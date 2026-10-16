# 🔧 Sık Karşılaşılan Sorunlar, Hata Ayıklama ve İpuçları (FAQ & Troubleshooting)

Bu kılavuz, ProjectDiscovery araçları (**Subfinder**, **HTTPX**, **Nuclei**) ve **VulnX** kullanılırken sahada en çok karşılaşılan operasyonel sorunları ve çözüm yöntemlerini içerir.

---

## 📌 İçindekiler
1. [Go Araçlarında 'command not found' / PATH Hatası](#1-go-araçlarında-command-not-found--path-hatası)
2. [WAF ve Cloudflare 429 / 403 Blokajlarını Aşma](#2-waf-ve-cloudflare-429--403-blokajlarını-aşma)
3. [Nuclei'de Yanlış Pozitif (False-Positive) Yönetimi](#3-nucleide-yanlış-pozitif-false-positive-yönetimi)
4. [Subfinder Ücretsiz API Limitleri ve Sıfır Sonuç Problemi](#4-subfinder-ücretsiz-api-limitleri-ve-sıfır-sonuç-problemi)
5. [HTTPX SSL/TLS Handshake ve Timeout Sorunları](#5-httpx-ssltls-handshake-ve-timeout-sorunları)
6. [Interactsh (OAST) Bağlantı ve Güvenlik Duvarı Sorunları](#6-interactsh-oast-bağlantı-ve-güvenlik-duvarı-sorunları)

---

## 1. Go Araçlarında 'command not found' / PATH Hatası

### Sorun
`go install` ile kurulan araçlar terminalde çalıştırılmak istendiğinde `command not found` veya `'subfinder' is not recognized` hatası alınır.

### Çözüm
Go binary'lerinin bulunduğu `GOPATH/bin` dizini sisteminizin `PATH` ortam değişkenine eklenmelidir.

**Linux / macOS (`~/.bashrc` veya `~/.zshrc`):**
```bash
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
source ~/.bashrc  # veya source ~/.zshrc
```

**Windows (PowerShell):**
```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:USERPROFILE\go\bin", "User")
```

---

## 2. WAF ve Cloudflare 429 / 403 Blokajlarını Aşma

### Sorun
Hedef sunucu veya bulut WAF (Cloudflare, Akamai, Imperva) çok hızlı istek gönderildiği için taramayı `429 Too Many Requests` veya `403 Forbidden` ile bloklar.

### Çözümler
1. **Hız Sınırı (Rate Limit) ve Concurrency Düşürün**:
   ```bash
   httpx -l targets.txt -rl 20 -t 10
   nuclei -l targets.txt -rl 25 -c 10
   ```
2. **Gerçekçi User-Agent Tanımlayın**:
   Varsayılan araç başlıkları WAF imzaları tarafından yakalanır. Standart bir tarayıcı User-Agent'ı ekleyin:
   ```bash
   httpx -l targets.txt -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
   ```
3. **Denetim Başlığı (Audit Header) Ekleyin**:
   Kurumsal testlerde SOC ekibine IP'nizi beyaz listeye (whitelist) ekletin ve özel başlık kullanın:
   ```bash
   nuclei -l targets.txt -H "X-Security-Audit: Authorized-Assessment-2026"
   ```

---

## 3. Nuclei'de Yanlış Pozitif (False-Positive) Yönetimi

### Sorun
Bazı şablonlar, hedef sunucunun her geçersiz URL'e `200 OK` (özel 404 sayfası) dönmesi durumunda sahte zafiyet uyarısı verir.

### Çözümler
1. **Bulguyu Manuel Olarak cURL ile Doğrulayın**:
   Nuclei çıktısındaki tam URL ve parametreleri cURL ile çağırarak yanıtı inceleyin:
   ```bash
   curl -i -s "https://example.com/vulnerable-path?param=payload"
   ```
2. **Interactsh (OAST) Şablonlarını Önceliklendirin**:
   Kör (blind) zafiyetlerde dışarıya yapılan DNS veya HTTP geri dönüşlerini (callback) doğrulamak en kesin yoldur:
   ```bash
   nuclei -u https://example.com -tags rce,ssrf,oast
   ```
3. **Şablon Filtreleme ile DoS/Fuzzing'i Kapatın**:
   ```bash
   nuclei -l live_urls.txt -etags dos,fuzz -s high,critical
   ```

---

## 4. Subfinder Ücretsiz API Limitleri ve Sıfır Sonuç Problemi

### Sorun
Subfinder bazı hedeflerde çok az sayıda alt alan adı bulur veya API kotaları tükenir.

### Çözümler
1. **`provider-config.yaml` Yapılandırması**:
   Shodan, Censys, SecurityTrails, Chaos, VirusTotal ve GitHub API anahtarlarını ekleyin.
2. **`-all` Bayrağını Kullanın**:
   Varsayılan hızlı kaynakların dışındaki tüm kaynakları zorlamak için:
   ```bash
   subfinder -d example.com -all -silent
   ```
3. **DNS Çözümleme ile Birleştirin**:
   Pasif kaynakların bazen eski/silinmiş domainleri döndürmesi normaldir. `httpx` veya `dnsx` ile bu kayıtları canlılık süzgecinden geçirin.

---

## 5. HTTPX SSL/TLS Handshake ve Timeout Sorunları

### Sorun
Eski SSL sertifikalarına veya kendini imzalamış (self-signed) sertifikalara sahip sunucularda HTTPX bağlantı hataları verebilir.

### Çözümler
1. **Zaman Aşımını Artırın**:
   ```bash
   httpx -l targets.txt -timeout 15 -retries 2
   ```
2. **HTTP ve HTTPS Protokollerini Otomatik Denetleyin**:
   HTTPX varsayılan olarak hem HTTPS hem de HTTP'yi dener. Yalnızca HTTPS'i zorlamak istiyorsanız:
   ```bash
   httpx -l targets.txt -tls-probe
   ```

---

## 6. Interactsh (OAST) Bağlantı ve Güvenlik Duvarı Sorunları

### Sorun
Kurum içi kısıtlı ağlarda halka açık Interactsh sunucularına (`oast.pro`, `oast.live`) giden DNS veya HTTP paketleri güvenlik duvarı tarafından engellenebilir.

### Çözüm
Kendi şirket altyapınızda barındırdığınız özel Interactsh sunucusunu belirtin:
```bash
nuclei -l targets.txt -iserver my-private-oast.corp.internal -itoken SECRET_TOKEN
```
