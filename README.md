# 🛠️ Siber Güvenlik ve Keşif Araçları Cheatsheet Deposu

Bu depo; modern siber güvenlik denetimlerinde, zafiyet yönetiminde ve saldırı yüzeyi analizinde (Attack Surface Management) yaygın olarak kullanılan **ProjectDiscovery** ekosistemi araçları (**Subfinder**, **HTTPX**, **Nuclei**) ile popüler CMS zafiyet denetim aracı **VulnX** için hazırlanmış kapsamlı, Türkçe hızlı başvuru rehberlerini (cheatsheets) ve örnek senaryoları içerir.

---

## 📚 Araç Kılavuzları ve Hızlı Erişim

| Araç | Geliştirici | Rol ve Kullanım Amacı | Kılavuz Linki |
| :--- | :--- | :--- | :--- |
| **🔍 Subfinder** | ProjectDiscovery | Pasif OSINT kaynaklarıyla hızlı alt alan adı (subdomain) keşfi. | [Subfinder Kılavuzu](./subfinder/README.md) |
| **⚡ HTTPX** | ProjectDiscovery | Çok amaçlı HTTP probing, teknoloji tespiti, durum kodları ve port analizi. | [HTTPX Kılavuzu](./httpx/README.md) |
| **🛡️ Nuclei** | ProjectDiscovery | YAML tabanlı şablonlarla hızlı, kural bazlı güvenlik ve zafiyet tarayıcısı. | [Nuclei Kılavuzu](./nuclei/README.md) |
| **🎯 VulnX** | Anouar Ben Saad | WordPress, Joomla vb. CMS tespiti, sürüm analizi ve zafiyet denetimi. | [VulnX Kılavuzu](./vulnx/README.md) |
| **🔗 Recon Pipeline** | Entegrasyon | Araçların zincirleme (subfinder ➔ httpx ➔ nuclei/vulnx) kullanımı ve betikler. | [Pipeline Kılavuzu](./workflows/reconnaissance-pipeline.md) |
| **📋 Pentest Checklist** | Metodoloji | Kurumsal sızma testi, keşif ve zafiyet doğrulama kontrol listesi. | [Kontrol Listesi](./checklist/pentest-checklist.md) |
| **🔧 FAQ & Troubleshooting**| Rehber | WAF atlatma, rate-limit, PATH hataları ve false-positive yönetimi. | [Hata Ayıklama & SSS](./troubleshooting/faq.md) |
| **🤖 CI/CD Automation** | DevSecOps | Otomatik zamanlanmış güvenlik denetimi için GitHub Actions iş akışı. | [GitHub Actions Workflow](./.github/workflows/security-scan.yml) |

---

## 🔥 En Çok Kullanılan Kullanımlar (Top Daily Drivers Özeti)

Sahada en sık başvurulan günlük komut kombinasyonları ve kullanım senaryoları:

| Araç | Kullanım Amacı | En Çok Kullanılan Komut |
| :--- | :--- | :--- |
| **Subfinder** | Hızlı ve temiz alt alan adı keşfi | `subfinder -d example.com -silent -o subdomains.txt` |
| **Subfinder** | Tüm pasif kaynakları zorlama (derin tarama) | `subfinder -d example.com -all -silent -o all_subs.txt` |
| **Subfinder** | Rate-limit korumalı güvenli tarama | `subfinder -d example.com -rl 5 -timeout 15 -silent` |
| **HTTPX** | Canlılık, HTTP durum kodu ve teknoloji tespiti | `cat subdomains.txt \| httpx -silent -sc -title -td -mc 200,301,302` |
| **HTTPX** | Sadece 200 OK dönen temiz liste (Nuclei öncesi) | `cat subdomains.txt \| httpx -silent -mc 200 -o live_urls.txt` |
| **HTTPX** | Yaygın web ve yönetim portlarını denetleme | `httpx -l subdomains.txt -p 80,443,8080,8443,9000 -sc -title` |
| **Nuclei** | Kritik ve yüksek riskli zafiyetleri denetleme | `nuclei -l live_urls.txt -severity high,critical -stats -o findings.txt` |
| **Nuclei** | Güvenli denetim (DoS ve Fuzzing şablonları hariç) | `nuclei -l live_urls.txt -etags dos,fuzz -s medium,high,critical -rl 50` |
| **Nuclei** | Açıkta kalan panel ve konfigürasyon sızıntıları | `nuclei -l live_urls.txt -tags panel,exposure,misconfig` |
| **VulnX** | Hızlı CMS ve sürüm tespiti | `python vulnx.py -u http://target.local --cms -t 10` |
| **VulnX** | Toplu listede CMS taraması | `python vulnx.py -w cms_targets.txt --cms --threads 10 -o ./cms_reports/` |
| **Pipeline** | Uçtan uca otomasyon (Subfinder ➔ HTTPX ➔ Nuclei) | `subfinder -d example.com -silent \| httpx -silent -mc 200,302 \| nuclei -severity high,critical -stats` |

