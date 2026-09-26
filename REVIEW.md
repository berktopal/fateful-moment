# Teslim Öncesi Denetim — Fateful Moment

_Tarih: 2026-09-26 · Dal: `master` (`5c7cce7`) · Denetleyen: Claude Code (ayrı denetim oturumu)_

**Kapsam:** Figma uyumu, iOS/Android farkları, UI/UX, QA (akışlar ve uç durumlar), erişilebilirlik, kod kalitesi, statik kontroller ve case maddelerine göre puanlama.

**Yöntem:** Kodun tamamı okundu. Figma MCP ile Playground sayfasının yapısı ve iki ekranı alındı, ardından MCP Starter plan limitine takıldı. Bileşen kütüphanesi, kullanıcının Figma'dan aldığı 20 görselle karşılaştırıldı. Değerler daha önceki bir oturumda Figma MCP ile okunmuştu (`docs/AI_LOG.md` Phase 8).

## Statik kontroller (denetim anı)

| Kontrol | Sonuç |
|---|---|
| `npx expo lint` | ✅ 0 hata, 0 uyarı |
| `npx tsc --noEmit` | ✅ temiz |
| `npm test` | ✅ 8 suite, 49 test |

---

## Kritik

### K1. Figma'nın asıl ekranları (Playground sayfası) uygulanmamış
- **Bulgu:** Case linki (`node-id=0-1`) **🛝Playground** sayfasını açıyor. Bu sayfada şunlar var:
  - **Flow v01** (yatay 812×375): sol menü (Scenarios / DNA / Settings), yatay "Scenarios" listesi, sağ üstte ses çalar, senaryo hero'su, Video Page, 2×2+1 karar ızgarası ve altta sarıdan kırmızıya dönen timer, "Karar DNAsı" (arketip portresi ve radar grafik).
  - **Dikey auth akışları:** Sign in/up, Create Account, Sign in with Email, Reset Password, Error Cases.

  Uygulama ise dikey, 6 sekmeli ve bu ekranların hiçbirini içermiyor. `AGENTS.md`, `HANDOFF.md`, `README.md` ve `docs/AI_LOG.md` "Figma yalnızca bileşen kütüphanesi" diyor; bu yanlış. Önceki oturumlar yalnızca **🧩Local Components** sayfasına bakmış.
- **Karar (kullanıcı, 2026-09-26):** Bileşen kütüphanesiyle uyum yeterli kabul edildi. Playground ekranları kapsam dışında kalıyor ve README'de sapma olarak açıkça belirtilecek.
- **Öneri:** Dokümanlardaki yanlış ifadeyi düzelt. README'de hangi Figma sayfasının uygulandığını ve neyin kapsam dışında kaldığını yaz.

### K2. Hızlı çift dokunma aynı ekranı iki kez açıyor; gizli simülasyon çalışmaya devam ediyor
- **Yer:** `src/app/(tabs)/index.tsx:19` (`openBriefing` → `router.push`), `src/app/scenario/[id]/index.tsx:74` (Start Simulation → `router.push`), `src/app/scenario/[id]/play.tsx:106-109` (BackHandler).
- **Senaryo:** Brifingde "Simülasyonu Başlat"a çift dokunulunca iki simülasyon ekranı üst üste açılıyor. Alttaki ekran görünmüyor ama timer'ı işliyor, haptik uyarıları titreşiyor ve `hardwareBackPress` dinleyicisi aktif kalıyor. Görev bitip sonuç ekranı açıldığında Android geri tuşu, gizli ekranın "Görevi iptal et?" diyaloğunu açıyor. Onaylanırsa sonuç ekranından yarım kalmış gizli simülasyona dönülüyor.
- **Öneri:** `Button` bileşeninde örnek başına çift dokunma kilidi (ör. 500 ms). Tüm navigasyon butonları bu bileşenden geçtiği için tek noktadan çözülür.

### K3. iOS'ta hiç çalıştırılmadı
- **Bulgu:** HANDOFF'a göre iOS'ta yalnızca `expo export` ile bundle derlendi. Teslim ise iOS ekran kaydı istiyor. Çentik, safe area, Menlo fontu ve gölgeler (bkz. Ö6) iOS'ta hiç görülmedi.
- **Öneri:** Kullanılan tüm native modüller Expo Go'da mevcut. Bir iPhone'da Expo Go (SDK 57) ile QR kodu okutup akışı baştan sona oynatmak ve kaydı almak yeterli. Bu adım teslimden önce kullanıcı tarafından yapılmalı.

