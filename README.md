# Fateful Moment (React Native)

"Fateful Moment", Figma tasarımına sadık kalınarak geliştirilmiş, taktiksel kriz yönetimi ve askeri/bilimkurgu simülasyonu temalı, yüksek performanslı ve çift temalı (Dark + Light) bir mobil uygulamadır.

---

## 🚀 Öne Çıkan Mühendislik & Tasarım Standartları

* **Çift Tema Desteği (Dark & Light Mode):**
  * **Dark Theme:** Figma Stil Rehberindeki renk kodları (`#00D3F3`, `#0F172A`, `#FB2C36`, `#020617`, `#1D293D`, `#F1F5F9`) ile piksel-kusursuz (pixel-perfect) uyum.
  * **Light Theme:** Marka kimliğini koruyan, WCAG AA erişilebilirlik standartlarına uygun kontrast oranları ve dinamik tema geçiş altyapısı (`useTheme()`).
  * **Runtime Selector:** Ayarlar (Settings) sekmesinden anlık olarak System / Dark / Light geçişi yapılabilir.
* **Tasarım Sistemi Bileşenleri (Atomic Components):**
  * `Button`: Primary, Secondary, Danger, Dark varyantları; SM, MD, LG boyutları; dokunma esnasında yaylı ölçekleme animasyonu (`Animated.spring`).
  * `TimerBar`: Figma'daki Cyan → Kırmızı degradeye sahip, animasyonlu operasyon geri sayım çubuğu.
  * `StatusBeacon`: Gerçek zamanlı sistem ve operatif durumunu simüle eden yanıp sönen (pulsing) yeşil/kırmızı gösterge halkaları.
  * `OptionCard`: Karar Matrisi (Decision Matrix) için Active (Cyan degrade), Default ve Passive durumları.
  * `ScenarioCard`: Kriz brifing kartı (büyük ve standart boyutlar, kilitli/pasif soluk mod, buton durumları).
  * `SquareCard`: 1:1 en-boy oranı (`aspectRatio: 1`) korunarak resim sünmelerini önleyen arşiv ızgara kartı.
  * `NavBar`: Çentik ve Dinamik Ada (Safe Area) paylarına tam uyumlu başlık ve interaktif aksiyon barı.
* **Tasarım Doğrulama Galerisi (`/gallery`):**
  * Tüm bileşenlerin açık ve koyu temalardaki tüm durumlarını yan yana test edebilmek için Settings sekmesinden erişilebilen canlı bir **Component Gallery** ekranı bulunmaktadır.
* **Async Repository Mimarisi:**
  * UI katmanı statik verilere doğrudan bağımlı değildir; `scenarioRepository`, `intelRepository` gibi asenkron servisler üzerinden beslenir. İleride backend veya GraphQL eklendiğinde tek satır UI kodu değiştirmeden entegrasyon sağlanabilir.
* **Tam Tip Güvenliği:** Strict TypeScript (`npx tsc --noEmit` sıfır hata).

---

## 🛠️ Kurulum ve Çalıştırma

### Gereksinimler
* Node.js (v18+)
* Expo Go uygulaması (iOS App Store veya Android Google Play)

### Adımlar

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirme sunucusunu başlatın:**
   ```bash
   npx expo start
   ```

3. **Cihazda Çalıştırma:**
   * **iOS:** Kameranız ile terminaldeki QR kodu okutun (Expo Go açılacaktır).
   * **Android:** Expo Go uygulamasından "Scan QR Code" seçeneğiyle terminaldeki QR kodu okutun.
   * **Simulator:** Terminalde `i` (iOS simulator) veya `a` (Android emulator) tuşuna basabilirsiniz.

---

## 🤖 AI Araçları Kullanımı ve Mühendislik Yaklaşımı

Proje geliştirme sürecinde yapay zeka (Antigravity/Gemini) bir **Staff-Level Pair Programmer** olarak konumlandırılmış, körü körüne kod üretimi yerine sıkı bir mühendislik döngüsü izlenmiştir:

1. **Phase 0 – Mimari Analiz & Gap Tespiti:**
   Figma ekranları ile mevcut kod tabanı karşılaştırılarak renk sapmaları, eksik bileşenler (TimerBar, StatusBeacon, Light Mode) ve veri mimarisi eksikleri raporlandı.
2. **Phase 1 – Semantic Design Token & Context:**
   Sert kodlanmış hex değerleri temizlenerek `src/theme/tokens.ts` altında semantik token yapısı kuruldu.
3. **Phase 2 – Bileşen & Ekran Entegrasyonu:**
   Bileşenler tek tek elden geçirilerek animasyon, erişilebilirlik ve çift tema desteği kazandırıldı.
4. **Phase 3 – Asenkron Katman:**
   Dummy veriler `src/repositories/` katmanına soyutlandı.
5. **Phase 4 – Doğrulama & Tip Denetimi:**
   `npx tsc --noEmit` ile tip açıkları giderildi.

Detaylı karar günlüğü için [`docs/AI_LOG.md`](docs/AI_LOG.md) dosyasını inceleyebilirsiniz.

---

## 📦 Proje Dosya Yapısı

```text
src/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx    # Dinamik temalı alt gezinme menüsü (6 tab)
│   │   ├── index.tsx      # War Room Alpha (Senaryolar ve TimerBar)
│   │   ├── explore.tsx    # Intel (Canlı Karar Matrisi ve Uydu Haritası)
│   │   ├── vitals.tsx     # Biyometrik Durum ve Canlı Telemetri
│   │   ├── profile.tsx    # Ajan 47 Dosyası ve Görev Metrikleri
│   │   ├── system.tsx     # 2x2 Kare Arşiv Izgarası & Modül Teşhisi
│   │   └── settings.tsx   # Tema Değiştirici (Dark/Light/System) & Galeri Linki
│   ├── gallery.tsx        # Bileşen Doğrulama Vitrini
│   └── _layout.tsx        # Root ThemeProvider ve Dinamik StatusBar
├── components/            # Yeniden kullanılabilir atomik tasarım bileşenleri
├── constants/             # Geriye dönük uyumluluk sabitleri
├── data/                  # Mock veriler
├── repositories/          # Asenkron servis soyutlama katmanı
├── theme/                 # Semantik renk, tipografi, boşluk tokenları ve useTheme hook'u
└── types/                 # Katı TypeScript modelleri
```
