import { Category } from '../domain/entities';

export const seedCategories: Omit<Category, 'id'>[] = [
  {
    name: '運動 Sports',
    type: 'interest',
    values: [
      '跑步', '行山', '游水', '羽毛球', '籃球', '足球', '健身', 'gym',
      'yoga', '單車', '踏單車', '排球', '網球', '壁球', '水上活動',
      '長跑', '踢足球', '打波', '打羽毛球', 'swim', '運動', 'pickle ball',
      '遠足', '郊遊',
    ],
  },
  {
    name: '音樂 Music',
    type: 'interest',
    values: [
      '音樂', '唱歌', '鋼琴', '小提琴', '演唱會', '聽歌', '音樂會',
      '音樂劇', '詩歌', '唱詩歌', '聽音樂', '音響', 'kpop', 'jpop',
    ],
  },
  {
    name: '藝術文化 Arts & Culture',
    type: 'interest',
    values: [
      '畫畫', '攝影', '影相', '博物館', '展覽', '舞台劇', '書法',
      '藝術', '手工', '手作', '做手工', '手工藝', '睇展覽', '逛博物館',
      '英文書法', '藝術觀賞', '展覽藝術', 'photography', 'videography',
      'drawing', '繪畫', '戲劇',
    ],
  },
  {
    name: '影視娛樂 Movies & Entertainment',
    type: 'interest',
    values: [
      '睇戲', '電影', '睇Netflix', '煲劇', '劇本殺', '密室逃脫',
      'VR', '看電影', '睇電影', '動畫', '啟發性電影', 'Marvel電影',
      '看一人一故事', '戲', '睇電影+劇',
    ],
  },
  {
    name: '閱讀學習 Reading & Learning',
    type: 'interest',
    values: [
      '閱讀', '睇書', '看書', '小說', '學習', '學日文', 'podcast',
      '輔導', '輔導心理學', '金庸', '衛斯理', '納尼亞小說', '寫小說',
      '學習各種知識', '學習不同的事', '學新技能', '聽podcast',
    ],
  },
  {
    name: '飲食烹飪 Food & Cooking',
    type: 'interest',
    values: [
      '咖啡', '煮飯', '煮嘢食', '煮野吃', '食好西', '食野',
      '搵好嘢食', '飲咖啡', 'wine and spirit', '食飯傾偈',
    ],
  },
  {
    name: '旅行戶外 Travel & Outdoors',
    type: 'interest',
    values: [
      '旅行', '旅遊', '戶外活動', '大自然', '去旅行',
      '親近大自然', '看海', '大自然活動', '戶外及水上活動',
    ],
  },
  {
    name: '桌遊社交 Board Games & Social',
    type: 'interest',
    values: [
      '桌遊', 'board game', 'boardgame', 'board games', 'boardgames',
      '三國殺', '砌Lego', 'DND', 'TRPG', '玩拼圖', 'bg',
    ],
  },
  {
    name: '電玩科技 Gaming & Tech',
    type: 'interest',
    values: [
      '電腦遊戲', '打機', '遊戲', '游戲', 'Switch', 'minecraft',
      'Pokemon', 'IG', 'Threads', 'Youtube', '睇youtube',
      '美股投資', '機動遊戲', '迪士尼',
    ],
  },
  {
    name: '動物寵物 Pets & Animals',
    type: 'interest',
    values: ['貓', '狗', '玩貓', '貓狗', '小動物', '玩小動物'],
  },
  {
    name: '生活方式 Lifestyle',
    type: 'interest',
    values: [
      '襯衫', 'skincare', '環保', '義工', '兒童及青年工作',
      '整理收納', '與朋友興祝生日', '行街',
    ],
  },
  {
    name: '創作 Creative',
    type: 'interest',
    values: [
      '創作', '剪片', '語言', '舊歌新詞創作', 'meme',
      '創作(故事、游戲、meme等)', '砌模型', '短劇',
    ],
  },
  // MBTI
  {
    name: 'MBTI',
    type: 'mbti',
    values: [
      'INTJ', 'INTP', 'ENTJ', 'ENTP',
      'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
      'ISTP', 'ISFP', 'ESTP', 'ESFP',
    ],
  },
  // Occupation categories
  {
    name: '教育 Education',
    type: 'occupation',
    values: ['補習老師', '中學教師', '老師', '教師', '小提琴老師', '鋼琴老師', '傳道人'],
  },
  {
    name: '科技工程 Tech & Engineering',
    type: 'occupation',
    values: ['資訊科技', 'it', 'programmer', '工程師', '工程技術主任', '技術員', 'quality assurance specialist', '工程'],
  },
  {
    name: '商業金融 Business & Finance',
    type: 'occupation',
    values: [
      '會計', '會計師', '精算師', '銀行teller', 'account clerk',
      '生物科技公司的商業發展', 'esg officer',
      'customer relationship & brand marketing manager',
    ],
  },
  {
    name: '醫療健康 Healthcare',
    type: 'occupation',
    values: ['物理治療師', '醫院助理院務經理', '護理'],
  },
  {
    name: '法律行政 Legal & Admin',
    type: 'occupation',
    values: ['律師行文員', '見習律師', '秘書', '助理公司秘書主任', 'administrative assistant'],
  },
  {
    name: '社會服務 Social Services',
    type: 'occupation',
    values: ['社工', '社會服務', '非牟利機構', 'ngo pw'],
  },
  {
    name: '創意設計 Creative & Design',
    type: 'occupation',
    values: ['設計師', '攝影師', 'fashion advertising / photographer', 'marketing officer'],
  },
  {
    name: '公務行政 Civil Service & Admin',
    type: 'occupation',
    values: ['公務員(文職)', '口岸助理', '活動幹事', 'site administrator'],
  },
  {
    name: '其他 Other Occupations',
    type: 'occupation',
    values: ['倉務員', '產品陳列員，兼職足球教練', '自僱人士', '暫無業', 'environmental consultant'],
  },
];
