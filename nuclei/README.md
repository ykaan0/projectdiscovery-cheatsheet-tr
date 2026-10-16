# 🛡️ Nuclei Kapsamlı Cheatsheet (Hızlı Başvuru Rehberi)

[![Canlı Web Sitesi](https://img.shields.io/badge/🌐_Canlı_Rehber-ykaan0.github.io%2Fprojectdiscovery--cheatsheet--tr-2ea44f?style=for-the-badge&logo=githubpages&logoColor=white)](https://ykaan0.github.io/projectdiscovery-cheatsheet-tr/)
[![Ana Depo](https://img.shields.io/badge/📂_Ana_Depo-projectdiscovery--cheatsheet--tr-blue?style=for-the-badge&logo=github&logoColor=white)](../README.md)

> [!TIP]
> 🌐 **İnteraktif Web Arayüzü:** Bu cheatsheet'teki komutları filtrelemek, aramak ve tek tıkla kopyalamak için canlı web sürümünü kullanabilirsiniz:
> 👉 **[https://ykaan0.github.io/projectdiscovery-cheatsheet-tr/](https://ykaan0.github.io/projectdiscovery-cheatsheet-tr/)**

> **Nuclei**, ProjectDiscovery tarafından topluluk odaklı olarak geliştirilen, basit ve okunabilir YAML şablonları (templates) üzerinden çalışan modern, modüler ve son derece hızlı bir güvenlik ve zafiyet tarayıcısıdır.

---

## 📌 İçindekiler
- [Temel Mimari ve Çalışma Prensibi](#-temel-mimari-ve-çalışma-prensibi)
- [🔥 En Çok Kullanılan Kullanımlar (Top Daily Drivers)](#-en-çok-kullanılan-kullanımlar-top-daily-drivers)
- [Kurulum ve Şablon Yönetimi](#-kurulum-ve-şablon-yönetimi)
- [Parametre Referans Tablosu](#-parametre-referans-tablosu)
- [Kullanım Örnekleri](#-kullanım-örnekleri)
  - [1. Tekil Hedefte Kritik ve Yüksek Seviyeli Taramalar](#1-tekil-hedefte-kritik-ve-yüksek-seviyeli-taramalar)
  - [2. Belirli Bir CVE veya Zafiyet Türü Tarama](#2-belirli-bir-cve-veya-zafiyet-türü-tarama)
  - [3. Açık Panel ve Yanlış Yapılandırma (Misconfiguration) Taraması](#3-açık-panel-ve-yanlış-yapılandırma-misconfiguration-taraması)
  - [4. Çoklu Hedef (HTTPX Çıktısı) ile Toplu Tarama](#4-çoklu-hedef-httpx-çıktısı-ile-toplu-tarama)
  - [5. Performans ve Hız Sınırlandırma (Rate Limiting)](#5-performans-ve-hız-sınırlandırma-rate-limiting)
  - [6. JSON ve Markdown Rapor Formatları](#6-json-ve-markdown-rapor-formatları)
- [Örnek YAML Şablonu Anatomisi](#-örnek-yaml-şablonu-anatomisi)
- [İpuçları ve En İyi Pratikler](#-ipuçları-ve-en-iyi-pratikler)

---

## 🚀 Temel Mimari ve Çalışma Prensibi

Nuclei, geleneksel ağır güvenlik tarayıcılarının aksine karmaşık betikler yerine deklaratif YAML şablonları kullanır:
- **Çoklu Protokol Desteği**: HTTP, DNS, TCP, SSL/TLS, Headless (Chrome tarayıcı simülasyonu), Websocket ve File protokollerini destekler.
- **Topluluk Şablonları**: Binlerce bağımsız araştırmacı tarafından sürekli güncellenen geniş CVE, sızıntı (exposure), varsayılan kimlik bilgisi (default credentials) ve misconfiguration kütüphanesi.
- **Interactsh Entegrasyonu**: Out-of-Band (OAST) etkileşimleri (DNS callback, HTTP pingback) otomatik doğrular.

---

## 🔥 En Çok Kullanılan Kullanımlar (Top Daily Drivers)

Güvenlik mühendislerinin, sızma testi uzmanlarının ve DevSecOps uzmanlarının günlük çalışmalarda en sık çalıştırdığı 6 temel Nuclei senaryosu:

### 1. Sadece Kritik ve Yüksek Seviyeli Zafiyetleri Tarama (%90 Günlük Standart)
Gereksiz bilgi seviyesindeki bulguları eleyip doğrudan müdahale gerektiren açıkları tarar ve canlı istatistik gösterir:
```bash
nuclei -l live_urls.txt -severity high,critical -stats -o critical_findings.txt
```
*Neden kullanılır?* Zaman kısıtlı olduğunda doğrudan RCE, SQLi, SSRF ve Authentication Bypass gibi kritik açıkları yakalamak için.

### 2. Güvenli ve Kararlı Tarama (DoS & Fuzzing Hariç)
Hizmet kesintisi yaratabilecek veya hedef sunucuyu çökertebilecek agresif şablonları filtreler:
```bash
nuclei -l live_urls.txt -etags dos,fuzz -severity medium,high,critical -rl 50 -c 15 -o secure_audit.txt
```
*Neden kullanılır?* Canlı üretim (production) ortamlarında ve kurumsal güvenlik denetimlerinde sistemi riske atmamak için zorunlu kuraldır.

### 3. Açık Panel ve Hassas Bilgi Sızıntısı Taraması (Exposures & Panels)
Açıkta kalmış yönetim panelleri, `.git`, `.env`, phpinfo ve Swagger yapılandırma sızıntılarını tespit eder:
```bash
nuclei -l live_urls.txt -tags panel,exposure,misconfig -severity low,medium,high,critical -o exposures.txt
```
*Neden kullanılır?* Yanlış yapılandırmalar (misconfiguration) saldırganların en kolay yararlandığı ilk giriş noktalarıdır.

### 4. Güncel Yıllara Ait CVE Taraması
2023 ve 2024 yıllarına ait güncel CVE açıklarını hedef sistemler üzerinde doğrular:
```bash
nuclei -l live_urls.txt -tags cve2023,cve2024 -severity medium,high,critical -o cve_audit.txt
```
*Neden kullanılır?* Yakın zamanda duyurulan zero-day veya güncel güvenlik bültenlerine karşı kurum sistemlerini hızlıca denetlemek için.

### 5. Yeni Eklenen Şablonlarla Hızlı Tarama (`-nt`)
Şablon kütüphanesini güncelleyip son güncellemede eklenen yepyeni güvenlik kontrollerini hedefe karşı koşturur:
```bash
nuclei -update-templates && nuclei -l live_urls.txt -nt -severity high,critical -stats
```
*Neden kullanılır?* Yeni çıkan kritik bir zafiyete karşı şablon kütüphanesine eklenir eklenmez ilk denetimi yapmak için.

### 6. Raporlama İçin Markdown Dışa Aktarımı (`-me`)
Tarama sonuçlarını açıklamaları, referansları ve çözüm önerileriyle birlikte GitHub Markdown formatında raporlar:
```bash
nuclei -l live_urls.txt -severity high,critical -me ./nuclei_markdown_report/
```
*Neden kullanılır?* Denetim sonrası yöneticilere veya yazılım ekiplerine sunulacak hazır raporlar üretmek için.

---

## 💻 Kurulum ve Şablon Yönetimi

### Go ile Kurulum
```bash
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
```

### Şablonları İndirme ve Güncelleme
Nuclei çalıştırılmadan önce resmi şablon kütüphanesinin güncellenmesi gerekir:
```bash
# Şablonları güncelle
nuclei -update-templates

# Hem nuclei motorunu hem şablonları güncelle
nuclei -update
```
Şablonlar varsayılan olarak şu konuma kaydedilir:
- **Linux/macOS**: `~/nuclei-templates`
- **Windows**: `%USERPROFILE%\nuclei-templates`

---

## 📊 Parametre Referans Tablosu

| Kategori | Parametre | Açıklama | Örnek Kullanım |
| :--- | :--- | :--- | :--- |
| **Hedef (Target)** | `-u, -target` | Taranacak tekil URL veya ana makine. | `nuclei -u https://example.com` |
| | `-l, -list` | Taranacak URL listesi dosyası. | `nuclei -l live_urls.txt` |
| **Şablon Seçimi** | `-t, -templates` | Kullanılacak şablon veya klasör yolu. | `nuclei -t cves/ -t misconfiguration/` |
| | `-w, -workflows`| Kullanılacak iş akışı (workflow) dosyası. | `nuclei -w workflows/` |
| | `-nt, -new-templates`| Yalnızca son güncellemede eklenen yeni şablonları çalıştırır. | `nuclei -nt` |
| **Filtreleme** | `-s, -severity` | Kritiklik derecesine göre filtreler (`info,low,medium,high,critical`). | `nuclei -s high,critical` |
| | `-tags` | Belirtilen etiketlere (tags) sahip şablonları çalıştırır. | `nuclei -tags cve,panel,auth` |
| | `-etags` | Belirtilen etiketlere sahip şablonları hariç tutar. | `nuclei -etags dos,fuzz` |
| | `-es, -exclude-severity`| Belirtilen kritiklik seviyelerini hariç tutar. | `nuclei -es info,low` |
| | `-author` | Şablon yazar(lar)ına göre filtreleme yapar. | `nuclei -author geeknik` |
| **Performans & Ağ** | `-c, -concurrency` | Eşzamanlı çalıştırılacak şablon sayısı (varsayılan: 25). | `nuclei -c 50` |
| | `-bs, -bulk-size` | Şablon başına eşzamanlı hedef sayısı (varsayılan: 25). | `nuclei -bs 25` |
| | `-rl, -rate-limit`| Saniyede gönderilecek maksimum HTTP istek sayısı. | `nuclei -rl 150` |
| | `-timeout` | İstek zaman aşımı süresi (saniye, varsayılan: 10). | `nuclei -timeout 15` |
| | `-retries` | Başarısız istekler için tekrar deneme sayısı. | `nuclei -retries 2` |
| **Çıktı & Raporlama** | `-o, -output` | Sonuçları metin dosyasına kaydeder. | `nuclei -o findings.txt` |
| | `-j, -jsonl` | Sonuçları JSONL formatında yazar. | `nuclei -j -o report.jsonl` |
| | `-me, -markdown-export`| Sonuçları GitHub uyumlu zengin Markdown raporu olarak dışa aktarır. | `nuclei -me ./audit_report/` |
| | `-stats` | Gerçek zamanlı tarama istatistiklerini ekranda gösterir. | `nuclei -stats` |
| | `-silent` | Sadece bulunan zafiyet/bilgileri ekrana basar. | `nuclei -silent` |

---

## 🛠 Kullanım Örnekleri

### 1. Tekil Hedefte Kritik ve Yüksek Seviyeli Taramalar
Sadece doğrudan güvenlik riski oluşturan High ve Critical seviyedeki şablonları çalıştırmak:
```bash
nuclei -u https://example.com -severity high,critical -stats -o critical_findings.txt
```

### 2. Belirli Bir CVE veya Zafiyet Türü Tarama
Örneğin 2023 ve 2024 yıllarına ait CVE şablonlarını hedef üzerinde denetlemek:
```bash
nuclei -u https://example.com -tags cve2023,cve2024 -o cve_results.txt
```

### 3. Açık Panel ve Yanlış Yapılandırma (Misconfiguration) Taraması
Yönetim panelleri, açıkta kalan Swagger/API dokümantasyonları ve `.git`, `.env` gibi sızıntıları aramak:
```bash
nuclei -u https://example.com -tags panel,exposure,misconfig -severity medium,high,critical
```

### 4. Çoklu Hedef (HTTPX Çıktısı) ile Toplu Tarama
HTTPX tarafından canlı olduğu doğrulanmış URL listesini hız sınırına dikkat ederek taramak:
```bash
nuclei -l live_urls.txt -severity high,critical -rl 100 -c 30 -o bulk_audit.txt
```

### 5. Performans ve Hız Sınırlandırma (Rate Limiting)
Hedef sistemin altyapısını yormamak ve IPS/WAF blokajlarına takılmamak için dikkatli tarama:
```bash
nuclei -u https://example.com -rl 20 -c 10 -timeout 10 -severity medium,high,critical
```

### 6. JSON ve Markdown Rapor Formatları
DevSecOps pipeline'larına entegrasyon veya yönetimsel raporlama için:
```bash
# Markdown rapor klasörü oluşturma
nuclei -l live_targets.txt -severity critical,high -me ./nuclei-markdown-report/

# JSON Lines formatında kayıt
nuclei -l live_targets.txt -j -o findings.jsonl
```

---

## 📝 Örnek YAML Şablonu Anatomisi

```yaml
id: exposed-env-file-check

info:
  name: Exposed .env Configuration File
  author: security-team
  severity: high
  description: Checks if the application accidentally exposes environment variables and credentials via .env file.
  tags: config,exposure,credentials

http:
  - method: GET
    path:
      - "{{BaseURL}}/.env"
      - "{{BaseURL}}/core/.env"

    matchers-condition: and
    matchers:
      - type: status
        status:
          - 200

      - type: word
        words:
          - "DB_PASSWORD"
          - "APP_KEY"
          - "DATABASE_URL"
        condition: or

    extractors:
      - type: regex
        part: body
        regex:
          - "(DB_PASSWORD|APP_KEY)=[^\\r\\n]+"
```

---

## 💡 İpuçları ve En İyi Pratikler

> [!WARNING]
> Tarama sırasında `dos` (Denial of Service) ve kontrolsüz `fuzzing` etiketlerini devre dışı bırakmak için her zaman `-etags dos,fuzz` parametresini kullanmanız sistem kararlılığı açısından önerilir:
> ```bash
> nuclei -l targets.txt -etags dos,fuzz -s medium,high,critical
> ```

> [!TIP]
> **Etkileşimli İstatistik Ekranı**: `-stats` bayrağı ile taramanın yüzdesini, kalan süreyi ve saniyelik istek hızını anlık takip edebilirsiniz.
