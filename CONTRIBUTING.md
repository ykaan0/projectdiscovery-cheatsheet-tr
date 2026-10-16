# 🤝 Katkıda Bulunma Rehberi (Contributing Guide)

Bu depoya katkıda bulunmak istediğiniz için teşekkür ederiz! Açık kaynak topluluğu sayesinde bu cheatsheet deposu her zaman güncel, doğru ve zengin kalmaktadır.

---

## 🛠️ Nasıl Katkı Sağlayabilirsiniz?

1. **Yeni Komutlar ve Senaryolar Eklemek**:
   - `subfinder/README.md`, `httpx/README.md`, `nuclei/README.md` veya `vulnx/README.md` dosyalarına yeni bir bayrak veya yaygın kullanım ekleyebilirsiniz.
   - Eklenen komutların pratik ve açıklayıcı olmasına özen gösterin.
2. **Web Arayüzüne (`app.js`) Kart Eklemek**:
   - Yeni bir komut eklediğinizde bunu `app.js` içerisindeki `cheatsheetData` dizisine ekleyerek interaktif web paneline dahil edin.
3. **Hata Düzeltmeleri ve Çeviriler**:
   - Yazım hatalarını düzeltmek veya parametre açıklamalarını netleştirmek çok değerlidir.

---

## 📋 Katkı Kuralları

- **Yasal ve Etik Sınırlar**: İstismar (exploitation), yetkisiz sızma veya zararlı yazılım kodları içeren katkılar kabul edilmez. Odak noktamız **savunma, keşif, envanter çıkarma ve kural tabanlı denetimdir**.
- **Standart Hedef İsimleri**: Komut örneklerinde gerçek sistem veya IP adresleri yerine `example.com`, `target.local` gibi RFC standardı güvenli alan adları kullanılmalıdır.
- **Biçimlendirme**: Markdown tablolarını ve kod bloklarını temiz tutun.

---

## 🚀 Çekme İsteği (Pull Request) Süreci

1. Depoyu Fork edin (`Fork` butonu).
2. Özellik dalınızı oluşturun: `git checkout -b feature/yeni-senaryo`
3. Değişikliklerinizi commit edin: `git commit -m 'feat: nuclei markdown raporlama senaryosu eklendi'`
4. Dalınızı push edin: `git push origin feature/yeni-senaryo`
5. Bir Pull Request açın.
