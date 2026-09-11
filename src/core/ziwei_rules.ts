import { HEAVEN_STEMS, EARTH_BRANCHES, FIVE_TIGER_ESCAPE } from './calendar';
import { ChartData, Palace, Star, Gender, SihuaType } from './types';

// 十二宮標準順序 (逆時針或順行推安)
export const PALACE_NAMES = [
  '命宮', '兄弟宮', '夫妻宮', '子女宮', '財帛宮', '疾厄宮',
  '遷移宮', '奴僕宮', '官祿宮', '田宅宮', '福德宮', '父母宮'
];

// 六十甲子納音五行局
export const NAYIN_BUREAU: Record<string, { name: string; num: number }> = {
  '甲子': { name: '水二局', num: 2 }, '乙丑': { name: '水二局', num: 2 },
  '丙寅': { name: '火六局', num: 6 }, '丁卯': { name: '火六局', num: 6 },
  '戊辰': { name: '木三局', num: 3 }, '己巳': { name: '木三局', num: 3 },
  '庚午': { name: '土五局', num: 5 }, '辛未': { name: '土五局', num: 5 },
  '壬申': { name: '金四局', num: 4 }, '癸酉': { name: '金四局', num: 4 },
  '甲戌': { name: '火六局', num: 6 }, '乙亥': { name: '火六局', num: 6 },
  '丙子': { name: '水二局', num: 2 }, '丁丑': { name: '水二局', num: 2 },
  '戊寅': { name: '土五局', num: 5 }, '己卯': { name: '土五局', num: 5 },
  '庚辰': { name: '金四局', num: 4 }, '辛巳': { name: '金四局', num: 4 },
  '壬午': { name: '木三局', num: 3 }, '癸未': { name: '木三局', num: 3 },
  '甲申': { name: '水二局', num: 2 }, '乙酉': { name: '水二局', num: 2 },
  '丙戌': { name: '土五局', num: 5 }, '丁亥': { name: '土五局', num: 5 },
  '戊子': { name: '火六局', num: 6 }, '己丑': { name: '火六局', num: 6 },
  '庚寅': { name: '木三局', num: 3 }, '辛卯': { name: '木三局', num: 3 },
  '壬辰': { name: '水二局', num: 2 }, '癸巳': { name: '水二局', num: 2 },
  '甲午': { name: '金四局', num: 4 }, '乙未': { name: '金四局', num: 4 },
  '丙申': { name: '火六局', num: 6 }, '丁酉': { name: '火六局', num: 6 },
  '戊戌': { name: '木三局', num: 3 }, '己亥': { name: '木三局', num: 3 },
  '庚子': { name: '土五局', num: 5 }, '辛丑': { name: '土五局', num: 5 },
  '壬寅': { name: '金四局', num: 4 }, '癸卯': { name: '金四局', num: 4 },
  '甲辰': { name: '火六局', num: 6 }, '乙巳': { name: '火六局', num: 6 },
  '丙午': { name: '水二局', num: 2 }, '丁未': { name: '水二局', num: 2 },
  '戊申': { name: '土五局', num: 5 }, '己酉': { name: '土五局', num: 5 },
  '庚戌': { name: '金四局', num: 4 }, '辛亥': { name: '金四局', num: 4 },
  '壬子': { name: '木三局', num: 3 }, '癸丑': { name: '木三局', num: 3 },
  '甲寅': { name: '水二局', num: 2 }, '乙卯': { name: '水二局', num: 2 },
  '丙辰': { name: '土五局', num: 5 }, '丁巳': { name: '土五局', num: 5 },
  '戊午': { name: '火六局', num: 6 }, '己未': { name: '火六局', num: 6 },
  '庚申': { name: '木三局', num: 3 }, '辛酉': { name: '木三局', num: 3 },
  '壬戌': { name: '水二局', num: 2 }, '癸亥': { name: '水二局', num: 2 }
};

// 生年天干四化表 (祿 權 科 忌)
export const SIHUA_TABLE: Record<string, { lu: string; quan: string; ke: string; ji: string }> = {
  '甲': { lu: '廉貞', quan: '破軍', ke: '武曲', ji: '太陽' },
  '乙': { lu: '天機', quan: '天梁', ke: '紫微', ji: '太陰' },
  '丙': { lu: '天同', quan: '天機', ke: '文昌', ji: '廉貞' },
  '丁': { lu: '太陰', quan: '天同', ke: '天機', ji: '巨門' },
  '戊': { lu: '貪狼', quan: '太陰', ke: '右弼', ji: '天機' },
  '己': { lu: '武曲', quan: '貪狼', ke: '天梁', ji: '文曲' },
  '庚': { lu: '太陽', quan: '武曲', ke: '太陰', ji: '天同' },
  '辛': { lu: '巨門', quan: '太陽', ke: '文曲', ji: '文昌' },
  '壬': { lu: '天梁', quan: '紫微', ke: '左輔', ji: '武曲' },
  '癸': { lu: '破軍', quan: '巨門', ke: '太陰', ji: '貪狼' }
};

// 祿存、羊陀表 (依生年天干)
export const LUCUN_TABLE: Record<string, string> = {
  '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午', '戊': '巳',
  '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子'
};

