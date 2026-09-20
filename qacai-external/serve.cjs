const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const port = 8765;
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.css':'text/css; charset=utf-8'};
const server = http.createServer((req,res)=>{
  try {
    const urlPath = decodeURIComponent((req.url||'/').split('?')[0]);
    const rel = urlPath === '/' ? '/index.html' : urlPath;
    const file = path.join(root, rel);
    if (!file.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
    fs.stat(file,(err,st)=>{
      if(err || !st.isFile()){res.writeHead(404); return res.end('Not found');}
      const ext=path.extname(file).toLowerCase();
      res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','Cache-Control':'no-store'});
      fs.createReadStream(file).pipe(res);
    });
  } catch(e){res.writeHead(500);res.end('Server error');}
});
server.listen(port,'127.0.0.1',()=>console.log(`QACAI server: http://127.0.0.1:${port}/index.html`));