### K4. README'nin AI bölümü ve bazı bilgileri güncel değil
- **Yer:** `README.md` ("AI araçları ve yaklaşım", "Kalite kontrolleri").
- **Bulgu:** Kullanılan araç "Antigravity (Gemini) ve Claude Code" diye geçiyor ama somut bir yönlendirme örneği yok. Ayrı denetim oturumu anlatılmıyor. Reddedilen AI önerileri görünmüyor. Figma MCP limiti anlatılmıyor. Test sayısı 41 yazıyor, gerçekte 49. Case'in değerlendirdiği ana madde tam olarak bu bölüm.
- **Öneri:** Kısa ve taranabilir, somut örnekli bir AI bölümü yaz. Kurulum adımlarının temiz bir makinede izlenebildiğini kontrol et. APK komutunu ve bilinen sınırlamaları ekle.

## Önemli

### Ö1. "Kararı Kilitle"ye çift dokunmak sonucu atlıyor
- **Yer:** `src/app/scenario/[id]/play.tsx:144-165`
- **Senaryo:** Footer'daki buton ilk dokunuşta "Sonraki Karar"a dönüşüyor. React aynı konumdaki `Button`'ı yeniden kullandığı için ikinci dokunuş kullanıcı kararın sonucunu görmeden bir sonraki adıma geçiriyor. Reducer bunu engellemiyor, çünkü ikinci aksiyon yeni faz için geçerli.
- **Öneri:** K2'deki buton kilidi bunu da çözer. Footer'ı açıkça tek bir `Button` olarak yaz ve bu davranışı test et.

### Ö2. İptal onayı açıkken geri sayım durmuyor
- **Yer:** `src/app/scenario/[id]/play.tsx:71-76`, `97-103`
- **Senaryo:** Kullanıcı geri tuşuna basıyor ve "Görevi iptal et?" diyaloğu açılıyor. Diyalog açıkken süre doluyor ve ceza yazılıyor. "Devam Et" denince karar kaçırılmış oluyor.
- **Öneri:** Diyalog açıkken countdown'ı duraklat. Diyalog kapanınca (Devam Et ya da Android'de dışarı dokunma) kaldığı yerden devam etsin.

### Ö3. Light tema WCAG AA kontrastını karşılamıyor
- **Yer:** `src/theme/tokens.ts:230-236` (LIGHT_TOKENS)
- **Bulgu:**
  - `primary #0891B2` beyaz üstünde **3.7:1**. Küçük cyan metinlerde (HUD etiketleri, timer değeri, rütbe) ve primary butonun beyaz etiketinde kullanılıyor.
  - `warning #D97706` **3.2:1**, `success #059669` **3.8:1**. İkisi de metin rengi olarak kullanılıyor (tehdit etiketi, derece, metrik değeri).

  README ise light temanın "WCAG AA kontrastına göre türetildiğini" söylüyor. Light tema Figma'da yok, tamamen türetilmiş.
- **Öneri:** `#0E7490` (5.4:1), `#B45309` (5.0:1), `#047857` (5.5:1).

### Ö4. Nav bar ikonlarının erişilebilirlik etiketleri anlamsız
- **Yer:** `src/components/IconButton.tsx:44` (`accessibilityLabel || icon`), `src/components/NavBar.tsx:38,51`
- **Bulgu:** NavBar hiç etiket geçmediği için ekran okuyucu "arrow-left", "squiggle", "refresh-cw", "bell-dot" gibi İngilizce ikon adlarını okuyor. Bazı ikonların `onPress`'i de yok: tüm sekmelerdeki sol squiggle ve System'deki grid. Bunlar da işlevsiz birer "buton" olarak duyuruluyor.
- **Öneri:** NavBar'da dekoratif ikon ile aksiyonu tipte ayır; aksiyonlar için etiket zorunlu olsun. `IconButton`'da `accessibilityLabel` zorunlu olsun. Etiketler i18n üzerinden gelsin.

### Ö5. 44pt altında dokunma alanları
- **Yer:** `src/components/Button.tsx:56-60`, `src/app/(tabs)/settings.tsx:275-279`
- **Bulgu:**
  - `Button` md ≈ 36pt, sm ≈ 34pt. Etkilenenler: Profil'deki "İlerlemeyi Sıfırla" ve "Savaş Odasını Aç", hata ekranındaki "Tekrar Dene", liste kartlarındaki "Başlat" (≈ 42pt).
  - Ayarlar'daki tema ve dil segmentleri ≈ 31pt.
- **Öneri:** Buton ölçüleri Figma'dan geldiği için görünümü değiştirme; md/sm/link butonlara `hitSlop` ekle. Segmentlere `minHeight: 44` ver.

