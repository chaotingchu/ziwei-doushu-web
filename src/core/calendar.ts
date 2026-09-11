import { Solar, Lunar } from 'lunar-javascript';

// 天干與地支定義
export const HEAVEN_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const EARTH_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五虎遁：根據生年天干起正月（寅宮）之天干
export const FIVE_TIGER_ESCAPE: Record<string, string> = {
  '甲': '丙', '己': '丙',
  '乙': '戊', '庚': '戊',
  '丙': '庚', '辛': '庚',
  '丁': '壬', '壬': '壬',
  '戊': '甲', '癸': '甲'
};

// 五鼠遁：依日干起子時天干
export const FIVE_RAT_ESCAPE: Record<string, string> = {
  '甲': '甲', '己': '甲',
  '乙': '丙', '庚': '丙',
  '丙': '戊', '辛': '戊',
  '丁': '庚', '壬': '庚',
  '戊': '壬', '癸': '壬'
};

// 時辰地支對照 (0~23 小時)
export function getHourBranch(hour: number): string {
  if (hour === 23 || hour === 0) return '子';
  if (hour === 1 || hour === 2) return '丑';
  if (hour === 3 || hour === 4) return '寅';
  if (hour === 5 || hour === 6) return '卯';
  if (hour === 7 || hour === 8) return '辰';
  if (hour === 9 || hour === 10) return '巳';
  if (hour === 11 || hour === 12) return '午';
  if (hour === 13 || hour === 14) return '未';
  if (hour === 15 || hour === 16) return '申';
  if (hour === 17 || hour === 18) return '酉';
  if (hour === 19 || hour === 20) return '戌';
  if (hour === 21 || hour === 22) return '亥';
  return '子';
}

export interface CalendarResult {
  solarDateStr: string;
  lunarDateStr: string;
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeap: boolean;
  yearGanZhi: string;
  yearStem: string;
  yearBranch: string;
  monthGanZhi: string;
  dayGanZhi: string;
  hourGanZhi: string;
  hourBranch: string;
}

/**
 * 萬年曆轉換：輸入西曆西元年、月、日、時
 * 依照使用者指定規則：『閏月一律直接算當月』
 */
export function getCalendarData(year: number, month: number, day: number, hour: number): CalendarResult {
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const lunar = solar.getLunar();

  let lunarYear = lunar.getYear();
  let lunarMonth = lunar.getMonth(); // 若為閏月，lunar-javascript 返回負數或正數
  let isLeap = false;
  
  // 檢查是否為閏月
  if (lunarMonth < 0) {
    isLeap = true;
    // 依使用者要求：閏月一律直接算當月
    lunarMonth = Math.abs(lunarMonth);
  }

  const lunarDay = lunar.getDay();
  const hourBranch = getHourBranch(hour);

  const yearGanZhi = lunar.getYearInGanZhi();
  const yearStem = yearGanZhi.substring(0, 1);
  const yearBranch = yearGanZhi.substring(1, 2);

  // 時天干 (五鼠遁)
  const dayStem = lunar.getDayGan();
  const startHourStem = FIVE_RAT_ESCAPE[dayStem] || '甲';
  const hourBranchIndex = EARTH_BRANCHES.indexOf(hourBranch);
  const startHourStemIndex = HEAVEN_STEMS.indexOf(startHourStem);
  const hourStem = HEAVEN_STEMS[(startHourStemIndex + hourBranchIndex) % 10];
  const hourGanZhi = `${hourStem}${hourBranch}`;

  const solarDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const lunarDateStr = `${yearGanZhi}年 ${isLeap ? '閏' : ''}${lunarMonth}月${lunarDay}日 ${hourBranch}時`;

  return {
    solarDateStr,
    lunarDateStr,
    lunarYear,
    lunarMonth,
    lunarDay,
    isLeap,
    yearGanZhi,
    yearStem,
    yearBranch,
    monthGanZhi: lunar.getMonthInGanZhi(),
    dayGanZhi: lunar.getDayInGanZhi(),
    hourGanZhi,
    hourBranch
  };
}
