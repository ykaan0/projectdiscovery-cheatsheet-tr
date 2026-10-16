// Dataset of Cheatsheet Cards with "isPopular" tags for most used commands
const cheatsheetData = [
  // SUBFINDER
  {
    id: "sub-1",
    tool: "subfinder",
    category: "Temel Tarama",
    title: "Temel Pasif Alt Alan Adı Keşfi",
    desc: "Hedef alan adına ait alt alan adlarını sessiz modda pasif kaynaklardan toplayıp dosyaya kaydeder. Günlük çalışmalarda en sık kullanılan temel komuttur.",
    command: "subfinder -d example.com -silent -o subdomains.txt",
    tags: ["temel", "osint", "subdomain", "popüler"],
    isPopular: true
  },
  {
    id: "sub-2",
    tool: "subfinder",
    category: "Toplu Tarama",
    title: "Dosyadan Çoklu Hedef Taraması",
    desc: "Birden fazla alan adını içeren liste dosyasını 25 eşzamanlı iş parçacığıyla tarar.",
    command: "subfinder -dL domains.txt -t 25 -o all_subdomains.txt",
    tags: ["liste", "hız", "threads"]
  },
  {
    id: "sub-3",
    tool: "subfinder",
    category: "Kapsamlı Tarama",
    title: "Tüm Pasif Kaynakları Zorlama (-all)",
    desc: "Yavaş yanıt verenler dahil tüm OSINT kaynaklarını kullanarak azami sayıda alt alan adı toplar.",
    command: "subfinder -d example.com -all -silent -o comprehensive_subs.txt",
    tags: ["all", "kapsamlı", "derin", "popüler"],
    isPopular: true
  },
  {
    id: "sub-4",
    tool: "subfinder",
    category: "Kaynak Filtreleme",
    title: "Özel Kaynak Seçimi (Shodan, Censys)",
    desc: "Yalnızca yapılandırılmış Shodan ve Censys API kaynaklarını sorgular.",
    command: "subfinder -d example.com -s shodan,censys -silent",
    tags: ["filtreleme", "api", "kaynak"]
  },
  {
    id: "sub-5",
    tool: "subfinder",
    category: "Çıktı & JSON",
    title: "JSON Lines ve Kaynak Etiketleme",
    desc: "Her alt alan adını tespit edildiği kaynak sağlayıcı bilgisiyle birlikte JSON formatında depolar.",
    command: "subfinder -d example.com -oJ -cs -o results.json",
    tags: ["json", "export", "rapor"]
  },
  {
    id: "sub-6",
    tool: "subfinder",
    category: "Hız & Limit",
    title: "Rate Limit ile Güvenli Tarama",
    desc: "API engellerine takılmamak için saniyede 5 istek sınırı ve 15 saniye zaman aşımı uygular.",
    command: "subfinder -d example.com -rl 5 -timeout 15 -silent",
    tags: ["rate-limit", "güvenli", "performans", "popüler"],
    isPopular: true
  },

  // HTTPX
  {
    id: "httpx-1",
    tool: "httpx",
    category: "Canlılık & Teknoloji",
    title: "Canlı Web Servisleri ve Teknoloji Analizi (%90 Günlük Standart)",
    desc: "Hedeflerin HTTP yanıt kodu, sayfa başlığı, web sunucusu ve kullanılan framework/CMS teknolojilerini tek bakışta listeler.",
    command: "cat subdomains.txt | httpx -silent -sc -title -td -mc 200,301,302 -o alive_hosts.txt",
    tags: ["temel", "probing", "tech-detect", "title", "popüler"],
    isPopular: true
  },
  {
    id: "httpx-2",
    tool: "httpx",
    category: "Filtreleme",
    title: "Nuclei İçin Temiz 'Sadece 200 OK' URL Listesi",
    desc: "Sadece 200 OK dönen çalışan servisleri yakalayıp zafiyet taramaları için tertemiz girdi listesi üretir.",
    command: "cat subdomains.txt | httpx -silent -mc 200 -o live_urls.txt",
    tags: ["filtreleme", "status-code", "temel", "popüler"],
    isPopular: true
  },
  {
    id: "httpx-3",
    tool: "httpx",
    category: "Port Taraması",
    title: "Yaygın Web ve Yönetim Portlarını Denetleme",
    desc: "80 ve 443 dışındaki standart dışı web ve yönetim portlarında (8080, 8443, 9000 vb.) çalışan servisleri tespit eder.",
    command: "httpx -l targets.txt -p 80,443,8000,8080,8443,8888,9000 -sc -title",
    tags: ["port", "ağ", "web-ports", "popüler"],
    isPopular: true
  },
  {
    id: "httpx-4",
    tool: "httpx",
    category: "Yol Taraması",
    title: "Hassas Yol / Dosya Varlık Kontrolü (Path Probing)",
    desc: "Hedef sitelerde .env, .git/config, swagger ve actuator gibi kritik dosyaların varlığını hızlıca test eder.",
    command: "httpx -l hosts.txt -path \"/.env,/.git/config,/swagger-ui.html,/actuator/health\" -mc 200 -silent",
    tags: ["path", "endpoint", "keşif", "popüler"],
    isPopular: true
  },
  {
    id: "httpx-5",
    tool: "httpx",
    category: "Ağ & CDN",
    title: "CDN ve Çözümlenen IP Adresi Tespiti",
    desc: "Web sitelerinin Cloudflare/Akamai arkasında olup olmadığını ve gerçek IP adreslerini raporlar.",
    command: "httpx -l domains.txt -cdn -ip -silent",
    tags: ["cdn", "ip", "waf"]
  },
  {
    id: "httpx-6",
    tool: "httpx",
    category: "JSON & Ayrıştırma",
    title: "JSON Çıktısı Alma ve jq ile Ayrıştırma",
    desc: "Tüm probing yanıtlarını JSONL olarak kaydeder; jq ile teknolojiye göre filtreleme yapılmasını sağlar.",
    command: "httpx -l domains.txt -json -o report.json -silent",
    tags: ["json", "export", "otomasyon"]
  },
  {
    id: "httpx-7",
    tool: "httpx",
    category: "Görsel",
    title: "Otomatik Web Sayfası Ekran Görüntüsü Alma",
    desc: "Chrome motorunu kullanarak hedef sitelerin ekran görüntülerini yakalar.",
    command: "httpx -l domains.txt -screenshot -system-chrome -o screenshots_summary.txt",
    tags: ["screenshot", "görsel", "headless"]
  },

  // NUCLEI
  {
    id: "nuclei-1",
    tool: "nuclei",
    category: "Kritik Zafiyetler",
    title: "Kritik ve Yüksek Seviyeli Güvenlik Taraması (%90 Standart)",
    desc: "Doğrudan RCE, SQLi, SSRF ve Auth Bypass riski teşkil eden High ve Critical şablonları canlı istatistikle çalıştırır.",
    command: "nuclei -l live_urls.txt -severity high,critical -stats -o critical_findings.txt",
    tags: ["kritik", "severity", "cve", "temel", "popüler"],
    isPopular: true
  },
  {
    id: "nuclei-2",
    tool: "nuclei",
    category: "Güvenli Tarama",
    title: "DoS ve Fuzzing Şablonlarını Devre Dışı Bırakma",
    desc: "Sistem kararlılığını korumak için hizmet kesintisi yaratabilecek şablonları eler (Kurumsal denetim standardı).",
    command: "nuclei -l live_urls.txt -etags dos,fuzz -severity medium,high,critical -rl 50 -c 15 -o secure_audit.txt",
    tags: ["güvenli", "etags", "stabilite", "popüler"],
    isPopular: true
  },
  {
    id: "nuclei-3",
    tool: "nuclei",
    category: "Açık Paneller & Sızıntılar",
    title: "Yönetim Paneli ve Misconfiguration Tespiti",
    desc: "Açıkta kalmış admin panelleri, .git, .env ve Swagger yapılandırma sızıntılarını arar.",
    command: "nuclei -l live_urls.txt -tags panel,exposure,misconfig -severity low,medium,high,critical -o exposures.txt",
    tags: ["panel", "exposure", "misconfig", "popüler"],
    isPopular: true
  },
  {
    id: "nuclei-4",
    tool: "nuclei",
    category: "CVE Taraması",
    title: "Güncel Yıllara Ait CVE Şablonlarını Tarama",
    desc: "2023 ve 2024 yıllarına ait güncel CVE şablonlarını hedef sistemde denetler.",
    command: "nuclei -l live_urls.txt -tags cve2023,cve2024 -severity medium,high,critical -o cve_audit.txt",
    tags: ["cve", "tags", "zafiyet", "popüler"],
    isPopular: true
  },
  {
    id: "nuclei-5",
    tool: "nuclei",
    category: "Yeni Şablonlar",
    title: "Yeni Eklenen Şablonlarla Hızlı Tarama (-nt)",
    desc: "Şablon kütüphanesini güncelleyip son güncellemede eklenen yepyeni güvenlik kontrollerini koşturur.",
    command: "nuclei -update-templates && nuclei -l live_urls.txt -nt -severity high,critical -stats",
    tags: ["yeni", "templates", "popüler"],
    isPopular: true
  },
  {
    id: "nuclei-6",
    tool: "nuclei",
    category: "Raporlama",
    title: "Zengin Markdown Denetim Raporu Üretme",
    desc: "Bulguları GitHub ve yönetimsel sunumlara uygun Markdown dosyaları olarak dışa aktarır.",
    command: "nuclei -l live_targets.txt -severity critical,high -me ./nuclei-report/",
    tags: ["markdown", "rapor", "export"]
  },
  {
    id: "nuclei-7",
    tool: "nuclei",
    category: "Tekil Şablon",
    title: "Belirli Bir YAML Şablonunu Doğrulama",
    desc: "Özel yazılmış veya tekil bir zafiyet şablonunu doğrudan hedefe karşı çalıştırır.",
    command: "nuclei -u https://example.com -t http/cves/2023/CVE-2023-XXXXX.yaml",
    tags: ["şablon", "yaml", "doğrulama"]
  },

  // VULNX
  {
    id: "vulnx-1",
    tool: "vulnx",
    category: "CMS Tespiti",
    title: "Tekil Hedefte CMS ve Sürüm Tespiti (En Sık Kullanım)",
    desc: "Hedef web uygulamasında WordPress, Joomla, Drupal vb. CMS altyapısını ve sürümlerini hızlıca belirler.",
    command: "python vulnx.py -u http://target.local --cms -t 10",
    tags: ["temel", "cms", "wordpress", "joomla", "popüler"],
    isPopular: true
  },
  {
    id: "vulnx-2",
    tool: "vulnx",
    category: "Toplu Tarama",
    title: "HTTPX Çıktısı CMS Hedeflerini Toplu Tarama",
    desc: "Çoklu hedef listesini 10 iş parçacığıyla CMS analizi için tarar ve klasöre kaydeder.",
    command: "python vulnx.py -w cms_candidates.txt --cms --threads 10 -o ./vulnx_reports/",
    tags: ["liste", "cms", "threads", "popüler"],
    isPopular: true
  },
  {
    id: "vulnx-3",
    tool: "vulnx",
    category: "DNS & Keşif",
    title: "CMS Analizi ile Birlikte DNS Bilgisi Toplama",
    desc: "Hedef CMS ile ilişkili DNS kayıtlarını ve alt alan bilgilerini toplar.",
    command: "python vulnx.py -u http://target.local --cms --dns",
    tags: ["dns", "cms", "keşif"]
  },
  {
    id: "vulnx-4",
    tool: "vulnx",
    category: "Özel Port",
    title: "Alternatif Portlarda CMS Taraması",
    desc: "8080 veya 8443 gibi özel web portlarındaki CMS kurulumlarını güvenli zaman aşımıyla denetler.",
    command: "python vulnx.py -u http://target.local --cms -p 8080,8443 -t 15",
    tags: ["port", "cms", "popüler"],
    isPopular: true
  },

  // PIPELINE
  {
    id: "pipe-1",
    tool: "pipeline",
    category: "Uçtan Uca Zincir",
    title: "Subfinder ➔ HTTPX ➔ Nuclei Tam Otomasyon (%90 Kullanım)",
    desc: "Pasif subdomain topla, canlı web servislerini ayıkla, yüksek ve kritik zafiyetleri tek komutla tespit et.",
    command: "subfinder -d example.com -silent | httpx -silent -mc 200,301,302 | nuclei -severity high,critical -stats -o findings.txt",
    tags: ["pipeline", "otomasyon", "zincir", "one-liner", "popüler"],
    isPopular: true
  },
  {
    id: "pipe-2",
    tool: "pipeline",
    category: "Teknoloji Filtreli",
    title: "Nginx / Apache Sunucularını Ayıklayıp Tarama",
    desc: "HTTPX JSON çıktısından belirli sunucu teknolojilerini jq ile filtreleyip Nuclei'ye aktarır.",
    command: "subfinder -d example.com -silent | httpx -silent -td -json | jq -r 'select(.technologies[]? | test(\"nginx|apache\"; \"i\")) | .url' | nuclei -tags cve -o web_cves.txt",
    tags: ["pipeline", "jq", "filtreleme", "cve"]
  },
  {
    id: "pipe-3",
    tool: "pipeline",
    category: "CMS Yönlendirme",
    title: "WordPress/Joomla Hedeflerini VulnX İçin Ayıklama",
    desc: "HTTPX ile CMS kullanan varlıkları süzüp VulnX için hedef listesi oluşturur.",
    command: "subfinder -d example.com -silent | httpx -silent -td -json | jq -r 'select(.technologies[]? | test(\"WordPress|Joomla\"; \"i\")) | .url' > cms_targets.txt",
    tags: ["pipeline", "cms", "jq", "popüler"],
    isPopular: true
  }
];

