<script setup lang=ts>
import { computed } from 'vue';
import { ChartData, ChartType, Palace, SihuaType } from '../core/types';
import { calculatePalaceFlyingSihua } from '../core/ziwei_rules';

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

// 當前選中宮位的玄空飛星資訊
const currentFlyingSihua = computed(() => {
  return calculatePalaceFlyingSihua(props.chart, props.selectedPalaceIndex);
});

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

// 取得某宮位被當前選中宮位飛入的四化標籤
function getFlyingTag(idx: number): { type: SihuaType; star: string; isSelf: boolean } | null {
  if (idx < 0) return null;
  const fs = currentFlyingSihua.value.targets;
  if (fs.ji.toPalaceIndex === idx) return { type: '忌', star: fs.ji.star, isSelf: fs.ji.isSelf };
  if (fs.lu.toPalaceIndex === idx) return { type: '祿', star: fs.lu.star, isSelf: fs.lu.isSelf };
  if (fs.quan.toPalaceIndex === idx) return { type: '權', star: fs.quan.star, isSelf: fs.quan.isSelf };
  if (fs.ke.toPalaceIndex === idx) return { type: '科', star: fs.ke.star, isSelf: fs.ke.isSelf };
  return null;
}

// 判斷該宮位是否被當前選中宮位的忌星「沖破」
function isClashed(idx: number): boolean {
  if (idx < 0) return false;
  return currentFlyingSihua.value.targets.ji.clashPalaceIndex === idx;
}

