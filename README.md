# Fateful Moment

Kriz anlarında süreye karşı karar verdiğiniz taktiksel bir simülasyon. React Native + Expo (SDK 57) ile iOS ve Android için geliştirildi. Backend yok, tüm veriler dummy.

**Akış:** Savaş Odası → Brifing → zamanlı 3 karar → Harekât Sonrası Rapor

**Kurallar:**
- Her karar *İstikrar* ve *Kamu Güveni* değerlerini değiştirir.
- Süre dolduğunda işaretli bir seçenek varsa o uygulanır. Hiçbir seçenek işaretli değilse ceza yazılır.
- Sonuç, 0–100 arası bir skor ve bir derece olarak gösterilir.

**Dil:** Türkçe (varsayılan) ve İngilizce. **Tema:** Koyu, Açık ve Sistem.

## Kurulum

Gereksinimler: [Node.js LTS](https://nodejs.org) (20+), Git, ve telefonda **Expo Go** (SDK 57) ya da bir Android emülatörü / iOS simülatörü.

```bash
git clone https://github.com/berktopal/fateful-moment.git
cd fateful-moment
npm install
npx expo start
```

`npx expo start` bir QR kod gösterir. Telefonda Expo Go ile okutun. Android emülatörü için terminalde `a`, iOS simülatörü için `i` tuşuna basın.

> Repodaki `.npmrc` dosyası `legacy-peer-deps=true` ayarını içerir. Expo'nun opsiyonel `react-dom` peer bağımlılığı `react@19.2.3` ile yanlış bir çakışma bildiriyor. Bu ayar hem temiz kurulumun hem de EAS build'in çalışması için gerekli; silmeyin.

### Kalite kontrolleri

```bash
npm test              # Jest + React Native Testing Library, 66 test
npm run typecheck     # tsc --noEmit (strict)
npm run lint          # expo lint
npx expo-doctor       # 21/21
```

### Android APK

APK bulutta EAS ile derlenir. Ücretsiz bir Expo hesabı yeterli.

```bash
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview   # eas.json → preview: buildType "apk"
```

İlk build'de EAS, projeyi hesabınıza bağlamayı ve bir Android keystore üretmeyi önerir; ikisine de "yes" deyin. Build bitince terminalde APK'nın indirme linki görünür.

## AI araçları ve yaklaşım

**Araçlar:**
- İlk aşamalarda **Antigravity (Gemini)** kullanıldı.
- Sonraki tüm aşamalar **Claude Code** (VS Code eklentisi) ile yapıldı.
- Tasarım değerleri **Figma MCP** (Figma'nın resmi MCP sunucusu) ile doğrudan Figma dosyasından okundu.

AI'ı kod yazan bir araçtan çok, her adımı doğrulanan bir eşli programlama ortağı olarak kullandım. Kapsam, öncelik ve Figma'dan sapma kararları bende kaldı. Ayrıntılı karar günlüğü: [`docs/AI_LOG.md`](docs/AI_LOG.md).

### Claude Code nasıl yönlendirildi

- **Kalıcı kurallar:** Proje kuralları [`AGENTS.md`](AGENTS.md) dosyasında (CLAUDE.md bu dosyayı içe aktarıyor). Bazı örnekler:
  - Figma tek doğruluk kaynağı; bir değer belirsizse ekran görüntüsünden tahmin edilmez, Figma'dan okunur.
  - Bileşenlerde ham renk yok; her şey token'lardan gelir.
  - React Native'in `Text`'i yerine projenin kendi `Text` bileşeni kullanılır (ESLint bunu zorunlu kılıyor).
  - Ekran metinleri i18n dosyalarında durur; büyük harfe `toUpper` ile çevrilir.
  - Bir iş "bitti" denmeden önce lint, typecheck ve testler çalıştırılır; UI değişiklikleri emülatörde kontrol edilir.
- **Oturumlar arası devir:** Durum bilgisi [`HANDOFF.md`](HANDOFF.md) dosyasında tutuldu. Her yeni oturum işe buradan başladı.
- **Onay kapıları:** Figma'dan sapan bir karar ya da yeni bir paket gerektiğinde AI durup bana sordu. Figma'ya erişilemediğinde tahminle devam etmemesi açıkça istendi.
- **Commit düzeni:** Her mantıklı değişiklik grubu ayrı bir conventional commit oldu. Commit mesajında "neden"i anlatan bir açıklama bulunuyor.

### Figma MCP kullanımı

Figma değişkenleri, tipografi, radius, padding, gölge ve bileşen durumları MCP ile doğrudan dosyadan okundu. Böylece ekran görüntülerinden yapılan ilk tahminlerin bir kısmının yanlış olduğu ortaya çıktı:
- Option Card'ın dolguları yarı saydam (`rgba(15,23,43,0.63)`); Figma'nın açık tuvalinde gri göründükleri için gri sanılmıştı.
- Kilitli kart beyaz bir perde değil, %35 opaklık.
- Buton panosundaki gri ve koyu sütunlar ayrı renk varyantları değil, Disabled ve Pressed durumları.

MCP, Figma'nın Starter planında olduğu için çağrı limitine takıldı. Son denetimde bileşenler, Figma'dan dışa aktarılan görsellerle karşılaştırıldı.

### Ayrı denetim oturumu

Teslimden önce ayrı bir Claude Code oturumu, projeyi bir değerlendirici gözüyle denetledi. Denetim kod değiştirmeden yapıldı; bulgular dosya:satır ve öneriyle listelendi, sonra ayrı commit'lerle düzeltildi. Sonuç: [`REVIEW.md`](REVIEW.md). Test edilebilen düzeltmelere test eklendi; çift dokunma, timer ve kontrast testlerinin düzeltme olmadan düştüğü ayrıca doğrulandı. Bulunan hatalardan bazıları:

- Brifingde "Başlat"a çift dokunulunca iki simülasyon açılıyordu. Görünmeyen ekranın sayacı ve Android geri tuşu dinleyicisi çalışmaya devam ediyordu.
- "Kararı Kilitle"ye çift dokunmak, kararın sonucunu göstermeden bir sonraki adıma geçiriyordu.
- İptal onayı ekranda açıkken karar süresi işlemeye devam ediyordu.
- Açık temanın WCAG AA uyumlu olduğu yazıyordu ama cyan, amber ve yeşil metinler ölçüldüğünde 3.2–3.8:1 çıktı (AA için en az 4.5:1 gerekir).
- iOS'ta kart gölgeleri kırpılıyordu.

### AI önerisinin reddedildiği ya da düzeltildiği yerler

- **"Figma yalnızca bileşen kütüphanesi" varsayımı yanlıştı.** Önceki oturumlar Figma dosyasının yalnızca bir sayfasına bakmıştı. Denetim, case linkinin açtığı Playground sayfasında tam ekranlar olduğunu buldu. Kapsamı ben belirledim (aşağıdaki Notlar'a bakın).
- **Option Card çerçevesi.** `#F8FAFC` çerçeve koyu zeminde belirgin duruyor. Değerlendirme Figma'ya göre yapılacağı için yumuşatmadım, Figma değeri korundu.
- **Figma'nın Passive durumu.** Bu durum cyan gradyanı koruduğu için ikinci bir seçim gibi görünüyordu. Seçilmeyen seçenekler için Figma'daki Default görünümü, Passive'in %48 opaklığıyla kullanıldı.
- **AI'ın kendi test hataları.** Çift dokunma testinin ilk hali takıldı: Expo Router'ın test kütüphanesi sahte zamanlayıcı kullandığı için gerçek bekleme hiç bitmiyordu. Süre dolumu testi de başka bir sorunu ortaya çıkardı: Jest ortamında uygulama "arka planda" göründüğü için simülasyon testlerinde sayaç hiç çalışmıyordu. İkisi de düzeltildi.
- **Geri alınan bir performans denemesi.** AI, timer çubuğunun animasyonunu native thread'e taşıdı; testler geçti. Emülatörde ise çubuğun sayaçtan geri kaldığı görüldü: her 100 ms'de yeniden başlatılan native animasyon eski bir değerden başlıyordu. Değişiklik geri alındı.
- **Yeni paket yerine basit çözüm.** i18n için `i18next` / `expo-localization` eklenmedi. İki dil için tipli bir sözlük ve context yeterli. Eksik bir çeviri anahtarı derleme hatası verir.

## Mimari

```text
src/
├── app/                  Expo Router ekranları: (tabs)/, scenario/[id]/ (brifing → play → outcome), gallery
├── components/           Tasarım sistemi bileşenleri (+ testler)
├── features/simulation/  Saf oyun motoru, faz reducer'ı, countdown hook'u (+ testler)
├── store/                AppStore + AsyncStorage kalıcılığı (sürümlü anahtar, yüklenirken sanitize)
├── repositories/         Async veri katmanı; ekranlar dummy veriye doğrudan erişmez
├── i18n/                 TR / EN tipli sözlükler, Türkçe büyük harf kuralları
└── theme/                Figma değişkenlerinden türetilen token'lar, ThemeProvider
```

- **Oyun mantığı UI'dan ayrı.** Sonuç ekranı skoru URL'deki seçimlerden yeniden hesaplar; bu yüzden sonuçlar tekrar üretilebilir ve test edilebilir.
- **Akış bir reducer ile yönetiliyor** (`deciding → reviewing → complete`). O andaki duruma uymayan aksiyonlar yok sayılır.
- **Timer gerçek geçen süreyi ölçer**, tik saymaz. Uygulama arka plana alınınca ve iptal onayı açıkken durur. Geri sayım ayrı bir bileşende tutulur; saniyede 10 güncelleme ekranın tamamını değil, sadece timer'ı yeniden çizer (bir testle ölçülüyor).
- **Butonlar çift dokunmaya karşı korumalı.** Figma boyutundaki küçük butonların dokunma alanı `hitSlop` ile 44pt'ye tamamlanır.

## Notlar ve bilinen sınırlamalar

- **Figma kapsamı.** Uygulama, Figma dosyasının **🧩Local Components** sayfasını uygular: Style Guide, butonlar, kartlar, Option Card, Nav Bar, Tabbar ve ikonlar. Case linkinin açtığı **🛝Playground** sayfasındaki şu tasarımlar bilinçli olarak kapsam dışında bırakıldı:
  - yatay (812×375) Flow v01: sol menü, video sayfaları, Karar DNAsı sonuç ekranı
  - dikey auth akışları

  Brifing, simülasyon ve sonuç ekranları bileşen kütüphanesiyle, dikey olarak kuruldu.
- **Style Guide ile Buttons panosu çelişiyor.** Style Guide'daki butonlar büyük harfli ve primary rengi cyan 700. Uygulama, bileşen tanımı olan Buttons panosunu izliyor: cyan 400 ve normal yazım.
- **Option Card renkleri iki temada da aynı.** Figma'daki yarı saydam değerler Figma tuvaliyle (`#F5F5F5`) karıştırılıp opak renge çevrildi; türetme bir testle belgeleniyor. Böylece kartlar koyu temada da Figma bileşeni gibi görünüyor.
- **Açık tema Figma'da yok.** WCAG AA'ya göre türetildi ve bir testle korunuyor. Fotoğraf üstündeki içerik iki temada da aynı kalıyor.
- **Test edilen cihazlar.** Android akışı emülatörde (Pixel, Android 14) uçtan uca test edildi. iOS'ta Expo Go ile çalışır; kullanılan tüm native modüller Expo Go'da mevcut.
- **Tablet.** Ekranlar telefon için tasarlandı ve dikey yönde çalışır. Tablette içerik ve alt butonlar en fazla 640 pt genişliğe kadar büyür ve ortalanır; kartlar kenardan kenara yayılmaz.
- **Android'de font.** Menlo Android'de bulunmadığı için HUD metinleri sistemin monospace fontuyla gösterilir.
- **Görev Uyarıları** ayarı yalnızca tercihi kaydeder; bu demoda bildirim servisi yok.
- **Expo Go dişlisi.** Expo Go'da ekranda görünen dişli simgesi Expo'nun geliştirici menüsüdür, APK'da yer almaz.
- **Görseller** Unsplash lisansı altında kullanılmıştır.
