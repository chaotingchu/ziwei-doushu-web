<script setup lang=ts>
import { computed } from 'vue';
import { ChartData, ChartType, Palace } from '../core/types';

const props = defineProps<{
  chart: ChartData;
  mode: ChartType;
  selectedPalaceIndex: number;
}>();

const emit = defineEmits<{
  (e: 'selectPalace', index: number): void;
  (e: 'changeMode', mode: ChartType): void;
}>();

// 4x4 宮位網格對應地支索引 (0:子 ~ 11:亥)
// 第一列 (頂部): 巳(5), 午(6), 未(7), 申(8)
// 第二列:       辰(4),  中宮,  中宮, 酉(9)
// 第三列:       卯(3),  中宮,  中宮, 戌(10)
// 第四列 (底部): 寅(2), 丑(1), 子(0), 亥(11)
const gridLayout = [
  [5, 6, 7, 8],
  [4, -1, -2, 9],
  [3, -3, -4, 10],
  [2, 1, 0, 11]
];

function getPalace(idx: number): Palace | undefined {
  if (idx < 0) return undefined;
  return props.chart.palaces[idx];
}

// 判斷是否為選中宮位、三合宮或對宮
const highlightedIndices = computed(() => {
  const sel = props.selectedPalaceIndex;
  // 對宮: +6
  const opposite = (sel + 6) % 12;
  // 三合宮: +4, +8
  const triangle1 = (sel + 4) % 12;
  const triangle2 = (sel + 8) % 12;
  return {
    selected: sel,
    opposite,
    triangle1,
    triangle2
  };
});

function isHighlight(idx: number): string {
  if (idx < 0) return '';
  const h = highlightedIndices.value;
  if (idx === h.selected) return 'is-selected';
  if (idx === h.opposite) return 'is-opposite';
  if (idx === h.triangle1 || idx === h.triangle2) return 'is-triangle';
  return '';
}
</script>

