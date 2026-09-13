<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChartData, ChartType } from '../core/types';
import { AspectKey, analyzeAspect } from '../analysis/aspect_analyzer';

const props = defineProps<{
  chart: ChartData;
  mode: ChartType;
  currentAspect: AspectKey;
}>();

const emit = defineEmits<{
  (e: 'selectAspect', aspect: AspectKey): void;
}>();

const aspectsList: { key: AspectKey; label: string; icon: string }[] = [
  { key: 'destiny', label: '整體格局', icon: '🌟' },
  { key: 'xuankong', label: '玄空飛星', icon: '🔀' },
  { key: 'marriage', label: '婚姻感情', icon: '💑' },
  { key: 'wealth', label: '財運求財', icon: '💰' },
  { key: 'career', label: '事業升遷', icon: '💼' },
  { key: 'exam', label: '讀書考試', icon: '🎓' },
  { key: 'house', label: '買房祖業', icon: '🏠' },
  { key: 'children', label: '子女親子', icon: '👶' },
  { key: 'travel', label: '出外移居', icon: '✈️' },
  { key: 'blessing', label: '精神福德', icon: '🧘' },
  { key: 'friends', label: '人際合夥', icon: '🤝' },
  { key: 'parents', label: '長輩手足', icon: '👨‍👩‍👦' },
  { key: 'health', label: '健康疾難', icon: '🩺' },
  { key: 'religion', label: '宗教修行', icon: '📿' }
];

const analysis = computed(() => {
  return analyzeAspect(props.chart, props.mode, props.currentAspect);
});

// 是否顯示專業星曜名稱 (預設為 false: 純通俗大白話模式)
const showStarNames = ref(false);

// 去除星曜前綴以呈現純通俗解說
function formatPlainContent(text: string, showStars: boolean): string {
  if (showStars) return text;
  // 去除 【針對xx星】、【xx星之隱患】、【xx星】、【xx星修持致命盲點】等術語
  return text
    .replace(/^針對【[^】]+】：/, '')
    .replace(/^【[^】]+之隱患】：/, '')
    .replace(/^【[^】]+盲點】：/, '')
    .replace(/^【[^】]+功課】：/, '')
    .replace(/^【[^】]+改進】：/, '')
    .replace(/^【[^】]+衝破】：/, '')
    .replace(/^【[^】]+暗纏】：/, '')
    .replace(/^【[^】]+干擾】：/, '')
    .replace(/^【[^】]+業障】：/, '')
    .replace(/^【[^】]+化剋】：/, '')
    .replace(/^【無主星借對宮】：/, '自身立場容易隨波逐流：');
}
</script>

