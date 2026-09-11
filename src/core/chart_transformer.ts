import { ChartData, ChartType, Palace, Star } from '../core/types';
import { PALACE_NAMES, SIHUA_TABLE, LUCUN_TABLE, KUI_YUE_TABLE } from '../core/ziwei_rules';
import { EARTH_BRANCHES, HEAVEN_STEMS, getCalendarData } from '../core/calendar';

/**
 * 根據使用者選擇的盤別 (本命盤 / 大限盤 / 流年盤)
 * 產生帶有動態宮位名稱、飛星四化與流曜的展示盤面
 */
export function transformChartForDisplay(chart: ChartData, mode: ChartType): ChartData {
  // 深拷貝 chart 避免污染原始數據
  const displayChart: ChartData = JSON.parse(JSON.stringify(chart));

  if (mode === 'original') {
    // 本命盤：保持原樣
    return displayChart;
  }

  if (mode === 'big_limit') {
    // 大限盤：
    // 以當前大限命宮 (currentBigLimitIndex) 為基準排大限十二宮
    // 大限命宮之宮干，飛出大限四化 (大祿, 大權, 大科, 大忌)
    const bigLimitStem = displayChart.palaces[displayChart.currentBigLimitIndex].heavenStem;
    const bigSihua = SIHUA_TABLE[bigLimitStem];

    for (let i = 0; i < 12; i++) {
      const palace = displayChart.palaces[i];
      // 大限宮名推算：逆時針 (以大限命宮為起點)
      const offset = (displayChart.currentBigLimitIndex - i + 12) % 12;
      palace.bigLimitName = `大限${PALACE_NAMES[offset]}`;

      // 附加各星曜的大限四化
      if (bigSihua) {
        palace.majorStars.forEach(star => {
          if (star.name === bigSihua.lu) star.flowSihua = '祿';
          else if (star.name === bigSihua.quan) star.flowSihua = '權';
          else if (star.name === bigSihua.ke) star.flowSihua = '科';
          else if (star.name === bigSihua.ji) star.flowSihua = '忌';
        });
      }

      // 大限羊陀 (大羊、大陀)
      const bigLucunBranch = LUCUN_TABLE[bigLimitStem];
      if (bigLucunBranch) {
        const bigLucunIdx = EARTH_BRANCHES.indexOf(bigLucunBranch);
        const bigQingyangIdx = (bigLucunIdx + 1) % 12;
        const bigTuoluoIdx = (bigLucunIdx - 1 + 12) % 12;
        if (i === bigQingyangIdx) {
          palace.flowStars.push({ name: '大羊', type: 'flow' });
        }
        if (i === bigTuoluoIdx) {
          palace.flowStars.push({ name: '大陀', type: 'flow' });
        }
      }
    }
    return displayChart;
  }

  if (mode === 'flow_year') {
    // 流年盤：
    // 以目標流年地支 (currentFlowYearIndex) 為流年命宮
    // 依流年天干飛出流年四化 (流祿, 流權, 流科, 流忌) 與流羊流陀
    const targetCal = getCalendarData(displayChart.targetYear, 6, 1, 12);
    const flowStem = targetCal.yearStem;
    const flowSihua = SIHUA_TABLE[flowStem];

    for (let i = 0; i < 12; i++) {
      const palace = displayChart.palaces[i];
      // 流年宮名
      const offset = (displayChart.currentFlowYearIndex - i + 12) % 12;
      palace.flowYearName = `流年${PALACE_NAMES[offset]}`;

      if (flowSihua) {
        palace.majorStars.forEach(star => {
          if (star.name === flowSihua.lu) star.flowSihua = '祿';
          else if (star.name === flowSihua.quan) star.flowSihua = '權';
          else if (star.name === flowSihua.ke) star.flowSihua = '科';
          else if (star.name === flowSihua.ji) star.flowSihua = '忌';
        });
      }

      const flowLucunBranch = LUCUN_TABLE[flowStem];
      if (flowLucunBranch) {
        const flowLucunIdx = EARTH_BRANCHES.indexOf(flowLucunBranch);
        const flowQingyangIdx = (flowLucunIdx + 1) % 12;
        const flowTuoluoIdx = (flowLucunIdx - 1 + 12) % 12;
        if (i === flowQingyangIdx) {
          palace.flowStars.push({ name: '流羊', type: 'flow' });
        }
        if (i === flowTuoluoIdx) {
          palace.flowStars.push({ name: '流陀', type: 'flow' });
        }
      }
    }
    return displayChart;
  }

  return displayChart;
}
