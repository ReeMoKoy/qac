const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const ROOT=__dirname;const PORT=process.env.PORT||3000;const USERS=path.join(ROOT,'users.json');
const sessions=new Map();const presence=new Map();
function loadUsers(){try{return JSON.parse(fs.readFileSync(USERS,'utf8'));}catch{return []}}
function saveUsers(u){fs.writeFileSync(USERS,JSON.stringify(u,null,2));}
function hash(p,s){return crypto.scryptSync(p,s,64).toString('hex')}
function token(){return crypto.randomBytes(24).toString('hex')}
function json(res,status,obj){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*'});res.end(JSON.stringify(obj))}
function body(req){return new Promise((resolve,reject)=>{let b='';req.on('data',c=>b+=c);req.on('end',()=>{try{resolve(b?JSON.parse(b):{})}catch(e){reject(e)}})})}
function auth(req){const u=req.headers['x-qac-user'],t=req.headers['x-qac-token'];if(!u||!t)return null;const s=sessions.get(t);return s&&s.username===u?s:null}
const server=http.createServer(async(req,res)=>{
  if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type,X-QAC-USER,X-QAC-TOKEN','Access-Control-Allow-Methods':'GET,POST,OPTIONS'});return res.end()}
  if(req.url==='/api/auth'&&req.method==='POST'){
    const b=await body(req);const users=loadUsers();let u=users.find(x=>x.username===b.username);
    if(b.mode==='register'){
      if(u)return json(res,400,{ok:false,message:'Kullanıcı zaten var.'});
      const salt=crypto.randomBytes(16).toString('hex');u={username:b.username,salt,hash:hash(b.password,salt),role:b.username==='ReeMoKoy'?'admin':'user',createdAt:Date.now()};users.push(u);saveUsers(users);
    } else {
      if(!u)return json(res,401,{ok:false,message:'Kullanıcı bulunamadı.'});
      if(u.username==='ReeMoKoy'&&process.env.QAC_ADMIN_PASSWORD){if(b.password!==process.env.QAC_ADMIN_PASSWORD)return json(res,401,{ok:false,message:'Yönetici şifresi yanlış.'});}
      else if(hash(b.password,u.salt)!==u.hash)return json(res,401,{ok:false,message:'Şifre yanlış.'});
    }
    const t=token();sessions.set(t,{username:u.username,role:u.role});presence.set(u.username,{username:u.username,role:u.role,model:'-',lang:'tr',lastSeen:Date.now()});return json(res,200,{ok:true,token:t,user:{username:u.username,role:u.role}});
  }
  if(req.url==='/api/heartbeat'&&req.method==='POST'){const b=await body(req);const s=auth(req);const username=(s?s.username:b.username);if(!username)return json(res,401,{ok:false});const u=presence.get(username)||{username,role:s?.role||'user'};u.model=b.model||u.model;u.lang=b.lang||u.lang;u.lastSeen=Date.now();presence.set(username,u);return json(res,200,{ok:true})}
  if(req.url==='/api/admin/active'&&req.method==='GET'){const s=auth(req);if(!s||s.role!=='admin')return json(res,403,{ok:false});const now=Date.now();const users=[...presence.values()].filter(u=>now-u.lastSeen<45000);return json(res,200,{users})}
  if(req.url==='/api/logout'&&req.method==='POST'){const s=auth(req);if(s)presence.delete(s.username);return json(res,200,{ok:true})}
  let file=req.url.split('?')[0];if(file==='/')file='/index.html';const fp=path.join(ROOT,file.replace(/^\//,''));if(!fp.startsWith(ROOT)){res.writeHead(403);return res.end('Forbidden')}
  try{const data=fs.readFileSync(fp);const ext=path.extname(fp);const ct={'.html':'text/html; charset=utf-8','.json':'application/json; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[ext]||'text/plain; charset=utf-8';res.writeHead(200,{'Content-Type':ct});res.end(data);}catch{res.writeHead(404);res.end('Not found')}
});
server.listen(PORT,()=>console.log(`QACAI AI-only: http://localhost:${PORT}`));
setInterval(()=>{const n=Date.now();for(const [u,v] of presence)if(n-v.lastSeen>60000)presence.delete(u)},30000);
