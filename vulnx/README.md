# 🎯 VulnX Kapsamlı Cheatsheet (Hızlı Başvuru Rehberi)

[![Canlı Web Sitesi](https://img.shields.io/badge/🌐_Canlı_Rehber-ykaan0.github.io%2Fprojectdiscovery--cheatsheet--tr-2ea44f?style=for-the-badge&logo=githubpages&logoColor=white)](https://ykaan0.github.io/projectdiscovery-cheatsheet-tr/)
[![Ana Depo](https://img.shields.io/badge/📂_Ana_Depo-projectdiscovery--cheatsheet--tr-blue?style=for-the-badge&logo=github&logoColor=white)](../README.md)

> [!TIP]
> 🌐 **İnteraktif Web Arayüzü:** Bu cheatsheet'teki komutları filtrelemek, aramak ve tek tıkla kopyalamak için canlı web sürümünü kullanabilirsiniz:
> 👉 **[https://ykaan0.github.io/projectdiscovery-cheatsheet-tr/](https://ykaan0.github.io/projectdiscovery-cheatsheet-tr/)**

> **VulnX**, popüler İçerik Yönetim Sistemleri (CMS) olan WordPress, Joomla, Drupal, PrestaShop vb. altyapıların tespiti, sürüm analizi ve CMS tabanlı bilinen güvenlik açıklarının taranması amacıyla geliştirilmiş açık kaynaklı bir güvenlik denetim aracıdır.

---

## 📌 İçindekiler
- [Temel Özellikler ve Desteklenen CMS'ler](#-temel-özellikler-ve-desteklenen-cmsler)
- [🔥 En Çok Kullanılan Kullanımlar (Top Daily Drivers)](#-en-çok-kullanılan-kullanımlar-top-daily-drivers)
- [Kurulum](#-kurulum)
- [Parametre Referans Tablosu](#-parametre-referans-tablosu)
- [Kullanım Örnekleri](#-kullanım-örnekleri)
  - [1. Tekil Hedefte CMS Tespiti ve Bilgi Toplama](#1-tekil-hedefte-cms-tespiti-ve-bilgi-toplama)
  - [2. Hedef Listesinde Toplu CMS Taraması](#2-hedef-listesinde-toplu-cms-taraması)
  - [3. Dizin ve DNS Bilgisi Toplama](#3-dizin-ve-dns-bilgisi-toplama)
  - [4. Rapor Klasörü ve Çıktı Yönetimi](#4-rapor-klasörü-ve-çıktı-yönetimi)
- [Güvenlik ve Etik Denetim İlkeleri](#-güvenlik-ve-etik-denetim-ilkeleri)

---

## 🚀 Temel Özellikler ve Desteklenen CMS'ler

- **Geniş CMS Desteği**:
  - WordPress (eklentiler, temalar, sürüm tespiti)
  - Joomla (bileşenler ve sürüm tespiti)
  - Drupal (çekirdek ve modül denetimleri)
  - PrestaShop, OpenCart ve Magento
  - vBulletin ve diğer popüler forum/web platformları
- **Pasif ve Aktif Bilgi Toplama**: Hedef CMS'in imza dosyalarını, yönetim paneli yollarını ve açıkta kalan yapılandırma dosyalarını hızlıca kontrol eder.

---

## 🔥 En Çok Kullanılan Kullanımlar (Top Daily Drivers)

Güvenlik denetimlerinde CMS altyapılarını tespit etmek için sahada en sık başvurulan 4 temel kullanım şekli:

### 1. Hızlı Tekil Hedef CMS Tespiti (En Sık Kullanım)
Hedef web uygulamasının hangi CMS (WordPress, Joomla vb.) üzerinde çalıştığını ve sürümünü hızlıca belirler:
```bash
python vulnx.py -u http://target.local --cms -t 10
```
*Neden kullanılır?* Hedefin içerik yönetim sistemi olup olmadığını ve temel sürümünü doğrulamak için en pratik yöntemdir.

### 2. HTTPX'ten Gelen CMS Adaylarını Toplu Tarama
HTTPX tarafından teknoloji tespiti yapılmış hedefleri 10 eşzamanlı iş parçacığıyla analiz eder ve raporlar:
```bash
python vulnx.py -w cms_targets.txt --cms --threads 10 -o ./cms_audit_results/
```
*Neden kullanılır?* Çok sayıda alt alan adı arasından CMS kullananları tek seferde tarayıp ayrıştırmak için.

### 3. Alternatif Portlar ve Zaman Aşımı Ayarı
Standart dışı portlarda çalışan CMS kurulumlarını (8080/8443) güvenli zaman aşımıyla denetler:
```bash
python vulnx.py -u http://target.local --cms -p 8080,8443 -t 15
```
*Neden kullanılır?* Test ortamlarında ve proxy arkasındaki CMS'lerin yavaş yanıt vermesi durumunda paket kaybını engellemek için.

### 4. CMS Analizi ile Birlikte DNS Bilgilerini Toplama
CMS taramasına paralel olarak hedefin DNS ve IP yönlendirme bilgilerini bir araya getirir:
```bash
python vulnx.py -u http://target.local --cms --dns
```
*Neden kullanılır?* CMS sunucusunun arkasındaki IP veya CDN bilgilerini eşzamanlı raporlamak için.

---

## 💻 Kurulum

### Python Sanal Ortam ile Kurulum (Önerilen)
```bash
git clone https://github.com/anouarbensaad/vulnx.git
cd vulnx

python3 -m venv venv
# Linux / macOS:
source venv/bin/activate
# Windows:
# .\venv\Scripts\activate

pip install -r requirements.txt
python3 vulnx.py --help
```

### Docker ile Çalıştırma
```bash
docker build -t vulnx .
docker run -it vulnx -u http://example.local --cms
```

---

## 📊 Parametre Referans Tablosu

| Parametre | Uzun Ad | Açıklama | Örnek Kullanım |
| :--- | :--- | :--- | :--- |
| `-u` | `--url` | Taranacak tekil hedef web adresi. | `python vulnx.py -u http://target.local` |
| `-w` | `--file` | Birden çok hedefin bulunduğu metin dosyası. | `python vulnx.py -w targets.txt` |
| `-c` | `--cms` | CMS altyapısını ve eklenti/tema sürümlerini tespit eder. | `python vulnx.py -u http://target.local --cms` |
| `-d` | `--dork` | CMS belirleme amacıyla arama motoru dorkları kullanır. | `python vulnx.py -d "site:example.local"` |
| `-o` | `--output` | Tarama bulgularının kaydedileceği klasör yolu. | `python vulnx.py -u http://target.local -o ./vulnx_reports` |
| `-p` | `--ports` | Taranacak özel port aralığı veya tekil port. | `python vulnx.py -u http://target.local -p 8080` |
| `-t` | `--timeout`| İstek başına zaman aşımı süresi (saniye). | `python vulnx.py -u http://target.local -t 15` |
| `--dns` | `--dns` | Hedefe ait DNS kayıtlarını ve alt alan bilgilerini toplar. | `python vulnx.py -u http://target.local --dns` |
| `--threads` | `--threads` | Eşzamanlı çalışacak istek iş parçacığı sayısı. | `python vulnx.py -w targets.txt --threads 10` |

---

## 🛠 Detaylı Kullanım Örnekleri

### 1. Tekil Hedefte CMS Tespiti ve Bilgi Toplama
Yetkili olduğunuz hedef web sitesinde hangi CMS ve sürümün çalıştığını doğrulamak için:
```bash
python vulnx.py -u http://target.local --cms -t 10
```

### 2. Hedef Listesinde Toplu CMS Taraması
Reconnaissance aşamasında (örneğin HTTPX ile bulunmuş web uygulamaları) CMS kullanan varlıkları kategorize etmek için:
```bash
python vulnx.py -w cms_candidates.txt --cms --threads 10 -o ./cms_discovery_results/
```

### 3. Dizin ve DNS Bilgisi Toplama
Hedef web uygulamasıyla ilişkili DNS kayıtları ile birlikte CMS durumunu kontrol etmek:
```bash
python vulnx.py -u http://target.local --cms --dns
```

### 4. Rapor Klasörü ve Çıktı Yönetimi
Denetim sonuçlarını tarihli veya projeye özel bir klasöre yapılandırılmış olarak kaydetmek:
```bash
python vulnx.py -w targets.txt --cms -o ./reports/2026-audit/
```

---

## ⚖️ Güvenlik ve Etik Denetim İlkeleri

> [!IMPORTANT]
> **Yasal Uyarı**: Güvenlik taramaları ve zafiyet tespitleri yalnızca **yazılı izin alınmış** hedef sistemler üzerinde veya yerel test laboratuvarlarında (DVWA, bWAPP, VulnHub) gerçekleştirilmelidir.

> [!NOTE]
> **Defansif Yaklaşım**: VulnX gibi araçların otomatik istismar (exploitation) veya yetkisiz dosya yükleme gibi yetenekleri, güvenlik testlerinde sistem bütünlüğünü bozabileceği ve yasal risk doğurabileceği için bu cheatsheet'te yalnızca **CMS tespiti**, **envanter çıkarma** ve **bilgi toplama** fonksiyonları ele alınmıştır.

---

## 🏷️ İlgili Etiketler (Tags)

`vulnx` • `cms-scanner` • `wordpress` • `joomla` • `drupal` • `vulnerability-scanner` • `reconnaissance` • `bugbounty` • `cheatsheet` • `infosec`