<template>
  <div class="aspect-panel-container">
    <!-- 面向切換按鈕列 -->
    <div class="aspect-nav">
      <button
        v-for="item in aspectsList"
        :key="item.key"
        class="aspect-btn"
        :class="{ active: currentAspect === item.key }"
        @click="emit('selectAspect', item.key)"
      >
        <span class="btn-icon">{{ item.icon }}</span>
        <span class="btn-label">{{ item.label }}</span>
      </button>
    </div>

    <!-- 深度解讀主內容卡片 -->
    <div class="analysis-card">
      <div class="card-header">
        <div class="title-wrap">
          <div class="title-and-toggle">
            <h3 class="analysis-title">{{ analysis.title }}</h3>
            <button
              class="toggle-mode-btn"
              :class="{ active: showStarNames }"
              @click="showStarNames = !showStarNames"
              :title="showStarNames ? '目前為專業星曜對照，點擊切換純白話模式' : '目前為通俗易懂模式，點擊切換專業星曜模式'"
            >
              <span class="toggle-icon">{{ showStarNames ? '🔍' : '🌟' }}</span>
              <span class="toggle-label">{{ showStarNames ? '專業星曜模式 (已開啟)' : '切換專業星曜解說' }}</span>
            </button>
          </div>
          <span class="palace-badge">對應宮位：【{{ analysis.targetPalaceName }}】坐【{{ analysis.targetBranch }}宮】</span>
        </div>
        <p class="scope-desc">{{ analysis.scopeDesc }}</p>
      </div>

      <!-- 1. 👑 通俗大白話總結 (一秒看懂，完全無術語) -->
      <div v-if="analysis.plainSummary" class="section-box plain-summary-box">
        <div class="plain-summary-header">
          <span class="plain-badge">👑 通俗白話解讀</span>
          <span class="plain-sub">不用懂斗數術語，一分鐘了解重點</span>
        </div>
        <p class="plain-text">{{ analysis.plainSummary }}</p>
      </div>

      <!-- 2. ⚠️ 致命性格盲點與潛在隱患 (講壞的、講缺點、不粉飾太平) -->
      <div v-if="analysis.blindSpots && analysis.blindSpots.length > 0" class="section-box blind-spots-box">
        <div class="alert-header">
          <div class="header-left">
            <span class="blind-badge">⚠️ 致命性格盲點與隱患剖析</span>
            <span class="blind-sub">{{ showStarNames ? '專業星曜對照・直言不諱客觀剖析' : '大白話解讀・直言不諱客觀剖析劣勢與陷阱' }}</span>
          </div>
          <button
            class="section-toggle-btn"
            @click="showStarNames = !showStarNames"
            :title="showStarNames ? '點擊隱藏星曜名稱' : '點擊顯示對應星曜'"
          >
            {{ showStarNames ? '切換通俗白話' : '✨ 顯示星曜對照' }}
          </button>
        </div>
        <ul class="clean-list alert-list">
          <li v-for="(bs, bIdx) in analysis.blindSpots" :key="bIdx">
            {{ formatPlainContent(bs, showStarNames) }}
          </li>
        </ul>
      </div>

      <!-- 3. 🛠️ 具體自我改進與修為指引 (需要自己改進的部分) -->
      <div v-if="analysis.improvements && analysis.improvements.length > 0" class="section-box improvements-box">
        <div class="improve-header">
          <div class="header-left">
            <span class="improve-badge">🛠️ 自我修為與具體改進功課</span>
            <span class="improve-sub">{{ showStarNames ? '專業星曜對照・化解盲點打破命運循環' : '大白話解說・化解盲點與具體行動' }}</span>
          </div>
          <button
            class="section-toggle-btn"
            @click="showStarNames = !showStarNames"
            :title="showStarNames ? '點擊隱藏星曜名稱' : '點擊顯示對應星曜'"
          >
            {{ showStarNames ? '切換通俗白話' : '✨ 顯示星曜對照' }}
          </button>
        </div>
        <ul class="clean-list improve-list">
          <li v-for="(imp, iIdx) in analysis.improvements" :key="iIdx">
            {{ formatPlainContent(imp, showStarNames) }}
          </li>
        </ul>
      </div>

      <!-- 4. 💡 指引與建議 (Advice) -->
      <div v-if="analysis.advice.length > 0" class="section-box advice-box">
        <h4 class="section-title">💡 趨吉避凶指引與生活開運建議</h4>
        <ul class="clean-list">
          <li v-for="(adv, aIdx) in analysis.advice" :key="aIdx">
            {{ adv }}
          </li>
        </ul>
      </div>

      <!-- 🌟 專業深度星盤與技術論斷專區 (預設收攏/透過按鈕切換展開，適合有研究紫微者) -->
      <div class="pro-technical-wrapper">
        <div class="pro-toggle-bar">
          <button
            class="btn-pro-expand"
            :class="{ active: showStarNames }"
            @click="showStarNames = !showStarNames"
          >
            <span class="icon">{{ showStarNames ? '📖 正在顯示專業星曜與深層技術分析' : '🔍 點此展開專業星盤格局、飛星因果與深度斷語' }}</span>
            <span class="state-pill">{{ showStarNames ? '點擊收起技術分析 ▴' : '含玄空飛星、古訣斷語 ▾' }}</span>
          </button>
        </div>

        <!-- 只有開啟專業模式時展開技術分析 -->
        <transition name="fade">
          <div v-if="showStarNames" class="pro-content-area">
            <!-- (A) 宮位專屬：玄空飛星與自化追蹤卡 -->
            <div v-if="analysis.palaceSihuaSummary" class="palace-sihua-box">
              <div class="sihua-box-header">
                <span class="sihua-box-title">🔀 宮干【{{ analysis.palaceSihuaSummary.stem }}】玄空飛星與自化連鎖</span>
                <span class="sihua-box-badge">動態因果與受災點</span>
              </div>
              <div class="sihua-box-body">
                <div v-if="analysis.palaceSihuaSummary.plainStory" class="sihua-plain-story">
                  <span class="story-badge">💡 飛星因果解讀：</span>
                  <span class="story-text">{{ analysis.palaceSihuaSummary.plainStory }}</span>
                </div>

                <div class="fly-out-row">
                  <span class="row-label">本宮向外發射：</span>
                  <div class="fly-out-tags">
                    <span v-for="(fo, fIdx) in analysis.palaceSihuaSummary.flyOut" :key="fIdx" class="fly-tag-pill">
                      {{ fo }}
                    </span>
                  </div>
                </div>
                <div v-if="analysis.palaceSihuaSummary.selfSihua.length > 0" class="self-row">
                  <span class="row-label">本宮自化消散：</span>
                  <span class="self-highlight">
                    ⚠️ {{ analysis.palaceSihuaSummary.selfSihua.join('、') }}（主氣數自我內耗、成果容易莫名流失）
                  </span>
                </div>
                <div v-if="analysis.palaceSihuaSummary.clashedBy && analysis.palaceSihuaSummary.clashedBy.length > 0" class="clashed-by-row">
                  <span class="row-label">⚠️ 外部受災沖擊：</span>
                  <span class="clash-highlight">
                    遭 {{ analysis.palaceSihuaSummary.clashedBy.join('、') }}（此為該面向遭遇阻力或危機的幕後元凶！）
                  </span>
                </div>
              </div>
            </div>

            <!-- (B) 核心特徵與格局氣數 -->
            <div class="summary-pills">
              <div v-for="(sum, sIdx) in analysis.starsSummary" :key="sIdx" class="pill">
                {{ sum }}
              </div>
            </div>

            <div v-if="analysis.keyHighlights.length > 0" class="section-box highlights-box">
              <h4 class="section-title">📌 核心特徵與格局氣數</h4>
              <ul class="clean-list">
                <li v-for="(hl, hIdx) in analysis.keyHighlights" :key="hIdx">
                  {{ hl }}
                </li>
              </ul>
            </div>

            <!-- (C) 講義專論深度斷語解說 -->
            <div class="section-box detail-box">
              <h4 class="section-title">📖 講義專論深度斷語解說</h4>
              <div v-if="analysis.detailedExplanations.length > 0" class="paragraphs">
                <p v-for="(para, pIdx) in analysis.detailedExplanations" :key="pIdx">
                  {{ para }}
                </p>
              </div>
              <div v-else class="empty-tip">
                該宮星曜組合平穩，請參酌對宮與三方四正之吉凶星氣數綜合論斷。
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 🌸 佛法心靈環保開示 (源自聖嚴法師法鼓全集正信佛法智慧) -->
      <div v-if="analysis.masterGuidance" class="section-box master-box">
        <div class="master-header">
          <div class="master-title-wrap">
            <span class="master-icon">🌸</span>
            <h4 class="master-title">{{ analysis.masterGuidance.title }}</h4>
          </div>
          <span class="master-badge">法鼓山正信佛法・心靈環保</span>
        </div>
        
        <p class="master-summary">{{ analysis.masterGuidance.summary }}</p>
        
        <div class="master-practice">
          <span class="practice-label">🌱【生活實踐心法】：</span>
          <span class="practice-text">{{ analysis.masterGuidance.practice }}</span>
        </div>

        <!-- 延伸學習直達連結 -->
        <div v-if="analysis.masterGuidance.links && analysis.masterGuidance.links.length > 0" class="master-links">
          <div class="links-title">📚 延伸閱讀與影音聞法：</div>
          <div class="links-grid">
            <a
              v-for="(link, lIdx) in analysis.masterGuidance.links"
              :key="lIdx"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="master-link-item"
              :class="link.type"
            >
              <span class="link-badge">{{ link.type === 'youtube' ? '▶ YouTube 大法鼓' : '📖 法鼓全集' }}</span>
              <span class="link-name">{{ link.title }}</span>
              <span class="link-arrow">↗</span>
            </a>
          </div>
        </div>

        <!-- 🤖 《法鼓全集》智慧解說 AI 對話室 (Google Gem 大數據智庫連結) -->
        <div class="gemini-gem-card">
          <div class="gem-header">
            <div class="gem-title-wrap">
              <span class="gem-icon">✨</span>
              <span class="gem-title">遇到困惑想深入請教？「法鼓全集」智慧解說 AI</span>
            </div>
            <span class="gem-badge">Gemini Gem 智庫</span>
          </div>
          <p class="gem-desc">
            若對星盤盲點、人生因果或心靈卡關有不理解之處，歡迎點擊下方進入專屬 AI 對話室。此 Google Gem 系統單純連結了《法鼓全集》完整文獻與大數據智慧，能針對您的提問提供客觀、慈悲的正信佛法解讀與生活疏導。
          </p>
          <a
            href="https://gemini.google.com/gem/14Ctk6nL941tvvbGxQ4FIx5wph_98HtAh?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            class="gem-action-btn"
          >
            <span class="btn-icon">💬</span>
            <span class="btn-text">開啟「法鼓全集」智慧解說 AI 對話室</span>
            <span class="btn-arrow">↗</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aspect-panel-container {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.aspect-nav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  border-bottom: 1px solid #1e293b;
  padding-bottom: 14px;
}