<template>
  <div class="chart-board-container">
    <!-- 盤別切換工具列 -->
    <div class="chart-toolbar">
      <div class="chart-tabs">
        <button
          class="tab-btn"
          :class="{ active: mode === 'original' }"
          @click="emit('changeMode', 'original')"
        >
          🌟 本命天盤 (一生先天定數)
        </button>
        <button
          class="tab-btn"
          :class="{ active: mode === 'big_limit' }"
          @click="emit('changeMode', 'big_limit')"
        >
          ⏳ 大限盤 (當前十年大運: {{ chart.palaces[chart.currentBigLimitIndex].bigLimitRange }}歲)
        </button>
        <button
          class="tab-btn"
          :class="{ active: mode === 'flow_year' }"
          @click="emit('changeMode', 'flow_year')"
        >
          📅 流年盤 ({{ chart.targetYear }}年 {{ chart.targetYearGanZhi }})
        </button>
      </div>

      <div class="legend">
        <span class="legend-item"><span class="dot sel"></span> 本位</span>
        <span class="legend-item"><span class="dot opp"></span> 對宮 (遷移位)</span>
        <span class="legend-item"><span class="dot tri"></span> 三合宮 (三方四正)</span>
      </div>
    </div>

    <!-- 4x4 宮位網格盤面 -->
    <div class="grid-board">
      <template v-for="(row, rIdx) in gridLayout" :key="rIdx">
        <template v-for="(cellIdx, cIdx) in row" :key="cIdx">
          <!-- 中宮資訊區域 (佔據中央 2x2: cellIdx 為 -1, -2, -3, -4) -->
          <div
            v-if="cellIdx === -1"
            class="palace-cell center-cell"
            style="grid-column: 2 / span 2; grid-row: 2 / span 2;"
          >
            <div class="center-content">
              <h3 class="center-title">紫微斗數命盤</h3>
              <div class="center-meta">
                <div class="meta-row">
                  <span class="label">命造：</span>
                  <span class="val">{{ chart.gender === '男' ? '乾造' : '坤造' }} ({{ chart.currentAge }} 歲)</span>
                </div>
                <div class="meta-row">
                  <span class="label">陽曆：</span>
                  <span class="val">{{ chart.solarDate }}</span>
                </div>
                <div class="meta-row">
                  <span class="label">農曆：</span>
                  <span class="val highlight-gold">{{ chart.lunarDate }}</span>
                </div>
                <div class="meta-row">
                  <span class="label">八字：</span>
                  <span class="val">{{ chart.yearGanZhi }}年 {{ chart.monthGanZhi }}月 {{ chart.dayGanZhi }}日 {{ chart.hourGanZhi }}時</span>
                </div>
                <div class="meta-row">
                  <span class="label">局象：</span>
                  <span class="val highlight-cyan">{{ chart.fiveElementsBureau }}</span>
                </div>
                <div class="meta-row">
                  <span class="label">星主：</span>
                  <span class="val">命主【{{ chart.destinyMaster }}】・ 身主【{{ chart.bodyMaster }}】</span>
                </div>
              </div>
              <div class="center-tip">
                👉 點擊外圍任一宮位，即可即時連動三方四正高亮與下方深度面向分析
              </div>
            </div>
          </div>

          <!-- 12 個實體外圍宮位 -->
          <div
            v-else-if="cellIdx >= 0"
            class="palace-cell"
            :class="[isHighlight(cellIdx)]"
            @click="emit('selectPalace', cellIdx)"
          >
            <!-- 宮位頂部標籤 -->
            <div class="palace-header">
              <span class="palace-stem-branch">{{ getPalace(cellIdx)?.heavenStem }}{{ getPalace(cellIdx)?.earthBranch }}</span>
              <span class="palace-name" :class="{ 'is-body': getPalace(cellIdx)?.isBodyPalace }">
                {{ mode === 'big_limit' ? getPalace(cellIdx)?.bigLimitName : mode === 'flow_year' ? getPalace(cellIdx)?.flowYearName : getPalace(cellIdx)?.name }}
                <small v-if="getPalace(cellIdx)?.isBodyPalace" class="body-tag">[身宮]</small>
              </span>
            </div>

            <!-- 主星與四化 -->
            <div class="stars-area">
              <div class="major-stars">
                <div
                  v-for="star in getPalace(cellIdx)?.majorStars"
                  :key="star.name"
                  class="star-badge major"
                >
                  <span class="star-name">{{ star.name }}</span>
                  <span class="star-bright">{{ star.brightness }}</span>
                  <span v-if="star.sihua" class="sihua-tag" :class="star.sihua">
                    {{ star.sihua }}
                  </span>
                  <span v-if="star.flowSihua" class="sihua-tag flow" :class="star.flowSihua">
                    {{ star.flowSihua }}
                  </span>
                </div>
              </div>

              <!-- 吉星與輔星 -->
              <div class="minor-stars">
                <span
                  v-for="m in getPalace(cellIdx)?.minorStars"
                  :key="m.name"
                  class="star-badge minor"
                  :class="{ lucun: m.name === '祿存' }"
                >
                  {{ m.name }}
                </span>
                <span
                  v-for="b in getPalace(cellIdx)?.badStars"
                  :key="b.name"
                  class="star-badge bad"
                >
                  {{ b.name }}
                </span>
                <span
                  v-for="f in getPalace(cellIdx)?.flowStars"
                  :key="f.name"
                  class="star-badge flow"
                >
                  {{ f.name }}
                </span>
              </div>
            </div>

            <!-- 宮位底部年齡與宮名重疊資訊 -->
            <div class="palace-footer">
              <span class="limit-age">{{ getPalace(cellIdx)?.bigLimitRange }}</span>
              <span v-if="mode !== 'original'" class="overlay-original-name">
                (本:{{ getPalace(cellIdx)?.name }})
              </span>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.chart-board-container {
  background: #090d16;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  margin-bottom: 24px;
}

.chart-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
  border-bottom: 1px solid #1e293b;
  padding-bottom: 10px;
}

.chart-tabs {
  display: flex;
  gap: 8px;
}

.tab-btn {
  background: #1e293b;
  color: #94a3b8;
  border: 1px solid #334155;
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #334155;
  color: #f8fafc;
}

.tab-btn.active {
  background: #d97706;
  border-color: #f59e0b;
  color: #fff;
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.4);
}

