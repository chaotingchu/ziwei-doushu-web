import { HEAVEN_STEMS, EARTH_BRANCHES, FIVE_TIGER_ESCAPE, getCalendarData } from './calendar';
import {
  PALACE_NAMES, NAYIN_BUREAU, SIHUA_TABLE, LUCUN_TABLE, KUI_YUE_TABLE,
  DESTINY_MASTER, BODY_MASTER, getZiweiIndex, getTianfuIndex
} from './ziwei_rules';
import { ChartData, Palace, Star, Gender, SihuaType } from './types';

// 十四主星廟旺平陷字典 (以 地支 0:子 ~ 11:亥 為索引)
const STAR_BRIGHTNESS: Record<string, string[]> = {
  '紫微': ['平', '廟', '廟', '旺', '得', '旺', '廟', '廟', '旺', '平', '得', '旺'],
  '天機': ['廟', '陷', '得', '旺', '平', '廟', '廟', '陷', '得', '旺', '平', '廟'],
  '太陽': ['陷', '陷', '旺', '廟', '旺', '廟', '廟', '得', '平', '平', '閑', '陷'],
  '武曲': ['旺', '廟', '得', '利', '廟', '平', '旺', '廟', '得', '利', '廟', '平'],
  '天同': ['旺', '陷', '利', '廟', '平', '平', '陷', '陷', '旺', '平', '平', '廟'],
  '廉貞': ['平', '利', '廟', '平', '旺', '陷', '平', '利', '廟', '平', '旺', '陷'],
  '天府': ['廟', '廟', '廟', '得', '廟', '旺', '廟', '廟', '得', '平', '廟', '旺'],
  '太陰': ['廟', '廟', '陷', '陷', '陷', '陷', '陷', '平', '得', '旺', '廟', '廟'],
  '貪狼': ['旺', '廟', '平', '平', '廟', '陷', '旺', '廟', '平', '平', '廟', '陷'],
  '巨門': ['旺', '旺', '廟', '廟', '平', '平', '旺', '陷', '廟', '廟', '平', '旺'],
  '天相': ['廟', '廟', '廟', '陷', '旺', '平', '廟', '得', '廟', '陷', '得', '平'],
  '天梁': ['廟', '旺', '廟', '廟', '旺', '陷', '廟', '旺', '陷', '得', '廟', '陷'],
  '七殺': ['旺', '廟', '廟', '平', '旺', '平', '旺', '廟', '廟', '平', '旺', '平'],
  '破軍': ['廟', '旺', '得', '陷', '旺', '平', '廟', '旺', '得', '陷', '旺', '平'],
  '文昌': ['廟', '廟', '陷', '得', '利', '廟', '陷', '得', '利', '廟', '陷', '廟'],
  '文曲': ['廟', '廟', '平', '旺', '得', '廟', '平', '旺', '得', '廟', '平', '廟'],
  '左輔': ['廟', '廟', '廟', '旺', '旺', '得', '廟', '廟', '廟', '旺', '旺', '得'],
  '右弼': ['廟', '廟', '廟', '旺', '旺', '得', '廟', '廟', '廟', '旺', '旺', '得'],
  '火星': ['陷', '平', '廟', '利', '得', '廟', '平', '廟', '利', '得', '廟', '陷'],
  '鈴星': ['陷', '平', '廟', '利', '得', '廟', '平', '廟', '利', '得', '廟', '陷'],
  '擎羊': ['平', '廟', '陷', '廟', '陷', '平', '平', '廟', '陷', '廟', '陷', '平'],
  '陀羅': ['廟', '陷', '平', '廟', '陷', '廟', '廟', '陷', '平', '廟', '陷', '廟']
};

/**
 * 核心排盤計算函數
 */
