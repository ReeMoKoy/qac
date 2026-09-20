QACAI - HARICI VERI PAKETI

Bu paket, QACAI arayuzunu ve yapay zeka verilerini ayri tutar.

YAPI
index.html                         -> Ana arayuz ve uygulama kodu
data/manifest.json                -> Veri katalogu ve model kapasitesi
data/index/*.json                  -> Hafif soru->parca indeksleri
data/tr/flash1/*.json              -> Flash 1 kisa cevap verileri
 data/tr/flashlite1/*.json         -> Flash-Lite 1 detayli cevap verileri
 data/tr/ultra211/*.json           -> Ultra 21.1 verileri
 data/tr/games/*.json              -> Oyun detay verileri
start_qacai.bat                    -> Windows'ta yerel sunucuyu baslatir
serve.cjs                          -> Node.js ile basit yerel sunucu

NEDEN AYRI?
JSON verileri index.html icine gomulmez. Uygulama sorgu geldiginde sadece ilgili JSON parcaciklarini yukler ve bellekte tutar. Boylece cok buyuk veri havuzlari tek seferde tarayiciya yuklenmez.

1.500.000 KAYIT KAPASITESI
manifest.json icinde model basina mantiksal 1.500.000 kayitlik kapasite tanimlidir. Mevcut paketteki gercek veri kayitlari ayri shard dosyalarinda tutulur. Daha buyuk veri setleri ayni klasor/yiginlama yapisiyla yeni shard dosyalari eklenerek buyutulebilir; index.json dosyalari da guncellenir.

CALISTIRMA
1) Windows'ta start_qacai.bat dosyasina cift tikla.
2) Tarayici http://127.0.0.1:8765/index.html adresini acar.
3) index.html dosyasini tek basina file:// ile acmak yerine yerel sunucuyu kullan; ayri JSON dosyalari tarayicinin guvenlik kurallari nedeniyle HTTP uzerinden daha sorunsuz yuklenir.

NOT
Mevcut veriler korunmustur. Veri dosyalarini baska klasore tasiyorsan data/manifest.json ve index.json yollarini birlikte tasiman gerekir.
