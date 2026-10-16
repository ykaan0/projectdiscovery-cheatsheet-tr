# 🔗 Entegre Keşif ve Güvenlik Denetim Pipeline'ı (Reconnaissance Pipeline)

Modern güvenlik denetimlerinde araçları tekil çalıştırmak yerine, Unix felsefesiyle birbirine bağlamak (pipeline) zamandan ve kaynaklardan büyük tasarruf sağlar.

ProjectDiscovery ekosistemindeki **Subfinder**, **HTTPX** ve **Nuclei** araçları stdin/stdout akışları üzerinden birbiriyle kusursuz haberleşir. CMS tespiti gerektiğinde ise **VulnX** sürece dahil edilebilir.

---

## 🏗️ Pipeline Mimarisi

```mermaid
flowchart LR
    A["Hedef Alan Adı\n(example.com)"] -->|OSINT / Pasif| B["Subfinder\n(Alt Alan Adı Keşfi)"]
    B -->|subdomains.txt / pipe| C["HTTPX\n(Canlılık, Port, Tech Detect)"]
    C -->|live_urls.txt| D{"Teknoloji Tespiti"}
    D -->|Genel Web Servisleri| E["Nuclei\n(CVE & Misconfig Taraması)"]
    D -->|CMS Varlıkları (WP, Joomla vb.)| F["VulnX\n(CMS Analizi)"]
    E --> G["Denetim Raporu\n(Markdown / JSON)"]
    F --> G
```

---

## ⚡ Tek Satırlık (One-Liner) Pipeline Örnekleri

### 1. Temel Canlı Zafiyet Taraması (End-to-End One-Liner)
Alt alan adlarını pasif topla ➔ Canlı HTTP servislerini ayıkla ➔ Sadece High ve Critical seviyeli şablonları tara:
```bash
subfinder -d example.com -silent | httpx -silent -mc 200,301,302 | nuclei -severity high,critical -stats -o findings.txt
```

### 2. Teknoloji Odaklı Filtreleme ve Tarama
Sadece Nginx veya Apache kullanan canlı sunucuları filtreleyip JSON raporu üretmek:
```bash
subfinder -d example.com -silent \
  | httpx -silent -sc -title -td -json \
  | jq -r 'select(.technologies[]? | test("nginx|apache"; "i")) | .url' \
  | nuclei -tags cve,misconfig -severity medium,high,critical -o web_cves.txt
```

### 3. CMS Hedeflerini Ayıklayıp VulnX'e Aktarma
HTTPX ile WordPress veya Joomla tespit edilen hedefleri ayıklayıp VulnX listesine hazırlama:
```bash
subfinder -d example.com -silent \
  | httpx -silent -tech-detect -json \
  | jq -r 'select(.technologies[]? | test("WordPress|Joomla|Drupal"; "i")) | .url' > cms_targets.txt

python vulnx.py -w cms_targets.txt --cms -o ./cms_reports/
```

---

## 📜 Otomasyon Betikleri

### 1. Bash Otomasyon Scripti (`recon.sh`)
Linux ve macOS sistemler için modüler tarama scripti:

```bash
#!/usr/bin/env bash
# ==============================================================================
# Otomatik Keşif ve Güvenlik Denetim Pipeline'ı
# Araçlar: Subfinder -> HTTPX -> Nuclei
# ==============================================================================

set -euo pipefail

DOMAIN="${1:-}"

if [[ -z "$DOMAIN" ]]; then
    echo "Kullanım: $0 <hedef-domain.com>"
    exit 1
fi

OUTPUT_DIR="./recon_output_${DOMAIN}_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUTPUT_DIR"

echo "[+] 1. Aşama: Subfinder ile alt alan adları toplanıyor..."
subfinder -d "$DOMAIN" -all -silent -o "$OUTPUT_DIR/subdomains.txt"
SUB_COUNT=$(wc -l < "$OUTPUT_DIR/subdomains.txt")
echo "[✓] $SUB_COUNT adet alt alan adı tespit edildi."

echo "[+] 2. Aşama: HTTPX ile canlı web servisleri ve teknolojiler taranıyor..."
httpx -l "$OUTPUT_DIR/subdomains.txt" \
      -silent \
      -sc -title -td \
      -mc 200,301,302,401,403 \
      -o "$OUTPUT_DIR/live_hosts.txt" \
      -json -o "$OUTPUT_DIR/httpx_full.json"
LIVE_COUNT=$(wc -l < "$OUTPUT_DIR/live_hosts.txt")
echo "[✓] $LIVE_COUNT adet aktif HTTP servisi belirlendi."

echo "[+] 3. Aşama: Nuclei ile güvenlik açıkları denetleniyor..."
nuclei -l "$OUTPUT_DIR/live_hosts.txt" \
       -severity high,critical \
       -etags dos,fuzz \
       -rate-limit 50 \
       -concurrency 15 \
       -me "$OUTPUT_DIR/nuclei_report/" \
       -o "$OUTPUT_DIR/nuclei_findings.txt" \
       -stats

echo "[✓] Pipeline tamamlandı! Sonuçlar $OUTPUT_DIR dizininde saklandı."
```

### 2. Windows PowerShell Otomasyon Scripti (`recon.ps1`)
Windows kullanıcıları için native PowerShell pipeline scripti:

```powershell
<#
.SYNOPSIS
    Subfinder, HTTPX ve Nuclei için Windows PowerShell Otomasyon Betiği
.EXAMPLE
    .\recon.ps1 -Domain "example.com"
#>
param (
    [Parameter(Mandatory=$true)]
    [string]$Domain
)

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$OutputDir = ".\recon_output_${Domain}_${Timestamp}"
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

Write-Host "[+] 1. Aşama: Subfinder ile alt alan adları keşfediliyor..." -ForegroundColor Cyan
subfinder -d $Domain -silent -o "$OutputDir\subdomains.txt"

Write-Host "[+] 2. Aşama: HTTPX ile canlı servisler taranıyor..." -ForegroundColor Cyan
Get-Content "$OutputDir\subdomains.txt" | httpx -silent -mc 200,301,302 -title -tech-detect -o "$OutputDir\live_targets.txt"

Write-Host "[+] 3. Aşama: Nuclei ile güvenlik açıkları denetleniyor..." -ForegroundColor Cyan
nuclei -l "$OutputDir\live_targets.txt" -severity high,critical -rl 50 -c 15 -o "$OutputDir\nuclei_findings.txt" -stats

Write-Host "[✓] Tarama tamamlandı. Çıktılar: $OutputDir" -ForegroundColor Green
```

---

## 💡 Pipeline Optimizasyon İpuçları

1. **DNS Çözümleme ile Ön Eleme**: Subfinder çıktısını doğrudan HTTPX'e vermek yerine araya `dnsx` koyarak var olmayan (NXDOMAIN) kayıtları önceden eleyebilirsiniz:
   ```bash
   subfinder -d example.com -silent | dnsx -silent | httpx -silent
   ```
2. **Interactsh Sunucusu**: Out-of-band (OAST) taramalarda kendi Interactsh sunucunuzu belirterek şirket içi izleme yapabilirsiniz:
   ```bash
   nuclei -l targets.txt -iserver my-oast.internal.domain
   ```
3. **Loglama ve İz Bırakma**: Kurumsal sızma testlerinde isteklerin SOC/SIEM ekiplerince ayırt edilebilmesi için HTTP başlıklarına proje kimliği ekleyin:
   ```bash
   httpx -l hosts.txt -H "X-Security-Audit: Pentest-Project-2026"
   nuclei -l hosts.txt -H "X-Security-Audit: Pentest-Project-2026"
   ```
