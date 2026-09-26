# Handoff — Fateful Moment

_Son güncelleme: 2026-09-27 · Dal: `master` (push edilmedi; origin'in önünde)_
Kalıcı kurallar (tasarım, yapı, mühendislik) → [AGENTS.md](AGENTS.md). Bu dosya yalnızca **durum** anlatır.

## Case teslim durumu

| Teslim | Durum |
|---|---|
| Repo linki — https://github.com/berktopal/fateful-moment (public) | ✅ |
| README (kurulum, AI araçları/yaklaşım, notlar) | ✅ (denetim sonrası yeniden yazıldı) |
| Android APK | ❌ Kullanıcı yapacak: `npx eas-cli@latest login` → `npx eas-cli@latest build -p android --profile preview` |
| iOS + Android ekran kaydı | ❌ Kullanıcı yapacak |

## Yapılanlar (özet)

1. **Figma hizalama:** Lucide ikon seti, Inter fontu, tasarım token'ları, tüm bileşenler. Son adımda **Figma MCP ile gerçek değerler** okunup ekran görüntüsü tahminleri düzeltildi (bkz. `docs/AI_LOG.md` Phase 8).
2. **Oynanabilir akış:** Brifing → zamanlı 3 karar → After Action Report. Skor 0–100, derece (Decisive / Contained / Compromised / Catastrophic). 3 oynanabilir senaryo, 1 kilitli.
3. **Kalıcılık:** Tema, haptik, bildirim tercihi ve görev geçmişi AsyncStorage'da. Splash, tercihler ve fontlar yüklenene kadar açık kalır.
4. **Çevrimdışı görseller:** `assets/images/` (Unsplash), `expo-image` ile gösteriliyor.
5. **UX:** Karar sonrası otomatik kaydırma, seçilmeyenleri soluklaştırma, kalan süre azaldıkça kırmızılaşan timer, FadeIn ve skor sayacı (Reduce Motion'a uyumlu), haptik.
6. **Kalite:** 41 test (engine, reducer, countdown, storage, Button, ScenarioCard ve Expo Router ile uçtan uca akış). `tsc`, `expo lint`, `expo-doctor` (21/21) temiz.
7. **Android ikonları:** Adaptive icon güvenli alana alındı, monochrome (temalı) ikon logodan üretildi, şablon asset'ler silindi.
8. **Emülatörde bulunup düzeltilen hatalar:** Tab bar'ın home indicator altında kalması, `userInterfaceStyle: light` yüzünden System temasının çalışmaması, status bar ve root arka plan rengi, eksik `scheme`, `aspectRatio` genişlik hatası, `expo-asset` eksikliği.

9. **Dil desteği (TR varsayılan, EN seçenek):** Ayarlar → Dil. Tüm ekranlar, uyarılar, erişilebilirlik etiketleri ve senaryo içerikleri çevrildi; seçim AsyncStorage'da saklanıyor, eski kayıtlar Türkçe'ye düşüyor. Türkçe büyük harf (i→İ) JS'te yapılıyor. Emülatörde iki dilde de doğrulandı. Test sayısı 49.
10. **Teslim öncesi denetim (ayrı oturum):** `REVIEW.md` yazıldı. Kritik ve Önemli maddeler ayrı commit'lerle düzeltildi: çift dokunma kilidi, iptal diyaloğunda timer'ın durması, light tema AA, NavBar erişilebilirlik etiketleri ve 44pt dokunma alanları, iOS kart gölgeleri, sonuç ekranı footer'ı. 56 test, emülatörde doğrulandı. README yeniden yazıldı.

## Önemli kararlar ve nedenleri

- **Uygulanan Figma sayfası: 🧩Local Components.** Case linkinin açtığı 🛝Playground sayfasında tam ekranlar da var (yatay Flow v01, Karar DNAsı, auth). Önceki oturumlar bu sayfayı görmemişti. Kullanıcı kararıyla kapsam dışında kaldı, README'de sapma olarak yazıldı (bkz. `REVIEW.md` K1).
- **"Dimmed" option durumu:** Figma'da yok. Figma'nın Passive durumu cyan gradient'i koruduğu için ikinci bir seçim gibi okunuyordu. Seçilmeyen seçenekler bu yüzden Default görünümde %48 opaklıkla gösteriliyor.
- **Option Card çerçevesi `#F8FAFC`** (Figma'daki değer). Koyu zeminde belirgin duruyor ama **kullanıcı kararı: Figma'ya sadık kalınacak** (değerlendirme Figma referans alınarak yapılacak). Yumuşatılmayacak.
- **Timer countdown modu:** Süre doluyken Figma'daki görünüm, azaldıkça yalnızca kırmızı uç görünüyor.
- **Light tema:** Figma'da yok. AA kontrastı için türetildi, fotoğraf üstündeki içerik iki temada da aynı kalıyor.
- **i18n kütüphanesi yok:** İki dil için tipli sözlük + context yeterli; `i18next`/`expo-localization` eklenmedi. Cihaz diline bakılmıyor, çünkü varsayılan dil bilerek Türkçe.
- **Galeri İngilizce kaldı:** Figma etiketlerini birebir gösteren geliştirici ekranı; yalnızca başlığı çevrildi.
- **`.npmrc` `legacy-peer-deps`:** Olmadan temiz kurulum ve EAS build kırılıyor.

## Dikkat edilecekler

- **iOS hiç test edilmedi** (Mac/iPhone yok); yalnızca `expo export` ile bundle derlendi. Çentik, safe area ve Menlo fontu iOS'ta kontrol edilmeli.
- **Emülatör (`fm_pixel`, Android 14, elle oluşturuldu):** `"%LOCALAPPDATA%\Android\Sdk\emulator\emulator" -avd fm_pixel -gpu host`. Açılışta çıkan "System UI isn't responding" penceresi emülatörün kendi yavaşlığından; **Wait**'e basılır. Tıklamalar gecikmeli işlendiği için karar timer'ları (12–20 sn) kolayca doluyor; bu bir hata değil.
- **Expo Go:** Sağ üstteki dişli simgesi Expo Go'nun geliştirici menüsü, APK'da yok. Uygulama ikonu da yalnızca APK'da görünür.
- **Metro:** 8081'de kullanıcının açtığı bir `expo start` olabilir; öldürmeden önce komut satırını kontrol et.
- **`expo prebuild`:** Doğrulama için çalıştırılırsa `android/` klasörünü sil (gitignore'da) ve `package.json`'daki script değişikliğini geri al.
- **Figma MCP:** claude.ai bağlantısı düştü; yerine Figma'nın resmi sunucusu eklendi (`figma`, HTTP, `https://mcp.figma.com/mcp`, User scope). Araçlar yalnızca yeni oturumda yüklenir. İlk iş: Figma araçlarının göründüğünü doğrula, görünmüyorsa `/mcp` → `figma` → Authenticate.
- **Sıradaki iş:** Kullanıcı tarafında APK build'i, iOS (Expo Go) ve Android ekran kayıtları ve push. Açık kalan Küçük maddeler `REVIEW.md`'de listelendi. Figma MCP Starter plan limitinde; tekrar kullanmadan önce kullanıcıya sor.
- **Push:** Kullanıcı açıkça istemeden push yapılmaz. `feat/design-polish` dalı silindi, tek dal `master`.
