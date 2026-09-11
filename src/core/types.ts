// 命盤資料型別定義

export type Gender = '男' | '女';

export type ChartType = 'original' | 'big_limit' | 'flow_year';

export type SihuaType = '祿' | '權' | '科' | '忌';

export interface Star {
  name: string;
  brightness?: string; // 廟, 旺, 得, 利, 平, 閑, 陷
  type: 'major' | 'minor' | 'lucun' | 'bad' | 'flow';
  sihua?: SihuaType; // 生年四化
  flowSihua?: SihuaType; // 大限或流年四化
}

export interface Palace {
  index: number;           // 0:子, 1:丑, 2:寅, ... 11:亥
  earthBranch: string;     // 子, 丑, 寅, 卯, 辰, 巳, 午, 未, 申, 酉, 戌, 亥
  heavenStem: string;      // 甲, 乙, 丙, ... 癸
  name: string;            // 本命宮位名稱: 命宮, 兄弟, 夫妻, ... 父母
  bigLimitName?: string;   // 大限宮位名稱 (若切換大限盤)
  flowYearName?: string;   // 流年宮位名稱 (若切換流年盤)
  isBodyPalace: boolean;   // 是否為身宮
  majorStars: Star[];      // 十四主星
  minorStars: Star[];      // 吉星、輔星
  badStars: Star[];        // 煞星
  flowStars: Star[];       // 流曜 (流羊, 流陀, 流魁, 流鉞等)
  bigLimitRange: string;   // 大限年齡區間, 如 2-11 或 24-33
  bigLimitStartAge: number;
  bigLimitEndAge: number;
  flowYearAge?: number;    // 流年虛歲
  selfSihua?: { star: string; sihua: SihuaType }[]; // 自化
}

export interface ChartData {
  gender: Gender;
  solarDate: string;       // 國曆日期, 例如 1990-05-18
  lunarDate: string;       // 農曆日期, 例如 庚午年四月廿四
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  lunarHourBranch: string; // 出生時辰地支 (子~亥)
  isLeapMonth: boolean;
  yearGanZhi: string;      // 例如 庚午
  monthGanZhi: string;
  dayGanZhi: string;
  hourGanZhi: string;
  fiveElementsBureau: string; // 水二局, 木三局, 金四局, 土五局, 火六局
  bureauNumber: number;        // 2, 3, 4, 5, 6
  destinyMaster: string;       // 命主 (依命宮地支)
  bodyMaster: string;          // 身主 (依生年地支)
  currentAge: number;          // 目標年份之虛歲
  targetYear: number;          // 指定流年
  targetYearGanZhi: string;    // 流年干支
  palaces: Palace[];           // 12 宮 (依地支 0:子 ~ 11:亥 排序)
  originalLifeIndex: number;   // 本命命宮所在的宮位索引 (0~11)
  currentBigLimitIndex: number;// 當前目標大限命宮所在的宮位索引
  currentFlowYearIndex: number;// 當前目標流年命宮所在的宮位索引
}

// 玄空飛星四化落點資訊
export interface FlyingSihuaTarget {
  sihua: SihuaType;       // 祿, 權, 科, 忌
  star: string;          // 化出的星曜
  toPalaceIndex: number; // 飛入的宮位索引 (0~11)
  toPalaceName: string;  // 飛入的宮位名稱 (如: 子女宮)
  isSelf: boolean;       // 是否為自化 (飛入本宮)
  clashPalaceIndex?: number; // 若為忌，沖的對宮索引
  clashPalaceName?: string;  // 若為忌，沖的對宮名稱
}

export interface PalaceFlyingSihua {
  fromPalaceIndex: number;
  fromPalaceName: string;
  fromPalaceStem: string;
  targets: {
    lu: FlyingSihuaTarget;
    quan: FlyingSihuaTarget;
    ke: FlyingSihuaTarget;
    ji: FlyingSihuaTarget;
  };
}
