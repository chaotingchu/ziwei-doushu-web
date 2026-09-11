<script setup lang="ts">
import { ref, computed } from 'vue';
import { calculateChart } from './core/ziwei_engine';
import { transformChartForDisplay } from './core/chart_transformer';
import { ChartType, Gender } from './core/types';
import { AspectKey } from './analysis/aspect_analyzer';
import InputPanel from './components/InputPanel.vue';
import ChartBoard from './components/ChartBoard.vue';
import AspectPanel from './components/AspectPanel.vue';

// 初始預設命盤參數 (1990年5月18日午時男命)
const birthParams = ref({
  year: 1990,
  month: 5,
  day: 18,
  hour: 12,
  gender: '男' as Gender,
  targetYear: 2026
});

// 當前盤別 (original: 本命, big_limit: 大限, flow_year: 流年)
const currentMode = ref<ChartType>('original');

// 當前選中的宮位索引 (預設為本命命宮)
const selectedPalaceIndex = ref<number>(2);

// 當前選中的深度分析面向
const currentAspect = ref<AspectKey>('destiny');

// 計算完整命盤
const baseChart = computed(() => {
  return calculateChart(
    birthParams.value.year,
    birthParams.value.month,
    birthParams.value.day,
    birthParams.value.hour,
    birthParams.value.gender,
    birthParams.value.targetYear
  );
});

// 根據所選盤別（本命/大限/流年）轉化後的展示盤面
const displayChart = computed(() => {
  return transformChartForDisplay(baseChart.value, currentMode.value);
});

// 處理立即排盤事件
function handleCalculate(payload: typeof birthParams.value) {
  birthParams.value = payload;
  // 更新後，將選中宮位重置為命宮
  selectedPalaceIndex.value = baseChart.value.originalLifeIndex;
}

function handleSelectPalace(index: number) {
  selectedPalaceIndex.value = index;
  // 根據點擊的宮位智能連動切換到對應分析面向
  const palace = displayChart.value.palaces[index];
  const pName = palace.name;
  if (pName === '夫妻宮') currentAspect.value = 'marriage';
  else if (pName === '財帛宮') currentAspect.value = 'wealth';
  else if (pName === '官祿宮') currentAspect.value = 'career';
  else if (pName === '田宅宮') currentAspect.value = 'house';
  else if (pName === '子女宮') currentAspect.value = 'children';
  else if (pName === '遷移宮') currentAspect.value = 'travel';
  else if (pName === '福德宮') currentAspect.value = 'blessing';
  else if (pName === '奴僕宮') currentAspect.value = 'friends';
  else if (pName === '父母宮' || pName === '兄弟宮') currentAspect.value = 'parents';
  else if (pName === '疾厄宮') currentAspect.value = 'health';
  else if (pName === '命宮') currentAspect.value = 'destiny';
}

function handleChangeMode(mode: ChartType) {
  currentMode.value = mode;
}

function handleSelectAspect(aspect: AspectKey) {
  currentAspect.value = aspect;
}
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="container">
        <!-- 頂部輸入區（單頁零跳轉即時排盤） -->
        <InputPanel @calculate="handleCalculate" />
      </div>
    </header>

    <main class="container main-content">
      <!-- 上半部：4x4 專業命盤盤面 (支援本命/大限/流年三盤切換與三方四正連線) -->
      <section class="chart-section">
        <ChartBoard
          :chart="displayChart"
          :mode="currentMode"
          :selectedPalaceIndex="selectedPalaceIndex"
          @selectPalace="handleSelectPalace"
          @changeMode="handleChangeMode"
        />
      </section>

      <!-- 下半部：多面向深度分析面板 (連動當前盤別，抽取自20篇Word講義) -->
      <section class="aspect-section">
        <AspectPanel
          :chart="displayChart"
          :mode="currentMode"
          :currentAspect="currentAspect"
          @selectAspect="handleSelectAspect"
        />
      </section>
    </main>

    <footer class="app-footer">
      <p>紫微斗數排盤與多面向深度分析系統・遵循正統中州派及古訣秘笈</p>
    </footer>
  </div>
</template>

<style>
/* 全域基本樣式 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans TC, sans-serif;
  background: #020617;
  color: #f8fafc;
  -webkit-font-smoothing: antialiased;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

.app-header {
  padding-top: 16px;
}

.main-content {
  padding-bottom: 40px;
}

.chart-section {
  margin-bottom: 12px;
}

.app-footer {
  text-align: center;
  padding: 24px 0;
  border-top: 1px solid #1e293b;
  color: #64748b;
  font-size: 13px;
}
</style>
