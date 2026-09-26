import type {
  ArchiveNodeSource,
  CommanderVitalSource,
  IntelItemSource,
  ProtocolOptionSource,
  ScenarioSource,
  SystemModuleSource,
} from '../types';

// Imagery is bundled (not fetched) so the app works offline and cards never render empty.
const IMAGES = {
  globalCrisis: require('../../assets/images/global-crisis.jpg'),
  operationMidnight: require('../../assets/images/operation-midnight.jpg'),
  cyberHeist: require('../../assets/images/cyber-heist.jpg'),
  falloutRescue: require('../../assets/images/fallout-rescue.jpg'),
  alphaNode: require('../../assets/images/alpha-node.jpg'),
  betaNode: require('../../assets/images/beta-node.jpg'),
  deltaNode: require('../../assets/images/delta-node.jpg'),
  omegaNode: require('../../assets/images/omega-node.jpg'),
};

export const TERRAIN_MAP_IMAGE = require('../../assets/images/terrain-map.jpg');
export const OPERATIVE_AVATAR = require('../../assets/images/operative-avatar.jpg');

export const FEATURED_SCENARIO_ID = 'global-crisis';

// All copy is authored in Turkish (primary) and English; repositories pick the active language.
export const SCENARIOS: ScenarioSource[] = [
  {
    id: 'global-crisis',
    title: { tr: 'Küresel Kriz', en: 'Global Crisis' },
    description: {
      tr: 'Dünya çapında alarm verildi. Ekibini topla, tehdit vektörlerini analiz et ve milyonların kaderini belirleyecek protokolü uygula.',
      en: 'A worldwide alert has been triggered. Assemble your team, analyze the threat vectors, and execute the protocol that will define the fate of millions.',
    },
    durationMin: 45,
    threatLevel: 'CRITICAL',
    image: IMAGES.globalCrisis,
    isActive: true,
    steps: [
      {
        id: 'gc-1',
        prompt: { tr: 'Uydu ağı karardı', en: 'Satellite grid goes dark' },
        context: {
          tr: 'Üç yörünge rölesi 90 saniyedir yanıt vermiyor. Piyasalar bir saat sonra açılıyor ve basın durumu çoktan fark etti.',
          en: 'Three orbital relays stopped responding 90 seconds ago. Markets open in one hour and the press has already noticed.',
        },
        timeLimitSec: 20,
        options: [
          {
            id: 'gc-1-a',
            text: {
              tr: 'Sakin bir kamuoyu açıklaması yap, sessizce soruştur',
              en: 'Issue a calm public statement, investigate quietly',
            },
            impact: { stability: 5, trust: 15 },
            consequence: {
              tr: 'Piyasalar sallanıyor ama dayanıyor. Halk şeffaflığı takdir ediyor.',
              en: 'Markets wobble but hold. The public appreciates the transparency.',
            },
          },
          {
            id: 'gc-1-b',
            text: {
              tr: 'Neden anlaşılana kadar medya karartması uygula',
              en: 'Impose a media blackout until the cause is known',
            },
            impact: { stability: 10, trust: -15 },
            consequence: {
              tr: 'Söylentiler gerçeklerden hızlı yayılıyor. Düzen şimdilik korunuyor.',
              en: 'Rumours spread faster than facts. Order holds for now.',
            },
          },
          {
            id: 'gc-1-c',
            text: {
              tr: 'Ulusu kenetlemek için yabancı bir aktörü suçla',
              en: 'Blame a foreign actor to rally the nation',
            },
            impact: { stability: -15, trust: -10 },
            consequence: {
              tr: 'Gerilim bir gecede tırmanıyor; müttefikler elinde olmayan kanıtları istiyor.',
              en: 'Tensions spike overnight and allies demand evidence you do not have.',
            },
          },
        ],
      },
      {
        id: 'gc-2',
        prompt: { tr: 'Siber saldırı doğrulandı', en: 'Cyber intrusion confirmed' },
        context: {
          tr: 'Adli inceleme, kesintiyi yer istasyonlarına sızmış bir solucana bağlıyor. Solucan şimdi elektrik şebekesinin kontrol ağına yayılıyor.',
          en: 'Forensics traces the outage to a worm inside the ground stations. It is spreading to the power grid control network.',
        },
        timeLimitSec: 18,
        options: [
          {
            id: 'gc-2-a',
            text: {
              tr: 'Şebekeyi izole et, dönüşümlü kesintileri göze al',
              en: 'Isolate the grid and accept rolling blackouts',
            },
            impact: { stability: 15, trust: -5 },
            consequence: {
              tr: 'Solucan durduruldu. Milyonlar altı saat karanlıkta kaldı.',
              en: 'The worm is contained. Millions sit in the dark for six hours.',
            },
          },
          {
            id: 'gc-2-b',
            text: {
              tr: 'Şebekeyi açık tut, solucanı canlı sistemde avla',
              en: 'Keep the grid online and hunt the worm live',
            },
            impact: { stability: -10, trust: 10 },
            consequence: {
              tr: 'Işıklar yanık kalıyor ama iki bölgesel trafo merkezi kaybediliyor.',
              en: 'Lights stay on, but two regional substations are lost.',
            },
          },
          {
            id: 'gc-2-c',
            text: {
              tr: 'Müttefik siber komutanlıklardan ortak müdahale iste',
              en: 'Request joint response from allied cyber commands',
            },
            impact: { stability: 10, trust: 10 },
            consequence: {
              tr: 'Müttefik ekipler istasyonları saatler içinde onarıyor. Karşılığında pahalı bir iyilik borçlusun.',
              en: 'Allied teams patch the stations within hours. A costly favour is owed.',
            },
          },
        ],
      },
      {
        id: 'gc-3',
        prompt: { tr: 'Saldırgan temas kuruyor', en: 'The attacker makes contact' },
        context: {
          tr: 'Şifreli bir mesaj, kalan uyduları serbest bırakmak için fidye istiyor. Son tarih gün doğumu.',
          en: 'An encrypted message demands a ransom to release the remaining satellites. The deadline is sunrise.',
        },
        timeLimitSec: 15,
        options: [
          {
            id: 'gc-3-a',
            text: {
              tr: 'Reddet ve yedek uyduları fırlat',
              en: 'Refuse and launch replacement satellites',
            },
            impact: { stability: 5, trust: 10 },
            consequence: {
              tr: 'Kapsama 48 saatte geri geliyor. Dünya zayıflık değil kararlılık görüyor.',
              en: 'Coverage returns in 48 hours. The world sees resolve, not weakness.',
            },
          },
          {
            id: 'gc-3-b',
            text: { tr: 'Sessizce öde ve parayı izle', en: 'Pay quietly and trace the funds' },
            impact: { stability: 15, trust: -20 },
            consequence: {
              tr: 'Uydular şafakta geri dönüyor. Ödeme bir hafta sonra basına sızıyor.',
              en: 'Satellites return by dawn. The payment leaks a week later.',
            },
          },
          {
            id: 'gc-3-c',
            text: {
              tr: 'Saldırganın altyapısına karşı saldırı başlat',
              en: 'Counter-hack the attacker infrastructure',
            },
            impact: { stability: -5, trust: 5 },
            consequence: {
              tr: 'Ağın yarısı kurtarılıyor; saldırganlar geri kalanıyla birlikte ortadan kayboluyor.',
              en: 'Half the network is recovered; the attackers vanish with the rest.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'operation-midnight',
    title: { tr: 'Gece Yarısı Operasyonu', en: 'Operation Midnight' },
    description: {
      tr: 'Korunaklı yerleşkeye sız ve VIP’yi şafaktan önce tahliye et. Gizlilik hayati, her seçim önemli.',
      en: 'Infiltrate the secure compound and extract the VIP before dawn. Stealth is critical, every choice matters.',
    },
    durationMin: 15,
    threatLevel: 'HIGH',
    image: IMAGES.operationMidnight,
    isActive: true,
    steps: [
      {
        id: 'om-1',
        prompt: { tr: 'Yaklaşma rotası', en: 'Approach vector' },
        context: {
          tr: 'Vadiyi sis kaplamış. Termal dronlar doğu duvarını dört dakikada bir devriye geziyor.',
          en: 'Fog covers the valley. Thermal drones patrol the east wall every four minutes.',
        },
        timeLimitSec: 20,
        options: [
          {
            id: 'om-1-a',
            text: { tr: 'Dere menfezinden ilerle', en: 'Move through the river culvert' },
            impact: { stability: 10, trust: 5 },
            consequence: {
              tr: 'Soğuk ve yavaş, ama ekip duvara görünmeden ulaşıyor.',
              en: 'Cold and slow, but the team reaches the wall unseen.',
            },
          },
          {
            id: 'om-1-b',
            text: {
              tr: 'Dronları karıştır ve doğu duvarından aş',
              en: 'Jam the drones and go over the east wall',
            },
            impact: { stability: -10, trust: 5 },
            consequence: {
              tr: 'Karıştırıcı işe yarıyor — ama muhafız komutanı paraziti fark ediyor.',
              en: 'The jammer works — and alerts the guard captain to interference.',
            },
          },
          {
            id: 'om-1-c',
            text: { tr: 'Bir sonraki devriye boşluğunu bekle', en: 'Wait for the next patrol gap' },
            impact: { stability: 5, trust: -5 },
            consequence: {
              tr: 'Güvenli, ama yirmi değerli dakika kaybedildi.',
              en: 'Safe, but twenty precious minutes are gone.',
            },
          },
        ],
      },
      {
        id: 'om-2',
        prompt: { tr: 'İç kapıdaki nöbetçi', en: 'Guard at the inner gate' },
        context: {
          tr: 'Tek bir nöbetçi, VIP hücresine giden tek yolu kesiyor. Henüz telsizine uzanmadı.',
          en: 'A lone sentry blocks the only route to the VIP cell. He has not raised his radio.',
        },
        timeLimitSec: 15,
        options: [
          {
            id: 'om-2-a',
            text: {
              tr: 'Karşı tarafta dikkat dağıtacak bir şey yap',
              en: 'Create a distraction on the far side',
            },
            impact: { stability: 5, trust: 10 },
            consequence: {
              tr: 'Nöbetçi oradan uzaklaşıyor. Kimse zarar görmüyor.',
              en: 'The sentry wanders off. Nobody is hurt.',
            },
          },
          {
            id: 'om-2-b',
            text: { tr: 'Nöbetçiyi sessizce etkisiz hale getir', en: 'Neutralise the guard silently' },
            impact: { stability: 10, trust: -10 },
            consequence: {
              tr: 'Yol açık, ama vardiya değişiminde bulunacak.',
              en: 'The path is clear, but the shift change will find him.',
            },
          },
          {
            id: 'om-2-c',
            text: {
              tr: 'Ele geçirilmiş bir üniformayla blöf yaparak geç',
              en: 'Bluff through wearing a captured uniform',
            },
            impact: { stability: -10, trust: 5 },
            consequence: {
              tr: 'Tereddüt ediyor, sonra telsizle haber veriyor. Süre az önce kısaldı.',
              en: 'He hesitates, then calls it in. The clock just got shorter.',
            },
          },
        ],
      },
      {
        id: 'om-3',
        prompt: { tr: 'Tahliye', en: 'Extraction' },
        context: {
          tr: 'VIP güvende. Kuzey kulesinde alarmlar çalıyor ve helikopterin varmasına 6 dakika var.',
          en: 'VIP secured. Alarms are sounding in the north tower and the helicopter is 6 minutes out.',
        },
        timeLimitSec: 12,
        options: [
          {
            id: 'om-3-a',
            text: {
              tr: 'Pozisyonu koru ve hava tahliyesini bekle',
              en: 'Hold position and wait for air extraction',
            },
            impact: { stability: -5, trust: 10 },
            consequence: {
              tr: 'Gergin bir çatışma, ama herkes helikoptere yetişiyor.',
              en: 'A tense firefight, but everyone makes the helicopter.',
            },
          },
          {
            id: 'om-3-b',
            text: {
              tr: 'Menfezden yaya olarak geri çekil',
              en: 'Exfiltrate on foot back through the culvert',
            },
            impact: { stability: 10, trust: 5 },
            consequence: {
              tr: 'Ekip sisin içinde kayboluyor. Yerleşke onları asla bulamıyor.',
              en: 'The team disappears into the fog. The compound never finds them.',
            },
          },
          {
            id: 'om-3-c',
            text: { tr: 'Bir araca el koy ve zorla çık', en: 'Commandeer a vehicle and break out' },
            impact: { stability: -15, trust: -5 },
            consequence: {
              tr: 'Kapı kırılıyor, VIP yaralanıyor ve operasyon gizliliğini yitiriyor.',
              en: 'The gate is rammed, the VIP is injured, and the mission goes loud.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'cyber-heist',
    title: { tr: 'Siber Soygun', en: 'Cyber Heist' },
    description: {
      tr: 'Dev bir şirketin ana sistemine sız. Güvenlik duvarlarını aş, tespit edilmekten kaçın ve şifreli yükü ele geçir.',
      en: 'Breach the mainframe of a mega-corporation. Hack the firewalls, avoid detection, and secure the encrypted payload.',
    },
    durationMin: 25,
    threatLevel: 'MEDIUM',
    image: IMAGES.cyberHeist,
    isActive: true,
    steps: [
      {
        id: 'ch-1',
        prompt: { tr: 'İlk dayanak noktası', en: 'Initial foothold' },
        context: {
          tr: 'Çevre güvenlik duvarı güncel. Bir yüklenicinin dizüstü bilgisayarında hâlâ VPN erişimi var.',
          en: 'The perimeter firewall is patched. A contractor laptop still has VPN access.',
        },
        timeLimitSec: 20,
        options: [
          {
            id: 'ch-1-a',
            text: {
              tr: 'Yükleniciye oltalama yapıp kimlik bilgilerini al',
              en: 'Phish the contractor for credentials',
            },
            impact: { stability: 10, trust: -5 },
            consequence: {
              tr: 'Kimlik bilgileri dakikalar içinde geliyor. Bu yüzden biri işini kaybedecek.',
              en: 'Credentials arrive within minutes. Someone will get fired for this.',
            },
          },
          {
            id: 'ch-1-b',
            text: {
              tr: 'VPN cihazındaki sıfırıncı gün açığını kullan',
              en: 'Exploit a zero-day in the VPN appliance',
            },
            impact: { stability: -5, trust: 10 },
            consequence: {
              tr: 'Temiz bir giriş — ama bu açık artık bir daha kullanılamaz.',
              en: 'Clean entry — but the zero-day is burned forever.',
            },
          },
          {
            id: 'ch-1-c',
            text: {
              tr: 'Yönetici paneline kaba kuvvet saldırısı yap',
              en: 'Brute-force the admin portal',
            },
            impact: { stability: -15, trust: -5 },
            consequence: {
              tr: 'Saldırı tespit sistemi stadyum gibi ışıl ışıl yanıyor.',
              en: 'The intrusion detection system lights up like a stadium.',
            },
          },
        ],
      },
      {
        id: 'ch-2',
        prompt: { tr: 'Güvenlik ekibi iz sürüyor', en: 'Security team is hunting' },
        context: {
          tr: 'Mavi takımdan bir analist olağandışı trafiği işaretliyor ve kayıtları incelemeye başlıyor.',
          en: 'A blue-team analyst flags unusual traffic and starts pulling logs.',
        },
        timeLimitSec: 15,
        options: [
          {
            id: 'ch-2-a',
            text: { tr: 'Bir saat boyunca sessize geç', en: 'Go dormant for an hour' },
            impact: { stability: 10, trust: 5 },
            consequence: {
              tr: 'Analist durumu yanlış alarm olarak kaydediyor.',
              en: 'The analyst files it as a false positive.',
            },
          },
          {
            id: 'ch-2-b',
            text: { tr: 'Kayıtları sil ve ilerlemeye devam et', en: 'Wipe the logs and keep moving' },
            impact: { stability: -10, trust: 0 },
            consequence: {
              tr: 'Kaybolan kayıtlar, trafiğin kendisinden daha şüpheli görünüyor.',
              en: 'Missing logs are more suspicious than the traffic was.',
            },
          },
          {
            id: 'ch-2-c',
            text: {
              tr: 'Başka bir yerde sahte bir sızma izi bırak',
              en: 'Plant a decoy intrusion elsewhere',
            },
            impact: { stability: 5, trust: -5 },
            consequence: {
              tr: 'Ekip yemin peşine düşüyor. Yan sistemlerden biri hasar görüyor.',
              en: 'The team chases the decoy. A side system is damaged.',
            },
          },
        ],
      },
      {
        id: 'ch-3',
        prompt: { tr: 'Verinin dışarı aktarılması', en: 'Payload exfiltration' },
        context: {
          tr: 'Veri 40 GB. Saatte 1 GB’ın üzerindeki çıkış trafiği izleniyor.',
          en: 'The payload is 40 GB. Egress is monitored above 1 GB per hour.',
        },
        timeLimitSec: 12,
        options: [
          {
            id: 'ch-3-a',
            text: { tr: 'İki güne yayarak damla damla aktar', en: 'Trickle it out over two days' },
            impact: { stability: 10, trust: 5 },
            consequence: {
              tr: 'Yavaş ve görünmez. Veri ele geçirildi.',
              en: 'Slow and invisible. The payload is secured.',
            },
          },
          {
            id: 'ch-3-b',
            text: {
              tr: 'Yalnızca dizini ve şifre çözme anahtarlarını al',
              en: 'Grab only the index and decryption keys',
            },
            impact: { stability: 5, trust: 10 },
            consequence: {
              tr: 'En değerli %2 binadan fark edilmeden çıkıyor.',
              en: 'The most valuable 2% leaves the building unnoticed.',
            },
          },
          {
            id: 'ch-3-c',
            text: { tr: 'Hepsini tek seferde çek', en: 'Pull everything at once' },
            impact: { stability: -15, trust: -10 },
            consequence: {
              tr: 'Aktarım %60’ta kesiliyor ve sızıntı haberlere çıkıyor.',
              en: 'The transfer is cut at 60% and the breach makes the news.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'fallout-rescue',
    title: { tr: 'Serpinti Kurtarması', en: 'Fallout Rescue' },
    description: {
      tr: 'Kıyamet sonrası çorak toprakları aşarak ele geçirilmiş bir yeraltı sığınağında mahsur kalan ajanları kurtar.',
      en: 'Navigate through a post-apocalyptic wasteland to rescue operatives trapped in a compromised subterranean bunker.',
    },
    durationMin: 40,
    threatLevel: 'CRITICAL',
    image: IMAGES.falloutRescue,
    isActive: false, // Locked — demonstrates the Figma passive card state.
    steps: [],
  },
];

export const ARCHIVE_NODES: ArchiveNodeSource[] = [
  { id: 'alpha', title: { tr: 'Alfa Düğümü', en: 'Alpha Node' }, scenarioCount: 12, image: IMAGES.alphaNode },
  { id: 'beta', title: { tr: 'Beta Düğümü', en: 'Beta Node' }, scenarioCount: 8, image: IMAGES.betaNode },
  { id: 'delta', title: { tr: 'Delta Düğümü', en: 'Delta Node' }, scenarioCount: 4, image: IMAGES.deltaNode },
  { id: 'omega', title: { tr: 'Omega Düğümü', en: 'Omega Node' }, scenarioCount: 1, image: IMAGES.omegaNode },
];

export const PROTOCOL_OPTIONS: ProtocolOptionSource[] = [
  { id: '1', text: { tr: 'Taktik pozisyonu koru ve gözlemle', en: 'Hold tactical position & observe' } },
  { id: '2', text: { tr: 'Uydu tarama protokolünü başlat', en: 'Initiate satellite scanning protocol' } },
  { id: '3', text: { tr: 'Doğrudan müdahaleye yetki ver', en: 'Authorize direct engagement' } },
];

export const INTEL_DATA: IntelItemSource[] = [
  {
    id: '1',
    title: { tr: 'Kontrolsüz Dron Hareketliliği', en: 'Rogue Drone Activity' },
    location: { tr: 'Sektör 7G', en: 'Sector 7G' },
    threat: 'High',
  },
  {
    id: '2',
    title: { tr: 'Şifreli İletim', en: 'Encrypted Transmission' },
    location: { tr: 'Bilinmiyor', en: 'Unknown' },
    threat: 'Medium',
  },
  {
    id: '3',
    title: { tr: 'İkmal Paketi Yolda', en: 'Supply Drop Inbound' },
    location: { tr: 'Alfa Üssü', en: 'Alpha Base' },
    threat: 'Low',
  },
];

export const SYSTEM_MODULES: SystemModuleSource[] = [
  {
    id: '1',
    name: { tr: 'Ana Sistem Bağlantısı', en: 'Mainframe Uplink' },
    status: { tr: 'ÇEVRİMİÇİ', en: 'ONLINE' },
    icon: 'server',
    isWarning: false,
  },
  {
    id: '2',
    name: { tr: 'Güvenlik Duvarı Protokolü', en: 'Firewall Protocol' },
    status: { tr: 'AKTİF', en: 'ACTIVE' },
    icon: 'shield',
    isWarning: false,
  },
  {
    id: '3',
    name: { tr: 'İletişim Rölesi', en: 'Communication Relay' },
    status: { tr: 'KESİNTİLİ', en: 'INTERRUPTED' },
    icon: 'radio',
    isWarning: true,
  },
  {
    id: '4',
    name: { tr: 'Güç Şebekesi', en: 'Power Grid' },
    status: { tr: 'STABİL', en: 'STABLE' },
    icon: 'zap',
    isWarning: false,
  },
];

/** `heart-rate` is live: the Vitals screen replaces its value with the simulated pulse. */
export const HEART_RATE_VITAL_ID = 'heart-rate';

export const COMMANDER_VITALS: CommanderVitalSource[] = [
  {
    id: 'core-temperature',
    label: { tr: 'Vücut Sıcaklığı', en: 'Core Temperature' },
    value: { tr: '42°C', en: '42°C' },
  },
  {
    id: HEART_RATE_VITAL_ID,
    label: { tr: 'Nabız', en: 'Heart Rate' },
    value: { tr: '84 BPM', en: '84 BPM' },
    highlight: true,
  },
  {
    id: 'radiation',
    label: { tr: 'Radyasyon Seviyesi', en: 'Radiation Level' },
    value: { tr: '0,02 Sv', en: '0.02 Sv' },
    danger: true,
  },
  {
    id: 'integrity',
    label: { tr: 'Sistem Bütünlüğü', en: 'System Integrity' },
    value: { tr: '%98,4', en: '98.4%' },
    highlight: true,
  },
];
