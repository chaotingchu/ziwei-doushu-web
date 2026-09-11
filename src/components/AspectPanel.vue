<script setup lang="ts">
import { computed } from 'vue';
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
          <h3 class="analysis-title">{{ analysis.title }}</h3>
          <span class="palace-badge">對應宮位：【{{ analysis.targetPalaceName }}】坐【{{ analysis.targetBranch }}宮】</span>
        </div>
        <p class="scope-desc">{{ analysis.scopeDesc }}</p>
      </div>

      <!-- 1. 👑 通俗大白話總結 (最上方！一般人一秒看懂，越白話越前面) -->
      <div v-if="analysis.plainSummary" class="section-box plain-summary-box">
        <div class="plain-summary-header">
          <span class="plain-badge">👑 通俗白話解讀</span>
          <span class="plain-sub">不用懂斗數術語，一分鐘了解重點</span>
        </div>
        <p class="plain-text">{{ analysis.plainSummary }}</p>
      </div>

      <!-- 2. 🔀 宮位專屬：玄空飛星與自化追蹤卡 (含白話因果故事) -->
      <div v-if="analysis.palaceSihuaSummary" class="palace-sihua-box">
        <div class="sihua-box-header">
          <span class="sihua-box-title">🔀 宮干【{{ analysis.palaceSihuaSummary.stem }}】玄空飛星與自化連鎖</span>
          <span class="sihua-box-badge">動態因果與受災點</span>
        </div>
        <div class="sihua-box-body">
          <!-- 💡 飛星因果大白話串聯 (最前面先看懂故事) -->
          <div v-if="analysis.palaceSihuaSummary.plainStory" class="sihua-plain-story">
            <span class="story-badge">💡 飛星因果白話解讀：</span>
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

      <!-- 3. ⚠️ 致命性格盲點與潛在隱患 (講壞的、講缺點、不粉飾太平) -->
      <div v-if="analysis.blindSpots && analysis.blindSpots.length > 0" class="section-box blind-spots-box">
        <div class="alert-header">
          <span class="blind-badge">⚠️ 致命性格盲點與隱患剖析</span>
          <span class="blind-sub">直言不諱・客觀剖析劣勢與陷阱</span>
        </div>
        <ul class="clean-list alert-list">
          <li v-for="(bs, bIdx) in analysis.blindSpots" :key="bIdx">
            {{ bs }}
          </li>
        </ul>
      </div>

      <!-- 4. 🛠️ 具體自我改進與修為指引 (需要自己改進的部分) -->
      <div v-if="analysis.improvements && analysis.improvements.length > 0" class="section-box improvements-box">
        <div class="improve-header">
          <span class="improve-badge">🛠️ 自我修為與具體改進功課</span>
          <span class="improve-sub">化解盲點・打破慣性與命運循環的關鍵行動</span>
        </div>
        <ul class="clean-list improve-list">
          <li v-for="(imp, iIdx) in analysis.improvements" :key="iIdx">
            {{ imp }}
          </li>
        </ul>
      </div>

      <!-- 5. 💡 指引與建議 (Advice) -->
      <div v-if="analysis.advice.length > 0" class="section-box advice-box">
        <h4 class="section-title">💡 趨吉避凶指引與行運建議</h4>
        <ul class="clean-list">
          <li v-for="(adv, aIdx) in analysis.advice" :key="aIdx">
            {{ adv }}
          </li>
        </ul>
      </div>

      <!-- 6. 核心特徵與技術星曜提要 (進入專業技術分析) -->
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

      <!-- 7. 📖 詳解文章 (技術專論深入斷語，放後面) -->
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

      <!-- 🌸 聖嚴法師心靈指引與佛法正信開示 (Gem專用智庫直達) -->
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
  gap: 10px;
  margin-bottom: 8px;
}

.analysis-title {
  font-size: 22px;
  font-weight: 800;
  color: #fbbf24;
  margin: 0;
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
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
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
  margin-bottom: 0;
}

.advice-box .section-title {
  color: #34d399;
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
</style>
