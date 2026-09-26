# Handoff — Fateful Moment

_Son güncelleme: 2026-09-26 · Dal: `master` (origin ile senkron, son commit `2753af6`)_
Kalıcı kurallar (tasarım, yapı, mühendislik) → [AGENTS.md](AGENTS.md). Bu dosya yalnızca **durum** anlatır.

## Case teslim durumu

| Teslim | Durum |
|---|---|
| Repo linki — https://github.com/berktopal/fateful-moment (public) | ✅ |
| README (kurulum, AI araçları/yaklaşım, notlar) | ✅ |
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

## Önemli kararlar ve nedenleri

- **Figma yalnızca bir bileşen kütüphanesi.** Brifing, simülasyon ve sonuç ekranları Figma bileşenleriyle kuruldu (README'de not düşüldü).
- **"Dimmed" option durumu:** Figma'da yok. Figma'nın Passive durumu cyan gradient'i koruduğu için ikinci bir seçim gibi okunuyordu. Seçilmeyen seçenekler bu yüzden Default görünümde %48 opaklıkla gösteriliyor.
- **Option Card çerçevesi `#F8FAFC`** (Figma'daki değer). Koyu zeminde belirgin duruyor ama **kullanıcı kararı: Figma'ya sadık kalınacak** (değerlendirme Figma referans alınarak yapılacak). Yumuşatılmayacak.
- **Timer countdown modu:** Süre doluyken Figma'daki görünüm, azaldıkça yalnızca kırmızı uç görünüyor.
- **Light tema:** Figma'da yok. AA kontrastı için türetildi, fotoğraf üstündeki içerik iki temada da aynı kalıyor.
- **`.npmrc` `legacy-peer-deps`:** Olmadan temiz kurulum ve EAS build kırılıyor.

## Dikkat edilecekler

- **iOS hiç test edilmedi** (Mac/iPhone yok); yalnızca `expo export` ile bundle derlendi. Çentik, safe area ve Menlo fontu iOS'ta kontrol edilmeli.
- **Emülatör (`fm_pixel`, Android 14, elle oluşturuldu):** `"%LOCALAPPDATA%\Android\Sdk\emulator\emulator" -avd fm_pixel -gpu host`. Açılışta çıkan "System UI isn't responding" penceresi emülatörün kendi yavaşlığından; **Wait**'e basılır. Tıklamalar gecikmeli işlendiği için karar timer'ları (12–20 sn) kolayca doluyor; bu bir hata değil.
- **Expo Go:** Sağ üstteki dişli simgesi Expo Go'nun geliştirici menüsü, APK'da yok. Uygulama ikonu da yalnızca APK'da görünür.
- **Metro:** 8081'de kullanıcının açtığı bir `expo start` olabilir; öldürmeden önce komut satırını kontrol et.
- **`expo prebuild`:** Doğrulama için çalıştırılırsa `android/` klasörünü sil (gitignore'da) ve `package.json`'daki script değişikliğini geri al.
- **Figma MCP:** Bu oturumda bağlıydı, bağlantı kesildi. Yeni oturumda gerekirse yeniden bağlanmalı.
- **Push:** Kullanıcı açıkça istemeden push yapılmaz. `feat/design-polish` dalı silindi, tek dal `master`.