export function calculateChart(
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: Gender,
  targetYear: number
): ChartData {
  const cal = getCalendarData(year, month, day, hour);

  // 1. 定命宮與身宮地支索引
  // 規則：從 寅宮 (索引 2) 起正月，順數至生月；再從該宮起子時，逆數至生時即為「命宮」
  // 身宮：從該宮起子時，順數至生時即為「身宮」
  const birthMonth = cal.lunarMonth;
  const birthHourIdx = EARTH_BRANCHES.indexOf(cal.hourBranch); // 0:子 ~ 11:亥

  // 正月在寅 (2)，順數 (birthMonth - 1)
  const monthPos = (2 + (birthMonth - 1)) % 12;
  // 逆數 birthHourIdx 為命宮
  const lifePalaceIdx = (monthPos - birthHourIdx + 12) % 12;
  // 順數 birthHourIdx 為身宮
  const bodyPalaceIdx = (monthPos + birthHourIdx) % 12;

  // 2. 定十二宮天干（五虎遁）
  // 依生年天干，起寅宮天干
  const startStem = FIVE_TIGER_ESCAPE[cal.yearStem] || '丙';
  const startStemIdx = HEAVEN_STEMS.indexOf(startStem);
  
  // 建立 12 宮基本結構
  const palaces: Palace[] = [];
  for (let i = 0; i < 12; i++) {
    // 地支索引 i: 0:子, 1:丑, 2:寅 ...
    // 寅宮 (2) 對應 startStemIdx，子宮 (0) 往前推 2
    const stemOffset = (i - 2 + 12) % 12;
    const stem = HEAVEN_STEMS[(startStemIdx + stemOffset) % 10];
    const branch = EARTH_BRANCHES[i];

    // 本命宮位名稱：以命宮 lifePalaceIdx 為第 0 個「命宮」，逆時針排「兄弟、夫妻...」
    // 逆時針即逆數索引：(lifePalaceIdx - i + 12) % 12
    const palaceNameIdx = (lifePalaceIdx - i + 12) % 12;
    const palaceName = PALACE_NAMES[palaceNameIdx];

    palaces.push({
      index: i,
      earthBranch: branch,
      heavenStem: stem,
      name: palaceName,
      isBodyPalace: i === bodyPalaceIdx,
      majorStars: [],
      minorStars: [],
      badStars: [],
      flowStars: [],
      bigLimitRange: '',
      bigLimitStartAge: 0,
      bigLimitEndAge: 0
    });
  }

  // 3. 定五行局 (取命宮之天干與地支納音)
  const lifePalace = palaces[lifePalaceIdx];
  const lifeGanZhi = `${lifePalace.heavenStem}${lifePalace.earthBranch}`;
  const bureau = NAYIN_BUREAU[lifeGanZhi] || { name: '水二局', num: 2 };
  const bureauNumber = bureau.num;

  // 4. 定大限起運年齡與順逆行
  // 陽男陰女順行 (地支順增)，陰男陽女逆行 (地支逆減)
  const isYangYear = ['甲', '丙', '戊', '庚', '壬'].includes(cal.yearStem);
  const isClockwise = (isYangYear && gender === '男') || (!isYangYear && gender === '女');

  for (let step = 0; step < 12; step++) {
    const curIdx = isClockwise
      ? (lifePalaceIdx + step) % 12
      : (lifePalaceIdx - step + 12) % 12;
    const startAge = bureauNumber + step * 10;
    const endAge = startAge + 9;
    palaces[curIdx].bigLimitRange = `${startAge}-${endAge}`;
    palaces[curIdx].bigLimitStartAge = startAge;
    palaces[curIdx].bigLimitEndAge = endAge;
  }

  // 5. 起十四主星
  // (A) 紫微星
  const ziweiIdx = getZiweiIndex(cal.lunarDay, bureauNumber);
  // 紫微星系：紫微、逆1天機、逆1隔1太陽、逆1武曲、逆1天同、逆1隔2廉貞
  const ziweiGroup: [string, number][] = [
    ['紫微', ziweiIdx],
    ['天機', (ziweiIdx - 1 + 12) % 12],
    ['太陽', (ziweiIdx - 3 + 12) % 12],
    ['武曲', (ziweiIdx - 4 + 12) % 12],
    ['天同', (ziweiIdx - 5 + 12) % 12],
    ['廉貞', (ziweiIdx - 8 + 12) % 12]
  ];

  // (B) 天府星系
  const tianfuIdx = getTianfuIndex(ziweiIdx);
  // 天府星系：天府、順1太陰、順1貪狼、順1巨門、順1天相、順1天梁、順1七殺、順1隔3破軍
  const tianfuGroup: [string, number][] = [
    ['天府', tianfuIdx],
    ['太陰', (tianfuIdx + 1) % 12],
    ['貪狼', (tianfuIdx + 2) % 12],
    ['巨門', (tianfuIdx + 3) % 12],
    ['天相', (tianfuIdx + 4) % 12],
    ['天梁', (tianfuIdx + 5) % 12],
    ['七殺', (tianfuIdx + 6) % 12],
    ['破軍', (tianfuIdx + 10) % 12]
  ];

  // 生年四化
  const yearSihua = SIHUA_TABLE[cal.yearStem] || { lu: '', quan: '', ke: '', ji: '' };

  function addMajorStar(name: string, pIdx: number) {
    let sihua: SihuaType | undefined = undefined;
    if (yearSihua.lu === name) sihua = '祿';
    else if (yearSihua.quan === name) sihua = '權';
    else if (yearSihua.ke === name) sihua = '科';
    else if (yearSihua.ji === name) sihua = '忌';

    const brightness = STAR_BRIGHTNESS[name]?.[pIdx] || '平';
    palaces[pIdx].majorStars.push({
      name,
      brightness,
      type: 'major',
      sihua
    });
  }

  ziweiGroup.forEach(([name, idx]) => addMajorStar(name, idx));
  tianfuGroup.forEach(([name, idx]) => addMajorStar(name, idx));

  // 6. 安吉星與凶煞星
  // (A) 月系星：左輔 (辰宮2起順數生月), 右弼 (戌宮10起逆數生月)
  const zuofuIdx = (4 + (birthMonth - 1)) % 12;
  const youbiIdx = (10 - (birthMonth - 1) + 12) % 12;
  palaces[zuofuIdx].minorStars.push({ name: '左輔', brightness: STAR_BRIGHTNESS['左輔']?.[zuofuIdx] || '廟', type: 'minor' });
  palaces[youbiIdx].minorStars.push({ name: '右弼', brightness: STAR_BRIGHTNESS['右弼']?.[youbiIdx] || '廟', type: 'minor' });

  // (B) 時系星：文昌 (戌10逆時辰), 文曲 (辰4順時辰)
  const wenchangIdx = (10 - birthHourIdx + 12) % 12;
  const wenquIdx = (4 + birthHourIdx) % 12;
  palaces[wenchangIdx].minorStars.push({ name: '文昌', brightness: STAR_BRIGHTNESS['文昌']?.[wenchangIdx] || '廟', type: 'minor' });
  palaces[wenquIdx].minorStars.push({ name: '文曲', brightness: STAR_BRIGHTNESS['文曲']?.[wenquIdx] || '廟', type: 'minor' });

  // 地空、地劫：亥宮起子時，地劫順數、地空逆數
  const dijieIdx = (11 + birthHourIdx) % 12;
  const dikongIdx = (11 - birthHourIdx + 12) % 12;
  palaces[dijieIdx].badStars.push({ name: '地劫', brightness: '陷', type: 'bad' });
  palaces[dikongIdx].badStars.push({ name: '地空', brightness: '陷', type: 'bad' });

  // 火星、鈴星（年支起宮順數生時）
  // 火星起宮：申子辰年起寅(2)，寅午戌年起丑(1)，巳酉丑年起卯(3)，亥卯未年起酉(9)
  const huoxingStartMap: Record<string, number> = {
    '申': 2, '子': 2, '辰': 2,
    '寅': 1, '午': 1, '戌': 1,
    '巳': 3, '酉': 3, '丑': 3,
    '亥': 9, '卯': 9, '未': 9
  };
  const huoxingStart = huoxingStartMap[cal.yearBranch] ?? 2;
  const huoxingIdx = (huoxingStart + birthHourIdx) % 12;
  palaces[huoxingIdx].badStars.push({ name: '火星', brightness: STAR_BRIGHTNESS['火星']?.[huoxingIdx] || '廟', type: 'bad' });

  // 鈴星起宮：申子辰/巳酉丑/亥卯未年起戌(10)，寅午戌年起卯(3)
  const lingxingStartMap: Record<string, number> = {
    '申': 10, '子': 10, '辰': 10,
    '寅': 3,  '午': 3,  '戌': 3,
    '巳': 10, '酉': 10, '丑': 10,
    '亥': 10, '卯': 10, '未': 10
  };
  const lingxingStart = lingxingStartMap[cal.yearBranch] ?? 10;
  const lingxingIdx = (lingxingStart + birthHourIdx) % 12;
  palaces[lingxingIdx].badStars.push({ name: '鈴星', brightness: STAR_BRIGHTNESS['鈴星']?.[lingxingIdx] || '廟', type: 'bad' });

  // (C) 年干系星：祿存、擎羊、陀羅、天魁、天鉞
  const lucunBranch = LUCUN_TABLE[cal.yearStem] || '寅';
  const lucunIdx = EARTH_BRANCHES.indexOf(lucunBranch);
  palaces[lucunIdx].minorStars.push({ name: '祿存', brightness: '廟', type: 'lucun' });

  // 擎羊在祿存前一位(順1)，陀羅在祿存後一位(逆1)
  const qingyangIdx = (lucunIdx + 1) % 12;
  const tuoluoIdx = (lucunIdx - 1 + 12) % 12;
  palaces[qingyangIdx].badStars.push({ name: '擎羊', brightness: STAR_BRIGHTNESS['擎羊']?.[qingyangIdx] || '廟', type: 'bad' });
  palaces[tuoluoIdx].badStars.push({ name: '陀羅', brightness: STAR_BRIGHTNESS['陀羅']?.[tuoluoIdx] || '廟', type: 'bad' });

  const kuiYue = KUI_YUE_TABLE[cal.yearStem];
  if (kuiYue) {
    const kuiIdx = EARTH_BRANCHES.indexOf(kuiYue.kui);
    const yueIdx = EARTH_BRANCHES.indexOf(kuiYue.yue);
    palaces[kuiIdx].minorStars.push({ name: '天魁', brightness: '廟', type: 'minor' });
    palaces[yueIdx].minorStars.push({ name: '天鉞', brightness: '廟', type: 'minor' });
  }

  // (D) 天馬星（年支三合長生馬：申子辰在寅，寅午戌在申，巳酉丑在亥，亥卯未在巳）
  const tianmaMap: Record<string, string> = {
    '申': '寅', '子': '寅', '辰': '寅',
    '寅': '申', '午': '申', '戌': '申',
    '巳': '亥', '酉': '亥', '丑': '亥',
    '亥': '巳', '卯': '巳', '未': '巳'
  };
  const tianmaBranch = tianmaMap[cal.yearBranch] || '寅';
  palaces[EARTH_BRANCHES.indexOf(tianmaBranch)].minorStars.push({ name: '天馬', brightness: '旺', type: 'minor' });

  // (E) 宗教、因果重要神煞：天刑、陰煞、華蓋
  // 1. 天刑：酉宮起正月順數至生月
  const tianxingIdx = (9 + (cal.lunarMonth - 1)) % 12;
  const tianxingBrightness = [2, 3, 9, 10].includes(tianxingIdx) ? '廟' : '平'; // 寅卯酉戌為廟
  palaces[tianxingIdx].badStars.push({ name: '天刑', brightness: tianxingBrightness, type: 'bad' });

  // 截路空亡 (截空)：甲己在申酉(陽年申/陰年酉)，乙庚在午未(陽年午/陰年未)，丙辛在辰巳(陽年辰/陰年巳)，丁壬在寅卯(陽年寅/陰年卯)，戊癸在子丑(陽年子/陰年丑)
  const jiekongMap: Record<string, { yang: number; yin: number }> = {
    '甲': { yang: 8, yin: 9 },  '己': { yang: 8, yin: 9 },
    '乙': { yang: 6, yin: 7 },  '庚': { yang: 6, yin: 7 },
    '丙': { yang: 4, yin: 5 },  '辛': { yang: 4, yin: 5 },
    '丁': { yang: 2, yin: 3 },  '壬': { yang: 2, yin: 3 },
    '戊': { yang: 0, yin: 1 },  '癸': { yang: 0, yin: 1 },
  };
  const jkPair = jiekongMap[cal.yearStem] || { yang: 8, yin: 9 };
  const jiekongIdx = isYangYear ? jkPair.yang : jkPair.yin;
  palaces[jiekongIdx].badStars.push({ name: '截空', brightness: '陷', type: 'bad' });

  // 2. 陰煞：正月在寅(2)、二月在子(0)、三月在戌(10)、四月在申(8)、五月在午(6)、六月在辰(4)（六月一循環）
  const yinshaCycle = [2, 0, 10, 8, 6, 4];
  const yinshaIdx = yinshaCycle[(cal.lunarMonth - 1) % 6];
  palaces[yinshaIdx].badStars.push({ name: '陰煞', brightness: '陷', type: 'bad' });

  // 3. 華蓋：依生年地支三合墓庫（申子辰在辰，寅午戌在戌，巳酉丑在丑，亥卯未在未）
  const huagaiMap: Record<string, string> = {
    '申': '辰', '子': '辰', '辰': '辰',
    '寅': '戌', '午': '戌', '戌': '戌',
    '巳': '丑', '酉': '丑', '丑': '丑',
    '亥': '未', '卯': '未', '未': '未'
  };
  const huagaiBranch = huagaiMap[cal.yearBranch] || '辰';
  palaces[EARTH_BRANCHES.indexOf(huagaiBranch)].minorStars.push({ name: '華蓋', brightness: '廟', type: 'minor' });

  // 4. 婚姻感情核心吉曜：紅鸞、天喜
  // 紅鸞：卯宮(3)起子年，逆數至生年地支
  const yearBranchIdx = EARTH_BRANCHES.indexOf(cal.yearBranch);
  const hongluanIdx = (3 - yearBranchIdx + 12) % 12;
  palaces[hongluanIdx].minorStars.push({ name: '紅鸞', brightness: '廟', type: 'minor' });

  // 天喜：紅鸞之對宮（沖紅鸞之位，即 (hongluanIdx + 6) % 12）
  const tianxiIdx = (hongluanIdx + 6) % 12;
  palaces[tianxiIdx].minorStars.push({ name: '天喜', brightness: '廟', type: 'minor' });

  // 5. 感情與人際神煞：天姚、咸池、孤辰、寡宿
  // 天姚：丑宮(1)起正月順數至生月
  const tianyaoIdx = (1 + (cal.lunarMonth - 1)) % 12;
  palaces[tianyaoIdx].minorStars.push({ name: '天姚', brightness: '廟', type: 'minor' });

  // 咸池：申子辰在酉(9)，寅午戌在卯(3)，巳酉丑在午(6)，亥卯未在子(0)
  const xianchiMap: Record<string, number> = {
    '申': 9, '子': 9, '辰': 9,
    '寅': 3, '午': 3, '戌': 3,
    '巳': 6, '酉': 6, '丑': 6,
    '亥': 0, '卯': 0, '未': 0
  };
  const xianchiIdx = xianchiMap[cal.yearBranch] ?? 9;
  palaces[xianchiIdx].minorStars.push({ name: '咸池', brightness: '陷', type: 'minor' });

  // 孤辰、寡宿：
  // 亥子丑年在寅(2)戌(10)，寅卯辰年在巳(5)丑(1)，巳午未年在申(8)辰(4)，申酉戌年在亥(11)未(7)
  const guchenGuasuMap: Record<string, { guchen: number; guasu: number }> = {
    '亥': { guchen: 2, guasu: 10 }, '子': { guchen: 2, guasu: 10 }, '丑': { guchen: 2, guasu: 10 },
    '寅': { guchen: 5, guasu: 1 },  '卯': { guchen: 5, guasu: 1 },  '辰': { guchen: 5, guasu: 1 },
    '巳': { guchen: 8, guasu: 4 },  '午': { guchen: 8, guasu: 4 },  '未': { guchen: 8, guasu: 4 },
    '申': { guchen: 11, guasu: 7 }, '酉': { guchen: 11, guasu: 7 }, '戌': { guchen: 11, guasu: 7 }
  };
  const gg = guchenGuasuMap[cal.yearBranch] || { guchen: 2, guasu: 10 };
  palaces[gg.guchen].badStars.push({ name: '孤辰', brightness: '平', type: 'bad' });
  palaces[gg.guasu].badStars.push({ name: '寡宿', brightness: '平', type: 'bad' });

  // 6. 事業、名譽、貴人吉曜：台輔、封誥、恩光、天貴、三台、八座
  // 台輔：午宮(6)起子時順數至生時
  const taifuIdx = (6 + birthHourIdx) % 12;
  palaces[taifuIdx].minorStars.push({ name: '台輔', brightness: '廟', type: 'minor' });

  // 封誥：寅宮(2)起子時順數至生時
  const fenggaoIdx = (2 + birthHourIdx) % 12;
  palaces[fenggaoIdx].minorStars.push({ name: '封誥', brightness: '廟', type: 'minor' });

  // 恩光：文昌宮順數至生日減一
  const enguangIdx = (wenchangIdx + (cal.lunarDay - 1)) % 12;
  palaces[enguangIdx].minorStars.push({ name: '恩光', brightness: '廟', type: 'minor' });

  // 天貴：文曲宮順數至生日減一
  const tianguiIdx = (wenquIdx + (cal.lunarDay - 1)) % 12;
  palaces[tianguiIdx].minorStars.push({ name: '天貴', brightness: '廟', type: 'minor' });

  // 三台：左輔宮順數至生日減一
  const santaiIdx = (zuofuIdx + (cal.lunarDay - 1)) % 12;
  palaces[santaiIdx].minorStars.push({ name: '三台', brightness: '廟', type: 'minor' });

  // 八座：右弼宮逆數至生日減一
  const bazuoIdx = (youbiIdx - (cal.lunarDay - 1) % 12 + 12) % 12;
  palaces[bazuoIdx].minorStars.push({ name: '八座', brightness: '廟', type: 'minor' });

  // 7. 計算目標流年與虛歲
  const currentAge = targetYear - year + 1; // 虛歲
  // 目標流年地支
  const targetYearCal = getCalendarData(targetYear, 6, 1, 12);
  const targetBranch = targetYearCal.yearBranch;
  const currentFlowYearIndex = EARTH_BRANCHES.indexOf(targetBranch);

  // 找出當前虛歲所對應的大限索引
  let currentBigLimitIndex = lifePalaceIdx;
  for (let i = 0; i < 12; i++) {
    if (currentAge >= palaces[i].bigLimitStartAge && currentAge <= palaces[i].bigLimitEndAge) {
      currentBigLimitIndex = i;
      break;
    }
  }

  // 命主與身主
  const destinyMaster = DESTINY_MASTER[lifePalace.earthBranch] || '貪狼';
  const bodyMaster = BODY_MASTER[cal.yearBranch] || '天梁';

  return {
    gender,
    solarDate: cal.solarDateStr,
    lunarDate: cal.lunarDateStr,
    lunarYear: cal.lunarYear,
    lunarMonth: cal.lunarMonth,
    lunarDay: cal.lunarDay,
    lunarHourBranch: cal.hourBranch,
    isLeapMonth: cal.isLeap,
    yearGanZhi: cal.yearGanZhi,
    monthGanZhi: cal.monthGanZhi,
    dayGanZhi: cal.dayGanZhi,
    hourGanZhi: cal.hourGanZhi,
    fiveElementsBureau: bureau.name,
    bureauNumber,
    destinyMaster,
    bodyMaster,
    currentAge,
    targetYear,
    targetYearGanZhi: targetYearCal.yearGanZhi,
    palaces,
    originalLifeIndex: lifePalaceIdx,
    currentBigLimitIndex,
    currentFlowYearIndex
  };
}
