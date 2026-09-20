QACAI AI-ONLY PAKETI

Bu paket tarayici/arama motoru, QMail ve site olusturucu ekranlarini kaldirir. Yalnizca yapay zeka arayuzu bulunur.

YAPI
- index.html: AI arayuzu
- data/flash1.json: kisa model verileri
- data/flashlite1.json: orta model verileri
- data/ultra211.json: uzun model verileri
- server.cjs: giris, oturum, heartbeat ve yonetici aktif kullanici API'si
- users.json: kullanici hesaplari
- start_qacai.bat: Windows baslatma

YONETICI
ReeMoKoy kullanicisi otomatik olarak admin rolundedir. Sunucuyu baslatirken QAC_ADMIN_PASSWORD ile guvenli yonetici sifresi verin.

CALISTIRMA
1) Node.js kurulu olsun.
2) start_qacai.bat dosyasini calistirin.
3) Tarayicidan http://localhost:3000 acin.

AKTIF KULLANICILAR
Yonetim paneli server.cjs uzerinden 45 saniyelik heartbeat ile aktif kullanicilari gosterebilir. GitHub Pages tek basina Node.js API calistiramaz; global aktif kullanici listesi icin bu paketin server.cjs'sini calistiran bir sunucu gerekir.

VERI
JSON verileri HTML'den ayridir. Model secildiginde ilgili JSON dosyasi lazy olarak yuklenir; bu sayede ana HTML dosyasi kucuktur.
