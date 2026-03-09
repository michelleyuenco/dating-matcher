import { Category, CategoryType } from '../entities';

/**
 * Keyword map for auto-categorizing Chinese/English interests
 */
const INTEREST_KEYWORDS: Record<string, string[]> = {
  '運動 Sports': [
    '跑步', 'running', '行山', 'hiking', '游水', 'swimming', '羽毛球', 'badminton',
    '籃球', 'basketball', '足球', 'soccer', 'football', '健身', 'gym', 'yoga', '瑜伽',
    '單車', 'cycling', '踏單車', '排球', 'volleyball', '網球', 'tennis', '壁球', 'squash',
    '水上活動', 'water sports', '衝浪', 'pickle ball', '長跑', '踢足球', '打波',
  ],
  '音樂 Music': [
    '音樂', 'music', '唱歌', 'singing', '鋼琴', 'piano', '小提琴', 'violin',
    '演唱會', 'concert', '聽歌', '音樂會', '音樂劇', 'musical', '詩歌', '唱詩歌',
    '音響',
  ],
  '藝術文化 Arts & Culture': [
    '畫畫', 'painting', 'drawing', '攝影', 'photography', '影相',
    '博物館', 'museum', '展覽', 'exhibition', '戲劇', 'theater', '舞台劇',
    '書法', 'calligraphy', '藝術', 'art', '手工', 'craft', '手作', '做手工',
    '手工藝', '睇展覽', '逛博物館', '英文書法',
  ],
  '影視娛樂 Movies & Entertainment': [
    '睇戲', '電影', 'movie', 'film', '睇Netflix', 'Netflix', '煲劇',
    '劇本殺', '密室逃脫', 'VR', '一人一故事', '看電影', '睇電影',
    '短劇', '動畫',
  ],
  '閱讀學習 Reading & Learning': [
    '閱讀', 'reading', '睇書', '看書', '小說', 'novel', '學習',
    '學日文', 'podcast', '輔導', '輔導心理學', '金庸', '衛斯理',
    '納尼亞', '漫畫', '寫小說',
  ],
  '飲食烹飪 Food & Cooking': [
    '咖啡', 'coffee', '煮飯', 'cooking', '煮嘢食', '煮野吃',
    '食好西', '食野', '搵好嘢食', '飲咖啡', 'wine', '品酒',
  ],
  '旅行戶外 Travel & Outdoors': [
    '旅行', 'travel', '旅遊', '郊遊', '戶外活動', '大自然',
    '去旅行', '親近大自然', '看海', '遠足', '露營',
  ],
  '桌遊社交 Board Games & Social': [
    '桌遊', 'board game', 'boardgame', 'bg', '三國殺',
    '砌Lego', 'LEGO', 'DND', 'TRPG', '拼圖',
  ],
  '電玩科技 Gaming & Tech': [
    '電腦遊戲', '打機', 'gaming', '遊戲', '游戲', 'Switch',
    'minecraft', 'Pokemon', 'IG', 'Threads', 'Youtube', '睇youtube',
    '美股投資', '投資', 'meme',
  ],
  '動物寵物 Pets & Animals': [
    '貓', '狗', '寵物', '玩貓', '貓狗', '小動物', '玩小動物',
  ],
  '時尚生活 Fashion & Lifestyle': [
    '襯衫', 'fashion', 'skincare', '護膚', '時尚', '整理收納',
    '環保', '義工', 'volunteering', '兒童及青年工作',
  ],
  '創作 Creative': [
    '創作', '剪片', '語言', '影片', 'videography',
    '舊歌新詞', '繪畫', 'kpop', 'jpop', '飛鏢',
  ],
};

/**
 * Try to find a matching category name for a given interest value
 */
export function findCategoryForInterest(interest: string): string | null {
  const normalized = interest.toLowerCase().trim();
  for (const [categoryName, keywords] of Object.entries(INTEREST_KEYWORDS)) {
    if (keywords.some(kw => normalized.includes(kw.toLowerCase()) || kw.toLowerCase().includes(normalized))) {
      return categoryName;
    }
  }
  return null;
}

