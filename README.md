# Fateful Moment

Kriz anlarında zamana karşı karar verdiğiniz, taktiksel bir simülasyon uygulaması. React Native + Expo ile iOS ve Android için geliştirildi; paylaşılan Figma tasarımını temel alır ve tamamen dummy veriyle çalışır.

## Öne çıkanlar

- **Oynanabilir senaryo akışı:** Brifing → zamanlı karar turları → After Action Report. Her karar *Stability* ve *Public Trust* değerlerini değiştirir. Süre dolarsa işaretli seçenek otomatik uygulanır, hiçbir seçenek işaretli değilse ceza puanı yazılır. Sonuç 0–100 arası bir skor ve bir derece olarak gösterilir (Decisive / Contained / Compromised / Catastrophic).
- **Figma tasarım sistemi:** Semantik token'lar (renk, tipografi, boşluk, radius), Lucide ikon seti ve Figma'daki bileşen durumları: 6 renk varyantı × solid/outline/link buton, senaryo kartları (aktif / pasif), option kartları, HUD kartı, timer, status beacon, scanline. Tüm bileşenler ve durumları *Settings → Design System Gallery* ekranında toplu olarak görülebilir.
- **Dark + Light tema:** Dark, Figma'daki temel görünüm. Light tema WCAG AA kontrastına göre türetildi. *System* seçeneği işletim sisteminin temasını takip eder.
- **Kalıcı durum:** Tema ve titreşim tercihleri ile görev geçmişi AsyncStorage'da tutulur. Diskteki veri bozuksa alan bazında varsayılana dönülür. Tercihler yüklenene kadar splash ekranı açık kalır, böylece açılışta tema yanıp sönmez.
- **Çevrimdışı çalışır:** Tüm görseller uygulama içinde gömülüdür ve `expo-image` ile önbelleklenip yumuşak geçişle yüklenir.
- **Tipografi ve hareket:** Figma'daki Inter fontu (Black Italic başlıklar dahil) kullanılır; HUD metinleri monospace. Karar kartları kademeli olarak belirir, skor sayarak yükselir, kalan süre azaldıkça timer kırmızıya döner. Cihazda "hareketi azalt" açıksa animasyonlar kapanır.
- **Erişilebilirlik ve detaylar:** Anlamlı erişilebilirlik rolleri (button / radio / progressbar / header), haptik geri bildirim (ayarlardan kapatılabilir), uygulama arka plana geçince duran timer, simülasyonun ortasında kazara çıkışa karşı onay (iOS kaydırma hareketi ve Android geri tuşu dahil).

## Ekranlar

