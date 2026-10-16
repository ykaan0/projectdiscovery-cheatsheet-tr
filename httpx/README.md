# ⚡ HTTPX Kapsamlı Cheatsheet (Hızlı Başvuru Rehberi)

> **HTTPX**, ProjectDiscovery tarafından geliştirilmiş; web servislerinin canlılık durumunu, HTTP durum kodlarını, sayfa başlıklarını, kullanılan teknolojileri, SSL sertifikalarını ve web sunucusu detaylarını yüksek hızda denetleyen çok amaçlı bir HTTP probing araçtır.

---

## 📌 İçindekiler
- [Temel Yetenekler](#-temel-yetenekler)
- [🔥 En Çok Kullanılan Kullanımlar (Top Daily Drivers)](#-en-çok-kullanılan-kullanımlar-top-daily-drivers)
- [Kurulum](#-kurulum)
- [Parametre Referans Tablosu](#-parametre-referans-tablosu)
- [Detaylı Kullanım Örnekleri](#-detaylı-kullanım-örnekleri)
  - [1. Canlılık Taraması ve Temel Bilgiler (Status, Title, Tech)](#1-canlılık-taraması-ve-temel-bilgiler-status-title-tech)
  - [2. Durum Kodu Filtreleme (Match / Filter Codes)](#2-durum-kodu-filtreleme-match--filter-codes)
  - [3. Çoklu Port ve SSL Taraması](#3-çoklu-port-ve-ssl-taraması)
  - [4. Özel Başlık (Header), Metot ve Dizin Taraması (Path Probing)](#4-özel-başlık-header-metot-ve-dizin-taraması-path-probing)
  - [5. CDN ve WAF Tespiti](#5-cdn-ve-waf-tespiti)
  - [6. JSON Çıktısı Alma ve Ayrıştırma (jq)](#6-json-çıktısı-alma-ve-ayrıştırma-jq)
  - [7. Web Sayfası Ekran Görüntüsü Alma (Screenshot)](#7-web-sayfası-ekran-görüntüsü-alma-screenshot)
- [İpuçları ve En İyi Pratikler](#-ipuçları-ve-en-iyi-pratikler)

---

## 🚀 Temel Yetenekler

- **Çoklu Probing**: Tek bir istekte HTTP durum kodu, sayfa başlığı, SSL sertifikası, içerik uzunluğu ve teknoloji yığını tespiti.
- **Wappalyzer Entegrasyonu**: Web uygulamasında çalışan kütüphane, framework (React, Vue, Laravel, Spring vb.) ve CMS tespiti.
- **Akıllı Filtreleme**: Boş sayfaları, 404 yanıtlarını veya belirli hata stringlerini eleyerek temiz veri üretme.
- **Yüksek Hız**: Go `retryablehttp` mimarisiyle binlerce hedefi saniyeler içinde tarar.

---

## 🔥 En Çok Kullanılan Kullanımlar (Top Daily Drivers)

Siber güvenlik ekiplerinin ve araştırmacıların günlük olarak en çok çalıştırdığı 6 HTTPX komutu:

### 1. Standart Canlılık ve Teknoloji Özeti (%90 Günlük Kullanım)
Subdomain listesindeki canlı hedefleri bulur, HTTP durum kodunu, sayfa başlığını ve teknolojilerini gösterip kaydeder:
```bash
cat subdomains.txt | httpx -silent -sc -title -td -mc 200,301,302 -o alive_hosts.txt
```
*Neden kullanılır?* Canlı web uygulamalarını ve kullandıkları altyapıyı (WordPress, Nginx, React vb.) tek bakışta görmek için en temel komuttur.

### 2. Nuclei İçin Temiz "Sadece 200 OK" URL Listesi Çıkarma
Yalnızca sorunsuz çalışan sayfaları ayıklar ve protokolleri (`https://` veya `http://`) ile temiz liste üretir:
```bash
cat subdomains.txt | httpx -silent -mc 200 -o live_urls.txt
```
*Neden kullanılır?* Nuclei veya diğer zafiyet tarayıcılarına ölü veya 404 veren domainleri göndermemek, tarama süresini yarı yarıya düşürür.

### 3. Standart Dışı Web ve Yönetim Portlarını Tarama
Web servislerinin 80 ve 443 dışındaki yaygın portlarda çalışıp çalışmadığını denetler:
```bash
httpx -l subdomains.txt -p 80,443,8080,8443,8888,9000 -sc -title -silent -o web_ports.txt
```
*Neden kullanılır?* Geliştirme, test veya yönetim ortamları genellikle 8080/8443 gibi alternatif portlarda unutulur.

### 4. Hassas Dosya ve Yol Yoklaması (Path Probing)
Listedeki tüm sitelerde kritik yapılandırma veya API dosyalarının varlığını tek hamlede test eder:
```bash
httpx -l subdomains.txt -path "/.env,/.git/config,/swagger-ui.html,/actuator/health" -mc 200 -silent -o exposed_paths.txt
```
*Neden kullanılır?* Açıkta kalan credential veya dokümantasyon dosyalarını hızlıca keşfeder.

### 5. Yönlendirmeleri Takip Ederek Nihai Sayfayı Çözümleme (`-fr`)
301 veya 302 yönlendirmelerini son varış noktasına kadar izler ve son sayfanın başlığını alır:
```bash
httpx -l subdomains.txt -follow-redirects -status-code -title -silent
```
*Neden kullanılır?* Yönlendirilen login veya intranet portallarının gerçek içeriğini ve durumunu yakalamak için.

### 6. Programatik Analiz ve jq Filtreleme İçin JSON Export
Tüm metrikleri zengin JSONL formatında kaydeder ve `jq` ile belirli teknolojileri ayıklar:
```bash
# JSON olarak kaydet
httpx -l subdomains.txt -json -o report.json -silent

# jq ile sadece Apache veya Nginx olanları süz
cat report.json | jq -r 'select(.webserver? | test("nginx|apache"; "i")) | .url'
```
*Neden kullanılır?* CI/CD boru hatlarına, veri tabanlarına veya özel otomasyon scriptlerine temiz veri beslemek için.

---

## 💻 Kurulum

### Go ile Kurulum
```bash
go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest
```

### Binary İle Kurulum
```bash
tar -xvf httpx_*_linux_amd64.tar.gz
sudo mv httpx /usr/local/bin/
httpx -version
```

### Docker ile Çalıştırma
```bash
docker run -it projectdiscovery/httpx:latest -u https://example.com
```

---

## 📊 Parametre Referans Tablosu

| Kategori | Parametre | Açıklama | Örnek Kullanım |
| :--- | :--- | :--- | :--- |
| **Giriş (Input)** | `-u, -target` | Tekil hedef URL/Domain/IP. | `httpx -u https://example.com` |
| | `-l, -list` | Taranacak hedeflerin listesi. | `httpx -l domains.txt` |
| **Bilgi Toplama** | `-sc, -status-code` | HTTP yanıt kodunu gösterir (200, 301, 404 vb.). | `httpx -sc` |
| | `-title` | Sayfa `<title>` etiketini yakalar. | `httpx -title` |
| | `-td, -tech-detect` | Kullanılan teknolojileri tespit eder (Wappalyzer). | `httpx -td` |
| | `-server, -web-server`| `Server` HTTP başlığını gösterir (Nginx, Apache vb.). | `httpx -server` |
| | `-cl, -content-length`| Yanıt boyutunu (Content-Length) listeler. | `httpx -cl` |
| | `-ip` | Hedefin çözümlenen IP adresini listeler. | `httpx -ip` |
| | `-cname` | CNAME DNS kaydını listeler. | `httpx -cname` |
| | `-asn` | IP'nin ASN (Autonomous System) bilgisini gösterir. | `httpx -asn` |
| | `-cdn` | Hedefin Cloudflare, Akamai vb. CDN arkasında olup olmadığını tespit eder. | `httpx -cdn` |
| **Filtreleme** | `-mc, -match-code` | Sadece belirli durum kodlarına uyanları listeler. | `httpx -mc 200,302` |
| | `-fc, -filter-code`| Belirtilen durum kodlarını eler (hariç tutar). | `httpx -fc 404,500,502` |
| | `-ms, -match-string`| Yanıt gövdesinde (body) belirli metin geçenleri listeler. | `httpx -ms "Dashboard"` |
| | `-fs, -filter-string`| Belirtilen metni içeren yanıtları eler. | `httpx -fs "Access Denied"` |
| **İstek & Yönlendirme**| `-fr, -follow-redirects` | HTTP yönlendirmelerini (301/302) son hedefe kadar takip eder. | `httpx -fr` |
| | `-path` | Taranacak özel URL dizinleri ekler. | `httpx -path /robots.txt,/api` |
| | `-p, -ports` | Taranacak özel portlar veya port şablonları. | `httpx -p 80,443,8080,8443` |
| | `-H, -header` | İsteğe özel HTTP başlığı ekler. | `httpx -H "User-Agent: SecBot"` |
| **Görselleştirme**| `-ss, -screenshot` | Canlı sitelerin ekran görüntüsünü kaydeder. | `httpx -ss -system-chrome` |
| **Performans** | `-t, -threads` | Eşzamanlı iş parçacığı sayısı (varsayılan: 50). | `httpx -t 100` |
| | `-rl, -rate-limit` | Saniyede gönderilecek maksimum istek sayısı. | `httpx -rl 150` |
| **Çıktı Formatı** | `-o, -output` | Sonuçları dosyaya kaydeder. | `httpx -o live_hosts.txt` |
| | `-json` | Çıktıyı JSON formatında yazar. | `httpx -json -o out.json` |
| | `-silent` | Yalnızca sonuçları ekrana basar. | `httpx -silent` |

---

## 🛠 Detaylı Kullanım Örnekleri

### 1. Canlılık Taraması ve Temel Bilgiler (Status, Title, Tech)
Bir alan adı listesindeki aktif web servislerini tespit etmek, başlık ve teknoloji bilgilerini yan yana görmek için:
```bash
httpx -l domains.txt -silent -sc -title -td -server
```

### 2. Durum Kodu Filtreleme (Match / Filter Codes)
Yalnızca `200 OK` ve `302 Found` dönen sayfaları alıp, `404` ve `500` hatalarını gizlemek:
```bash
httpx -l subdomains.txt -mc 200,302 -silent -o alive_200.txt
```

### 3. Çoklu Port ve SSL Taraması
Varsayılan 80/443 dışındaki yaygın web yönetim portlarını denetlemek:
```bash
httpx -l targets.txt -p 80,443,8000,8080,8443,8888,9000 -sc -title
```

### 4. Özel Başlık (Header), Metot ve Dizin Taraması (Path Probing)
Tüm hedeflerde `robots.txt` veya `/actuator/health` kontrolü yapıp yalnızca bulunanları raporlamak:
```bash
httpx -l hosts.txt -path "/robots.txt" -mc 200 -silent
```

### 5. CDN ve WAF Tespiti
Origin IP'yi bulmaya çalışırken ya da test kapsamını belirlerken CDN arkasında olanları işaretleme:
```bash
httpx -l domains.txt -cdn -ip -silent
```

### 6. JSON Çıktısı Alma ve Ayrıştırma (jq)
Programatik analizler veya raporlama için tüm detayları JSON olarak kaydedip belirli teknolojileri filtreleme:
```bash
httpx -l domains.txt -json -o report.json -silent
cat report.json | jq -r 'select(.technologies[]? | contains("WordPress")) | .url'
```

### 7. Web Sayfası Ekran Görüntüsü Alma (Screenshot)
Hedef sayfaların masaüstü ekran görüntülerini otomatik yakalayarak `output_screenshot` klasörüne kaydeder:
```bash
httpx -l domains.txt -screenshot -system-chrome -o screenshots_summary.txt
```

---

## 💡 İpuçları ve En İyi Pratikler

> [!TIP]
> **Subfinder ile Zincirleme Kullanım**:
> ```bash
> subfinder -d example.com -silent | httpx -silent -mc 200 -title -o active_web.txt
> ```
> Bu komut, hedef domaindeki tüm alt alan adlarını bulur, aralarından yalnızca HTTP 200 dönenleri ayıklar ve başlıklarıyla birlikte kaydeder.

> [!NOTE]
> Büyük ölçekli taramalarda WAF/IPS mekanizmaları tarafından engellenmemek için `-rate-limit 50` ve `-threads 25` gibi makul değerler kullanılması önerilir.