---

## 📁 Depo Yapısı

```text
cheatsheets/
├── README.md                          # Ana giriş ve genel indeks
├── index.html                         # İnteraktif Web Cheatsheet Arayüzü & Komut Oluşturucu
├── style.css                          # Modern karanlık tema & tasarım stilleri
├── app.js                             # Canlı arama, komut oluşturucu ve yer imleri
├── Dockerfile                         # Tüm araçları içeren çok aşamalı Docker imajı
├── docker-compose.yml                 # Tek komutla izole tarama ortamı
├── CONTRIBUTING.md                    # Açık kaynak katkı kuralları
├── SECURITY.md                        # Güvenlik politikası ve yasal sınırlar
├── LICENSE                            # MIT Lisansı
├── subfinder/
│   └── README.md                      # Detaylı Subfinder parametreleri ve senaryoları
├── httpx/
│   └── README.md                      # Detaylı HTTPX parametreleri ve filtreleme
├── nuclei/
│   └── README.md                      # Detaylı Nuclei parametreleri, şablonlar ve CVE filtreleme
├── vulnx/
│   └── README.md                      # Detaylı VulnX CMS tespiti ve parametreleri
├── workflows/
│   └── reconnaissance-pipeline.md     # Bash / PowerShell otomasyon scriptleri ve mimari
├── checklist/
│   └── pentest-checklist.md           # Kurumsal sızma testi kontrol listesi
└── troubleshooting/
    └── faq.md                         # Sık karşılaşılan sorunlar ve çözümleri
```

---

## 💻 Hızlı Kurulum Özeti

### Go Araçları (Subfinder, HTTPX, Nuclei)
Go ortamınızın kurulu olduğundan emin olun (`go version`):
```bash
# Subfinder
go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest

# HTTPX
go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest

# Nuclei & Şablonlar
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
nuclei -update-templates
```

### VulnX (Python)
```bash
git clone https://github.com/anouarbensaad/vulnx.git
cd vulnx
pip install -r requirements.txt
```

---

## 🌐 İnteraktif Web Görünümü

Bu depoda yer alan tüm komutlara, parametre tablolarına ve filtrelere tarayıcınızdan interaktif olarak erişmek, tek tıkla komutları kopyalamak ve canlı arama yapmak için depodaki `index.html` dosyasını tarayıcınızda açabilirsiniz.

---

## ⚖️ Yasal ve Etik Bilgilendirme

> [!IMPORTANT]
> Bu depodaki tüm bilgiler, komutlar ve araçlar; **yalnızca yetkili olduğunuz sistemlerin güvenlik denetimlerinde**, savunma amaçlı sızma testlerinde (authorized penetration testing), güvenlik açıklarını yamama süreçlerinde ve yerel eğitim/laboratuvar ortamlarında kullanılmak üzere hazırlanmıştır.
> 
> İzniniz bulunmayan hedef sistemlere yönelik gerçekleştirilecek herhangi bir tarama veya faaliyet ilgili ülkelerin siber suç kanunları uyarınca suç teşkil edebilir. Bütün sorumluluk kullanıcıya aittir.
