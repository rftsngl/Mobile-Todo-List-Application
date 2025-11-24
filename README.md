# Mobil Görev Yönetimi Uygulaması: Prototip Dokümantasyonu

Mevcut doküman, tek bir kod tabanı üzerinden çoklu platform (web ve mobil) uyumluluğu hedeflenerek, React ve TypeScript teknolojileriyle geliştirilmiş olan bir görev yönetimi arayüzü prototipini teferruatıyla açıklamaktadır. Projenin nihai amacı, React Native veya duyarlı tasarım metodolojileri aracılığıyla platformlar arası tutarlılığı temin edecek esnek bir mimari yapının tesis edilmesidir.

> **Resmi Uyarı:** İşbu yazılım deposu, münhasıran aktif geliştirme ve test süreçleri için tahsis edilmiştir. Kod temeli, uygulama programlama arayüzleri (API), dizin şeması ve işlevsel özellikler, önceden bildirimde bulunulmaksızın değişikliğe tabi tutulabilir. Projenin mevcut prototip statüsü göz önünde bulundurulduğunda, üretim ortamlarında kullanımına yönelik herhangi bir uygunluk taahhüt edilmemektedir.

## Mimari Bakış

Uygulamanın mimari temeli, tema, yerelleştirme (i18n), oturum yönetimi ve bildirim mekanizmaları gibi temel servisleri entegre eden modüler bir uygulama kabuğu (application shell) üzerine tesis edilmiştir. Kullanıcı deneyiminin akıcılığını sağlamak maksadıyla, ekranlar arası geçişler animasyonlarla desteklenmiş ve başlangıç konfigürasyonuna örnek veri setleri dahil edilmiştir. Sistem, `useAppNavigation` gibi özelleştirilmiş React yardımcı fonksiyonları (hooks), yönetimsel işlevleri taklit eden simüle edilmiş servis katmanları ve tematik koşullara bağlı olarak değişen global CSS değişkenlerini içeren bir tasarım sistemi ile teçhiz edilmiştir.

## Sistemin Temel Nitelikleri

**Modüler Altyapı:** Tema, dil, oturum ve bildirim yönetimi gibi temel servislerin bütünleşik olarak çalıştığı, genişletilebilir bir uygulama kabuğu.  
**Gelişmiş Kullanıcı Deneyimi:** Ekranlar arası animasyonlu geçişler ve önceden tanımlanmış veri setleri ile sağlanan kesintisiz başlangıç prosedürü.  
**Özelleştirilmiş Yardımcı Fonksiyonlar (Hooks):** Navigasyon ve durum yönetimi süreçlerini soyutlayarak basitleştiren `useAppNavigation` gibi özel React hook'larının kullanımı.  
**Simüle Edilmiş Servis Katmanı:** Gelecekte üretim seviyesi API entegrasyonlarına imkân tanıyacak şekilde tasarlanmış, `adminService` gibi ikame (mock) servisler.  
**Merkezi Tasarım Sistemi:** Uygulama genelinde görsel tutarlılığı temin eden, temaya duyarlı global CSS değişkenleri ve standartlaştırılmış renk paletleri.

## Proje Dizin Yapısı

Projenin temel dosya ve klasörlerinin şematik bir dökümü aşağıda sunulmuştur.

```txt
.
├─ App.tsx              # Ana giriş noktası: Sağlayıcılar ve ekran yönlendirmesi
├─ components/          # Ekranlar (Pano, Profil vb.) ve temel arayüz bileşenleri
├─ constants/           # Ekran tanımları, animasyon ayarları ve örnek veriler
├─ hooks/               # useAppNavigation gibi özel React hook'ları
├─ services/            # Gerçek API'lerle değiştirilecek sahte servis katmanı
└─ styles/              # Global stiller ve tema değişkenleri

```
## Öngörülen Geliştirme Süreçleri

**Çoklu Platform Desteğinin Genişletilmesi:** Duyarlı tasarım prensipleri doğrultusunda, web ve mobil platformlar için ortak kod tabanının yeteneklerinin artırılması.
**Veri Kalıcılığı ve Kimlik Doğrulama Entegrasyonu:** Simüle edilmiş servislerin, kalıcı bir veri depolama katmanı, harici API entegrasyonları ve standart kullanıcı kimlik doğrulama mekanizmaları ile ikame edilmesi.
**Tasarım Sisteminin Yetkinleştirilmesi:** Farklı ekran çözünürlüklerinde tutarlılık ve yeniden kullanılabilirlik sağlayacak kapsamlı bir bileşen kütüphanesinin geliştirilmesi.

## Lisans ve Atıf Bilgileri

Uygulama kapsamında kullanılan üçüncü taraf varlıklara ve ilgili lisans koşullarına dair detaylı bilgi için `Attributions.md` başlıklı belgeye müracaat edilmelidir.