// Tool Colors & Names
const toolMeta = {
  all: { name: "Tümü", color: "#38bdf8" },
  popular: { name: "Popüler", color: "#f59e0b" },
  favorites: { name: "Favorilerim", color: "#eab308" },
  subfinder: { name: "Subfinder", color: "var(--subfinder-color)" },
  httpx: { name: "HTTPX", color: "var(--httpx-color)" },
  nuclei: { name: "Nuclei", color: "var(--nuclei-color)" },
  vulnx: { name: "VulnX", color: "var(--vulnx-color)" },
  pipeline: { name: "Recon Pipeline", color: "var(--pipeline-color)" }
};

// LocalStorage for Favorites
let favorites = [];
try {
  favorites = JSON.parse(localStorage.getItem("sec_cheatsheet_favs") || "[]");
} catch(e) {
  favorites = [];
}

// DOM References
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search-btn");
const tabButtons = document.querySelectorAll(".tab-btn");
const cardsGrid = document.getElementById("cards-grid");
const visibleCountEl = document.getElementById("visible-count");
const totalCountEl = document.getElementById("total-count");
const quickTagsContainer = document.getElementById("quick-tags");
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toast-msg");

// Builder DOM References
const builderSection = document.getElementById("builder-section");
const builderToolSelect = document.getElementById("builder-tool-select");
const builderTargetInput = document.getElementById("builder-target-input");
const builderModeSelect = document.getElementById("builder-mode-select");
const builderOptionsGroup = document.getElementById("builder-options-group");
const builderOutputCmd = document.getElementById("builder-output-cmd");
const builderCopyBtn = document.getElementById("builder-copy-btn");
const btnToggleBuilder = document.getElementById("btn-toggle-builder");