.aspect-btn {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 8px 16px;
  color: #cbd5e1;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.aspect-btn:hover {
  background: #334155;
  color: #f8fafc;
}

.aspect-btn.active {
  background: linear-gradient(135deg, #b45309 0%, #78350f 100%);
  border-color: #f59e0b;
  color: #fff;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35);
}

.analysis-card {
  background: #090d16;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 24px;
}

.card-header {
  margin-bottom: 18px;
  border-bottom: 1px dashed #1e293b;
  padding-bottom: 14px;
}

.title-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.title-and-toggle {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.analysis-title {
  font-size: 22px;
  font-weight: 800;
  color: #fbbf24;
  margin: 0;
}

.toggle-mode-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid #475569;
  color: #cbd5e1;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-mode-btn:hover {
  border-color: #fbbf24;
  color: #fbbf24;
  background: rgba(51, 65, 85, 0.8);
}

.toggle-mode-btn.active {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.25) 0%, rgba(180, 83, 9, 0.15) 100%);
  border-color: #f59e0b;
  color: #fef08a;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.2);
}

.palace-badge {
  background: #1e293b;
  border: 1px solid #475569;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 13px;
  color: #38bdf8;
  font-weight: 600;
}

.scope-desc {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

.summary-pills {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.pill {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid #334155;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  color: #e2e8f0;
}

/* 宮位專屬飛星與自化追蹤盒 */
.palace-sihua-box {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid #4338ca;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
}

.sihua-box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #334155;
  padding-bottom: 6px;
  margin-bottom: 8px;
}

.sihua-box-title {
  font-size: 14px;
  font-weight: 700;
  color: #a5b4fc;
}

.sihua-box-badge {
  font-size: 11px;
  color: #c7d2fe;
  background: #3730a3;
  padding: 2px 6px;
  border-radius: 4px;
}

.sihua-box-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}

