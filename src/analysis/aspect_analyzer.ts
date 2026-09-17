import { ChartData, ChartType, Palace } from '../core/types';
import { PALACE_NAMES, calculatePalaceFlyingSihua, calculateAllSelfSihua } from '../core/ziwei_rules';
import marriageData from './data/marriage.json';
import wealthData from './data/wealth.json';
import careerData from './data/career.json';
import examData from './data/exam.json';
import houseData from './data/house.json';
import friendsData from './data/friends.json';
import healthData from './data/health.json';
import destinyData from './data/destiny.json';
import patternsData from './data/patterns.json';
import yunData from './data/yun.json';
import childrenData from './data/children.json';
import travelData from './data/travel.json';
import blessingData from './data/blessing.json';
import parentsData from './data/parents.json';
import brothersData from './data/brothers.json';
import religionData from './data/religion.json';
import shengyanGuidance from './data/shengyan_guidance.json';
import starFlaws from './data/star_flaws.json';


// 主星通俗白話性格與吉凶對照表
export const STAR_PLAIN_DESC: Record<string, { role: string; strength: string; weakness: string; fortune: string }> = {
  '紫微': { role: '領袖星、帝王星', strength: '有格局、自尊心高、自帶威嚴有魄力', weakness: '有時愛面子、主觀意識重、不喜被命令', fortune: '適合掌權當頭、做主導型事業' },
  '天機': { role: '智謀星、軍師星', strength: '腦筋動得極快、足智多謀、善於策劃分析', weakness: '想太多容易精神緊繃、患得患失、耐性較缺', fortune: '靠專業知識、智力企劃、技術專長吃穿' },
  '太陽': { role: '燃燒星、陽光博愛星', strength: '熱心腸、光明磊落、做事風風火火有擔當', weakness: '容易操勞過頭累壞自己、心軟好面子容易吃悶虧', fortune: '適合公開公關、教育傳播、為眾人服務之事業' },
  '武曲': { role: '行動正財星、將軍星', strength: '做事果斷剛毅、說到做到、執行力無敵強、自帶財氣', weakness: '個性太直太硬、不懂甜言蜜語、人情味稍顯冷淡', fortune: '求財能力極硬，適合金融商務、財務、技術獨立打拼' },
  '天同': { role: '福星、樂天星', strength: '待人隨和親切、EQ高、懂得享受生活情趣、人緣好', weakness: '比較容易安於現狀、動力不足、容易有拖延症', fortune: '自帶貴人運，衣食無憂，適合文創、服務、人際交流' },
  '廉貞': { role: '事業公關星、次桃花星', strength: '社交手腕高明、公私分明、責任感重、自帶獨特氣場', weakness: '個性有些傲骨強烈、防備心重、想得比較深密', fortune: '適合政界商場、公關、公職、大企業或法律專門領域' },
  '天府': { role: '財庫星、王爺管家星', strength: '穩健沈著、守成能力強、重信譽、能收能放有大將之風', weakness: '稍顯保守排斥冒險、有時太過按部就班、注重排場', fortune: '天生管錢能手，適合大機構高管、理財資產管理、做實業' },
  '太陰': { role: '田產母性星、月亮柔和星', strength: '溫柔細膩、善解人意、有審美品味、富同理心', weakness: '心思細密易多愁善感、容易生悶氣或情緒內耗', fortune: '自帶房產不動產緣分，適合財富積累、女性相關行業、設計美學' },
  '貪狼': { role: '才藝慾望星、公關靈魂星', strength: '交際手腕靈活、八面玲瓏、學東西超快、具表演魅力', weakness: '興趣太廣泛容易博而不精、慾望多變、容易三分鐘熱度', fortune: '適合業務拓展、公關公關、娛樂才藝、自由發揮市場' },
  '巨門': { role: '口才星、分析辨正星', strength: '口才一流、觀察入微、邏輯思維強、擅長挑刺找漏洞', weakness: '說話容易太直接太尖銳而得罪人、容易有口舌是非或猜疑', fortune: '靠嘴巴靠頭腦賺錢，適合律師、諮詢、教學、研究檢驗' },
  '天相': { role: '宰相印星、熱心和事佬星', strength: '外表端莊得體、誠懇講義氣、處事公正、是最佳神隊友', weakness: '耳根子軟容易隨波逐流、偶爾缺乏獨當一面的殺伐魄力', fortune: '適合專業經理人、秘書長、行政企劃、服務業' },
  '天梁': { role: '長老蔭星、貴人老大哥星', strength: '樂善好施、具長輩風範、臨危不亂、天生逢凶化吉的福氣', weakness: '愛碎碎念、有些倚老賣老或固執自己的原則', fortune: '自帶長輩緣與逢凶化吉力量，適合公職、醫療、法律、顧問' },
  '七殺': { role: '先鋒將星、開路大將軍', strength: '敢衝敢拼、獨立自主、不怕艱難、魄力爆棚、不拖泥帶水', weakness: '脾氣來得快、大起大落風險高、六親緣分較淡薄', fortune: '開疆闢土第一人，適合自己創業、業務先鋒、軍警冒險型事業' },
  '破軍': { role: '改革破壞星、先破後成星', strength: '破舊立新、勇於打破常規、創意狂人、不怕從零開始', weakness: '情緒波動大、愛折騰、破壞力強、錢財感情易動盪反覆', fortune: '適合創新研發、變革轉型事業，大破才能大立' }
};

export type AspectKey =
  | 'destiny'   // 先天命格與格局
  | 'xuankong'  // 🔀 玄空飛星（情之所鍾・因果盲點）
  | 'marriage'  // 婚姻感情
  | 'wealth'    // 財運求財
  | 'career'    // 事業升遷
  | 'exam'      // 讀書考試
  | 'house'     // 買房田宅與祖業
  | 'children'  // 子女緣分與教育
  | 'travel'    // 出外移居與貴人
  | 'blessing'  // 精神福德與減壓
  | 'friends'   // 人際交友與合夥
  | 'parents'   // 長輩父母與手足
  | 'health'    // 疾難健康
  | 'religion'; // 宗教玄學與修行因果

export interface AspectResult {
  title: string;
  scopeDesc: string;
  targetPalaceName: string;
  targetBranch: string;
  starsSummary: string[];
  palaceSihuaSummary?: {
    stem: string;
    flyOut: string[];     // 本宮飛出四化 (祿權科忌)
    selfSihua: string[];   // 本宮自化星曜
    clashTarget?: string;  // 忌沖哪一宮
    clashedBy?: string[];  // 哪些外宮化忌沖本宮
    plainStory?: string;   // 👑 飛星大白話因果解讀
  };
  plainSummary: string; // 👑 通俗大白話總結
  keyHighlights: string[];
  detailedExplanations: string[];
  advice: string[];
  blindSpots: string[]; // ⚠️ 致命盲點與個性隱患（講真話、講壞的）
  improvements: string[]; // 🛠️ 具體自我改進與修為指引
  masterGuidance?: {
    title: string;
    summary: string;
    practice: string;
    links: { type: string; title: string; url: string }[];
  };
}