let activeTool = "all";
let activeTag = "";
let searchTerm = "";

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  totalCountEl.textContent = cheatsheetData.length;
  renderQuickTags();
  renderCards();
  initCommandBuilder();

  // Search Input Event
  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    clearSearchBtn.style.display = searchTerm ? "block" : "none";
    renderCards();
  });

  // Clear Search Event
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchTerm = "";
    clearSearchBtn.style.display = "none";
    searchInput.focus();
    renderCards();
  });

  // Keyboard Shortcuts (Ctrl + K or '/')
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey && e.key.toLowerCase() === "k") || (e.key === "/" && document.activeElement !== searchInput && document.activeElement !== builderTargetInput)) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === "Escape") {
      searchInput.value = "";
      searchTerm = "";
      clearSearchBtn.style.display = "none";
      searchInput.blur();
      renderCards();
    }
  });

  // Tool Tabs Event
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeTool = btn.getAttribute("data-tool");
      renderCards();
    });
  });

  // Scroll to builder button
  if (btnToggleBuilder) {
    btnToggleBuilder.addEventListener("click", () => {
      builderSection.scrollIntoView({ behavior: "smooth", block: "start" });
      builderTargetInput.focus();
    });
  }
});

// Render Quick Filter Tags
function renderQuickTags() {
  const tagSet = new Set();
  cheatsheetData.forEach(item => {
    item.tags.forEach(t => tagSet.add(t));
  });

  const popularTags = ["popüler", "temel", "hız", "filtreleme", "json", "cve", "severity", "cms", "pipeline", "rate-limit"];
  
  popularTags.forEach(tag => {
    if (tagSet.has(tag)) {
      const chip = document.createElement("button");
      chip.className = "tag-chip" + (tag === "popüler" ? " active-accent" : "");
      chip.textContent = tag === "popüler" ? "🔥 #popüler" : `#${tag}`;
      chip.id = `tag-chip-${tag}`;
      chip.addEventListener("click", () => {
        if (activeTag === tag) {
          activeTag = "";
          chip.classList.remove("active");
        } else {
          document.querySelectorAll(".tag-chip").forEach(c => c.classList.remove("active"));
          activeTag = tag;
          chip.classList.add("active");
        }
        renderCards();
      });
      quickTagsContainer.appendChild(chip);
    }
  });
}