### Ö6. iOS'ta kart gölgeleri görünmüyor
- **Yer:** `src/components/ScenarioCard.tsx:118-150`, `src/components/SquareCard.tsx:90-100`
- **Bulgu:** Gölge ile `overflow: 'hidden'` aynı view'da. iOS gölgeyi kırpıyor, Android `elevation`'ı çiziyor. Sonuç olarak Figma'daki kart gölgesi (0 25 50 −12) iki platformda farklı görünüyor.
- **Öneri:** Dışta gölgeli bir view, içte köşeleri kırpan bir view kullan.

### Ö7. Sonuç ekranı butonları dar ekranda sığmıyor
- **Yer:** `src/app/scenario/[id]/outcome.tsx:97-111`, `302-311`
- **Bulgu:** İki `lg` buton ve ikonları yan yana duruyor. 360dp genişlikte her buton için yaklaşık 78px metin alanı kalıyor, bu yüzden "Tekrar Oyna" ve "Savaş Odası" satır kırıyor ya da taşıyor.
- **Öneri:** Butonları alt alta diz. Aynı footer kodu üç ekranda kopyalanmış (k2); ortak bir `ScreenFooter` bileşenine çıkar.

## Küçük

| # | Yer | Bulgu | Öneri |
|---|---|---|---|
| k1 | `src/app/**`, `src/components/**` | 44 ham `fontSize` (10, 13, 15, 20, 24, 44…) ve 22 ham `borderRadius`. TYPE_SCALE ve radius token'larının dışında kalıyor. | Figma'da olmayan ekranlarda ve kendi içlerinde tutarlı. Teslim öncesi toplu refactor görsel risk taşır. Sonraki adım: HUD mono etiketleri için `typography.hudMono` kullan. |
| k2 | `scenario/[id]/index.tsx:60-76`, `play.tsx:135-166`, `outcome.tsx:88-112` | Safe-area'lı footer kodu üç kez kopyalanmış. | `ScreenFooter` bileşeni (Ö7 ile birlikte). |
| k3 | `ScenarioCard.tsx:36`, `138-141` | Figma'da iki kart boyutu var: 220×176 ("0:00 min" + alarm) ve 326×261 ("Scenario Time" + squiggle). Uygulama büyük kartın boyutuna küçük kartın ikonu ve metnini koyuyor. | Sonraki sürümde `size` prop'u. |
| k4 | `Button.tsx` | Style Guide butonları büyük harfli ve "Primary Active" rengi cyan 700. Buttons panosunda primary cyan 400 ve normal yazımlı. İki kaynak çelişiyor; kod Buttons panosunu izliyor. | README'de not düş. |
| k5 | `tokens.ts:175` | Style Guide'da HUD Mono harf aralığı daha geniş, Display Large daha sıkı görünüyor. MCP limiti nedeniyle gerçek değer okunamadı. | MCP erişimi açılınca `get_variable_defs` ile doğrula. |
| k6 | `StatusBeacon.tsx:115` | Ham `'#000'` gölge rengi. | `theme.colors.shadow` |
| k7 | `InteractiveSelection.tsx:39` | Radio için `accessibilityState.selected` kullanılmış, doğrusu `checked`. | `checked` |
| k8 | `(tabs)/index.tsx:44-46` | Bildirim zili (bell-dot) Intel sekmesini açıyor. İkon ile eylem örtüşmüyor. | Etiketle netleştir ya da ikonu değiştir. |
| k9 | `(tabs)/index.tsx:69`, `explore.tsx:75` | Senaryo listesi ya da istihbarat akışı boş gelirse gösterilecek bir mesaj yok. Dummy veride tetiklenmiyor. | Boş durum metni. |
| k10 | `explore.tsx:29` | Varsayılan protokol id'si koda gömülü (`'2'`). | Veriden türet. |
| k11 | `app.json:12` | `supportsTablet: true` ama yalnızca portrait. iPad'de kartlar tam genişlikte, çok büyük görünüyor. | İçeriğe `maxWidth` ya da `supportsTablet: false`. |
| k12 | `play.tsx` | Süre dolduğu anda footer "Sonraki Karar"a dönüyor. Tam o anda "Kilitle"ye dokunan kullanıcı sonucu atlayabiliyor. Ö1'in kilidi bu durumu kapsamıyor. | Faz değişiminden sonra kısa bir giriş gecikmesi. |

---

## Değerlendirici gözüyle case maddeleri