// 判斷星曜是否在自宮自化
function getSelfSihuaForStar(palaceIdx: number, starName: string): SihuaType | null {
  const p = getPalace(palaceIdx);
  if (!p) return null;
  const fs = calculatePalaceFlyingSihua(props.chart, palaceIdx);
  for (const key of ['lu', 'quan', 'ke', 'ji'] as const) {
    const t = fs.targets[key];
    if (t.isSelf && t.star === starName) {
      return t.sihua;
    }
  }
  return null;
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
        <span class="legend-item"><span class="dot sel"></span> 選中發射宮</span>
        <span class="legend-item"><span class="dot fly-lu"></span> 祿入</span>
        <span class="legend-item"><span class="dot fly-quan"></span> 權入</span>
        <span class="legend-item"><span class="dot fly-ke"></span> 科入</span>
        <span class="legend-item"><span class="dot fly-ji"></span> 忌入</span>
        <span class="legend-item"><span class="dot clash"></span> ⚠️沖破</span>
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
              
              <!-- 基礎生辰資料盒 -->
              <div class="center-meta">
                <div class="meta-row">
                  <span class="label">命造：</span>
                  <span class="val">{{ chart.gender === '男' ? '乾造' : '坤造' }} ({{ chart.currentAge }} 歲)</span>
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
                  <span class="sub-label ml-2">星主：</span>
                  <span class="val">{{ chart.destinyMaster }}/{{ chart.bodyMaster }}</span>
                </div>
              </div>

              <!-- 🔀 當前選中宮位的玄空四化動態軌跡卡 -->
              <div class="flying-sihua-box">
                <div class="flying-box-title">
                  <span>🔀【{{ currentFlyingSihua.fromPalaceName }}】({{ currentFlyingSihua.fromPalaceStem }}) 玄空飛星軌跡</span>
                </div>
                <div class="flying-items-grid">
                  <div class="flying-item item-lu">
                    <span class="fly-badge lu">祿入</span>
                    <span class="fly-desc">{{ currentFlyingSihua.targets.lu.toPalaceName }} ({{ currentFlyingSihua.targets.lu.star }})</span>
                  </div>
                  <div class="flying-item item-quan">
                    <span class="fly-badge quan">權入</span>
                    <span class="fly-desc">{{ currentFlyingSihua.targets.quan.toPalaceName }} ({{ currentFlyingSihua.targets.quan.star }})</span>
                  </div>
                  <div class="flying-item item-ke">
                    <span class="fly-badge ke">科入</span>
                    <span class="fly-desc">{{ currentFlyingSihua.targets.ke.toPalaceName }} ({{ currentFlyingSihua.targets.ke.star }})</span>
                  </div>
                  <div class="flying-item item-ji">
                    <span class="fly-badge ji">{{ currentFlyingSihua.fromPalaceName === '命宮' ? '癡情忌' : '忌入' }}</span>
                    <span class="fly-desc">{{ currentFlyingSihua.targets.ji.toPalaceName }} ({{ currentFlyingSihua.targets.ji.star }})</span>
                  </div>
                </div>
                <div v-if="currentFlyingSihua.targets.ji.clashPalaceName" class="flying-clash-alert">
                  ⚠️ 忌入{{ currentFlyingSihua.targets.ji.toPalaceName }}，直沖【{{ currentFlyingSihua.targets.ji.clashPalaceName }}】（受災破耗點）
                </div>
              </div>

              <div class="center-tip">
                👉 點擊外圍任一宮位，即時連動全盤飛星落點、沖宮與下方深度解讀
              </div>
            </div>
          </div>

          <!-- 12 個實體外圍宮位 -->
          <div
            v-else-if="cellIdx >= 0"
            class="palace-cell"
            :class="[isHighlight(cellIdx), isClashed(cellIdx) ? 'is-clashed' : '']"
            @click="emit('selectPalace', cellIdx)"
          >
            <!-- 宮位頂部標籤 (天干地支與宮名，絕不被遮擋) -->
            <div class="palace-header">
              <span class="palace-stem-branch">{{ getPalace(cellIdx)?.heavenStem }}{{ getPalace(cellIdx)?.earthBranch }}</span>
              <span class="palace-name" :class="{ 'is-body': getPalace(cellIdx)?.isBodyPalace }">
                {{ mode === 'big_limit' ? getPalace(cellIdx)?.bigLimitName : mode === 'flow_year' ? getPalace(cellIdx)?.flowYearName : getPalace(cellIdx)?.name }}
                <small v-if="getPalace(cellIdx)?.isBodyPalace" class="body-tag">[身宮]</small>
              </span>
            </div>

            <!-- 宮內空檔區：玄空飛星圓圈標章 & 受沖徽章 (在宮內優雅展示，不遮字) -->
            <div v-if="getFlyingTag(cellIdx) || isClashed(cellIdx)" class="palace-fly-status-row">
              <!-- 飛入圓角徽章 -->
              <div v-if="getFlyingTag(cellIdx)" class="fly-circle-tag" :class="getFlyingTag(cellIdx)?.type">
                <span class="fly-icon-badge">{{ getFlyingTag(cellIdx)?.type }}</span>
                <span class="fly-text">
                  <template v-if="getFlyingTag(cellIdx)?.isSelf">自化{{ getFlyingTag(cellIdx)?.type }} ↺</template>
                  <template v-else-if="selectedPalaceIndex === chart.originalLifeIndex && getFlyingTag(cellIdx)?.type === '忌'">痴情忌入 ({{ getFlyingTag(cellIdx)?.star }})</template>
                  <template v-else>{{ getFlyingTag(cellIdx)?.type }}入 ({{ getFlyingTag(cellIdx)?.star }})</template>
                </span>
              </div>
              <!-- 沖破警示圓角徽章 -->
              <div v-if="isClashed(cellIdx)" class="clash-circle-tag">
                <span class="clash-icon-badge">沖</span>
                <span class="clash-text">對宮忌沖受克</span>
              </div>
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
                  <!-- 自化標記 -->
                  <span v-if="getSelfSihuaForStar(cellIdx, star.name)" class="sihua-tag self" :class="getSelfSihuaForStar(cellIdx, star.name)">
                    自{{ getSelfSihuaForStar(cellIdx, star.name) }}↺
                  </span>
                </div>
              </div>

              <!-- 吉星與輔星 -->
              <div class="minor-stars">
                <span
                  v-for="m in getPalace(cellIdx)?.minorStars"
                  :key="m.name"
                  class="star-badge minor"
                  :class="{ lucun: m.name === '祿存', peach: m.name === '紅鸞' || m.name === '天喜' }"
                >
                  {{ m.name }}
                  <span v-if="getSelfSihuaForStar(cellIdx, m.name)" class="sihua-tag self" :class="getSelfSihuaForStar(cellIdx, m.name)">
                    自{{ getSelfSihuaForStar(cellIdx, m.name) }}↺
                  </span>
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
.sihua-tag.self { 
  background: transparent;
  border: 1px dashed #f59e0b;
  color: #fde047;
  font-size: 8px;
  padding: 0 2px;
}
.sihua-tag.self.忌 {
  border-color: #ef4444;
  color: #fca5a5;
}

/* 宮內飛星狀態列 (不擋宮頭，善用宮內留白空間) */
.palace-fly-status-row {
  margin: 4px 0 2px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* 飛星圓圈標章 (帶小圓圈符號與清晰文字) */
.fly-circle-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(15, 23, 42, 0.85);
  border-radius: 12px;
  padding: 1px 7px 1px 2px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid;
}

.fly-icon-badge {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 800;
  color: #fff;
}

.fly-circle-tag.祿 {
  border-color: #22c55e;
  color: #86efac;
  background: rgba(34, 197, 94, 0.12);
}
.fly-circle-tag.祿 .fly-icon-badge {
  background: #16a34a;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
}

.fly-circle-tag.權 {
  border-color: #ef4444;
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.12);
}
.fly-circle-tag.權 .fly-icon-badge {
  background: #dc2626;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.6);
}

