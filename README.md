# Fateful Moment (React Native)

Bu proje "Jr. Frontend Developer Candidate" case'i için yapay zeka asistanı tarafından (Antigravity/Gemini) geliştirilmiştir.

## Proje Hakkında
Paylaşılan Figma tasarımına uygun olarak, React Native ve Expo kullanılarak iOS ve Android uyumlu bir şekilde geliştirilmiştir. Uygulama "War Room Alpha" konseptine sahiptir ve gönderilen Stil Rehberi (Style Guide), Nav Bar, Icon Button, Card gibi komponentler modüler olarak `src/components` altında kodlanmıştır.

## Kurulum Adımları
Projeyi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

1. Proje dizinine gidin:
   ```bash
   cd fateful-moment
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Expo uygulamasını başlatın:
   ```bash
   npx expo start
   ```

## Klasör Yapısı
- `src/app`: Expo Router kullanılarak oluşturulmuş sayfa yapısı (Tab navigasyonu ve sayfalar).
- `src/components`: Tekrar kullanılabilir (Reusable) bileşenler (NavBar, Button, ScenarioCard).
- `src/constants`: Renk paleti gibi sabit değerlerin (Colors.ts) bulunduğu dizin.
- `assets`: Uygulama ikonu ve splash screen görselleri.

## AI Araçları ve Yaklaşım
Bu proje geliştirilirken Google Deepmind Antigravity asistanı olarak şu yaklaşımları uyguladım:
1. **Analiz**: İlk olarak kullanıcının gönderdiği Figma çıktılarını (Style Guide, komponent varyasyonları) analiz ettim. Renk kodlarını, tipografik kararları ve UX elementlerini çıkardım.
2. **Setup**: Boş bir Expo projesi üzerinde `expo-router` kurulumunu tamamladım. Bağımlılık uyuşmazlıkları çıktığında `npx expo install --fix` ile süreci düzelttim.
3. **Komponent Bazlı Geliştirme**: Figma'daki bileşenleri React Native `StyleSheet` kullanarak piksel-mükemmeliyetçi (pixel-perfect) bir mantıkla oluşturmaya çalıştım. `NavBar`, `Button` (Primary, Secondary, Danger), ve `ScenarioCard` (Active, Disabled varyasyonları) komponentleştirildi.
4. **Navigasyon**: `expo-router` kullanılarak alt tab menüsü oluşturuldu ve feather-icons ile ikonlar yerleştirildi.

## Teslimat Notları
- **Ekran Kaydı & APK**: Sanal ortamda çalıştığım için, doğrudan bir ekran kaydı veya APK çıktısı almak (local EAS build başarısız olursa) mümkün olmayabilir. Eğer lokal APK yapımı sunucuda tamamlanamazsa, proje Expo ile çalışmaya hazır durumdadır; `npx expo start` ile anında test edilebilir.
- **Repo**: Proje şu anda kendi klasörü içinde git reposu olarak (local repo) hazırdır. 

Case'i değerlendirdiğiniz için teşekkürler!

