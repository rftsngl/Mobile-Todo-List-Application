# Mobile Todo List Application (TS Prototype)

TypeScript ile geliştirilen React tabanlı bir görev yönetimi arayüz prototipidir. Proje şu an **prototip** aşamasındadır. Hedef, ortak bir kod tabanı üzerinden hem web tarayıcılarında hem de mobil ortamlarda (ör. React Native veya responsive tasarım) çalışacak esnek bir mimariyi sağlamaktır.

> **Not (Test ve Değişiklik Uyarısı):** Bu depo **test amaçlıdır**. Kod, API yüzeyleri, dizin yapısı ve özellikler **ileride haber verilmeksizin değişebilir**. Üretim kullanımına uygunluk garanti edilmez; amaç hızlı prototipleme ve deneysel doğrulamadır.

## Genel Bakış

Uygulama, temalar, yerelleştirme, oturum ve bildirim sağlayıcılarının birleştiği bir **uygulama kabuğu** ile başlar. Başlangıç durumunda animasyonlu ekran geçişleri ve örnek görev verileri bulunur. Navigasyon ve durum yönetimi için özel hook’lar, yönetim özelliklerini taklit eden sahte servis katmanı ve temaya bağlı global CSS değişkenleriyle desteklenen bir tasarım sistemi yer alır.

## Özellikler

**Esnek uygulama kabuğu:** Temalar, yerelleştirme (i18n), oturum ve bildirim sağlayıcılarının birlikte çalıştığı bir üst seviye katman sunar.  
**Akıcı deneyim:** Ekranlar arasında animasyonlu geçişler ve varsayılan örnek görev verileriyle hızlı başlangıç sağlar.  
**Özel yardımcılar:** Navigasyon ve durum yönetimini basitleştiren `useAppNavigation` gibi özel React hook’ları kullanır.  
**Sahte servis katmanı:** Yönetim özellikleri için gerçek API’lerle değiştirilebilir mock servis (ör. `adminService`).  
**Tasarım sistemi:** Temaya bağlı global CSS değişkenleri ve tutarlı renk ölçekleriyle stil yönetimi.

## Proje Yapısı

Aşağıdaki yapı, kök dizindeki temel dosya ve klasörlerin bir özetidir.

```txt
.
├─ App.tsx                # Sağlayıcılar ve ekran yönlendirmesinin bulunduğu giriş noktası
├─ components/            # Ekranlar (dashboard, profil, görev detayları vb.) ve temel UI bileşenleri
├─ constants/             # Ekran tanımları, animasyon ayarları, örnek görev verileri
├─ hooks/                 # Özel React hook’ları (örn. useAppNavigation)
├─ services/              # Mock servis katmanı (gerçek API çağrılarına evrilecek)
└─ styles/                # Global stil tanımları ve tema değişkenleri

```

## Geliştirme Yol Haritası

Çoklu platform hedefi: Responsive tasarım ilkeleri ve platforma özgü adaptasyonlarla web ve mobilde ortak kod tabanının güçlendirilmesi.
Veri ve kimlik doğrulama: Sahte servislerin yerine kalıcı veri katmanı, gerçek API çağrıları ve kullanıcı kimlik doğrulama mekanizmalarının eklenmesi.
Tasarım sistemi olgunlaştırma: Farklı ekran boyutlarında yeniden kullanılabilir ve tutarlı bileşen kütüphanesinin genişletilmesi.

## Lisans ve Atıflar

Kullanılan üçüncü parti varlıklar ve lisans detayları için `Attributions.md` dosyasına bakın.