.fly-circle-tag.科 {
  border-color: #3b82f6;
  color: #93c5fd;
  background: rgba(59, 130, 246, 0.12);
}
.fly-circle-tag.科 .fly-icon-badge {
  background: #2563eb;
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.6);
}

.fly-circle-tag.忌 {
  border-color: #a855f7;
  color: #d8b4fe;
  background: rgba(168, 85, 247, 0.12);
}
.fly-circle-tag.忌 .fly-icon-badge {
  background: #7c3aed;
  box-shadow: 0 0 6px rgba(168, 85, 247, 0.6);
}

/* 受沖警示圓角徽章 */
.clash-circle-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(220, 38, 38, 0.15);
  border: 1px solid #ef4444;
  border-radius: 12px;
  padding: 1px 7px 1px 2px;
  font-size: 11px;
  font-weight: 700;
  color: #fca5a5;
}

.clash-icon-badge {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 800;
  background: #dc2626;
  color: #fef08a;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.7);
}

.palace-cell.is-clashed {
  border: 2px dashed #ef4444 !important;
  background: rgba(239, 68, 68, 0.06) !important;
}

.dot.fly-lu { background: #16a34a; box-shadow: 0 0 6px #16a34a; }
.dot.fly-quan { background: #dc2626; box-shadow: 0 0 6px #dc2626; }
.dot.fly-ke { background: #2563eb; box-shadow: 0 0 6px #2563eb; }
.dot.fly-ji { background: #7c3aed; box-shadow: 0 0 6px #7c3aed; }
.dot.clash { background: #ef4444; box-shadow: 0 0 6px #ef4444; }

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

.star-badge.minor.peach {
  color: #f472b6;
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
  padding: 14px;
}

.center-content {
  text-align: center;
  width: 100%;
}

.center-title {
  font-size: 18px;
  font-weight: 800;
  color: #fbbf24;
  letter-spacing: 2px;
  margin: 0 0 8px 0;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
}

.center-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #cbd5e1;
  text-align: left;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
}

.meta-row {
  display: flex;
  align-items: baseline;
}

.meta-row .label {
  width: 45px;
  color: #94a3b8;
  font-weight: 600;
}

.sub-label {
  color: #94a3b8;
  font-weight: 600;
}

.ml-2 {
  margin-left: 8px;
}

.highlight-gold {
  color: #f59e0b;
  font-weight: 700;
}

.highlight-cyan {
  color: #38bdf8;
  font-weight: 700;
}

/* 中宮飛星軌跡卡 */
.flying-sihua-box {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid #334155;
  border-radius: 6px;
  padding: 8px 10px;
  text-align: left;
}

.flying-box-title {
  font-size: 12px;
  font-weight: 700;
  color: #fbbf24;
  margin-bottom: 6px;
  border-bottom: 1px dashed #475569;
  padding-bottom: 3px;
}

.flying-items-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  font-size: 11px;
}

.flying-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.fly-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 3px;
  color: #fff;
  flex-shrink: 0;
}

.fly-badge.lu { background: #16a34a; }
.fly-badge.quan { background: #dc2626; }
.fly-badge.ke { background: #2563eb; }
.fly-badge.ji { background: #7c3aed; }

.fly-desc {
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flying-clash-alert {
  margin-top: 5px;
  font-size: 10.5px;
  color: #f87171;
  font-weight: 600;
  background: rgba(239, 68, 68, 0.12);
  border-radius: 4px;
  padding: 2px 6px;
}

.center-tip {
  margin-top: 8px;
  font-size: 11px;
  color: #fbbf24;
  font-style: italic;
}
</style>

