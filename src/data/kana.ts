export interface ExampleWord {
  japanese: string;
  thai: string;
  romaji: string;
}

export interface KanaLesson {
  id: string;
  groupId: string;
  groupCode: string;
  groupTitle: string;
  title: string;
  character: string;
  romaji: string;
  mnemonic: string;
  mnemonicImage: string;
  audioUrl: string;
  strokeOrder: number[][];
  exampleWords: ExampleWord[];
}

const box = (strokes: number[][]): number[][] => strokes;

export const kanaLessons: KanaLesson[] = [
  {
    id: "a",
    groupId: "1-1",
    groupCode: "1.1",
    groupTitle: "สระพื้นฐาน",
    title: "あ — คนก้มหัว",
    character: "あ",
    romaji: "a",
    mnemonic: "เห็นคนก้มหัวทักทาย เส้นบนคือมือพนม วงล่างคือหลังที่โค้ง",
    mnemonicImage: "/kana/a.jpg",
    audioUrl: "",
    strokeOrder: box([
      [40, 30, 70, 28, 78, 48],
      [48, 42, 46, 78, 62, 88],
      [58, 55, 88, 62, 70, 92],
    ]),
    exampleWords: [
      { japanese: "あい", thai: "ความรัก", romaji: "ai" },
      { japanese: "あさ", thai: "ตอนเช้า", romaji: "asa" },
    ],
  },
  {
    id: "i",
    groupId: "1-1",
    groupCode: "1.1",
    groupTitle: "สระพื้นฐาน",
    title: "い — ปลาไหลสองตัว",
    character: "い",
    romaji: "i",
    mnemonic: "ปลาไหลสองตัวยืนคู่กัน ตัวซ้ายสูง ตัวขวาสั้นกว่า",
    mnemonicImage: "/kana/i.jpg",
    audioUrl: "",
    strokeOrder: box([
      [38, 22, 36, 78],
      [62, 34, 66, 80],
    ]),
    exampleWords: [
      { japanese: "いえ", thai: "บ้าน", romaji: "ie" },
      { japanese: "いぬ", thai: "สุนัข", romaji: "inu" },
    ],
  },
  {
    id: "u",
    groupId: "1-1",
    groupCode: "1.1",
    groupTitle: "สระพื้นฐาน",
    title: "う — วัวหันข้าง",
    character: "う",
    romaji: "u",
    mnemonic: "หน้าวัวหันข้าง ขีดบนคือเขา เส้นโค้งคือจมูก",
    mnemonicImage: "/kana/u.jpg",
    audioUrl: "",
    strokeOrder: box([
      [36, 28, 70, 26],
      [48, 40, 40, 62, 70, 70, 78, 52],
    ]),
    exampleWords: [
      { japanese: "うみ", thai: "ทะเล", romaji: "umi" },
      { japanese: "うた", thai: "เพลง", romaji: "uta" },
    ],
  },
  {
    id: "e",
    groupId: "1-1",
    groupCode: "1.1",
    groupTitle: "สระพื้นฐาน",
    title: "え — นกหางยาว",
    character: "え",
    romaji: "e",
    mnemonic: "นกหางยาวกำลังบิน ขีดบนคือปีก เส้นล่างคือหางปัด",
    mnemonicImage: "/kana/e.jpg",
    audioUrl: "",
    strokeOrder: box([
      [34, 26, 74, 24],
      [40, 40, 42, 58, 78, 50],
      [48, 62, 70, 86],
    ]),
    exampleWords: [
      { japanese: "えき", thai: "สถานี", romaji: "eki" },
      { japanese: "え", thai: "รูปภาพ", romaji: "e" },
    ],
  },
  {
    id: "o",
    groupId: "1-1",
    groupCode: "1.1",
    groupTitle: "สระพื้นฐาน",
    title: "お — ลูกกอล์ฟบนที",
    character: "お",
    romaji: "o",
    mnemonic: "ลูกกอล์ฟอยู่บนที วงกลมคือลูก เส้นขีดคือที",
    mnemonicImage: "/kana/o.jpg",
    audioUrl: "",
    strokeOrder: box([
      [40, 22, 42, 48, 70, 36],
      [36, 58, 62, 56, 78, 78, 48, 90, 30, 74],
    ]),
    exampleWords: [
      { japanese: "おかね", thai: "เงิน", romaji: "okane" },
      { japanese: "おちゃ", thai: "ชา", romaji: "ocha" },
    ],
  },
  {
    id: "ka",
    groupId: "1-2",
    groupCode: "1.2",
    groupTitle: "แถว ค",
    title: "か — ปากอ้า",
    character: "か",
    romaji: "ka",
    mnemonic: "คนอ้าปากร้อง คะ เส้นขีดคือลมที่พุ่งออกจากปาก",
    mnemonicImage: "/kana/ka.jpg",
    audioUrl: "",
    strokeOrder: box([
      [34, 24, 36, 80],
      [30, 46, 72, 40],
      [58, 28, 70, 86],
    ]),
    exampleWords: [
      { japanese: "かお", thai: "ใบหน้า", romaji: "kao" },
      { japanese: "かさ", thai: "ร่ม", romaji: "kasa" },
    ],
  },
  {
    id: "ki",
    groupId: "1-2",
    groupCode: "1.2",
    groupTitle: "แถว ค",
    title: "き — กุญแจ",
    character: "き",
    romaji: "ki",
    mnemonic: "กุญแจตั้งตรง ขีดสองเส้นคือฟันกุญแจ",
    mnemonicImage: "/kana/ki.jpg",
    audioUrl: "",
    strokeOrder: box([
      [40, 18, 42, 82],
      [28, 36, 74, 32],
      [30, 56, 76, 52],
      [48, 70, 68, 88],
    ]),
    exampleWords: [
      { japanese: "き", thai: "ต้นไม้", romaji: "ki" },
      { japanese: "きく", thai: "ฟัง", romaji: "kiku" },
    ],
  },
  {
    id: "ku",
    groupId: "1-2",
    groupCode: "1.2",
    groupTitle: "แถว ค",
    title: "く — ปากนก",
    character: "く",
    romaji: "ku",
    mnemonic: "ปากนกกาอ้าเป็นมุม เหมือนเสียง คุ ที่สั้นและคม",
    mnemonicImage: "/kana/ku.jpg",
    audioUrl: "",
    strokeOrder: box([[30, 30, 62, 48, 28, 78]]),
    exampleWords: [
      { japanese: "くち", thai: "ปาก", romaji: "kuchi" },
      { japanese: "くるま", thai: "รถ", romaji: "kuruma" },
    ],
  },
  {
    id: "ke",
    groupId: "1-2",
    groupCode: "1.2",
    groupTitle: "แถว ค",
    title: "け — ถังชา",
    character: "け",
    romaji: "ke",
    mnemonic: "ถังชาเอียง เส้นซ้ายคือหูถัง เส้นขวาคือน้ำที่กระฉอก",
    mnemonicImage: "/kana/ke.jpg",
    audioUrl: "",
    strokeOrder: box([
      [34, 20, 32, 82],
      [48, 28, 74, 24, 70, 84],
    ]),
    exampleWords: [
      { japanese: "けさ", thai: "เมื่อเช้านี้", romaji: "kesa" },
      { japanese: "け", thai: "ขน", romaji: "ke" },
    ],
  },
  {
    id: "ko",
    groupId: "1-2",
    groupCode: "1.2",
    groupTitle: "แถว ค",
    title: "こ — เด็กซ่อนของ",
    character: "こ",
    romaji: "ko",
    mnemonic: "เด็กซ่อนของไว้ข้างหลัง เส้นสองเส้นคือแขนที่โอบของ",
    mnemonicImage: "/kana/ko.jpg",
    audioUrl: "",
    strokeOrder: box([
      [32, 36, 74, 30],
      [36, 68, 78, 62],
    ]),
    exampleWords: [
      { japanese: "ここ", thai: "ที่นี่", romaji: "koko" },
      { japanese: "こえ", thai: "เสียง", romaji: "koe" },
    ],
  },
  {
    id: "sa",
    groupId: "1-3",
    groupCode: "1.3",
    groupTitle: "แถว ซ",
    title: "さ — ปลาว่ายน้ำ",
    character: "さ",
    romaji: "sa",
    mnemonic: "ปลาว่ายตัดขีดน้ำ วงล่างคือฟองอากาศ",
    mnemonicImage: "/kana/sa.jpg",
    audioUrl: "",
    strokeOrder: box([
      [30, 28, 74, 26],
      [42, 22, 40, 58, 68, 70, 62, 88, 36, 80],
    ]),
    exampleWords: [
      { japanese: "さかな", thai: "ปลา", romaji: "sakana" },
      { japanese: "さけ", thai: "สาเก", romaji: "sake" },
    ],
  },
  {
    id: "shi",
    groupId: "1-3",
    groupCode: "1.3",
    groupTitle: "แถว ซ",
    title: "し — ตะขอตกปลา",
    character: "し",
    romaji: "shi",
    mnemonic: "ตะขอตกปลาโค้งลง เสียง ชิ สั้นเหมือนเหยื่อตกน้ำ",
    mnemonicImage: "/kana/shi.jpg",
    audioUrl: "",
    strokeOrder: box([[48, 20, 46, 48, 62, 78, 40, 86]]),
    exampleWords: [
      { japanese: "しお", thai: "เกลือ", romaji: "shio" },
      { japanese: "しま", thai: "เกาะ", romaji: "shima" },
    ],
  },
  {
    id: "su",
    groupId: "1-3",
    groupCode: "1.3",
    groupTitle: "แถว ซ",
    title: "す — ถ้วยซุป",
    character: "す",
    romaji: "su",
    mnemonic: "ถ้วยซุปมีช้อนปัก ขีดล่างคือจานรอง",
    mnemonicImage: "/kana/su.jpg",
    audioUrl: "",
    strokeOrder: box([
      [36, 24, 70, 22],
      [48, 32, 46, 70, 70, 62],
      [30, 84, 78, 80],
    ]),
    exampleWords: [
      { japanese: "すし", thai: "ซูชิ", romaji: "sushi" },
      { japanese: "すな", thai: "ทราย", romaji: "suna" },
    ],
  },
  {
    id: "se",
    groupId: "1-3",
    groupCode: "1.3",
    groupTitle: "แถว ซ",
    title: "せ — ประตู",
    character: "せ",
    romaji: "se",
    mnemonic: "บานประตูมีกลอนขวาง เสียง เซะ เหมือนบานเลื่อน",
    mnemonicImage: "/kana/se.jpg",
    audioUrl: "",
    strokeOrder: box([
      [36, 20, 38, 80],
      [30, 36, 76, 32],
      [32, 56, 78, 52],
      [48, 70, 74, 88],
    ]),
    exampleWords: [
      { japanese: "せなか", thai: "หลัง", romaji: "senaka" },
      { japanese: "せん", thai: "เส้น", romaji: "sen" },
    ],
  },
  {
    id: "so",
    groupId: "1-3",
    groupCode: "1.3",
    groupTitle: "แถว ซ",
    title: "そ — เข็มเย็บ",
    character: "そ",
    romaji: "so",
    mnemonic: "เข็มเย็บผ้าซิกแซก เส้นสุดท้ายคือด้ายที่ลากออก",
    mnemonicImage: "/kana/so.jpg",
    audioUrl: "",
    strokeOrder: box([[34, 24, 70, 28, 40, 50, 72, 62, 36, 84]]),
    exampleWords: [
      { japanese: "そら", thai: "ท้องฟ้า", romaji: "sora" },
      { japanese: "そこ", thai: "ตรงนั้น", romaji: "soko" },
    ],
  },
  {
    id: "ta",
    groupId: "1-4",
    groupCode: "1.4",
    groupTitle: "แถว ท",
    title: "た — ธง",
    character: "た",
    romaji: "ta",
    mnemonic: "เสาธงกับผ้าที่ปลิว ขีดบนคือลม",
    mnemonicImage: "/kana/ta.jpg",
    audioUrl: "",
    strokeOrder: box([
      [30, 22, 72, 20],
      [42, 18, 40, 84],
      [48, 46, 76, 42, 70, 78],
    ]),
    exampleWords: [
      { japanese: "たべる", thai: "กิน", romaji: "taberu" },
      { japanese: "たこ", thai: "ปลาหมึก", romaji: "tako" },
    ],
  },
  {
    id: "chi",
    groupId: "1-4",
    groupCode: "1.4",
    groupTitle: "แถว ท",
    title: "ち — เชียร์",
    character: "ち",
    romaji: "chi",
    mnemonic: "มือเชียร์ยกขึ้นแล้วปัดลง เสียง ชิ ที่คม",
    mnemonicImage: "/kana/chi.jpg",
    audioUrl: "",
    strokeOrder: box([
      [32, 24, 72, 22],
      [48, 20, 46, 50, 70, 70, 40, 86],
    ]),
    exampleWords: [
      { japanese: "ちず", thai: "แผนที่", romaji: "chizu" },
      { japanese: "ちち", thai: "พ่อ", romaji: "chichi" },
    ],
  },
  {
    id: "tsu",
    groupId: "1-4",
    groupCode: "1.4",
    groupTitle: "แถว ท",
    title: "つ — คลื่น",
    character: "つ",
    romaji: "tsu",
    mnemonic: "คลื่นลูกเดียวซัดเข้าหาฝั่ง เสียง สึ เหมือนคลื่นแตก",
    mnemonicImage: "/kana/tsu.jpg",
    audioUrl: "",
    strokeOrder: box([[28, 40, 48, 36, 70, 48, 60, 78]]),
    exampleWords: [
      { japanese: "つき", thai: "ดวงจันทร์", romaji: "tsuki" },
      { japanese: "つくえ", thai: "โต๊ะ", romaji: "tsukue" },
    ],
  },
  {
    id: "te",
    groupId: "1-4",
    groupCode: "1.4",
    groupTitle: "แถว ท",
    title: "て — มือยื่น",
    character: "て",
    romaji: "te",
    mnemonic: "มือยื่นไปข้างหน้า เส้นนอนคือแขน เส้นตั้งคือนิ้ว",
    mnemonicImage: "/kana/te.jpg",
    audioUrl: "",
    strokeOrder: box([[28, 36, 74, 30, 68, 82]]),
    exampleWords: [
      { japanese: "て", thai: "มือ", romaji: "te" },
      { japanese: "てんき", thai: "อากาศ", romaji: "tenki" },
    ],
  },
  {
    id: "to",
    groupId: "1-4",
    groupCode: "1.4",
    groupTitle: "แถว ท",
    title: "と — ตะปู",
    character: "と",
    romaji: "to",
    mnemonic: "ตะปูตอกแล้วงอปลาย เสียง โตะ สั้นเหมือนค้อนเคาะ",
    mnemonicImage: "",
    audioUrl: "",
    strokeOrder: box([
      [40, 20, 42, 78],
      [48, 48, 76, 56, 62, 82],
    ]),
    exampleWords: [
      { japanese: "とり", thai: "นก", romaji: "tori" },
      { japanese: "とけい", thai: "นาฬิกา", romaji: "tokei" },
    ],
  },
];

export const kanaGroups = ["1-1", "1-2", "1-3", "1-4"].map((id) => {
  const items = kanaLessons.filter((k) => k.groupId === id);
  return {
    id,
    code: items[0].groupCode,
    title: items[0].groupTitle,
    characters: items.map((k) => k.character).join(" "),
    firstId: items[0].id,
    lessons: items,
  };
});

export function getKana(id: string) {
  return kanaLessons.find((k) => k.id === id);
}

export function neighbors(id: string) {
  const i = kanaLessons.findIndex((k) => k.id === id);
  return {
    prev: i > 0 ? kanaLessons[i - 1] : undefined,
    next: i >= 0 && i < kanaLessons.length - 1 ? kanaLessons[i + 1] : undefined,
    index: i,
  };
}