.fly-out-row, .self-row, .clashed-by-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.row-label {
  color: #94a3b8;
  font-weight: 600;
  flex-shrink: 0;
}

.fly-out-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.fly-tag-pill {
  background: rgba(55, 48, 163, 0.35);
  border: 1px solid #6366f1;
  color: #e0e7ff;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
}

.self-highlight {
  color: #fde047;
  font-weight: 600;
}

.clash-highlight {
  color: #f87171;
  font-weight: 600;
}

.sihua-plain-story {
  margin-top: 6px;
  background: rgba(30, 41, 59, 0.7);
  border-left: 3px solid #fbbf24;
  border-radius: 0 6px 6px 0;
  padding: 8px 12px;
  line-height: 1.6;
  font-size: 13px;
}

.story-badge {
  color: #fbbf24;
  font-weight: 700;
  margin-right: 4px;
}

.story-text {
  color: #f1f5f9;
}

.section-box {
  margin-bottom: 20px;
  border-radius: 8px;
  padding: 16px;
}

.plain-summary-box {
  background: linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(180, 83, 9, 0.08) 100%);
  border: 1px solid rgba(245, 158, 11, 0.4);
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.1);
  position: relative;
}

.plain-summary-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.plain-badge {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.plain-sub {
  color: #94a3b8;
  font-size: 13px;
}

.plain-text {
  font-size: 15px;
  line-height: 1.85;
  color: #fef08a;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.highlights-box {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.highlights-box .section-title {
  color: #f59e0b;
}

/* ⚠️ 致命性格盲點與隱患剖析 (警示紅橙風格) */
.blind-spots-box {
  background: linear-gradient(135deg, rgba(225, 29, 72, 0.12) 0%, rgba(159, 18, 57, 0.06) 100%);
  border: 1px solid rgba(244, 63, 94, 0.35);
  box-shadow: 0 4px 16px rgba(225, 29, 72, 0.1);
}

.alert-header, .improve-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.section-toggle-btn {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.section-toggle-btn:hover {
  border-color: #f59e0b;
  color: #fbbf24;
  background: rgba(30, 41, 59, 0.8);
}

.blind-badge {
  background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.blind-sub {
  color: #fda4af;
  font-size: 13px;
}

.alert-list li {
  color: #ffe4e6;
  margin-bottom: 6px;
}

/* 🛠️ 具體自我改進與修為指引 (翠綠方針風格) */
.improvements-box {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.06) 100%);
  border: 1px solid rgba(16, 185, 129, 0.35);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
}

.improve-badge {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.improve-sub {
  color: #6ee7b7;
  font-size: 13px;
}

.improve-list li {
  color: #d1fae5;
  margin-bottom: 6px;
}

.detail-box {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid #1e293b;
}

.detail-box .section-title {
  color: #38bdf8;
}

.paragraphs p {
  font-size: 14px;
  line-height: 1.8;
  color: #cbd5e1;
  margin: 0 0 12px 0;
}

.advice-box {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  margin-bottom: 16px;
}

.advice-box .section-title {
  color: #34d399;
}

/* 專業深度星盤與技術論斷專區折疊卡 */
.pro-technical-wrapper {
  margin: 20px 0 24px 0;
}

.pro-toggle-bar {
  display: flex;
  justify-content: center;
}

.btn-pro-expand {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid #3b82f6;
  border-radius: 8px;
  color: #93c5fd;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.btn-pro-expand:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
  border-color: #60a5fa;
}

.btn-pro-expand.active {
  background: linear-gradient(135deg, #1e293b 0%, #1e1b4b 100%);
  border-color: #a855f7;
  color: #e9d5ff;
}

.btn-pro-expand .state-pill {
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
}

.pro-content-area {
  margin-top: 14px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px dashed #3b82f6;
  border-radius: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.clean-list {
  margin: 0;
  padding-left: 20px;
  color: #cbd5e1;
  font-size: 14px;
  line-height: 1.8;
}

.empty-tip {
  color: #64748b;
  font-size: 14px;
  font-style: italic;
}

/* 🌸 聖嚴法師心靈指引卡片樣式 */
.master-box {
  margin-top: 24px;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(79, 70, 229, 0.06) 100%);
  border: 1px solid rgba(168, 85, 247, 0.35);
  box-shadow: 0 4px 20px rgba(147, 51, 234, 0.12);
  border-radius: 10px;
  padding: 20px;
}

.master-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
  border-bottom: 1px dashed rgba(168, 85, 247, 0.25);
  padding-bottom: 10px;
}

.master-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.master-icon {
  font-size: 20px;
}

.master-title {
  color: #c084fc;
  font-size: 17px;
  font-weight: 800;
  margin: 0;
}

.master-badge {
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.4);
  color: #e9d5ff;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.master-summary {
  font-size: 14.5px;
  line-height: 1.85;
  color: #e2e8f0;
  margin: 0 0 14px 0;
  letter-spacing: 0.2px;
}

.master-practice {
  background: rgba(15, 23, 42, 0.6);
  border-left: 3px solid #a855f7;
  padding: 10px 14px;
  border-radius: 4px;
  margin-bottom: 18px;
  font-size: 14px;
  line-height: 1.7;
}

.practice-label {
  color: #a855f7;
  font-weight: 700;
}

.practice-text {
  color: #f1f5f9;
}

.master-links {
  border-top: 1px solid rgba(168, 85, 247, 0.2);
  padding-top: 14px;
}

.links-title {
  color: #cbd5e1;
  font-size: 13.5px;
  font-weight: 700;
  margin-bottom: 10px;
}

.links-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.master-link-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(30, 41, 59, 0.85);
  border: 1px solid #334155;
  border-radius: 6px;
  padding: 8px 12px;
  text-decoration: none;
  color: #cbd5e1;
  font-size: 13.5px;
  transition: all 0.2s ease;
  gap: 10px;
}