/**
 * Auto-categorize a list of interests.
 * Returns updated categories with new values added, and creates new categories if needed.
 */
export function autoCategorizeInterests(
  interests: string[],
  existingCategories: Category[]
): Category[] {
  const categories = existingCategories.map(c => ({ ...c, values: [...c.values] }));

  for (const interest of interests) {
    const normalized = interest.toLowerCase().trim();
    if (!normalized) continue;

    // Already exists in some category?
    const alreadyExists = categories.some(
      c => c.type === 'interest' && c.values.includes(normalized)
    );
    if (alreadyExists) continue;

    // Try keyword matching
    const matchedName = findCategoryForInterest(normalized);
    if (matchedName) {
      const cat = categories.find(c => c.name === matchedName && c.type === 'interest');
      if (cat) {
        cat.values.push(normalized);
        continue;
      }
    }

    // Put in "其他 Other" category
    let other = categories.find(c => c.name === '其他 Other' && c.type === 'interest');
    if (!other) {
      other = { id: `cat-other-interest`, name: '其他 Other', type: 'interest' as CategoryType, values: [] };
      categories.push(other);
    }
    if (!other.values.includes(normalized)) {
      other.values.push(normalized);
    }
  }

  return categories;
}

/**
 * Auto-categorize occupations similarly
 */
const OCCUPATION_KEYWORDS: Record<string, string[]> = {
  '教育 Education': ['老師', '教師', '補習', 'teacher', 'tutor', '傳道人', 'professor'],
  '科技工程 Tech & Engineering': ['IT', 'programmer', 'software', '資訊科技', '技術員', 'engineer', 'QA', 'quality assurance'],
  '商業金融 Business & Finance': ['會計', 'accountant', 'ESG', '銀行', 'teller', '精算', 'actuary', '商業發展', 'business'],
  '醫療健康 Healthcare': ['物理治療', 'physiotherapist', '醫院', 'nurse', '護理', 'healthcare'],
  '法律行政 Legal & Admin': ['律師', 'lawyer', '秘書', 'secretary', 'administrative', '助理', '文員', 'clerk'],
  '社會服務 Social Services': ['社工', 'social worker', '社會服務', 'NGO', '非牟利', 'nonprofit'],
  '創意設計 Creative & Design': ['設計師', 'designer', '攝影師', 'photographer', 'advertising', 'marketing'],
  '公務員 Civil Service': ['公務員', 'civil servant', '口岸', '活動幹事'],
  '其他 Other Occupations': ['倉務', '產品陳列', '自僱', '工程'],
};

export function autoCategorizeOccupations(
  occupations: string[],
  existingCategories: Category[]
): Category[] {
  const categories = existingCategories.map(c => ({ ...c, values: [...c.values] }));

  for (const occ of occupations) {
    const normalized = occ.toLowerCase().trim();
    if (!normalized) continue;

    const alreadyExists = categories.some(
      c => c.type === 'occupation' && c.values.includes(normalized)
    );
    if (alreadyExists) continue;

    let matched = false;
    for (const [catName, keywords] of Object.entries(OCCUPATION_KEYWORDS)) {
      if (keywords.some(kw => normalized.includes(kw.toLowerCase()) || kw.toLowerCase().includes(normalized))) {
        let cat = categories.find(c => c.name === catName && c.type === 'occupation');
        if (!cat) {
          cat = { id: `cat-occ-${catName}`, name: catName, type: 'occupation' as CategoryType, values: [] };
          categories.push(cat);
        }
        if (!cat.values.includes(normalized)) {
          cat.values.push(normalized);
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      let other = categories.find(c => c.name === '其他 Other Occupations' && c.type === 'occupation');
      if (!other) {
        other = { id: `cat-occ-other`, name: '其他 Other Occupations', type: 'occupation' as CategoryType, values: [] };
        categories.push(other);
      }
      if (!other.values.includes(normalized)) {
        other.values.push(normalized);
      }
    }
  }

  return categories;
}