// Render Cards
function renderCards() {
  const filtered = cheatsheetData.filter(item => {
    let matchesTool = true;
    if (activeTool === "all") {
      matchesTool = true;
    } else if (activeTool === "popular") {
      matchesTool = item.isPopular === true;
    } else if (activeTool === "favorites") {
      matchesTool = favorites.includes(item.id);
    } else {
      matchesTool = item.tool === activeTool;
    }

    const matchesTag = !activeTag || item.tags.includes(activeTag);
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm) ||
      item.desc.toLowerCase().includes(searchTerm) ||
      item.command.toLowerCase().includes(searchTerm) ||
      item.tool.toLowerCase().includes(searchTerm) ||
      item.tags.some(t => t.toLowerCase().includes(searchTerm));

    return matchesTool && matchesTag && matchesSearch;
  });

  visibleCountEl.textContent = filtered.length;
  cardsGrid.innerHTML = "";

  if (filtered.length === 0) {
    cardsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>Aradığınız kriterlere uygun komut bulunamadı.</h3>
        <p>Arama teriminizi değiştirebilir veya filtreleri sıfırlayabilirsiniz.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const isStarred = favorites.includes(item.id);
    const card = document.createElement("div");
    card.className = "cheat-card";
    card.id = `card-${item.id}`;
    card.style.setProperty("--card-color", toolMeta[item.tool]?.color || "#38bdf8");

    const popularBadgeHtml = item.isPopular 
      ? `<span class="card-popular-badge">🔥 En Çok Kullanılan</span>` 
      : "";

    card.innerHTML = `
      <div class="card-top">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="card-tool-tag">${toolMeta[item.tool]?.name || item.tool}</span>
          ${popularBadgeHtml}
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <button class="star-btn ${isStarred ? 'starred' : ''}" data-id="${item.id}" title="${isStarred ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}">
            ${isStarred ? '★' : '☆'}
          </button>
          <span class="card-category">${item.category}</span>
        </div>
      </div>
      <h3 class="card-title">${escapeHtml(item.title)}</h3>
      <p class="card-desc">${escapeHtml(item.desc)}</p>
      <div class="code-box">
        <code>${escapeHtml(item.command)}</code>
        <button class="copy-btn" id="copy-btn-${item.id}" data-cmd="${encodeURIComponent(item.command)}" title="Komutu Kopyala">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>Kopyala</span>
        </button>
      </div>
    `;

    cardsGrid.appendChild(card);
  });

  // Attach Star Event Listeners
  document.querySelectorAll(".star-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      toggleFavorite(id);
    });
  });

  // Attach Copy Event Listeners
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const rawCmd = decodeURIComponent(btn.getAttribute("data-cmd"));
      copyToClipboard(rawCmd, btn);
    });
  });
}