.legend {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: #94a3b8;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.dot.sel { background: #e11d48; box-shadow: 0 0 6px #e11d48; }
.dot.opp { background: #3b82f6; box-shadow: 0 0 6px #3b82f6; }
.dot.tri { background: #10b981; box-shadow: 0 0 6px #10b981; }

.grid-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, minmax(130px, 1fr));
  gap: 6px;
  background: #020617;
  border: 2px solid #334155;
  border-radius: 8px;
  padding: 6px;
}

.palace-cell {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.palace-cell:hover {
  border-color: #64748b;
  background: #1e293b;
}

.palace-cell.is-selected {
  border: 2px solid #f43f5e !important;
  background: rgba(244, 63, 94, 0.12) !important;
  box-shadow: inset 0 0 12px rgba(244, 63, 94, 0.35);
}

.palace-cell.is-opposite {
  border: 2px solid #38bdf8 !important;
  background: rgba(56, 189, 248, 0.1) !important;
  box-shadow: inset 0 0 10px rgba(56, 189, 248, 0.3);
}

.palace-cell.is-triangle {
  border: 2px solid #34d399 !important;
  background: rgba(52, 211, 153, 0.1) !important;
  box-shadow: inset 0 0 10px rgba(52, 211, 153, 0.3);
}

.palace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #334155;
  padding-bottom: 4px;
}

.palace-stem-branch {
  font-size: 13px;
  font-weight: 700;
  color: #cbd5e1;
}

.palace-name {
  font-size: 13px;
  font-weight: 700;
  color: #f59e0b;
}

.palace-name.is-body {
  color: #ec4899;
}

.body-tag {
  font-size: 10px;
  color: #ec4899;
  margin-left: 2px;
}

.stars-area {
  margin: 6px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.major-stars {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.star-badge.major {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: rgba(225, 29, 72, 0.15);
  border: 1px solid rgba(225, 29, 72, 0.4);
  border-radius: 4px;
  padding: 1px 4px;
}

.star-badge.major .star-name {
  font-size: 13px;
  font-weight: 700;
  color: #fda4af;
}

.star-badge.major .star-bright {
  font-size: 10px;
  color: #94a3b8;
}

.sihua-tag {
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  border-radius: 3px;
  padding: 0 2px;
}

.sihua-tag.祿 { background: #16a34a; }
.sihua-tag.權 { background: #dc2626; }
.sihua-tag.科 { background: #2563eb; }
.sihua-tag.忌 { background: #7c3aed; }
.sihua-tag.flow { border: 1px solid #fff; }

.minor-stars {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.star-badge.minor {
  font-size: 11px;
  color: #38bdf8;
}

.star-badge.minor.lucun {
  color: #facc15;
  font-weight: 700;
}

.star-badge.bad {
  font-size: 11px;
  color: #fb7185;
}

.star-badge.flow {
  font-size: 11px;
  color: #c084fc;
}

.palace-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #64748b;
  border-top: 1px dashed #1e293b;
  padding-top: 3px;
}

.overlay-original-name {
  color: #d97706;
  font-weight: 600;
}

/* 中宮樣式 */
.center-cell {
  background: radial-gradient(circle, #1e293b 0%, #0b1329 100%) !important;
  border: 2px solid #b45309 !important;
  cursor: default !important;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
}

.center-content {
  text-align: center;
  width: 100%;
}

.center-title {
  font-size: 20px;
  font-weight: 800;
  color: #fbbf24;
  letter-spacing: 2px;
  margin: 0 0 12px 0;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
}

.center-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #cbd5e1;
  text-align: left;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 8px;
  padding: 10px 14px;
}

.meta-row {
  display: flex;
  align-items: baseline;
}

.meta-row .label {
  width: 50px;
  color: #94a3b8;
  font-weight: 600;
}

.highlight-gold {
  color: #f59e0b;
  font-weight: 700;
}

.highlight-cyan {
  color: #38bdf8;
  font-weight: 700;
}

.center-tip {
  margin-top: 12px;
  font-size: 12px;
  color: #fbbf24;
  font-style: italic;
}
</style>
