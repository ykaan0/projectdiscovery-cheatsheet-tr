# 🔍 Subfinder Kapsamlı Cheatsheet (Hızlı Başvuru Rehberi)

> **Subfinder**, ProjectDiscovery tarafından Go diliyle geliştirilmiş; hedef alan adlarına ait alt alan adlarını (subdomains) pasif OSINT kaynaklarını kullanarak saniyeler içinde toplayan, modüler ve yüksek performanslı bir araçtır.

---

## 📌 İçindekiler
- [Temel Özellikler ve Çalışma Mantığı](#-temel-özellikler-ve-çalışma-mantığı)
- [🔥 En Çok Kullanılan Kullanımlar (Top Daily Drivers)](#-en-çok-kullanılan-kullanımlar-top-daily-drivers)
- [Kurulum](#-kurulum)
- [API Anahtarlarının Yapılandırılması](#-api-anahtarlarının-yapılandırılması)
- [Parametre Referans Tablosu](#-parametre-referans-tablosu)
- [Kullanım Örnekleri](#-kullanım-örnekleri)
  - [1. Tekil Hedef Tarama](#1-tekil-hedef-tarama)
  - [2. Çoklu Hedef (Liste) Tarama](#2-çoklu-hedef-liste-tarama)
  - [3. Tüm Pasif Kaynakları Zorlama (Tüm Kaynaklar)](#3-tüm-pasif-kaynakları-zorlama-tüm-kaynaklar)
  - [4. Belirli Kaynakları Seçme veya Hariç Tutma](#4-belirli-kaynakları-seçme-veya-hariç-tutma)
  - [5. Çıktıyı Formatlama ve JSON Kaydı](#5-çıktıyı-formatlama-ve-json-kaydı)
  - [6. Performans ve Hız Sınırlandırması (Rate-Limit)](#6-performans-ve-hız-sınırlandırması-rate-limit)
- [İpuçları ve En İyi Pratikler](#-ipuçları-ve-en-iyi-pratikler)

---

## 🚀 Temel Özellikler ve Çalışma Mantığı

- **Pasif Keşif**: Hedef sunucuya doğrudan DNS veya HTTP trafiği göndermez; arama motorları, sertifika şeffaflık kayıtları (Certificate Transparency), tehdit istihbarat servisleri ve arşivler üzerinden veri çeker.
- **Hız ve Düşük Kaynak Tüketimi**: Go eşzamanlılığı (goroutine) ile onlarca pasif kaynağı paralel sorgular.
- **Pipeline Uyumluluğu**: `stdout` çıktısı standart Unix pipe (`|`) yapısına uygundur; `httpx`, `nuclei`, `dnsx` gibi araçlarla doğrudan bağlanabilir.

---

## 🔥 En Çok Kullanılan Kullanımlar (Top Daily Drivers)

Siber güvenlik uzmanlarının ve bug bounty araştırmacılarının günlük çalışmalarda en sık başvurduğu 6 temel senaryo:

### 1. Hızlı ve Temiz Tekli Keşif (Günlük Standart)
Banner ve logları gizleyerek sadece alt alan adlarını ekrana basar ve dosyaya kaydeder:
```bash
subfinder -d example.com -silent -o subdomains.txt
```
*Neden kullanılır?* Pipeline'lar ve temiz çıktı listeleri için en pratik ve hızlı yöntemdir.

### 2. Kapsamlı Tüm Kaynakları Zorlama (`-all`)
Yavaş çalışan veya derinlemesine tarama yapan tüm pasif kaynakları dahil eder:
```bash
subfinder -d example.com -all -silent -o all_subdomains.txt
```
*Neden kullanılır?* Hızdan feragat edip hiçbir alt alan adını kaçırmak istemediğiniz detaylı denetimlerde kullanılır.

### 3. Çoklu Alan Adı (Root Domain) Listesi Tarama
Birden çok kök alan adını içeren `domains.txt` dosyasını yüksek iş parçacığıyla tarar:
```bash
subfinder -dL domains.txt -t 30 -silent -o multi_targets_subs.txt
```
*Neden kullanılır?* Geniş kapsamlı kurumsal varlık envanteri çıkartırken kullanılır.

### 4. HTTPX ile Canlılık Taramasına Doğrudan İletme (Pipe)
Bulunan alt alan adlarını diske yazmadan doğrudan `httpx` aracına iletip çalışan web servislerini ayıklar:
```bash
subfinder -d example.com -silent | httpx -silent -mc 200,301,302 -title
```
*Neden kullanılır?* Pasif bulunan subdomainlerin kaç tanesinde gerçek web servisi çalıştığını saniyeler içinde gösterir.

### 5. API ve WAF Limitlerine Takılmayan Güvenli Hız
Ücretsiz API kotalarını tüketmemek ve IP blokajı yememek için saniyede 5 istek sınırı uygular:
```bash
subfinder -d example.com -rl 5 -timeout 15 -silent -o safe_subs.txt
```
*Neden kullanılır?* Shodan, Censys veya VirusTotal API anahtarlarının rate-limit nedeniyle kısıtlanmasını önler.

### 6. Kaynak Detaylı JSON Çıktısı (`-cs -oJ`)
Hangi alt alan adının hangi OSINT servisinden geldiğini JSONL formatında kaydeder:
```bash
subfinder -d example.com -cs -oJ -o subdomains.json
```
*Neden kullanılır?* `jq` veya SIEM/veritabanı sistemlerine aktararak veri doğrulaması ve analizi yapmak için.

---

## 💻 Kurulum

### Go ile Kurulum (Önerilen)
```bash
go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest
```

### Binary İle Kurulum (GitHub Releases)
```bash
tar -xvf subfinder_*_linux_amd64.tar.gz
sudo mv subfinder /usr/local/bin/
subfinder -version
```

### Docker ile Çalıştırma
```bash
docker run -it projectdiscovery/subfinder:latest -d example.com
```

---

## 🔑 API Anahtarlarının Yapılandırılması

Subfinder ücretsiz kaynakların yanında, API anahtarı girildiğinde çok daha fazla veri döndüren kaynakları (Shodan, Censys, SecurityTrails, VirusTotal, Chaos vb.) destekler.

Ayar dosyasının varsayılan konumu:
- **Linux/macOS**: `~/.config/subfinder/provider-config.yaml`
- **Windows**: `%USERPROFILE%\.config\subfinder\provider-config.yaml`

Örnek `provider-config.yaml` yapılandırması:
```yaml
binaryedge:
  - "YOUR_API_KEY_HERE"
censys:
  - "YOUR_CENSYS_ID:YOUR_CENSYS_SECRET"
chaos:
  - "YOUR_API_KEY_HERE"
github:
  - "YOUR_PERSONAL_ACCESS_TOKEN"
securitytrails:
  - "YOUR_API_KEY_HERE"
shodan:
  - "YOUR_API_KEY_HERE"
virustotal:
  - "YOUR_API_KEY_HERE"
```

---

## 📊 Parametre Referans Tablosu

| Parametre | Açıklama | Örnek Kullanım |
| :--- | :--- | :--- |
| `-d, -domain` | Taranacak ana alan adı (domain). | `subfinder -d example.com` |
| `-dL, -list` | Taranacak alan adlarını içeren dosya listesi. | `subfinder -dL domains.txt` |
| `-s, -sources` | Sadece belirtilen kaynakları kullanır. | `subfinder -d example.com -s shodan,censys` |
| `-es, -exclude-sources` | Belirtilen kaynakları hariç tutar. | `subfinder -d example.com -es alienvault` |
| `-all` | Yavaş veya derinlemesine olan tüm kaynakları zorlar. | `subfinder -d example.com -all` |
| `-o, -output` | Sonuçları belirtilen metin dosyasına yazar. | `subfinder -d example.com -o subdomains.txt` |
| `-oJ, -json` | Çıktıyı JSON Lines (JSONL) formatında üretir. | `subfinder -d example.com -oJ -o subs.json` |
| `-silent` | Sadece alt alan adlarını yazdırır (banner/logları gizler). | `subfinder -d example.com -silent` |
| `-t, -threads` | Eşzamanlı iş parçacığı sayısı (varsayılan: 10). | `subfinder -d example.com -t 50` |
| `-timeout` | Kaynak başına zaman aşımı süresi (saniye). | `subfinder -d example.com -timeout 30` |
| `-rl, -rate-limit` | Saniye başına maksimum istek sayısı. | `subfinder -d example.com -rl 10` |
| `-cs, -collect-sources` | Her alt alan adının hangi kaynaktan geldiğini listeler. | `subfinder -d example.com -cs` |
| `-ls, -list-sources` | Desteklenen tüm kaynakları listeler. | `subfinder -ls` |

---

## 🛠 Detaylı Kullanım Örnekleri

### 1. Tekil Hedef Tarama
Hedef alan adı için temiz ve sade alt alan adı listesi çıkarma:
```bash
subfinder -d example.com -silent -o example_subs.txt
```

### 2. Çoklu Hedef (Liste) Tarama
Birden fazla alan adını içeren `targets.txt` dosyasını tarama:
```bash
subfinder -dL targets.txt -t 25 -o all_subdomains.txt
```

### 3. Tüm Pasif Kaynakları Zorlama (Tüm Kaynaklar)
Hızdan ziyade maksimum kapsam istendiğinde `-all` bayrağı kullanılır:
```bash
subfinder -d example.com -all -silent -o comprehensive_subs.txt
```

### 4. Belirli Kaynakları Seçme veya Hariç Tutma
Yalnızca belirli kaynaklardan (örneğin Shodan ve Censys) veri çekmek için:
```bash
subfinder -d example.com -s shodan,censys -silent
```
Belirli bir kaynağı (örneğin yavaş yanıt veren bir kaynağı) hariç tutmak için:
```bash
subfinder -d example.com -es alienvault,archiveis -silent
```

### 5. Çıktıyı Formatlama ve JSON Kaydı
Bulunan alt alan adlarını ve kaynaklandığı sağlayıcıyı JSON olarak kaydetmek:
```bash
subfinder -d example.com -oJ -cs -o results.json
```

### 6. Performans ve Hız Sınırlandırması (Rate-Limit)
API sağlayıcılarının IP bloklamasını önlemek için hız sınırlayıcı belirleme:
```bash
subfinder -d example.com -rl 5 -timeout 15 -silent
```

---

## 💡 İpuçları ve En İyi Pratikler

> [!TIP]
> **Pipeline Gücü**: Subfinder çıktısı doğrudan `httpx` aracına iletilebilir. Böylece sadece pasif olarak bulunan domainlerin hangilerinin aktif web sunucusu barındırdığı hemen test edilir:
> ```bash
> subfinder -d example.com -silent | httpx -silent -title -status-code
> ```

> [!NOTE]
> Pasif taramalar hedef sunucuyu doğrudan tetiklemez. Ancak ücretsiz API limitlerine takılmamak adına `provider-config.yaml` dosyanıza kendi API anahtarlarınızı eklemeniz başarı oranını 3 ila 5 kat artıracaktır.