// Toggle Favorite Functionality
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
    showToast("Komut favorilerden çıkarıldı.");
  } else {
    favorites.push(id);
    showToast("Komut favorilere eklendi! ⭐");
  }
  try {
    localStorage.setItem("sec_cheatsheet_favs", JSON.stringify(favorites));
  } catch(e) {}

  renderCards();
}

// ==============================================================================
// Interactive Command Builder Logic
// ==============================================================================
const builderOptionsConfig = {
  subfinder: [
    { id: "opt-silent", label: "Sessiz Mod (-silent)", flag: "-silent", checked: true },
    { id: "opt-all", label: "Tüm Kaynakları Zorla (-all)", flag: "-all", checked: false },
    { id: "opt-json", label: "JSONL Formatı (-oJ -cs)", flag: "-oJ -cs", checked: false },
    { id: "opt-rl", label: "Rate Limit 5 rps (-rl 5)", flag: "-rl 5", checked: false },
    { id: "opt-output", label: "Dosyaya Kaydet (-o subdomains.txt)", flag: "-o subdomains.txt", checked: true }
  ],
  httpx: [
    { id: "opt-silent", label: "Sessiz Mod (-silent)", flag: "-silent", checked: true },
    { id: "opt-sc", label: "Durum Kodu (-sc)", flag: "-sc", checked: true },
    { id: "opt-title", label: "Sayfa Başlığı (-title)", flag: "-title", checked: true },
    { id: "opt-td", label: "Teknoloji Tespiti (-td)", flag: "-td", checked: true },
    { id: "opt-mc", label: "Sadece 200/302 (-mc 200,302)", flag: "-mc 200,302", checked: true },
    { id: "opt-ports", label: "Web Portları (-p 80,443,8080,8443)", flag: "-p 80,443,8080,8443", checked: false },
    { id: "opt-output", label: "Dosyaya Kaydet (-o live_hosts.txt)", flag: "-o live_hosts.txt", checked: true }
  ],
  nuclei: [
    { id: "opt-severity", label: "Severity: High,Critical (-s high,critical)", flag: "-severity high,critical", checked: true },
    { id: "opt-safe", label: "Güvenli Mod (-etags dos,fuzz)", flag: "-etags dos,fuzz", checked: true },
    { id: "opt-stats", label: "Canlı İstatistik (-stats)", flag: "-stats", checked: true },
    { id: "opt-rl", label: "Hız Sınırı 40 rps (-rl 40)", flag: "-rl 40", checked: true },
    { id: "opt-silent", label: "Sessiz Mod (-silent)", flag: "-silent", checked: false },
    { id: "opt-markdown", label: "Markdown Raporu (-me ./nuclei-report/)", flag: "-me ./nuclei-report/", checked: false },
    { id: "opt-output", label: "Dosyaya Kaydet (-o findings.txt)", flag: "-o findings.txt", checked: true }
  ],
  vulnx: [
    { id: "opt-cms", label: "CMS Tespiti (--cms)", flag: "--cms", checked: true },
    { id: "opt-timeout", label: "Zaman Aşımı 10s (-t 10)", flag: "-t 10", checked: true },
    { id: "opt-dns", label: "DNS Bilgisi Topla (--dns)", flag: "--dns", checked: false },
    { id: "opt-ports", label: "Alternatif Portlar (-p 8080,8443)", flag: "-p 8080,8443", checked: false },
    { id: "opt-output", label: "Rapor Klasörü (-o ./vulnx_reports/)", flag: "-o ./vulnx_reports/", checked: true }
  ]
};