export function analyzeAspect(chart: ChartData, mode: ChartType, aspect: AspectKey): AspectResult {
  // 決定對應目標宮位
  let targetPalaceName = '命宮';
  if (aspect === 'marriage') targetPalaceName = '夫妻宮';
  else if (aspect === 'wealth') targetPalaceName = '財帛宮';
  else if (aspect === 'career') targetPalaceName = '官祿宮';
  else if (aspect === 'exam') targetPalaceName = '官祿宮';
  else if (aspect === 'house') targetPalaceName = '田宅宮';
  else if (aspect === 'children') targetPalaceName = '子女宮';
  else if (aspect === 'travel') targetPalaceName = '遷移宮';
  else if (aspect === 'blessing') targetPalaceName = '福德宮';
  else if (aspect === 'friends') targetPalaceName = '奴僕宮';
  else if (aspect === 'parents') targetPalaceName = '父母宮';
  else if (aspect === 'health') targetPalaceName = '疾厄宮';
  else if (aspect === 'religion') targetPalaceName = '福德宮'; // 宗教以福德宮與命宮為主參

  let targetIdx = chart.originalLifeIndex;
  if (mode === 'original') {
    const p = chart.palaces.find(pal => pal.name === targetPalaceName);
    if (p) targetIdx = p.index;
  } else if (mode === 'big_limit') {
    const p = chart.palaces.find(pal => pal.bigLimitName && pal.bigLimitName.includes(targetPalaceName));
    if (p) targetIdx = p.index;
    else {
      const pIdx = PALACE_NAMES.indexOf(targetPalaceName);
      targetIdx = (chart.currentBigLimitIndex - pIdx + 12) % 12;
    }
  } else if (mode === 'flow_year') {
    const p = chart.palaces.find(pal => pal.flowYearName && pal.flowYearName.includes(targetPalaceName));
    if (p) targetIdx = p.index;
    else {
      const pIdx = PALACE_NAMES.indexOf(targetPalaceName);
      targetIdx = (chart.currentFlowYearIndex - pIdx + 12) % 12;
    }
  }

  const palace = chart.palaces[targetIdx];
  const branch = palace.earthBranch;
  const originalPalaceName = palace.name;
  const majorStars = palace.majorStars.map(s => s.name);
  const minorStars = palace.minorStars.map(s => s.name);
  const badStars = palace.badStars.map(s => s.name);
  const sihuaStars = palace.majorStars.filter(s => s.sihua || s.flowSihua).map(s => `${s.name}化${s.flowSihua || s.sihua}`);
  const bigLimitRangeStr = chart.palaces[chart.currentBigLimitIndex]?.bigLimitRange || '';

  let title = '';
  let scopeDesc = '';
  let plainSummary = '';
  const keyHighlights: string[] = [];
  const detailedExplanations: string[] = [];
  const advice: string[] = [];
  const blindSpots: string[] = [];
  const improvements: string[] = [];

  const modeText = mode === 'original' 
    ? '【本命先天】' 
    : mode === 'big_limit' 
    ? '【當前大限 ' + bigLimitRangeStr + ' 歲】' 
    : '【' + chart.targetYear + ' 流年行運】';

  const starsSummary = [
    '坐守主星：' + (majorStars.length > 0 ? majorStars.join('、') : '無主星 (借對宮星曜)'),
    '吉星會聚：' + (minorStars.length > 0 ? minorStars.join('、') : '無特別吉星'),
    '煞曜神煞：' + (badStars.length > 0 ? badStars.join('、') : '三方清吉無重煞'),
    sihuaStars.length > 0 ? '四化引動：' + sihuaStars.join('、') : '本宮無引動四化'
  ];

  // 計算該目標宮位的玄空飛星四化與自化
  const palaceFlying = calculatePalaceFlyingSihua(chart, targetIdx);
  const pTargets = palaceFlying.targets;
  const selfSihuaList: string[] = [];
  (['lu', 'quan', 'ke', 'ji'] as const).forEach(k => {
    if (pTargets[k].isSelf) {
      selfSihuaList.push(`${pTargets[k].star}自化${pTargets[k].sihua}`);
    }
  });

  // 檢查全盤是否有其他宮位化忌沖本宮
  const clashedByList: string[] = [];
  for (let i = 0; i < chart.palaces.length; i++) {
    if (i === targetIdx) continue;
    const otherFlying = calculatePalaceFlyingSihua(chart, i);
    if (otherFlying.targets.ji.clashPalaceIndex === targetIdx) {
      clashedByList.push(`【${otherFlying.fromPalaceName}】化忌入【${otherFlying.targets.ji.toPalaceName}】來沖`);
    }
  }

  // 產生生動的飛星因果大白話串聯
  let plainStory = `【${palace.name}】的善緣好處情願給【${pTargets.lu.toPalaceName}】（化祿），最想展現掌控力與爭取話語權在【${pTargets.quan.toPalaceName}】（化權），最在乎斯文體面名聲在【${pTargets.ke.toPalaceName}】（化科）；但最放心不下、最容易鑽牛角尖牽掛的地方落在【${pTargets.ji.toPalaceName}】（化忌），因而連帶沖擊了【${pTargets.ji.clashPalaceName}】！`;
  if (selfSihuaList.length > 0) {
    plainStory += ` 此外本宮逢【${selfSihuaList.join('、')}】，代表此處能量容易自尋煩惱或不自覺流失，需靠後天自律守成。`;
  }
  if (clashedByList.length > 0) {
    plainStory += ` 特別注意：本宮受到${clashedByList.join('、')}，代表此面向若遇瓶頸，常是被這些外來人事所牽累，需有防人之心。`;
  }

  const palaceSihuaSummary = {
    stem: palace.heavenStem,
    flyOut: [
      `祿入【${pTargets.lu.toPalaceName}】(${pTargets.lu.star})`,
      `權入【${pTargets.quan.toPalaceName}】(${pTargets.quan.star})`,
      `科入【${pTargets.ke.toPalaceName}】(${pTargets.ke.star})`,
      `忌入【${pTargets.ji.toPalaceName}】(${pTargets.ji.star})`
    ],
    selfSihua: selfSihuaList,
    clashTarget: pTargets.ji.clashPalaceName,
    clashedBy: clashedByList,
    plainStory
  };

  // 1. 婚姻感情
  if (aspect === 'marriage') {
    title = modeText + ' 婚姻感情與伴侶專論';
    scopeDesc = mode === 'original' ? '著重於先天擇偶眼光、感情觀、夫妻對待關係與早婚晚婚傾向。' : mode === 'big_limit' ? '解讀這十年 (' + bigLimitRangeStr + '歲) 姻緣：單身者脫單契機，已婚者感情磨合重點。' : '針對 ' + chart.targetYear + ' 年當年的感情桃花與相處提醒。';
    if (mode === 'original') {
      plainSummary = majorStars.length > 0 ? '【白話說給你聽】：你在感情上非常看重對方的「' + (STAR_PLAIN_DESC[majorStars[0]]?.strength || '個人魅力') + '」。你天生會被有才華、有魄力的人吸引，但相處時「' + (STAR_PLAIN_DESC[majorStars[0]]?.weakness || '彼此性格需要磨合') + '」，多點包容才能長長久久。' : '【白話說給你聽】：你的夫妻宮沒有主要星曜，代表你天生的擇偶條件很有彈性、比較隨緣，容易受身邊親友或相遇氛圍影響，感情往往順其自然展開。';
    } else if (mode === 'big_limit') {
      plainSummary = '【這十年感情大白話】：此步大限夫妻宮重疊在你的本命【' + originalPalaceName + '】。這十年間感情會是人生的一大重心。若有化祿或吉星，這十年婚緣極旺、容易成家立業；若會煞星，感情溝通就要少點固執、多點傾聽。';
    } else {
      plainSummary = '【今年感情運白話】：' + chart.targetYear + '年流年夫妻宮走到本命【' + originalPalaceName + '】。今年感情氣場特別活躍，有對象者講話放軟身段，單身者出外或社交容易有心動契機！';
    }
    majorStars.forEach(star => {
      const p = STAR_PLAIN_DESC[star];
      if (p) keyHighlights.push('坐守【' + star + '】：伴侶本質帶有「' + p.role + '」特質，性格通常「' + p.strength + '」。');
    });
    if (majorStars.length === 0) {
      detailedExplanations.push('夫妻宮無主星：感情緣分較為隨緣多變，對伴侶的期待易受外在環境或朋友意見影響，宜以對宮(官祿宮)之星曜借星合參。');
    } else {
      majorStars.forEach(star => {
        const docStar = (marriageData.stars as any)[star];
        if (docStar && docStar.general) detailedExplanations.push(...docStar.general.slice(0, 3));
      });
    }
    if (minorStars.includes('紅鸞') || minorStars.includes('天喜')) {
      const peachStars = minorStars.filter(s => s === '紅鸞' || s === '天喜').join('與');
      keyHighlights.push(`🌸 夫妻宮逢【${peachStars}】：正桃花正曜同度，天生自帶異性緣與浪漫魅力，感情互動甜蜜，逢流年大限吉化極利結髮連理。`);
    }
    if (minorStars.includes('天姚') || minorStars.includes('咸池')) {
      const pStars = minorStars.filter(s => s === '天姚' || s === '咸池').join('、');
      keyHighlights.push(`🌹 夫妻宮逢【${pStars}】：次桃花與風情曜會聚，伴侶極富幽默感與社交魅力，感情重視情調浪漫，亦需謹守分寸防桃色波折。`);
    }
    if (badStars.includes('孤辰') || badStars.includes('寡宿')) {
      const gStars = badStars.filter(s => s === '孤辰' || s === '寡宿').join('、');
      keyHighlights.push(`🕯️ 夫妻宮逢【${gStars}】：主獨立清高，感情上容易各忙各的或聚少離多，宜主動製造生活共鳴與深度交心。`);
    }
    advice.push(badStars.length > 0 ? '💡【白話開運提醒】：本宮見【' + badStars.join('、') + '】小磨練。相處切忌「爭一時輸贏」，生氣時先冷靜半小時再去溝通，感情反而更甜。' : '💡【白話開運提醒】：宮位平穩，日常多製造專屬儀式感，互為最強後盾。');

  // 2. 財運求財
  } else if (aspect === 'wealth') {
    title = modeText + ' 財運求財與資產專論';
    scopeDesc = mode === 'original' ? '解析一生財富格局、進財管道、正財偏財傾向與理財守財能力。' : mode === 'big_limit' ? '評估這十年 (' + bigLimitRangeStr + '歲) 求財得失、投資創業時機與財庫積蓄動能。' : '推算 ' + chart.targetYear + ' 年度進財機會、花費破耗熱點與理財警訊。';
    if (mode === 'original') {
      plainSummary = majorStars.length > 0 ? '【白話說給你聽】：你天生賺錢靠的是「' + (STAR_PLAIN_DESC[majorStars[0]]?.fortune || '個人專長能力') + '」。你有自己獨特的賺錢路數，最忌跟風盲從。只要把心思放在懂的領域，累積財富水到渠成。' : '【白話說給你聽】：你的先天財帛宮無主星，代表一生財路多元靈活，賺錢適合靠隨機應變、整合資源或跟著強者團隊走，避免孤注一擲。';
    } else if (mode === 'big_limit') {
      plainSummary = '【這十年財富大白話】：此步大限財帛宮落在本命【' + originalPalaceName + '】。這十年間是建立個人資產的重要週期，適合穩扎穩打增加被動收入或核心技能，切忌過度槓桿與衝動投機。';
    } else {
      plainSummary = '【今年財運白話】：' + chart.targetYear + '年流年財帛宮進入本命【' + originalPalaceName + '】。今年進財有機會，但開銷也不小。建議今年賺到錢先留三成做緊急備用金，看緊荷包不借貸。';
    }
    majorStars.forEach(star => {
      const p = STAR_PLAIN_DESC[star];
      if (p) keyHighlights.push('坐守【' + star + '】：求財方式帶有「' + p.role + '」特質，進財擅長「' + p.fortune + '」。');
    });
    if (majorStars.length === 0) {
      detailedExplanations.push('財帛宮無主星：財來財去流動性大，不宜高風險投機，宜以專業技術建立護城河。');
    } else {
      majorStars.forEach(star => {
        const docStar = (wealthData.stars as any)[star];
        if (docStar && docStar.general) detailedExplanations.push(...docStar.general.slice(0, 3));
      });
    }
    if (minorStars.includes('祿存')) keyHighlights.push('財帛宮逢【祿存】，得天厚賜財祿，利於儲蓄積累，正財源源不絕。');
    advice.push(badStars.includes('地空') || badStars.includes('地劫') ? '💡【白話開運提醒】：見空劫星，手頭流動大。最好的化解法就是「強迫儲蓄」或把錢換成保值不動產，平時少看投機明牌。' : '💡【白話開運提醒】：善用滾雪球效應進行穩健配置，財富積少成多。');

  // 3. 事業升遷
  } else if (aspect === 'career') {
    title = modeText + ' 事業發展與職場升遷專論';
    scopeDesc = mode === 'original' ? '分析個人事業抱負、天賦行業性向、職場領導力與成就高度。' : mode === 'big_limit' ? '剖析這十年 (' + bigLimitRangeStr + '歲) 工作發展重點、跳槽升遷或開拓新局之機遇。' : '指引 ' + chart.targetYear + ' 年度考績升遷、職場人際、業務突破與工作壓力應對。';
    if (mode === 'original') {
      plainSummary = majorStars.length > 0 ? '【白話說給你聽】：在職場上你是屬於「' + (STAR_PLAIN_DESC[majorStars[0]]?.role || '實力派') + '」型人才！工作時最大的優勢是「' + (STAR_PLAIN_DESC[majorStars[0]]?.strength || '積極專注') + '」，只要找對能讓你展現主導權或發揮創意的舞台，成就不可限量。' : '【白話說給你聽】：你的官祿宮沒有主星，說明你在職場上身段柔軟、適應力極強。你適合跨界整合、擔任團隊的靈魂黏著劑，職場路走得越廣，價值越高。';
    } else if (mode === 'big_limit') {
      plainSummary = '【這十年事業大白話】：此步大限官祿宮坐落在本命【' + originalPalaceName + '】。這十年間是事業升級打怪的重要階段，容易有責任加重、掌權甚至轉型獨立創業的契機，扛住壓力就能站上新高點！';
    } else {
      plainSummary = '【今年工作運白話】：' + chart.targetYear + '年流年官祿宮進駐本命【' + originalPalaceName + '】。今年職場能見度提升，主動爭取重要專案容易被主管看見，遇事少抱怨、多提解決方案就是升遷密碼！';
    }
    if (majorStars.length === 0) {
      detailedExplanations.push('官祿宮無主星：職場生涯具靈活性，可多角化發展或擔任幕僚輔佐角色，宜跟隨具實力之領導者打拼。');
    } else {
      majorStars.forEach(star => {
        const docStar = (careerData.stars as any)[star];
        if (docStar && docStar.general) detailedExplanations.push(...docStar.general.slice(0, 3));
      });
    }
    advice.push('💡【白話開運提醒】：職場除了硬實力，口碑與情商更是推進器。多讚美團隊伙伴、把榮譽分給大家，升遷路上貴人自然源源不絕。');

  // 4. 讀書考試
  } else if (aspect === 'exam') {
    title = modeText + ' 讀書考試與功名檢定專論';
    scopeDesc = mode === 'original' ? '分析功名考運、證照檢定、求知學習效率與面試競試之先天優勢。' : mode === 'big_limit' ? '評估這十年 (' + bigLimitRangeStr + '歲) 求學深造、專業執照考取之機遇。' : '透視 ' + chart.targetYear + ' 年當年的升學面試、國考檢定與臨場應變。';
    
    // 檢查官祿宮及三方四正是否見科甲文星
    const careerPalace = palace; // 官祿宮
    const hasWenchang = minorStars.includes('文昌');
    const hasWenqu = minorStars.includes('文曲');
    const hasKui = minorStars.includes('天魁');
    const hasYue = minorStars.includes('天鉞');
    const hasKe = palace.majorStars.some(s => s.sihua === '科' || s.flowSihua === '科');
    const hasLu = palace.majorStars.some(s => s.sihua === '祿' || s.flowSihua === '祿') || minorStars.includes('祿存');
    const hasBadForExam = badStars.some(s => ['擎羊', '陀羅', '火星', '鈴星', '地空', '地劫', '化忌'].includes(s));

    if (mode === 'original') {
      if (hasWenchang || hasWenqu || hasKui || hasYue || hasKe) {
        const foundStars = [hasWenchang ? '文昌' : '', hasWenqu ? '文曲' : '', hasKui ? '天魁' : '', hasYue ? '天鉞' : '', hasKe ? '化科' : ''].filter(Boolean);
        plainSummary = '【考星得位白話說給你聽】：你的官祿宮直接坐守【' + foundStars.join('、') + '】！講義第十六章明確指出：「文昌、文曲、天魁、天鉞、化科等諸星對考試、讀書最為重要，諸星聚會力量愈強。」你理解力快、考前抓重點精準，大小考試與專業面試只要維持平穩心態，極易金榜題名！';
      } else if (majorStars.length > 0) {
        plainSummary = '【實力型應試白話說給你聽】：你的官祿宮坐守【' + majorStars.join('、') + '】，本宮雖無昌曲魁鉞，但自帶主星之剛毅耐力。講義指出你讀書不適合死記硬背，需要「理解背後邏輯」或「實務動手操作」才會開竅，憑藉扎實累積照樣能考取功名。';
      } else {
        plainSummary = '【彈性靈活備考白話說給你聽】：你的官祿宮無主星，讀書與考試環境容易受同儕氛圍影響。找自律的讀書夥伴或參加圖書館衝刺班，能大幅提升專注力。';
      }
    } else if (mode === 'big_limit') {
      plainSummary = '【這十年考運大白話】：此步大限官祿宮重疊在你的本命【' + originalPalaceName + '】。這十年間利於考取含金量高的專業證照或完成學業學位，累積的專業認證就是你下半場躍升的底氣。';
    } else {
      plainSummary = '【今年考運面試白話】：' + chart.targetYear + '年考運氣場聚焦於臨場發揮與心態調適。考前一週維持規律作息，面試時展現真誠自信，容易吸引考官青睞。';
    }

    // 核心提要（嚴格依據命盤星曜）
    if (hasWenchang || hasWenqu) keyHighlights.push('官祿宮會【' + (hasWenchang && hasWenqu ? '文昌、文曲' : hasWenchang ? '文昌' : '文曲') + '】：文筆思緒敏捷、理解吸收能力強，考運考風極佳。');
    if (hasKui || hasYue) keyHighlights.push('官祿宮逢【' + (hasKui && hasYue ? '天魁、天鉞' : hasKui ? '天魁' : '天鉞') + '】：應試得長官長輩提攜，臨場發揮容易得貴人相助。');
    if (hasKe) keyHighlights.push('官祿宮逢【化科星】：化科為正統科甲之神，主名譽聲望、利於各類公職考試與論文著作。');
    if (badStars.includes('地空') || badStars.includes('地劫')) keyHighlights.push('官祿宮見【空劫】：講義指出天空主煩惱想太多不利讀書，需防思緒飄忽，宜多做模擬題訓練定力。');
    if (badStars.includes('擎羊') || badStars.includes('陀羅')) keyHighlights.push('官祿宮見【羊陀】：容易粗心急躁或卡在難題鑽牛角尖，考試需注重時間分配。');

    // 講義如實精選斷語
    detailedExplanations.push('【講義考運精華原則】：講義第十六章指出「本命、運限之三方四正為論斷讀書考試的首要根據，以命宮、官祿宮影響力最強。吉星之外要注意凶星破壞力量，吉凶參半則過程辛苦，唯有恆心能克難」。');
    if (hasWenchang || hasWenqu) detailedExplanations.push('講義斷語：昌曲入官祿宮，主才思敏捷，文字組織與理解力過人，最利於文書、文職與法政筆試。');
    if (hasKui || hasYue) detailedExplanations.push('講義斷語：天魁天鉞為天乙貴人，主面試考官緣極佳，容易在面試與競賽中給評審留下端莊可靠的好印象。');
    if (!hasWenchang && !hasWenqu && !hasKui && !hasYue) detailedExplanations.push('講義指導：本宮未逢直接文星，代表考運並非僥倖型，功名完全取決於平日之踏實準備與實務累積，一分耕耘一分收穫。');

    advice.push('💡【白話開運提醒】：考前最忌熬夜打亂節奏。讀書時多利用「費曼學習法」講給自己聽，理解深透勝過死背十遍。');

  // 5. 買房田宅與祖業
  } else if (aspect === 'house') {
    title = modeText + ' 買房置產、家宅與祖業專論';
    scopeDesc = mode === 'original' ? '看祖產家業承襲、不動產購置運、居住環境與家庭安全感。' : mode === 'big_limit' ? '評析這十年 (' + bigLimitRangeStr + '歲) 內置產購屋、搬家裝修或房產增值契機。' : '觀察 ' + chart.targetYear + ' 當年買房租屋、居家修繕與家庭氣氛。';
    if (mode === 'original') {
      plainSummary = majorStars.includes('太陰') || majorStars.includes('天府') || majorStars.includes('武曲') ? '【白話說給你聽】：你是標準的「庫星入田宅」，自帶置產守財運！一生中很有機會買下屬於自己的舒適好房，房產會成為你最安心的金庫。' : '【白話說給你聽】：你的田宅星情重視「居住環境的舒適感與自由度」。買房不必好高騖遠，選生活機能方便、採光通風好的地段，住得開心運氣自然旺。';
    } else if (mode === 'big_limit') {
      plainSummary = '【這十年置產大白話】：大限田宅宮坐入本命【' + originalPalaceName + '】。這十年間置產動能強烈，有極高機率完成買房、換大屋或資產重組的願望，但要算好房貸現金流。';
    } else {
      plainSummary = '【今年家宅運白話】：' + chart.targetYear + '年田宅氣數變動，可能有搬家、重新裝潢布置或添置大型家電的計畫，多整理居家雜物能改善全家氣場。';
    }
    majorStars.forEach(star => {
      const docStar = (houseData.stars as any)[star];
      if (docStar) detailedExplanations.push(...docStar.slice(0, 2));
    });
    if (badStars.includes('火星') || badStars.includes('鈴星')) {
      keyHighlights.push('田宅宮見【火星/鈴星】：講義載明火星帶爆發力防散盡祖業，鈴星難守祖產，宜自力置產，不宜因祖業引發家族爭執。');
    }
    if (detailedExplanations.length === 0) detailedExplanations.push('田宅宮主不動產與藏財之庫。吉星入田宅主家宅興旺、能置房產；煞星入田宅需防修繕耗費或產權糾紛。');
    advice.push('💡【白話開運提醒】：家宅是元氣充電站。客廳保持明亮、玄關不堆雜物，財神與好運自然常常光臨。');

  // 6. 子女緣分與教育
  } else if (aspect === 'children') {
    title = modeText + ' 子女緣分、教育與親子專論';
    scopeDesc = mode === 'original' ? '分析子女先天個性格局、親子相處緣分、教育引導方針與晚年天倫之樂。' : mode === 'big_limit' ? '關注這十年 (' + bigLimitRangeStr + '歲) 的生育時機、子女升學成長及兩代溝通。' : '檢視 ' + chart.targetYear + ' 年度子女考運、親子互動與家庭和諧。';
    if (mode === 'original') {
      plainSummary = majorStars.length > 0 ? '【白話說給你聽】：你的孩子天生帶有「' + (STAR_PLAIN_DESC[majorStars[0]]?.role || '獨立獨特') + '」的特質，個性上「' + (STAR_PLAIN_DESC[majorStars[0]]?.strength || '很有主見') + '」。教育他們不能用強壓命令，多用「朋友般的平等討論」引導，孩子長大會非常有出息。' : '【白話說給你聽】：你的子女宮無主星，代表你對子女的期望非常開明隨和，不會把自己的框架硬套在孩子身上。給孩子自由探索的空間，兩代關係反而親密無間。';
    } else if (mode === 'big_limit') {
      plainSummary = '【這十年親子大白話】：此步大限子女宮落在本命【' + originalPalaceName + '】。這十年間子女成長變化迅速，是建立孩子價值觀與深層信任的黃金十年。多花時間陪伴傾聽，少嘮叨。';
    } else {
      plainSummary = '【今年子女運白話】：' + chart.targetYear + '年親子互動氣場活絡。今年多鼓勵孩子發揮所長，參加戶外活動或親子旅遊，能大幅增進兩代感情！';
    }
    majorStars.forEach(star => {
      const docStar = (childrenData.stars as any)[star];
      if (docStar) detailedExplanations.push(...docStar.slice(0, 2));
    });
    if (badStars.includes('天刑') || badStars.includes('陰煞')) {
      keyHighlights.push('子女宮見【天刑/陰煞】：兩代相處容易有些脾氣摩擦或操心相欠債。多用同理心溝通，給彼此空間，即能轉化業力。');
    }
    if (detailedExplanations.length === 0 && childrenData.general) detailedExplanations.push(...childrenData.general.slice(0, 3));
    advice.push('💡【白話開運提醒】：每個孩子都是獨立的花朵，花期各有不同。少做比較、多發掘孩子的獨特亮點，父母的信任是孩子最大的底氣。');

  // 7. 出外移居與貴人
  } else if (aspect === 'travel') {
    title = modeText + ' 出外遠行、移居與貴人專論';
    scopeDesc = mode === 'original' ? '分析出外機遇、移居留學運、外地貴人助力與交通出差安全。' : mode === 'big_limit' ? '推斷這十年 (' + bigLimitRangeStr + '歲) 換城市發展、出國進修或跨國業務之動能。' : '檢視 ' + chart.targetYear + ' 年度差旅遠行、對外社交與出入平安。';
    if (mode === 'original') {
      plainSummary = minorStars.includes('天馬') || majorStars.includes('太陽') || majorStars.includes('貪狼') ? '【白話說給你聽】：你是典型的「動則得咎、動則生財」！你適合多出外走動、出差甚至移居外地，外面的世界越大，你的舞台與貴人就越多。' : '【白話說給你聽】：你在外處事沉穩低調，適合在熟悉的環境中紮根深耕。出外旅遊或洽公以做好充分規劃為主，行事按部就班就能平安順遂。';
    } else if (mode === 'big_limit') {
      plainSummary = '【這十年出外運大白話】：此步大限遷移宮位氣場活躍，這十年間有強烈的驛馬動能，非常容易發生搬遷、出國留學、外派或跨區域開拓市場的機遇，大膽跨出舒適圈收穫豐碩！';
    } else {
      plainSummary = '【今年遠行出外白話】：' + chart.targetYear + '年出外能見度高。多外出拜訪客戶、拓展朋友圈容易有意外驚喜，出門開車走路遵守交通規則，平安順遂。';
    }
    majorStars.forEach(star => {
      const docStar = (travelData.stars as any)[star];
      if (docStar) detailedExplanations.push(...docStar.slice(0, 2));
    });
    if (detailedExplanations.length === 0 && travelData.general) detailedExplanations.push(...travelData.general.slice(0, 3));
    advice.push('💡【白話開運提醒】：讀萬卷書不如行萬里路。每當心境受限時，安排一趟短途小旅行或接觸新朋友，往往能瞬間打開靈感與運勢！');

  // 8. 精神福德與減壓
  } else if (aspect === 'blessing') {
    title = modeText + ' 心靈福德、精神品味與減壓專論';
    scopeDesc = mode === 'original' ? '透視精神世界、幸福感來源、潛意識壓力、休閒嗜好與晚年福報。' : mode === 'big_limit' ? '剖析這十年 (' + bigLimitRangeStr + '歲) 的心理狀態、抗壓韌性與身心靈平衡。' : '指引 ' + chart.targetYear + ' 年的情緒釋放、焦慮排解與心靈充電法門。';
    if (mode === 'original') {
      plainSummary = majorStars.includes('天同') || majorStars.includes('天梁') ? '【白話說給你聽】：你天生自帶「懂享受、有福報」的靈魂！遇到煩惱容易看開，喜歡有品味的生活。只要少鑽牛角尖，你的日子會過得比大部分人都更怡然自得。' : '【白話說給你聽】：你的責任心很強，常常把事情往自己身上攬，容易有「想太多、停不下來」的精神內耗。學會適度放手、給自己放空時間，幸福感會翻倍。';
    } else if (mode === 'big_limit') {
      plainSummary = '【這十年心靈大白話】：此步大限福德宮提醒你：這十年是滋養精神靈魂的關鍵階段。除了拼世俗成就，一定要培養一兩個能讓自己完全沉浸放鬆的興趣嗜好。';
    } else {
      plainSummary = '【今年福氣情緒白話】：' + chart.targetYear + '年情緒起伏較受外界人事影響。每週給自己安排「無手機干擾的靜心時間」，散步泡澡聽音樂，把元氣補滿。';
    }
    majorStars.forEach(star => {
      const docStar = (blessingData.stars as any)[star];
      if (docStar) detailedExplanations.push(...docStar.slice(0, 2));
    });
    if (detailedExplanations.length === 0 && blessingData.general) detailedExplanations.push(...blessingData.general.slice(0, 3));
    advice.push('💡【白話開運提醒】：境隨心轉，心平則萬事順。每天睡前在心裡感謝三件好事，能為你的氣場注入源源不絕的幸運頻率。');

  // 9. 人際交友與合夥
  } else if (aspect === 'friends') {
    title = modeText + ' 人際交友與合夥是非專論';
    scopeDesc = mode === 'original' ? '分析部屬員工關係、社交朋友圈助力、合夥合約得失與是非防範。' : mode === 'big_limit' ? '檢視這十年 (' + bigLimitRangeStr + '歲) 社交圈換血、貴人提攜或合夥合作之利弊。' : '指引 ' + chart.targetYear + ' 年的人際互動、防小人避是非之道。';
    if (mode === 'original') {
      plainSummary = badStars.length > 0 ? '【白話說給你聽】：你重情重義，但容易「交友不設防」。在人際或合夥上務必「親兄弟明算帳」，白紙黑字寫清楚，才不會真心換絕情。' : '【白話說給你聽】：你的人緣相當不錯，待人真誠和善。在朋友圈容易受到同儕喜愛，多參與高質量社群能帶來意想不到的機遇。';
    } else if (mode === 'big_limit') {
      plainSummary = '【這十年人際大白話】：此步大限朋友宮落在本命【' + originalPalaceName + '】。這十年間社交圈會大洗牌，會淘汰酒肉朋友，結識更多具備社會資源或志同道合的事業伙伴。';
    } else {
      plainSummary = '【今年社交運白話】：' + chart.targetYear + '年流年交友宮氣場活絡。拓展人脈能有新啟發，但合夥出資需格外審慎，務必留心合約條款與資金流向。';
    }
    majorStars.forEach(star => {
      const docStar = (friendsData.stars as any)[star];
      if (docStar) detailedExplanations.push(...docStar.slice(0, 2));
    });
    if (detailedExplanations.length === 0) detailedExplanations.push('奴僕宮為人際關係樞紐。吉星多主得部屬朋黨助力；煞星需防受人牽累或背後是非。');
    advice.push('💡【白話開運提醒】：社交重質不重量。學會拒絕無效社交，把時間留給懂你、支持你並能共同成長的優質好友。');

  // 10. 長輩父母與手足
  } else if (aspect === 'parents') {
    title = modeText + ' 長輩父母、長官貴人與手足情誼專論';
    scopeDesc = mode === 'original' ? '剖析與父母原生家庭緣分、長官主管提攜力、公家文書契約及手足平輩互動。' : mode === 'big_limit' ? '透視這十年 (' + bigLimitRangeStr + '歲) 與長輩相處、繼承家業及手足助力。' : '檢視 ' + chart.targetYear + ' 年度主管緣分、公文合約簽訂及家庭長輩安康。';
    if (mode === 'original') {
      plainSummary = minorStars.includes('天魁') || minorStars.includes('天鉞') || majorStars.includes('天梁') ? '【白話說給你聽】：你自帶強大的「長輩與長官貴人運」！在學校或職場上容易得到長輩疼愛與貴人賞識，遇困難多向長官或長輩請益，能迅速逢凶化吉。' : '【白話說給你聽】：你與長輩或手足相處上都很有自己的主見，有時容易因代溝或說話太直接而有摩擦。多用傾聽與關心代替爭辯，孝順父母就是最好的改運之道。';
    } else if (mode === 'big_limit') {
      plainSummary = '【這十年長上大白話】：此步大限父母宮落在本命【' + originalPalaceName + '】。這十年間長輩主管對你的事業決策影響深遠，同時也需多花心思關懷父母健康，陪伴是最好的孝敬。';
    } else {
      plainSummary = '【今年主管文書白話】：' + chart.targetYear + '年長官緣尚佳，各類合約、公家證照或印鑑簽署要看清細則條款，防範文書細節失誤。';
    }
    majorStars.forEach(star => {
      const docStar = (parentsData.stars as any)[star];
      if (docStar) detailedExplanations.push(...docStar.slice(0, 2));
    });
    if (detailedExplanations.length === 0 && parentsData.general) detailedExplanations.push(...parentsData.general.slice(0, 3));
    advice.push('💡【白話開運提醒】：百善孝為先。經常給父母一通關心的電話，父母的祝福往往是人生路上最強大的護身符。');

  // 11. 健康疾難
  } else if (aspect === 'health') {
    title = modeText + ' 健康疾難與身心保養專論';
    scopeDesc = mode === 'original' ? '分析先天體質強弱、五行臟腑保健重點、行運意外防範與日常養生之道。' : mode === 'big_limit' ? '關注這十年 (' + bigLimitRangeStr + '歲) 體能代謝變化、慢性疲勞預防與身心壓力調適。' : '警示 ' + chart.targetYear + ' 年日常保健、季節流行疾病預防與出入平安。';
    
    // 取得疾厄宮實際坐守主星、吉星、煞星
    const healthPalace = palace; // 疾厄宮
    const healthMajor = majorStars;
    const healthBad = badStars;

    if (mode === 'original') {
      if (healthMajor.length > 0) {
        plainSummary = '【先天體質白話說給你聽】：你的先天體質特質鮮明，顯示身體基因遺傳與臟腑機能強弱有專屬重點。平時需特別注重代謝循環（如脾胃消化、呼吸系統或心血管調節），維持良好運動習慣，避免長期過勞與熬夜積累成疾。';
      } else {
        plainSummary = '【先天體質白話說給你聽】：你的先天體質彈性大、適應力強，無特定頑疾基因；但抵抗力易受生活節奏與作息起伏影響，保持心情愉悅與規律作息是最佳良方。';
      }
    } else if (mode === 'big_limit') {
      plainSummary = '【這十年養生大白話】：此步大限疾厄宮提醒你：身體代謝開始進入新階段，少吃油膩重鹹、多喝水少喝含糖飲料，注重腸胃與睡眠品質是這十年的長壽密碼。';
    } else {
      plainSummary = '【今年健康運白話】：' + chart.targetYear + '年行運要注意作息規律，避免長時間低頭滑手機引起肩頸僵硬。出門開車走路多看一眼，平平安安就是最大的福氣。';
    }

    // 核心提要（依據疾厄宮實際星曜精準輸出）
    healthMajor.forEach(star => {
      keyHighlights.push('疾厄宮逢【' + star + '】：依五行歸屬，重點防護該星曜對應之臟腑機能與生活保養。');
    });
    if (healthBad.includes('擎羊')) keyHighlights.push('疾厄逢【擎羊】：講義明示防外傷疤痕、急性發炎或跌撞刀傷，見血光宜捐血化解。');
    if (healthBad.includes('陀羅')) keyHighlights.push('疾厄逢【陀羅】：防慢性病拖延、筋骨痠痛或牙齒脊椎毛病，日常宜多伸展運動。');
    if (healthBad.includes('火星') || healthBad.includes('鈴星')) keyHighlights.push('疾厄逢【火鈴】：防火氣旺盛、皮膚過敏或急性發燒發炎，飲食宜清淡避燥熱。');
    if (healthBad.includes('天刑')) keyHighlights.push('疾厄逢【天刑】：講義指出天刑在疾厄防外傷手術或肢體傷殘，平時多捐血布施。');
    if (healthBad.includes('陰煞')) keyHighlights.push('疾厄逢【陰煞】：容易小病不斷、易遇誤診，除了醫療治療外宜多行善積陰德迴向。');

    // 講義專論深度斷語解說（僅輸出命中真實存在的星曜）
    detailedExplanations.push('【講義疾厄專論總綱】：講義第十七章指出：「疾厄宮顯示身體健康、疾病與基因遺傳。研判先天體質除了檢視疾厄宮外，亦應參看對宮父母宮（父母遺傳基因）及命宮、福德宮作綜合研判。」');
    if (healthMajor.length > 0) {
      healthMajor.forEach(star => {
        const starItems = (healthData.stars as any)?.[star];
        if (starItems && starItems.length > 0) {
          detailedExplanations.push(...starItems.slice(0, 2));
        }
      });
    } else {
      detailedExplanations.push('疾厄宮無主星：借對宮（父母宮）星曜合參。平日注意季節交替免疫力變化，防患於未然。');
    }

    advice.push('💡【白話開運提醒】：早起一杯溫開水，每天抽空快走20分鐘，善待你的身體，它就會回報你滿滿的精神活力。');

  // 12. 宗教玄學與修行因果
  } else if (aspect === 'religion') {
    title = modeText + ' 宗教玄學、修行天命與因果業力專論';
    scopeDesc = mode === 'original' ? '依據講義專論，深入解析個人命盤之仙佛神緣、修行悟性、前世相欠債(陰煞業力)與祖德因果回饋。' : mode === 'big_limit' ? '透視這十年 (' + bigLimitRangeStr + '歲) 的性靈成長契機、善緣化解阻礙與布施功德。' : '指引 ' + chart.targetYear + ' 年的心靈沉澱、祈福安太歲與轉化磁場方法。';
    
    // 精確尋找命宮與身宮
    const originalLifePalace = chart.palaces[chart.originalLifeIndex];
    const bodyPalace = chart.palaces.find(p => p.isBodyPalace) || originalLifePalace;

    // 檢查天刑是否坐守「命宮」或「身宮」
    const tianxingInLife = originalLifePalace.badStars.some(s => s.name === '天刑');
    const tianxingInBody = bodyPalace.badStars.some(s => s.name === '天刑');
    const tianxingInLifeOrBody = tianxingInLife || tianxingInBody;

    // 檢查陰煞是否坐守「命宮」或「身宮」
    const yinshaInLife = originalLifePalace.badStars.some(s => s.name === '陰煞');
    const yinshaInBody = bodyPalace.badStars.some(s => s.name === '陰煞');

    // 尋找天刑與陰煞所在宮位
    const tianxingPalace = chart.palaces.find(p => p.badStars.some(s => s.name === '天刑'));
    const yinshaPalace = chart.palaces.find(p => p.badStars.some(s => s.name === '陰煞'));

    // 慧根玄學星曜
    const hasHuagai = originalLifePalace.minorStars.some(s => s.name === '華蓋') || bodyPalace.minorStars.some(s => s.name === '華蓋');
    const hasKongJie = originalLifePalace.badStars.some(s => s.name === '地空' || s.name === '地劫') || bodyPalace.badStars.some(s => s.name === '地空' || s.name === '地劫');
    const hasTianliangKongjie = (originalLifePalace.majorStars.some(s => s.name === '天梁') && hasKongJie) || (bodyPalace.majorStars.some(s => s.name === '天梁') && hasKongJie);
    const hasTanlangKongjie = (originalLifePalace.majorStars.some(s => s.name === '貪狼') && hasKongJie) || (bodyPalace.majorStars.some(s => s.name === '貪狼') && hasKongJie);
    const hasTianji = originalLifePalace.majorStars.some(s => s.name === '天機') || bodyPalace.majorStars.some(s => s.name === '天機');

    // 1. 白話總結：全面剖析「仙佛天命（天刑）」與「前世冤親債主業障（陰煞）」，講真話、不避諱
    if (mode === 'original') {
      const summaries: string[] = [];

      // (A) 陰煞星：前世業障與冤親債主討債宮位（講義第三章最重磅篇幅）
      if (yinshaInLife || yinshaInBody) {
        summaries.push(`【前世業力・冤親債主入${yinshaInLife ? '命宮' : '身宮'}】：講義第三章明確記載：「陰煞主一生中的業障所在，也就是前世所欠、今生須償還的債，陰煞被定位為小人星，其實就是冤親債主！」陰煞坐入命身，代表前世帶來較深的心靈疑障與因果牽絆，容易生性多疑、瞻前顧後、容易自尋煩惱，甚至身體虛弱時容易精神恍惚或做惡夢。講義強調此格「最需要修行」，凡事光明磊落、多做不求回報的陰德布施，以「甘願受、歡喜還」的心態面對人際是非，才能化解冤親債主糾纏。`);
      } else if (yinshaPalace) {
        const ysDesc = (religionData.yinsha.palaces as any)[yinshaPalace.name] || '主該宮位容易莫名遇小人暗害或前世相欠債。';
        summaries.push(`【前世因果討債點在【${yinshaPalace.name}】】：你的陰煞星坐入【${yinshaPalace.name}】。講義第三章明示：「陰煞所在的宮位，就是此生來向你討債的宮位，是先天因果業力帶來的煩惱焦點！」在【${yinshaPalace.name}】領域你容易覺得付出多卻被拖累、自覺選錯人或受小人暗算（${ysDesc}）。明白這是前世相欠債，此處就是你今生修忍辱與化解宿怨的「修行道場」。`);
      }

      // (B) 天刑星：仙佛天命與神界執法宿命
      if (tianxingInLifeOrBody) {
        summaries.push(`【仙佛天命・神界執法宿命】：你的【${tianxingInLife ? '命宮' : '身宮'}】逢【天刑星】坐守！講義第三章明確記載：「天刑之靈電與仙佛有因緣，或為仙佛轉世，又或為仙佛受業報而落入凡塵；天刑單守命身宮，常具有特殊感應能力，不乏具神通力量者，且容易留有前世記憶。」你天生直覺敏銳、富有俠義正義感；但講義亦嚴厲警告：天刑入命身者性格過硬、說話太衝易惹官非是非，必須以正信佛法柔和修心修口，切莫仗著感應自傲。`);
      } else if (tianxingPalace) {
        summaries.push(`【仙佛紀律執法在【${tianxingPalace.name}】】：天刑星坐入【${tianxingPalace.name}】。代表你將天刑的「嚴明因果、原則紀律與責任感」投射在此宮位，眼裡容不下沙子、講求絕對公平，但也需防過度嚴苛引發人際摩擦或官司是非。`);
      }

      // (C) 慧根玄骨（華蓋、空劫、天梁、天機）
      if (hasHuagai || hasKongJie || hasTianliangKongjie || hasTanlangKongjie || hasTianji) {
        const comboName = hasHuagai ? '華蓋' : hasTianliangKongjie ? '天梁會空劫' : hasTanlangKongjie ? '貪狼會空劫' : hasTianji ? '天機星' : '地空地劫';
        summaries.push(`【玄學仙骨與哲學慧根】：命身見【${comboName}】！講義第十章指出「命逢空劫者名利空虛，修行可減其凶；天梁貪狼見空劫者看透世俗，是為僧道仙風之命」。你對人生真諦、哲理佛法與玄學五術具有極高的領悟力，智慧不落世俗。`);
      }

      // 若命盤平穩
      if (summaries.length === 0) {
        summaries.push('【腳踏實地修心白話說給你聽】：講義第八章強調「福德宮是前世因所造的今生果，修行是調整性格、打破命定唯一的方法」。你的命盤在靈性上講求務實，不需要追求神秘感應或盲目通靈；把人做好、孝順父母、慈悲待人，就是最踏實的因果功德護城河。');
      }

      plainSummary = summaries.join('\n\n');
    } else if (mode === 'big_limit') {
      plainSummary = '【這十年性靈因果大白話】：此步大限行運引動因果氣數。講義指出大限行至玄學、煞曜或陰煞宮位時，是化解宿世業債、沉澱心性、提升智慧的黃金十年。非常適合研讀正信佛法、修持經咒或布施利他，以修行的慈悲心化解世俗的奔波與摩擦。';
    } else {
      plainSummary = '【今年開運祈福白話】：' + chart.targetYear + '年心靈磁場轉化。講義提醒流年行運逢煞曜或陰煞時，心思容易敏感浮躁、易招小人暗害；切忌去磁場不良場所，在家中安奉祖先、多行暗德布施，即能逢凶化吉。';
    }

    // 2. 核心提要（Highlights）
    if (tianxingPalace) {
      const txDesc = (religionData.tianxing.palaces as any)[tianxingPalace.name] || '性格剛直負責，需防原則過硬引發是非。';
      if (tianxingInLifeOrBody) {
        keyHighlights.push('📌 仙佛轉世宿命：【天刑星】坐入本命【' + tianxingPalace.name + '】— 靈電通天、直覺感應敏銳，帶有仙佛執法或修行天命。');
      } else {
        keyHighlights.push('📌 仙佛執法定位：【天刑星】坐入本命【' + tianxingPalace.name + '】— ' + txDesc);
      }
    }

    if (yinshaPalace) {
      const ysDesc = (religionData.yinsha.palaces as any)[yinshaPalace.name] || '主該宮位容易莫名遇小人暗害或前世相欠債。';
      keyHighlights.push('📌 前世業障冤親債主定位：【陰煞星】坐入本命【' + yinshaPalace.name + '】— ' + ysDesc);
    }

    // 3. 講義專論深度斷語解說（Detailed Explanations）- 如實精準對照
    if (tianxingInLifeOrBody) {
      detailedExplanations.push(religionData.tianxing.nature);
      detailedExplanations.push(religionData.tianxing.supernatural);
      detailedExplanations.push(religionData.tianxing.positive);
      detailedExplanations.push(religionData.tianxing.negative);
    } else if (tianxingPalace) {
      detailedExplanations.push('【天刑星坐守' + tianxingPalace.name + '釋義】：講義第三章指出天刑主刑傷、原則與業力因果。天刑未入命身，代表命主並非自帶仙佛轉世或特殊神通之體質，但天刑坐入【' + tianxingPalace.name + '】，在此宮位表現出極強的執法魄力、剛直不阿；若逢煞星，則須防因原則太硬招致官非是非。');
    }

    if (yinshaPalace) {
      if (yinshaInLife || yinshaInBody) {
        detailedExplanations.push(religionData.yinsha.nature);
        detailedExplanations.push(religionData.yinsha.symptoms);
      } else {
        detailedExplanations.push('【陰煞星入' + yinshaPalace.name + '釋義】：講義第三章明確記載：「陰煞主一生中的業障所在，也就是前世所欠、今生須償還的債（冤親債主）。」陰煞入【' + yinshaPalace.name + '】，代表此領域是命主今生修忍辱與化解宿怨的重點功課。');
      }
    }

    // 對照祖先因果（嚴格對照命主實際宮位）
    const housePalace = chart.palaces.find(p => p.name === '田宅宮');
    const spousePalace = chart.palaces.find(p => p.name === '夫妻宮');
    const blessingPalace = chart.palaces.find(p => p.name === '福德宮');

    detailedExplanations.push(religionData.ancestor_karma.nature);

    // 檢查紫府 / 七殺仰斗
    const hasZiFu = originalLifePalace.majorStars.some(s => s.name === '紫微') && originalLifePalace.majorStars.some(s => s.name === '天府');
    const hasQishaYangdou = originalLifePalace.majorStars.some(s => s.name === '七殺') && (originalLifePalace.earthBranch === '寅' || originalLifePalace.earthBranch === '申');
    if (hasZiFu || hasQishaYangdou) {
      detailedExplanations.push('【' + religionData.ancestor_karma.patterns[0].name + '】：' + religionData.ancestor_karma.patterns[0].desc);
    }

    // 檢查田宅火鈴
    if (housePalace && (housePalace.badStars.some(s => s.name === '火星' || s.name === '鈴星' || s.name === '地空' || s.name === '地劫') || housePalace.majorStars.some(s => s.name === '破軍'))) {
      detailedExplanations.push('【' + religionData.ancestor_karma.patterns[1].name + '】：' + religionData.ancestor_karma.patterns[1].desc);
    }

    // 檢查夫妻祿存單守或刑煞夾
    if (spousePalace && spousePalace.minorStars.some(s => s.name === '祿存') && spousePalace.majorStars.length === 0) {
      detailedExplanations.push('【' + religionData.ancestor_karma.patterns[2].name + '】：' + religionData.ancestor_karma.patterns[2].desc);
    }

    // 檢查相符的仙骨修行組合
    religionData.spiritual_combos.forEach(c => {
      let matched = false;
      if (c.name.includes('天梁遇空劫') && hasTianliangKongjie) matched = true;
      if (c.name.includes('貪狼遇空劫') && hasTanlangKongjie) matched = true;
      if (c.name.includes('天機') && hasTianji) matched = true;
      if (c.name.includes('命逢空劫') && hasKongJie) matched = true;
      if (matched) {
        detailedExplanations.push('【' + c.name + '】：' + c.desc);
      }
    });

    // 4. 行動指引與改進建議
    religionData.learning_advice.action_guide.forEach(guide => {
      advice.push(guide);
    });

    // 5. 致命盲點與改進功課（如實對照命中星曜）
    if (tianxingInLifeOrBody) {
      blindSpots.push('【天刑修持致命盲點】：性情孤僻剛愎、自命不凡、眼中容不下沙子，言語如刀常刺傷至親，容易自以為帶天命而狂妄迷失，最忌捲入官司刑訟與人際決裂。');
      improvements.push('【天刑自省功課】：修持「柔和忍辱」心態，得理且饒人；明白真正的高人深藏不露，將剛烈化為自律，將銳氣化為慈悲。');
    } else if (tianxingPalace) {
      blindSpots.push('【天刑在' + tianxingPalace.name + '之盲點】：在【' + tianxingPalace.name + '】之事務上要求過於苛刻死板、缺乏彈性，容易因直言不諱或原則過硬引發紛爭。');
      improvements.push('【' + tianxingPalace.name + '處事改進】：待人多留退路、就事論事但語氣柔軟，不要動輒上綱上線，以和為貴。');
    }

    if (yinshaInLife || yinshaInBody) {
      blindSpots.push('【陰煞疑障致命盲點】：疑心病過重、遇逆境容易自怨自艾，深陷「別人欠我、前世欠債」的受害者心態，多夢驚懼、內耗意志。');
      improvements.push('【陰煞解厄功課】：斷除疑根，凡事光明磊落；以「歡喜受、甘願還」之心面對世俗委屈，多做無求布施，消除無形宿怨。');
    } else if (yinshaPalace) {
      blindSpots.push('【' + yinshaPalace.name + '業障盲點】：在【' + yinshaPalace.name + '】領域容易心生猜忌、犯小人暗害或自覺付出多收穫少。');
      improvements.push('【' + yinshaPalace.name + '解怨改進】：視該宮位之逆境為「了結前世業債」，多付出不求回報，以誠待人轉化磁場。');
    }

    if (hasKongJie) {
      blindSpots.push('【空劫漂泊致命盲點】：容易消極遁世、眼高手低，在現實生活中缺乏腳踏實地的耐力，藉由追求神秘玄學逃避社會責任。');
      improvements.push('【空劫落地功課】：佛法在世間、不離世間覺；修行先從把本職工作做好、照顧好家庭做起，戒除空想投機。');
    }

    if (housePalace && (housePalace.badStars.some(s => s.name === '火星' || s.name === '鈴星'))) {
      blindSpots.push('【祖先家運阻礙】：田宅宮逢火鈴，講義明示祖業難守、祖產易惹糾紛，祖德若未積厚，家宅易有火躁不安之象。');
      improvements.push('【慎終追遠功課】：多孝敬在世長輩，並在佛堂寺廟為歷代祖先虔誠立牌超薦，以孝道積德平息家運爭端。');
    }

  // 13. 整體格局 (destiny)
  } else if (aspect === 'destiny') {
    title = modeText + ' 先天格局與綜合評述';
    scopeDesc = mode === 'original' ? '綜合三方四正、主星分佈、五行局氣數與命中吉凶格局之總綱。' : mode === 'big_limit' ? '總結這十年 (' + bigLimitRangeStr + '歲) 的行運主軸與人生轉折關鍵方向。' : '統整 ' + chart.targetYear + ' 年度的運勢高低潮與乘風破浪之操作心法。';
    const lifeMajor = chart.palaces[chart.originalLifeIndex].majorStars.map(s => s.name);
    if (mode === 'original') {
      plainSummary = lifeMajor.length > 0 ? '【白話說給你聽】：你是個「' + lifeMajor.map(m => (STAR_PLAIN_DESC[m]?.role || m).replace(/星/g, '')).join('兼具') + '」特質鮮明的人！內在性格有「' + lifeMajor.map(m => STAR_PLAIN_DESC[m]?.strength || '堅定信念').join('，且') + '」，人生只要方向確定、發揮天賦優勢，不畏短期挫折，終能成就一番格局。' : '【白話說給你聽】：你屬於「處事圓融、海納百川、大器晚成」的格局。你最大的優點是適應力極快、能屈能伸，擅長在不同環境與團隊中找到最佳生存之道！';
    } else if (mode === 'big_limit') {
      plainSummary = '【這十年人生大白話】：此步大限主星得力，是人生承上啟下的核心大運。這十年專注打磨你的核心專業與個人品牌，累積的資源將讓你下一個十年更輕鬆！';
    } else {
      plainSummary = '【今年全盤運勢白話】：' + chart.targetYear + '年流年氣場轉換。今年做事講求「穩字當頭、看準再出手」，好運來時大膽把握，遇到卡關時當作沉澱學習，整年運勢漸入佳境！';
    }
    keyHighlights.push('命坐【' + chart.palaces[chart.originalLifeIndex].earthBranch + '】宮，局屬【' + chart.fiveElementsBureau + '】，命主【' + chart.destinyMaster + '】，身主【' + chart.bodyMaster + '】。');
    if (lifeMajor.length > 0) keyHighlights.push('命宮坐守【' + lifeMajor.join('、') + '】，展現其特有之性格風骨與處事魄力。');

    // 嚴格比對講義第十章名宿吉凶格局
    const lifeP = chart.palaces[chart.originalLifeIndex];
    const oppoP = chart.palaces[(chart.originalLifeIndex + 6) % 12];
    const tri1P = chart.palaces[(chart.originalLifeIndex + 4) % 12];
    const tri2P = chart.palaces[(chart.originalLifeIndex + 8) % 12];
    const SanFangMajor = [...lifeP.majorStars, ...oppoP.majorStars, ...tri1P.majorStars, ...tri2P.majorStars].map(s => s.name);
    const SanFangMinor = [...lifeP.minorStars, ...oppoP.minorStars, ...tri1P.minorStars, ...tri2P.minorStars].map(s => s.name);
    const SanFangBad = [...lifeP.badStars, ...oppoP.badStars, ...tri1P.badStars, ...tri2P.badStars].map(s => s.name);

    const matchedPatterns: string[] = [];

    // 1. 七殺朝斗 / 仰斗格 (寅申宮七殺守命，對宮紫府)
    if (lifeMajor.includes('七殺') && (lifeP.earthBranch === '寅' || lifeP.earthBranch === '申')) {
      matchedPatterns.push('【七殺朝(仰)斗格】：七殺守命在' + lifeP.earthBranch + '宮，對宮紫微天府。講義載明此格富貴兼備、有將帥之才與開拓魄力；但若遇煞星沖破則成敗起伏，需防衝動。');
    }
    // 2. 極向離明格 (紫微在午宮守命)
    if (lifeMajor.includes('紫微') && lifeP.earthBranch === '午') {
      matchedPatterns.push('【極向離明格】：紫微居午宮入廟守命，人格高尚、有威儀氣度，若無煞星沖破主大貴。');
    }
    // 3. 日月同臨格 (丑未宮日月同守命)
    if (lifeMajor.includes('太陽') && lifeMajor.includes('太陰') && (lifeP.earthBranch === '丑' || lifeP.earthBranch === '未')) {
      matchedPatterns.push('【日月同臨格】：太陽太陰同守命於' + lifeP.earthBranch + '宮，年少聰穎、名利雙收；但日月同宮亦主心思多變，宜有恆心。');
    }
    // 4. 水澄桂萼格 (天同太陰在子宮)
    if (lifeMajor.includes('天同') && lifeMajor.includes('太陰') && lifeP.earthBranch === '子') {
      matchedPatterns.push('【水澄桂萼格】：天同太陰在子宮入廟，瀟灑秀麗、外緣極佳，得異性貴人助力，富貴福澤深厚。');
    }
    // 5. 命無正曜格 (命宮無主星)
    if (lifeMajor.length === 0) {
      matchedPatterns.push('【命無正曜格】：命宮無十四主星。講義指出此格幼年時多奔波或適應環境力強，借對宮星曜安身立命，處事圓融海納百川。');
    }
    // 6. 命逢空劫格
    if (lifeP.badStars.some(s => s.name === '地空' || s.name === '地劫')) {
      matchedPatterns.push('【命逢空劫】：命宮見地空或地劫。講義指出名利世俗心較淡，天馬行空有創意；修行、五術、哲學或專門技術可逢凶化吉。');
    }
    // 7. 馬頭帶劍格 (午宮擎羊)
    if (lifeP.earthBranch === '午' && lifeP.badStars.some(s => s.name === '擎羊')) {
      matchedPatterns.push('【馬頭帶劍格】：午宮安命逢擎羊，性情剛烈勇猛，敢衝敢拼；需防血光傷災與脾氣暴烈，宜習一技之長以柔化剛。');
    }

    if (matchedPatterns.length > 0) {
      matchedPatterns.forEach(pat => {
        keyHighlights.push('格局驗證：' + pat);
        detailedExplanations.push(pat);
      });
    } else {
      detailedExplanations.push('【三方四正氣數】：命宮主星配合三方四正會聚，性格穩定扎實，不走偏門，步步為營可成大器。');
    }

    detailedExplanations.push('【講義論命總綱】：講義第十章指出「性格決定命運，知命者乃在順應天時、發揮天賦，遇吉不驕、臨險知止。調整性格有賴修行，打破命定唯在覺悟與自律」。');
    advice.push('💡【白話開運提醒】：人生沒有永遠的逆境，也沒有不費吹灰之力的順境。了解自己的星盤，就是為了在對的時間做對的決定！');
  } else if (aspect === 'xuankong') {
    // 🔀 玄空飛星（情之所鍾・動態因果與執念）
    title = '玄空四化飛星（後天心念、情之所鍾與因果受災點）';
    scopeDesc = '生年四化為「先天業力與配備」，宮干玄空四化則為「後天主觀執著、心力付出與動態連鎖反應」。命宮化忌為命主最看不開的「癡情忌」，化忌所入之宮並非最傷，對宮「被沖破」才是後天受害重災區！';

    // 1. 命宮玄空四化
    const lifePalaceFlying = calculatePalaceFlyingSihua(chart, chart.originalLifeIndex);
    const lifeTargets = lifePalaceFlying.targets;

    plainSummary = `命主情之所鍾在【${lifeTargets.lu.toPalaceName}】（心甘情願付出${lifeTargets.lu.star}祿），但後天最大執念與盲點落在【${lifeTargets.ji.toPalaceName}】（${lifeTargets.ji.star}癡情忌）。此執著如同雙刃劍，直接沖擊震盪了【${lifeTargets.ji.clashPalaceName}】！`;

    keyHighlights.push(`命宮發射干【${lifePalaceFlying.fromPalaceStem}】：祿入【${lifeTargets.lu.toPalaceName}】、權入【${lifeTargets.quan.toPalaceName}】、科入【${lifeTargets.ke.toPalaceName}】、忌入【${lifeTargets.ji.toPalaceName}】`);
    keyHighlights.push(`致命盲點【癡情忌】：化忌入【${lifeTargets.ji.toPalaceName}】，反向直沖【${lifeTargets.ji.clashPalaceName}】！`);

    detailedExplanations.push(`【命主情之所鍾（命祿入${lifeTargets.lu.toPalaceName}）】：命宮宮干${lifePalaceFlying.fromPalaceStem}使${lifeTargets.lu.star}化祿飛入${lifeTargets.lu.toPalaceName}。講義指出：命祿入之宮，代表命主一生最心甘情願為該領域奉獻，不計代價與回報，在此處最容易結善緣、獲得歡喜心。`);
    detailedExplanations.push(`【命主掌控舞台（命權入${lifeTargets.quan.toPalaceName}）】：${lifeTargets.quan.star}化權飛入${lifeTargets.quan.toPalaceName}。代表命主在${lifeTargets.quan.toPalaceName}展現出最強的支配慾望與企圖心，想要說了算、不服輸，是命主後天奮力爭取主導權的焦點。`);
    detailedExplanations.push(`【命主體面名聲（命科入${lifeTargets.ke.toPalaceName}）】：${lifeTargets.ke.star}化科飛入${lifeTargets.ke.toPalaceName}。命主在此宮位講究體面斯文、重名譽聲望，容易得到該宮位人事的心靈慰藉與斯文貴人相挺。`);
    detailedExplanations.push(`【命主癡情忌與盲點（命忌入${lifeTargets.ji.toPalaceName}）】：命宮使${lifeTargets.ji.star}化忌飛入${lifeTargets.ji.toPalaceName}。講義專論特別強調：「命宮化忌入某宮，是為癡情忌，代表命主一生的心念、牽掛與執著焦點所在，看似關心，實則因愛之深而責之切，往往造成沉重心理負擔而弄巧成拙」。`);
    detailedExplanations.push(`【骨牌受災點（直沖${lifeTargets.ji.clashPalaceName}）】：忌入${lifeTargets.ji.toPalaceName}，力量直接放射沖破對宮【${lifeTargets.ji.clashPalaceName}】！這是全盤最嚴重的後天動態漏洞。往往因為命主過度緊盯${lifeTargets.ji.toPalaceName}，反而導致${lifeTargets.ji.clashPalaceName}的資源耗損、甚至無心經營而全面潰敗。`);

    // 2. 核心三宮（夫妻、財帛、官祿）飛忌追查
    const spouseP = chart.palaces.find(p => p.name === '夫妻宮');
    if (spouseP) {
      const spouseFlying = calculatePalaceFlyingSihua(chart, spouseP.index);
      detailedExplanations.push(`【夫妻宮飛忌溯源】：夫妻宮干【${spouseFlying.fromPalaceStem}】化忌入【${spouseFlying.targets.ji.toPalaceName}】（沖【${spouseFlying.targets.ji.clashPalaceName}】）。講義解析：若夫妻化忌入命宮，是配偶強加壓力於我；若化忌入財帛或田宅，婚姻裂痕多因錢財家產理念不合所致。`);
    }

    const wealthP = chart.palaces.find(p => p.name === '財帛宮');
    if (wealthP) {
      const wealthFlying = calculatePalaceFlyingSihua(chart, wealthP.index);
      detailedExplanations.push(`【財帛宮飛忌溯源（財庫漏點）】：財帛宮干【${wealthFlying.fromPalaceStem}】化忌入【${wealthFlying.targets.ji.toPalaceName}】（沖【${wealthFlying.targets.ji.clashPalaceName}】）。此為命主錢財最主要的後天損耗流向，需特別留意在此領域投資或借貸引發的財務黑洞。`);
    }

    const careerP = chart.palaces.find(p => p.name === '官祿宮');
    if (careerP) {
      const careerFlying = calculatePalaceFlyingSihua(chart, careerP.index);
      detailedExplanations.push(`【官祿宮飛忌溯源（事業瓶頸）】：官祿宮干【${careerFlying.fromPalaceStem}】化忌入【${careerFlying.targets.ji.toPalaceName}】（沖【${careerFlying.targets.ji.clashPalaceName}】）。代表事業打拼過程中最容易被牽絆或感到心力交瘁的環節。`);
    }

    // 3. 自化盤點
    const allSelf = calculateAllSelfSihua(chart);
    if (allSelf.length > 0) {
      const selfNames = allSelf.map(s => `【${s.palaceName}】${s.star}自化${s.sihua}`).join('、');
      keyHighlights.push(`盤中自化現象：${selfNames}`);
      detailedExplanations.push(`【全盤自化現象解析】：命盤中出現${selfNames}。講義第十九章指出：自化祿代表福報容易不自覺流失享受掉；自化忌則代表自尋煩惱、自我內耗消散，雖然對外宮殺傷力小，但容易缺乏堅持的恆心，需靠自律守成。`);
    } else {
      detailedExplanations.push('【無自化穩定格局】：命盤各宮無明顯同宮自化現象，各宮氣數能穩定留存，不輕易無端散佚。');
    }

    // 尖銳盲點與修為指引
    blindSpots.push(`【癡情忌致命盲點】：您對【${lifeTargets.ji.toPalaceName}】有過強的掌控欲與患得患失，常常以「我都是為了你好」的強加心態去要求對方或該領域，反而逼得對方窒息想逃！`);
    blindSpots.push(`【連鎖沖擊受災】：因為您對${lifeTargets.ji.toPalaceName}過度投入心力與執念，導致【${lifeTargets.ji.clashPalaceName}】長期被忽視或慘遭沖破，這是您人生後天最容易破產或翻車的盲區。`);

    improvements.push(`學會對【${lifeTargets.ji.toPalaceName}】學會「手放開」與尊重邊界，把要求別人的心力收回來提升自己。`);
    improvements.push(`全力防守補強被沖破的【${lifeTargets.ji.clashPalaceName}】，設定具體的備援保護機制，不要因小失大。`);

    advice.push(`💡【玄空解鎖】：玄空四化是「心念與因果的顯化」，它不是宿命。當您覺察並放下對【${lifeTargets.ji.toPalaceName}】的執取心，被沖的【${lifeTargets.ji.clashPalaceName}】自然回穩，後天運勢便能翻轉！`);
  }

  // 自動根據坐守主星、煞星與面向，提煉「個性致命傷與改進指引（講壞的、講真話）」
  if (majorStars.length > 0) {
    majorStars.forEach(star => {
      const flawInfo = (starFlaws as any)[star];
      if (flawInfo) {
        // 針對特定面向挑選最尖銳的盲點
        let specificFlaw = flawInfo.general;
        if (aspect === 'marriage' && flawInfo.marriage) specificFlaw = flawInfo.marriage;
        else if (aspect === 'wealth' && flawInfo.wealth) specificFlaw = flawInfo.wealth;
        else if (aspect === 'career' && flawInfo.career) specificFlaw = flawInfo.career;
        
        blindSpots.push('【' + star + '之隱患】：' + specificFlaw);
        if (flawInfo.fix && !improvements.includes(flawInfo.fix)) {
          improvements.push('針對【' + star + '】：' + flawInfo.fix);
        }
      }
    });
  } else {
    blindSpots.push('【無主星借對宮】：主見較弱，容易受到身邊強勢親友或環境牽著鼻子走，優柔寡斷而錯失良機。');
    improvements.push('培養獨立思考與斷捨離的魄力，重要決定不要盲目跟風或推託責任。');
  }

  // 煞星衝破之尖銳提醒
  if (badStars.includes('擎羊')) {
    blindSpots.push('【擎羊衝破】：性情急躁衝動、缺乏耐性，一生氣容易撕破臉掀桌子，殺敵一千自損八百。');
    improvements.push('克制暴躁脾氣，爭執時強迫自己閉嘴退開五分鐘，少說狠話。');
  }
  if (badStars.includes('陀羅')) {
    blindSpots.push('【陀羅暗纏】：習慣拖延、遇事鑽牛角尖暗中生悶氣，缺乏快刀斬亂麻的決斷力，容易內耗成疾。');
    improvements.push('破除拖延惰性，凡事給自己設定期限；有意見當面坦率溝通，拒絕冷暴力。');
  }
  if (badStars.includes('地空') || badStars.includes('地劫')) {
    blindSpots.push('【空劫干擾】：行事憑感覺不按牌理出牌，容易突發奇想投機冒險，導致財來財去、功虧一簣。');
    improvements.push('落實預算控制與止損機制，杜絕一切投機冒險，腳踏實地積累。');
  }
  if (badStars.includes('陰煞')) {
    blindSpots.push('【陰煞業障】：多疑善妒、容易胡思亂想自寻煩惱，在該宮位容易莫名遇小人暗害或相欠債。');
    improvements.push('至誠反省懺悔，遇逆境當作消業解怨，多行暗德、持咒念佛轉化磁場。');
  }
  if (badStars.includes('天刑')) {
    blindSpots.push('【天刑化剋】：性格孤傲不群、原則過硬缺乏彈性，容易因說話太衝招致是非甚至官非刑傷。');
    improvements.push('學會柔軟圓融，得理且饒人；凡事多留退路給別人，以柔克剛。');
  }
  if (badStars.includes('火星')) {
    blindSpots.push('【火星暴躁】：性急如火、缺乏耐性，脾氣一來口無遮欄容易傷人，易因一時衝動壞了大局。');
    improvements.push('遇事強迫自己「延遲反應三秒」，深呼吸緩和心律，戒急用忍。');
  }
  if (badStars.includes('鈴星')) {
    blindSpots.push('【鈴星陰悶】：心思過度深沉、容易暗中記恨生悶氣，長期憋在心裡引發精神內耗與暗疾。');
    improvements.push('學習坦率溝通，心中有不滿及時溫和說出，常行寬恕，不讓怨氣沉積在心。');
  }
  if (badStars.includes('孤辰') || badStars.includes('寡宿')) {
    const starName = badStars.includes('孤辰') ? '孤辰' : '寡宿';
    blindSpots.push(`【${starName}孤寂】：個性較為獨立清冷、防備心強不輕易敞開心扉，相處時容易習慣性冷戰或逃避深度溝通，易感孤立無援。`);
    improvements.push('主動表達內心感受與脆弱，多參與正向聚會，打開心門接納他人的善意與支持。');
  }

  // 針對該宮位玄空飛星與自化，自動補強深度斷語
  if (palaceSihuaSummary.selfSihua.length > 0) {
    keyHighlights.push(`本宮自化：${palaceSihuaSummary.selfSihua.join('、')}`);
    detailedExplanations.push(`【本宮自化現象】：本宮宮干使${palaceSihuaSummary.selfSihua.join('、')}。講義指出：自化為本宮氣數自我耗散或自我消解，在此領域容易有「自尋煩惱」或「成果容易無端流失」之象，需以意志力守成。`);
  }
  if (palaceSihuaSummary.clashedBy && palaceSihuaSummary.clashedBy.length > 0) {
    keyHighlights.push(`⚠️ 外宮化忌來沖本宮：${palaceSihuaSummary.clashedBy.join('；')}`);
    detailedExplanations.push(`【外在引爆點（受外宮飛忌沖破）】：受到${palaceSihuaSummary.clashedBy.join('；')}。講義專論指出：此為該面向遭遇危機或波折的「幕後元凶」，問題根源往往不是本宮自己，而是被這些外來宮位的人事物牽連拖累！`);
  }
  detailedExplanations.push(`【本宮飛星去向】：本宮干【${palaceSihuaSummary.stem}】${palaceSihuaSummary.flyOut.join('、')}。化忌所入之處為此宮位最牽掛付出之所，直沖【${palaceSihuaSummary.clashTarget}】需防連鎖損耗。`);

  const masterInfo = (shengyanGuidance as any)[aspect];

  return {
    title,
    scopeDesc,
    targetPalaceName,
    targetBranch: branch,
    starsSummary,
    palaceSihuaSummary,
    plainSummary,
    keyHighlights,
    detailedExplanations,
    advice,
    blindSpots,
    improvements,
    masterGuidance: masterInfo
  };
}