| Beklenti / teslim | Durum | Not | Puan |
|---|---|---|---|
| Figma tasarımına uygunluk | ⚠️ Zayıf | Bileşen kütüphanesiyle uyum iyi: token'lar, butonlar, kartlar, option card, nav/tab bar ve ikonlar Figma değerleriyle yapılmış. Ancak Playground'daki yatay akış, DNA ve auth ekranları yok (K1). | 5 |
| React Native, iOS ve Android | ⚠️ Zayıf | Android emülatörde uçtan uca test edilmiş. iOS hiç çalıştırılmamış (K3). iOS gölge farkı (Ö6). | 5 |
| AI araçlarının aktif kullanımı ve sürecin yönetimi | ⚠️ Zayıf | `docs/AI_LOG.md` ayrıntılı, ama README'deki anlatım genel kalıyor ve eski (K4). | 6 |
| Backend yok, dummy data | ✅ Karşılandı | Async repository katmanı var; ekranlar veriye doğrudan erişmiyor. | 10 |
| Teslim: ekran kayıtları | ❌ Eksik | Kullanıcı yapacak. | 0 |
| Teslim: Android APK | ❌ Eksik | `eas.json` preview profili APK'ya hazır. Build alınmadı. | 0 |
| Teslim: public repo | ✅ Karşılandı | github.com/berktopal/fateful-moment | 10 |
| Teslim: README | ⚠️ Zayıf | Kurulum ve mimari iyi; AI bölümü eski (K4). | 6 |
| Kod kalitesi (değerlendiricinin ayrıca bakacağı) | ✅ İyi | Saf oyun motoru, reducer, sanitize edilen kalıcılık, i18n, 49 test, temiz lint ve tsc. Eksikler: K2, Ö1, Ö2. | 8 |

**Genel puan (denetim anı): 6 / 10.** Kod kalitesi güçlü. Puanı düşüren başlıca etkenler eksik teslimler (APK, kayıtlar), iOS'un hiç test edilmemiş olması, Playground ekranlarının yokluğu ve README'deki AI anlatımı.

---

## Düzeltme durumu (2026-09-27)

| Madde | Durum | Commit |
|---|---|---|
| K1 Playground ekranları | Kapsam dışı (kullanıcı kararı). Dokümanlardaki yanlış ifade düzeltildi; README'de sapma olarak yazıldı. | docs commit'i |
| K2 Çift dokunma ile çift navigasyon | ✅ `Button`'da 500 ms kilit. Test, kilit olmadan düştüğü doğrulanarak eklendi. | `85e2d29` |
| K3 iOS'ta hiç çalıştırılmadı | ⏳ Kullanıcı: Expo Go ile iPhone'da oynatıp kaydını al. | — |
| K4 README | ✅ Yeniden yazıldı. | docs commit'i |
| Ö1 "Kilitle" çift dokunma sonucu atlıyor | ✅ Footer tek bir `Button`; akış testi eklendi. | `85e2d29` |
| Ö2 İptal diyaloğunda timer | ✅ Diyalog açıkken duruyor. Test eklendi, düzeltme olmadan düştüğü doğrulandı. | `8f9c680` |
| Ö3 Light tema kontrastı | ✅ `#0E7490` / `#B45309` / `#047857`. Kontrast testi eklendi. | `a55326a` |
| Ö4 NavBar erişilebilirliği | ✅ Aksiyonlarda etiket tipte zorunlu; dekoratif ikonlar gizli. | `d7e1b12` |
| Ö5 44pt dokunma alanları | ✅ Butonlara `hitSlop`, segmentlere `minHeight: 44`. | `85e2d29`, `d7e1b12` |
| Ö6 iOS kart gölgeleri | ✅ İki katmanlı kart yapısı (iOS cihazda görsel doğrulama K3 ile birlikte). | `48392da` |
| Ö7 Sonuç ekranı footer'ı | ✅ Butonlar alt alta; ortak `ScreenFooter` bileşeni (k2). | `791ea43` |
| k6, k7 | ✅ | `48392da`, `d7e1b12` |
| k1, k3, k4, k5, k8–k12 | Açık. Küçük maddeler; teslim öncesi görsel risk ya da MCP erişimi gerektiriyor. k8'deki zil ikonu artık erişilebilirlik etiketiyle açıklanıyor. | — |

**Son kontroller:** lint ✅ · tsc ✅ · 56/56 test ✅ · expo-doctor 21/21 ✅ · Android emülatörde doğrulandı (ana ekran kartları, simülasyon ve sonuç footer'ları, ayarlar, light tema).

**Güncel puan: 7 / 10.**
- Kod, QA ve erişilebilirlik tarafındaki açıklar kapandı; README artık AI sürecini somut örneklerle anlatıyor.
- Kalan düşüşün sebepleri: Playground ekranlarının yokluğu, iOS'un henüz çalıştırılmamış olması ve eksik teslimler (APK, ekran kayıtları).
- APK ve iki platformun ekran kaydı eklendiğinde beklenen puan **8 / 10**.