// 魁鉞表 (依生年天干)
export const KUI_YUE_TABLE: Record<string, { kui: string; yue: string }> = {
  '甲': { kui: '丑', yue: '未' },
  '乙': { kui: '子', yue: '申' },
  '丙': { kui: '亥', yue: '酉' },
  '丁': { kui: '亥', yue: '酉' },
  '戊': { kui: '丑', yue: '未' },
  '己': { kui: '子', yue: '申' },
  '庚': { kui: '丑', yue: '未' },
  '辛': { kui: '午', yue: '寅' },
  '壬': { kui: '卯', yue: '巳' },
  '癸': { kui: '卯', yue: '巳' }
};

// 命主星 (依命宮地支)
export const DESTINY_MASTER: Record<string, string> = {
  '子': '貪狼', '丑': '巨門', '寅': '祿存', '卯': '文曲',
  '辰': '廉貞', '巳': '武曲', '午': '破軍', '未': '武曲',
  '申': '廉貞', '酉': '文曲', '戌': '祿存', '亥': '巨門'
};

// 身主星 (依生年地支)
export const BODY_MASTER: Record<string, string> = {
  '子': '鈴星', '丑': '天相', '寅': '天梁', '卯': '天同',
  '辰': '文昌', '巳': '天機', '午': '火星', '未': '天相',
  '申': '天梁', '酉': '天同', '戌': '文昌', '亥': '天機'
};

/**
 * 核心起紫微星公式
 * day: 農曆生日 (1~30)
 * bureauNum: 五行局數 (2, 3, 4, 5, 6)
 * 返回紫微星所在的地支索引 (0:子 ~ 11:亥)
 */
export function getZiweiIndex(day: number, bureauNum: number): number {
  let remainder = day % bureauNum;
  let quotient = Math.floor(day / bureauNum);
  let ziweiPos = 0; // 寅宮起算 (地支索引 2)

  if (remainder === 0) {
    // 整除：商數即步數 (從寅起)
    ziweiPos = (2 + quotient - 1) % 12;
  } else {
    // 不整除：需補數
    let complement = bureauNum - remainder;
    let newQuotient = (day + complement) / bureauNum;
    if (complement % 2 === 1) {
      // 補奇數：商數減補數
      ziweiPos = (2 + (newQuotient - complement) - 1) % 12;
    } else {
      // 補偶數：商數加補數
      ziweiPos = (2 + (newQuotient + complement) - 1) % 12;
    }
  }
  return (ziweiPos + 12) % 12;
}

/**
 * 天府星與紫微星斜對應 (天府在 辰戌軸 對稱)
 * 對應公式：(4 - ziweiIndex + 12) % 12
 */
export function getTianfuIndex(ziweiIndex: number): number {
  return (4 - ziweiIndex + 12) % 12;
}

/**
 * 尋找特定星曜所在的宮位索引 (包含主星與昌曲等)
 */
export function findStarPalaceIndex(chart: ChartData, starName: string): number {
  for (let i = 0; i < chart.palaces.length; i++) {
    const p = chart.palaces[i];
    if (p.majorStars.some(s => s.name === starName)) return i;
    if (p.minorStars.some(s => s.name === starName)) return i;
  }
  return -1;
}

/**
 * 計算單一宮位的玄空四化（宮干飛星落點與沖宮）
 */
export function calculatePalaceFlyingSihua(chart: ChartData, palaceIndex: number): PalaceFlyingSihua {
  const fromPalace = chart.palaces[palaceIndex];
  const stem = fromPalace.heavenStem;
  const sihuaStars = SIHUA_TABLE[stem] || { lu: '', quan: '', ke: '', ji: '' };

  const createTarget = (sihua: SihuaType, star: string): FlyingSihuaTarget => {
    const targetPalaceIdx = findStarPalaceIndex(chart, star);
    const targetPalaceName = targetPalaceIdx >= 0 ? chart.palaces[targetPalaceIdx].name : '未知';
    const isSelf = targetPalaceIdx === palaceIndex;
    
    let clashPalaceIndex: number | undefined = undefined;
    let clashPalaceName: string | undefined = undefined;
    if (sihua === '忌' && targetPalaceIdx >= 0) {
      clashPalaceIndex = (targetPalaceIdx + 6) % 12;
      clashPalaceName = chart.palaces[clashPalaceIndex].name;
    }

    return {
      sihua,
      star,
      toPalaceIndex: targetPalaceIdx,
      toPalaceName: targetPalaceName,
      isSelf,
      clashPalaceIndex,
      clashPalaceName
    };
  };

  return {
    fromPalaceIndex: palaceIndex,
    fromPalaceName: fromPalace.name,
    fromPalaceStem: stem,
    targets: {
      lu: createTarget('祿', sihuaStars.lu),
      quan: createTarget('權', sihuaStars.quan),
      ke: createTarget('科', sihuaStars.ke),
      ji: createTarget('忌', sihuaStars.ji)
    }
  };
}

/**
 * 計算全盤十二宮的所有自化
 */
export function calculateAllSelfSihua(chart: ChartData): { palaceIndex: number; palaceName: string; star: string; sihua: SihuaType }[] {
  const result: { palaceIndex: number; palaceName: string; star: string; sihua: SihuaType }[] = [];
  for (let i = 0; i < chart.palaces.length; i++) {
    const p = chart.palaces[i];
    const fs = calculatePalaceFlyingSihua(chart, i);
    (['lu', 'quan', 'ke', 'ji'] as const).forEach(key => {
      const t = fs.targets[key];
      if (t.isSelf) {
        result.push({
          palaceIndex: i,
          palaceName: p.name,
          star: t.star,
          sihua: t.sihua
        });
      }
    });
  }
  return result;
}