| Ekran | İçerik |
|---|---|
| **War Room** (Home) | Öne çıkan brifing kartı, kampanya ilerlemesi, senaryo listesi (kilitli senaryo Figma'daki pasif durumda) |
| **Briefing** | Senaryo görseli, tehdit seviyesi / süre / karar sayısı, kurallar, en iyi skor |
| **Simulation** | Karar sayacı, geri sayım çubuğu, durum raporu, seçenekler, sonuç ve metrik değişimleri |
| **After Action Report** | Derece, skor, final metrikleri, karar zaman çizelgesi, Retry |
| **Intel / Vitals / System** | Protokol seçimi, istihbarat akışı, telemetri, 1:1 arşiv ızgarası, modül teşhisi |
| **Profile** | Gerçek görev geçmişinden hesaplanan istatistikler, son görevler, ilerlemeyi sıfırlama |
| **Settings** | Tema seçimi, haptik, bildirim tercihi, gizlilik, Design System Gallery |

## Kurulum

Gereksinimler: Node.js 20+, telefonda **Expo Go** (SDK 57) ya da bir iOS simülatörü / Android emülatörü.

```bash
npm install
npx expo start        # QR kodu Expo Go ile okutun; emülatör için "a", iOS simülatörü için "i"
```

> Repodaki `.npmrc` dosyası `legacy-peer-deps=true` ayarını içerir. Expo'nun opsiyonel `react-dom` peer bağımlılığı ile projedeki `react@19.2.3` arasında npm'in katı çözümleyicisi sahte bir çakışma bildiriyor. Bu ayar hem yerel kurulumun hem de EAS build'in sorunsuz çalışmasını sağlar.

### Kalite kontrolleri

```bash
npm test              # Jest + React Native Testing Library (41 test)
npm run typecheck     # tsc --noEmit (strict)
npm run lint          # expo lint
npx expo-doctor       # 21/21
```

### Android APK

```bash
npx eas-cli@latest build -p android --profile preview   # eas.json → preview: buildType "apk"
```

## Mimari

```text
src/
├── app/                       # Expo Router — her dosya bir ekran
│   ├── (tabs)/                # 6 sekme: War Room, Intel, Vitals, Profile, System, Settings
│   ├── scenario/[id]/         # index (brifing) → play (simülasyon) → outcome (rapor)
│   ├── gallery.tsx            # Tasarım sistemi vitrini
│   └── _layout.tsx            # Provider'lar, splash gating, Stack
├── components/                # Tasarım sistemi bileşenleri (+ __tests__)
├── features/simulation/       # Saf oyun motoru, reducer, countdown hook (+ __tests__)
├── store/                     # AppStore (context) + AsyncStorage kalıcılığı (+ __tests__)
├── hooks/                     # useAsyncData, useHaptics, useAppActive
├── repositories/              # Async veri katmanı (backend'e geçişte UI değişmez)
├── data/                      # Dummy veri ve gömülü görseller
├── theme/                     # Token'lar + ThemeProvider
└── types/                     # Domain modelleri
```

**Temel kararlar**

- **Oyun mantığı UI'dan ayrı.** `engine.ts` saf fonksiyonlardan oluşur. Sonuç ekranı skoru, senaryo tanımı ve URL'deki seçimlerden yeniden hesaplar. Bu sayede sonuçlar tekrar üretilebilir ve kolayca test edilebilir.
- **Akış bir reducer ile yönetiliyor** (`deciding → reviewing → complete`). O andaki duruma uymayan aksiyonlar yok sayılır. Böylece çift dokunma ya da "onayla" ile "süre doldu"nun aynı anda gelmesi hata üretmez.
- **Timer tik saymaz, gerçek geçen süreyi ölçer.** JS thread'i yavaşlasa bile süre uzamaz. Uygulama arka plana alınınca timer duraklar.
- **Bileşenler ham renk kullanmaz.** Her şey semantik token'lardan gelir. Görsellerin üstündeki içerik, Figma'da olduğu gibi iki temada da aynı kalır (`MEDIA_COLORS`).
- **Lucide ikonları tek tek import ediliyor.** Metro tree-shaking yapmadığı için bundle'a yalnızca kullanılan ikonlar girer.

## AI araçları ve yaklaşım

Geliştirmede **Antigravity (Gemini)** ve **Claude Code** kullanıldı. AI'ı kod üreten bir araçtan çok, her adımı doğrulanan bir eşli programlama ortağı olarak konumlandırdım:

1. **Denetim:** Figma ekran görüntüleri mevcut kodla bileşen bileşen karşılaştırıldı, sapmalar listelendi. Örneğin ikon setinin Lucide olduğu, buton varyantlarının eksik olduğu, pasif kart durumunun Figma'dan farklı olduğu bu aşamada görüldü.
2. **Plan:** Kapsam ve öncelik benim kararımdı. Senaryo akışı, kalıcılık, testler ve çevrimdışı görseller sırasıyla ele alındı.
3. **Figma'dan birebir değer alma:** Figma MCP ile dosyadaki bileşenlerin gerçek değerleri (renk değişkenleri, tipografi, radius, padding, gölge, durumlar) okundu. İlk sürümdeki bazı ekran görüntüsü tahminlerinin yanlış olduğu bu sayede görüldü: Option Card'ın yarı saydam olduğu, kilitli kartın %35 opaklıkla gösterildiği, buton panosundaki gri/koyu sütunların ayrı renk varyantı değil Disabled/Pressed durumları olduğu gibi. Hepsi Figma değerleriyle düzeltildi.
4. **Doğrulama:** Her aşamada `tsc`, lint, testler ve `expo-doctor` çalıştırıldı. Uygulama bir Android emülatöründe baştan sona oynatıldı ve ekran görüntüleri incelendi. Statik analizin yakalayamadığı birkaç hata bu şekilde bulunup düzeltildi:
   - iPhone'da tab bar'ın home indicator altında kalması
   - `userInterfaceStyle: "light"` nedeniyle System temasının hiç çalışmaması
   - Light temada status bar ikonlarının görünmemesi
   - Tab bar altındaki beyaz şerit
   - Brifing görselinin tam genişlikte olmaması
5. **Kayıt:** Karar günlüğü [`docs/AI_LOG.md`](docs/AI_LOG.md) dosyasında.

## Notlar ve bilinen sınırlamalar

- Figma dosyası yalnızca bileşen kütüphanesi içeriyor (tam ekran tasarımı yok). Ekran yerleşimleri bu bileşenlerle kuruldu; brifing, simülasyon ve sonuç ekranları Figma'da olmadığı için tasarım dili korunarak eklendi.
- Android'de Menlo bulunmadığından HUD metinleri sistemin monospace fontuyla gösterilir.
- *Mission Alerts* ayarı yalnızca tercihi kaydeder. Bu demoda push bildirim servisi yok.
- Android akışı emülatörde (Pixel, Android 14) uçtan uca test edildi. iOS bundle'ı `expo export` ile doğrulandı.
- Expo Go'da ekranda görünen dişli simgesi Expo'nun geliştirici menüsüdür, APK'da yer almaz.
- Görseller Unsplash lisansı altında kullanılmıştır.
