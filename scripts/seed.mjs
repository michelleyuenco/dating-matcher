/**
 * Seed script: loads 54 members + 22 categories into Firestore via REST API
 * Run: node scripts/seed.mjs
 */
import { readFileSync } from 'fs';
import { homedir } from 'os';

const PROJECT_ID = 'dating-matcher-hk';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Read access token from firebase CLI config
function getAccessToken() {
  const configPath = `${homedir()}/.config/configstore/firebase-tools.json`;
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  const token = config.tokens?.access_token;
  if (!token) throw new Error('No access token found. Run: firebase login');
  return token;
}

const VALID_MBTI = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
function mbti(raw) { const u = raw.toUpperCase().trim(); return VALID_MBTI.includes(u) ? u : 'INFP'; }
function pi(raw) { return raw.split(/[,，、\n;；]+/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 50); }

function toFV(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'number') return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFV) } };
  return { stringValue: String(val) };
}

function toDoc(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) fields[k] = toFV(v);
  return { fields };
}

async function main() {
  const accessToken = getAccessToken();
  const headers = { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
  const now = new Date().toISOString();

  async function deleteCollection(name) {
    const res = await fetch(`${BASE_URL}/${name}?pageSize=500`, { headers });
    const data = await res.json();
    if (data.documents) {
      await Promise.all(data.documents.map(d =>
        fetch(`https://firestore.googleapis.com/v1/${d.name}`, { method: 'DELETE', headers })
      ));
      console.log(`  Deleted ${data.documents.length} from ${name}`);
    }
  }

  async function createDoc(collection, docId, obj) {
    const url = docId
      ? `${BASE_URL}/${collection}/${docId}`
      : `${BASE_URL}/${collection}`;
    const res = await fetch(url, {
      method: docId ? 'PATCH' : 'POST',
      headers,
      body: JSON.stringify(toDoc(obj)),
    });
    if (!res.ok) throw new Error(`Create failed: ${await res.text()}`);
  }

  const members = [
    { name: 'Member 1', age: 27, gender: 'male', mbti: mbti('不知道'), occupation: '生物科技公司的商業發展', interests: pi('游戲、跑步、創作(故事、游戲、meme等)、學習各種知識'), bio: '善於思考但缺乏行動力。有興趣學習不同知識。', expectations: '我要來學習和纍積經驗', createdAt: now },
    { name: 'Member 2', age: 27, gender: 'male', mbti: mbti('ISFP'), occupation: 'ESG Officer', interests: pi('行山、羽毛球、睇戲、劇本殺、board game'), bio: '隨和 斯文 細心 健談 搞笑', expectations: '認識更多基督教嘅朋友', createdAt: now },
    { name: 'Member 3', age: 28, gender: 'male', mbti: mbti('ENFJ'), occupation: 'Fashion Advertising / Photographer', interests: pi('Photography、Videography、wine and spirit、襯衫、skincare、搵好嘢食、kpop、jpop、gym、swim、美股投資'), bio: '有創意，對事物充滿熱情。', expectations: '識吓人，搵到女朋友就最好', createdAt: now },
    { name: 'Member 4', age: 28, gender: 'male', mbti: mbti('ESFP'), occupation: '工程', interests: pi('睇youtube'), bio: '友善', expectations: '結識另一半', createdAt: now },
    { name: 'Member 5', age: 30, gender: 'male', mbti: mbti('INTJ'), occupation: '補習老師', interests: pi('咖啡、行山、貓'), bio: '衝動，遲鈍，高效率', expectations: '最好搵到終身伴侶', createdAt: now },
    { name: 'Member 6', age: 30, gender: 'male', mbti: mbti('ISTJ'), occupation: '物理治療師', interests: pi('音樂、咖啡、電腦遊戲'), bio: '穩重、認真、有耐性', expectations: '認識更多基督徒朋友', createdAt: now },
    { name: 'Member 7', age: 31, gender: 'male', mbti: mbti('INFP'), occupation: '技術員', interests: pi('砌模型、睇戲、行街'), bio: '感性、直率、樂觀', expectations: '發展一段關係', createdAt: now },
    { name: 'Member 8', age: 32, gender: 'male', mbti: mbti('INFJ'), occupation: '資訊科技', interests: pi('跑步、羽毛球、boardgame'), bio: '內斂、樂於助人、有諗法', expectations: '認識朋友', createdAt: now },
    { name: 'Member 9', age: 32, gender: 'male', mbti: mbti('ISFJ'), occupation: '公務員(文職)', interests: pi('Boardgame、睇戲、羽毛球、游水、水上活動、單車、行山、機動遊戲'), bio: '內向認真，Work hard play hard。', expectations: '認識更多單人弟兄姊妹', createdAt: now },
    { name: 'Member 10', age: 33, gender: 'male', mbti: mbti('INFJ'), occupation: '公務員(文職)', interests: pi('睇Netflix、睇演唱會、旅行、行博物館、食好西、羽毛球、籃球、足球、睇波'), bio: '善用比喻，善於觀察，重視承諾。', expectations: '找到適合自己的另一半', createdAt: now },
    { name: 'Member 11', age: 33, gender: 'male', mbti: mbti('ISFP'), occupation: '倉務員', interests: pi('桌遊、啟發性電影、藝術觀賞'), bio: '外表嚴肅，內心溫柔。', expectations: '學習與人相處之道', createdAt: now },
    { name: 'Member 12', age: 33, gender: 'male', mbti: mbti('INTP'), occupation: '工程師', interests: pi('桌遊、行山、電腦遊戲'), bio: '風趣，轉數快，好人', expectations: '找到終身伴侶', createdAt: now },
    { name: 'Member 13', age: 33, gender: 'male', mbti: mbti('ISFJ'), occupation: 'Programmer', interests: pi('遊戲、動畫、電影、IG、Threads、Youtube、畫畫、藝術、創作、影相'), bio: '愛神，樂觀，正面，有耐性，包容。', expectations: '認識愛神嘅另一半', createdAt: now },
    { name: 'Member 14', age: 33, gender: 'male', mbti: mbti('ISTJ'), occupation: '中學教師', interests: pi('TRPG、DND、Pokemon、minecraft、金庸、衛斯理、納尼亞小說、寫小說、迪士尼、VR、密室逃脫、三國殺、砌Lego、Marvel電影、踏單車、貓、舊歌新詞創作、繪畫'), bio: '認真 重情 勇敢', expectations: '找到結婚對像', createdAt: now },
    { name: 'Member 15', age: 34, gender: 'male', mbti: mbti('ISFJ'), occupation: 'Quality Assurance Specialist', interests: pi('長跑、閱讀、Gym'), bio: '溫柔，為人著想，較慢熱', expectations: '擴闊社交圈子', createdAt: now },
    { name: 'Member 16', age: 35, gender: 'male', mbti: mbti('ENTJ'), occupation: '產品陳列員，兼職足球教練', interests: pi('踢足球、睇戲、聽歌、行山、健身'), bio: '開朗，好動，大方', expectations: '認識新朋友', createdAt: now },
    { name: 'Member 17', age: 35, gender: 'male', mbti: mbti('ESFJ'), occupation: '口岸助理', interests: pi('煮飯、行山、跑步、踏單車'), bio: '開朗，容易相處', expectations: '玩bg識新朋友', createdAt: now },
    { name: 'Member 18', age: 36, gender: 'male', mbti: mbti('不知道'), occupation: '會計', interests: pi('跑步、游水、行山、看電影、Boardgame、義工'), bio: '喜歡認識朋友，情緒穩定', expectations: '認識新朋友和結婚對象', createdAt: now },
    { name: 'Member 19', age: 38, gender: 'male', mbti: mbti('INFP'), occupation: '工程技術主任', interests: pi('短劇、學日文、睇youtube、Switch、boardgames'), bio: '有耐性，願意聆聽。', expectations: '認識基督徒女仔', createdAt: now },
    { name: 'Member 20', age: 40, gender: 'male', mbti: mbti('不知道'), occupation: '律師行文員', interests: pi('睇戲、羽毛球、攝影'), bio: '文靜', expectations: '識多新朋友', createdAt: now },
    { name: 'Member 21', age: 41, gender: 'male', mbti: mbti('ISFJ'), occupation: '活動幹事', interests: pi('桌遊、羽毛球、電影、旅行、唱歌'), bio: '有耐性、細心', expectations: '尋找到伴侶', createdAt: now },
    { name: 'Member 22', age: 41, gender: 'male', mbti: mbti('ENFP'), occupation: '小提琴老師', interests: pi('玩貓、桌遊、小提琴、足球、行山、動畫、打機、食野'), bio: '開朗，善良，聆聽者', expectations: '認識異性，好好溝通', createdAt: now },
    { name: 'Member 23', age: 37, gender: 'male', mbti: mbti('ISFJ'), occupation: '護理', interests: pi('去旅行、煮嘢食、睇戲、貓狗'), bio: '有責任感，忠誠', expectations: '認識朋友', createdAt: now },
    { name: 'Member 24', age: 35, gender: 'male', mbti: mbti('INTJ'), occupation: 'IT', interests: pi('電影、旅遊、閱讀、聽podcast'), bio: '內斂，文靜，喜歡思考', expectations: '同唔同人交流到', createdAt: now },
    { name: 'Member 25', age: 27, gender: 'male', mbti: mbti('INFP'), occupation: 'NGO PW', interests: pi('閱讀、行山、聽歌'), bio: '真誠, 同理心, 善良', expectations: '認識另一半', createdAt: now },
    { name: 'Member 26', age: 37, gender: 'male', mbti: mbti('ESTJ'), occupation: 'Site Administrator', interests: pi('遠足、攝影、飛鏢'), bio: '細心亦有責任感', expectations: '認識新朋友', createdAt: now },
    { name: 'Member 27', age: 32, gender: 'male', mbti: mbti('ISTP'), occupation: 'Environmental Consultant', interests: pi('親近大自然、跑步'), bio: '文靜、細心、內斂', expectations: '擴闊社交圈子', createdAt: now },
    { name: 'Member 28', age: 45, gender: 'male', mbti: mbti('不知道'), occupation: '會計', interests: pi('Board game'), bio: '開朗', expectations: '識基督徒', createdAt: now },
    { name: 'Member 29', age: 27, gender: 'female', mbti: mbti('INFP'), occupation: '社工', interests: pi('跑步、睇書、睇電影+劇、飲咖啡、去旅行'), bio: '同理心、善於觀察和聆聽。', expectations: '擴闊社交圈子', createdAt: now },
    { name: 'Member 30', age: 28, gender: 'female', mbti: mbti('INFP'), occupation: 'Marketing Officer', interests: pi('跑步、行山、閱讀、看海'), bio: '慢熱，有親和力', expectations: '結識新朋友', createdAt: now },
    { name: 'Member 31', age: 30, gender: 'female', mbti: mbti('ISFP'), occupation: '補習老師', interests: pi('閱讀'), bio: '隨和開朗', expectations: '交友', createdAt: now },
    { name: 'Member 32', age: 31, gender: 'female', mbti: mbti('ESFJ'), occupation: '鋼琴老師', interests: pi('與朋友興祝生日、踏單車、桌遊、旅行、玩小動物、看書'), bio: '單純善良，外向，可愛', expectations: '找到伴侶', createdAt: now },
    { name: 'Member 33', age: 33, gender: 'female', mbti: mbti('INFJ'), occupation: '老師', interests: pi('閱讀、逛博物館、輔導、旅行'), bio: '溫柔、善良、負責任', expectations: '希望遇到另一半', createdAt: now },
    { name: 'Member 34', age: 34, gender: 'female', mbti: mbti('INFJ'), occupation: '老師', interests: pi('音樂、戲劇、學習不同的事、旅行'), bio: '有耐性，溫柔，關心人', expectations: '認識愛主的弟兄，進入婚姻', createdAt: now },
    { name: 'Member 35', age: 34, gender: 'female', mbti: mbti('ENFJ'), occupation: '助理公司秘書主任', interests: pi('board games、yoga、drawing'), bio: '善良、隨和', expectations: '識到新朋友', createdAt: now },
    { name: 'Member 36', age: 34, gender: 'female', mbti: mbti('ISFJ'), occupation: '教師', interests: pi('看書、書法、郊遊'), bio: '親切，願意幫忙人，責任感強。', expectations: '遇到合適的人', createdAt: now },
    { name: 'Member 37', age: 34, gender: 'female', mbti: mbti('INFP'), occupation: 'Administrative assistant', interests: pi('戶外活動、食野、旅行、boardgame'), bio: '內向文靜, 對人友善, 有責任心', expectations: '找到合適伴侶', createdAt: now },
    { name: 'Member 38', age: 34, gender: 'female', mbti: mbti('ISFJ'), occupation: '醫院助理院務經理', interests: pi('游水、行山、睇書、做手工、打羽毛球、board games、劇本殺'), bio: '動靜皆宜，鍾意做聆聽者。', expectations: '擴闊圈子', createdAt: now },
    { name: 'Member 39', age: 35, gender: 'female', mbti: mbti('ISFP'), occupation: '暫無業', interests: pi('環保、煲劇、食飯傾偈'), bio: '助人型，鍾意食飯傾偈見朋友', expectations: '以平常心對待', createdAt: now },
    { name: 'Member 40', age: 35, gender: 'female', mbti: mbti('ISFP'), occupation: '見習律師', interests: pi('唱歌、音樂會、音樂劇、網球、壁球、游水、跑步、水上活動、旅行、睇書'), bio: '有主見，對關係認真同真誠。', expectations: '識到可以發展嘅男人', createdAt: now },
    { name: 'Member 41', age: 35, gender: 'female', mbti: mbti('INFJ'), occupation: '秘書', interests: pi('睇展覽、戲、舞台劇'), bio: '斯文，願意聆聽，體貼，愛笑', expectations: '認識戀愛對象', createdAt: now },
    { name: 'Member 42', age: 36, gender: 'female', mbti: mbti('INTJ'), occupation: '精算師', interests: pi('旅行、游水、音響、閱讀、學新技能'), bio: '認真、謹慎、慢熱', expectations: '擴闊社交圈子', createdAt: now },
    { name: 'Member 43', age: 36, gender: 'female', mbti: mbti('ENFJ'), occupation: '會計師', interests: pi('行山、睇戲、打pickle ball'), bio: '隨和，有耐性，open minded', expectations: '認識多啲朋友', createdAt: now },
    { name: 'Member 44', age: 37, gender: 'female', mbti: mbti('不知道'), occupation: 'Account clerk', interests: pi('羽毛球、跑步'), bio: 'Nice', expectations: '認識基督徒', createdAt: now },
    { name: 'Member 45', age: 37, gender: 'female', mbti: mbti('ENFP'), occupation: '社會服務', interests: pi('郊遊、戶外及水上活動、展覽藝術、音樂'), bio: '外向，活潑好動', expectations: '認識異性基督徒', createdAt: now },
    { name: 'Member 46', age: 38, gender: 'female', mbti: mbti('INFJ'), occupation: '非牟利機構', interests: pi('影相、打羽毛球、畫畫、睇書'), bio: '情感豐富、樂觀、溫柔', expectations: '識到好弟兄', createdAt: now },
    { name: 'Member 47', age: 39, gender: 'female', mbti: mbti('ENFP'), occupation: '設計師', interests: pi('睇戲、睇展覽、演唱會、攝影、行山、做手作、Yoga'), bio: '斯文溫柔，健談，細心體貼。', expectations: '結識到基督教的另一半', createdAt: now },
    { name: 'Member 48', age: 40, gender: 'female', mbti: mbti('不知道'), occupation: '自僱人士', interests: pi('看一人一故事、聽音樂、唱詩歌、玩拼圖'), bio: '細心', expectations: '認識到朋友', createdAt: now },
    { name: 'Member 49', age: 42, gender: 'female', mbti: mbti('ISFP'), occupation: '社工', interests: pi('藝術、看電影'), bio: '真誠但慢熱', expectations: '認識愛主的異性', createdAt: now },
    { name: 'Member 50', age: 42, gender: 'female', mbti: mbti('INFP'), occupation: '傳道人', interests: pi('游水、排球、旅行、大自然活動'), bio: '以為外向實際內向、樂觀、親切', expectations: '認識可以分享的異性', createdAt: now },
    { name: 'Member 51', age: 44, gender: 'female', mbti: mbti('ENFJ'), occupation: '社工', interests: pi('手工藝、兒童及青年工作、義工、電影'), bio: '開朗，成熟，愛主，隨和', expectations: '認識另一半及基督徒朋友', createdAt: now },
    { name: 'Member 52', age: 44, gender: 'female', mbti: mbti('ENFP'), occupation: '攝影師', interests: pi('桌遊、攝影、書法、剪片、語言'), bio: 'ENFP，爽朗，風趣', expectations: '認識朋友', createdAt: now },
    { name: 'Member 53', age: 39, gender: 'female', mbti: mbti('ISFJ'), occupation: 'Customer Relationship & Brand Marketing Manager', interests: pi('閱讀、運動、英文書法、旅行、整理收納、輔導心理學'), bio: '細心、有耐性、擅於聆聽。喜愛閱讀、大自然。', expectations: '擴闊基督徒朋友的圈子', createdAt: now },
    { name: 'Member 54', age: 36, gender: 'female', mbti: mbti('不知道'), occupation: '銀行Teller', interests: pi('運動、跑步、煮野吃、看書、學習、音樂'), bio: '喜歡自在，有時開心，有時文靜', expectations: '冇特別期望', createdAt: now },
  ];

  const categories = [
    { name: '運動 Sports', type: 'interest', values: ['跑步','行山','游水','羽毛球','籃球','足球','健身','gym','yoga','單車','踏單車','排球','網球','壁球','水上活動','長跑','踢足球','打波','打羽毛球','swim','運動','pickle ball','遠足','郊遊'] },
    { name: '音樂 Music', type: 'interest', values: ['音樂','唱歌','鋼琴','小提琴','演唱會','聽歌','音樂會','音樂劇','詩歌','唱詩歌','聽音樂','音響','kpop','jpop'] },
    { name: '藝術文化 Arts & Culture', type: 'interest', values: ['畫畫','攝影','影相','博物館','展覽','舞台劇','書法','藝術','手工','手作','做手工','手工藝','睇展覽','逛博物館','英文書法','藝術觀賞','展覽藝術','photography','videography','drawing','繪畫','戲劇'] },
    { name: '影視娛樂 Movies & Entertainment', type: 'interest', values: ['睇戲','電影','睇Netflix','煲劇','劇本殺','密室逃脫','VR','看電影','睇電影','動畫','啟發性電影','Marvel電影','看一人一故事','戲','睇電影+劇'] },
    { name: '閱讀學習 Reading & Learning', type: 'interest', values: ['閱讀','睇書','看書','小說','學習','學日文','podcast','輔導','輔導心理學','金庸','衛斯理','納尼亞小說','寫小說','學習各種知識','學習不同的事','學新技能','聽podcast'] },
    { name: '飲食烹飪 Food & Cooking', type: 'interest', values: ['咖啡','煮飯','煮嘢食','煮野吃','食好西','食野','搵好嘢食','飲咖啡','wine and spirit','食飯傾偈'] },
    { name: '旅行戶外 Travel & Outdoors', type: 'interest', values: ['旅行','旅遊','戶外活動','大自然','去旅行','親近大自然','看海','大自然活動','戶外及水上活動'] },
    { name: '桌遊社交 Board Games & Social', type: 'interest', values: ['桌遊','board game','boardgame','board games','boardgames','三國殺','砌Lego','DND','TRPG','玩拼圖','bg'] },
    { name: '電玩科技 Gaming & Tech', type: 'interest', values: ['電腦遊戲','打機','遊戲','游戲','Switch','minecraft','Pokemon','IG','Threads','Youtube','睇youtube','美股投資','機動遊戲','迪士尼'] },
    { name: '動物寵物 Pets & Animals', type: 'interest', values: ['貓','狗','玩貓','貓狗','小動物','玩小動物'] },
    { name: '生活方式 Lifestyle', type: 'interest', values: ['襯衫','skincare','環保','義工','兒童及青年工作','整理收納','與朋友興祝生日','行街'] },
    { name: '創作 Creative', type: 'interest', values: ['創作','剪片','語言','舊歌新詞創作','meme','創作(故事、游戲、meme等)','砌模型','短劇'] },
    { name: 'MBTI', type: 'mbti', values: ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'] },
    { name: '教育 Education', type: 'occupation', values: ['補習老師','中學教師','老師','教師','小提琴老師','鋼琴老師','傳道人'] },
    { name: '科技工程 Tech & Engineering', type: 'occupation', values: ['資訊科技','IT','Programmer','工程師','工程技術主任','技術員','Quality Assurance Specialist','工程'] },
    { name: '商業金融 Business & Finance', type: 'occupation', values: ['會計','會計師','精算師','銀行Teller','Account clerk','生物科技公司的商業發展','ESG Officer','Customer Relationship & Brand Marketing Manager'] },
    { name: '醫療健康 Healthcare', type: 'occupation', values: ['物理治療師','醫院助理院務經理','護理'] },
    { name: '法律行政 Legal & Admin', type: 'occupation', values: ['律師行文員','見習律師','秘書','助理公司秘書主任','Administrative assistant'] },
    { name: '社會服務 Social Services', type: 'occupation', values: ['社工','社會服務','非牟利機構','NGO PW'] },
    { name: '創意設計 Creative & Design', type: 'occupation', values: ['設計師','攝影師','Fashion Advertising / Photographer','Marketing Officer'] },
    { name: '公務行政 Civil Service & Admin', type: 'occupation', values: ['公務員(文職)','口岸助理','活動幹事','Site Administrator'] },
    { name: '其他 Other Occupations', type: 'occupation', values: ['倉務員','產品陳列員，兼職足球教練','自僱人士','暫無業','Environmental Consultant'] },
  ];

  console.log('Step 1: Clearing existing data...');
  await deleteCollection('members');
  await deleteCollection('categories');

  console.log('\nStep 2: Seeding 22 categories...');
  for (let i = 0; i < categories.length; i++) {
    await createDoc('categories', `cat-${i}`, categories[i]);
  }
  console.log('  ✓ Categories done');

  console.log('\nStep 3: Seeding 54 members...');
  for (let i = 0; i < members.length; i++) {
    await createDoc('members', `member-${i + 1}`, members[i]);
    if ((i + 1) % 10 === 0) console.log(`  ${i + 1}/${members.length}...`);
  }
  console.log('  ✓ Members done');

  const males = members.filter(m => m.gender === 'male').length;
  const females = members.filter(m => m.gender === 'female').length;
  console.log(`\n✅ Firestore seeded successfully!`);
  console.log(`   ${members.length} members (${males} males, ${females} females)`);
  console.log(`   ${categories.length} categories`);
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