.master-link-item:hover {
  background: #334155;
  border-color: #a855f7;
  color: #f8fafc;
  transform: translateX(4px);
}

.link-badge {
  font-size: 11.5px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  white-space: nowrap;
}

.master-link-item.youtube .link-badge {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.master-link-item.ddc .link-badge {
  background: rgba(14, 165, 233, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(14, 165, 233, 0.4);
}

.link-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-arrow {
  color: #94a3b8;
  font-size: 14px;
}

/* 🤖 Gemini Gem 專屬 AI 對話卡片 */
.gemini-gem-card {
  margin-top: 18px;
  background: linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
  border: 1px solid rgba(168, 85, 247, 0.5);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.2);
}

.gem-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.gem-title-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.gem-icon {
  font-size: 16px;
  color: #facc15;
}

.gem-title {
  font-size: 14px;
  font-weight: 700;
  color: #f1f5f9;
}

.gem-badge {
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.gem-desc {
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.65;
  margin: 0 0 14px 0;
}

.gem-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #9333ea 0%, #6366f1 100%);
  color: #ffffff;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 2px 10px rgba(147, 51, 234, 0.4);
  transition: all 0.2s ease;
}

.gem-action-btn:hover {
  background: linear-gradient(135deg, #a855f7 0%, #4f46e5 100%);
  box-shadow: 0 4px 16px rgba(147, 51, 234, 0.6);
  transform: translateY(-1px);
  color: #ffffff;
}

.gem-action-btn .btn-arrow {
  font-size: 15px;
  transition: transform 0.2s;
}

.gem-action-btn:hover .btn-arrow {
  transform: translate(2px, -2px);
}
</style>