function initCommandBuilder() {
  if (!builderToolSelect) return;

  function updateOptions() {
    const selectedTool = builderToolSelect.value;
    const options = builderOptionsConfig[selectedTool] || [];
    builderOptionsGroup.innerHTML = "";

    options.forEach(opt => {
      const label = document.createElement("label");
      label.className = "builder-checkbox-label";
      label.innerHTML = `
        <input type="checkbox" id="${opt.id}" data-flag="${opt.flag}" ${opt.checked ? 'checked' : ''}>
        <span>${opt.label}</span>
      `;
      label.querySelector("input").addEventListener("change", generateBuilderCommand);
      builderOptionsGroup.appendChild(label);
    });

    generateBuilderCommand();
  }

  function generateBuilderCommand() {
    const tool = builderToolSelect.value;
    const target = builderTargetInput.value.trim() || "example.com";
    const mode = builderModeSelect.value;

    const checkedInputs = builderOptionsGroup.querySelectorAll("input:checked");
    const flags = Array.from(checkedInputs).map(i => i.getAttribute("data-flag")).join(" ");

    let cmd = "";

    if (tool === "subfinder") {
      const targetFlag = mode === "single" ? `-d ${target}` : `-dL ${target}`;
      cmd = `subfinder ${targetFlag} ${flags}`;
    } else if (tool === "httpx") {
      const targetFlag = mode === "single" ? `-u ${target}` : `-l ${target}`;
      cmd = `httpx ${targetFlag} ${flags}`;
    } else if (tool === "nuclei") {
      const targetFlag = mode === "single" ? `-u ${target}` : `-l ${target}`;
      cmd = `nuclei ${targetFlag} ${flags}`;
    } else if (tool === "vulnx") {
      const targetFlag = mode === "single" ? `-u ${target}` : `-w ${target}`;
      cmd = `python vulnx.py ${targetFlag} ${flags}`;
    }

    builderOutputCmd.textContent = cmd.replace(/\s+/g, " ").trim();
  }

  builderToolSelect.addEventListener("change", updateOptions);
  builderTargetInput.addEventListener("input", generateBuilderCommand);
  builderModeSelect.addEventListener("change", generateBuilderCommand);

  builderCopyBtn.addEventListener("click", () => {
    copyToClipboard(builderOutputCmd.textContent, builderCopyBtn);
  });

  updateOptions();
}

// Copy to Clipboard Utility
function copyToClipboard(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    if (btnElement) {
      btnElement.classList.add("copied");
      const span = btnElement.querySelector("span");
      const oldText = span ? span.textContent : "";
      if (span) span.textContent = "Kopyalandı!";
      setTimeout(() => {
        btnElement.classList.remove("copied");
        if (span) span.textContent = oldText;
      }, 2000);
    }
    showToast("Komut panoya kopyalandı!");
  }).catch(() => {
    showToast("Kopyalama başarısız oldu.");
  });
}

// Show Toast
let toastTimeout;
function showToast(message) {
  clearTimeout(toastTimeout);
  toastMsg.textContent = message;
  toast.classList.add("show");
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Escape HTML
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}
