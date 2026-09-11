<script setup lang="ts">
import { ref } from 'vue';
import { Gender } from '../core/types';

const emit = defineEmits<{
  (e: 'calculate', payload: {
    year: number;
    month: number;
    day: number;
    hour: number;
    gender: Gender;
    targetYear: number;
  }): void;
}>();

const year = ref(1990);
const month = ref(5);
const day = ref(18);
const hour = ref(12);
const gender = ref<Gender>('男');
const targetYear = ref(2026);

const hoursList = [
  { value: 0, label: '子時 (23:00 - 01:00)' },
  { value: 2, label: '丑時 (01:00 - 03:00)' },
  { value: 4, label: '寅時 (03:00 - 05:00)' },
  { value: 6, label: '卯時 (05:00 - 07:00)' },
  { value: 8, label: '辰時 (07:00 - 09:00)' },
  { value: 10, label: '巳時 (09:00 - 11:00)' },
  { value: 12, label: '午時 (11:00 - 13:00)' },
  { value: 14, label: '未時 (13:00 - 15:00)' },
  { value: 16, label: '申時 (15:00 - 17:00)' },
  { value: 18, label: '酉時 (17:00 - 19:00)' },
  { value: 20, label: '戌時 (19:00 - 21:00)' },
  { value: 22, label: '亥時 (21:00 - 23:00)' }
];

function submit() {
  emit('calculate', {
    year: Number(year.value),
    month: Number(month.value),
    day: Number(day.value),
    hour: Number(hour.value),
    gender: gender.value,
    targetYear: Number(targetYear.value)
  });
}
</script>

<template>
  <div class="input-container">
    <div class="header-title">
      <span class="icon">☯</span>
      <div>
        <h2>紫微斗數在線排盤與多面向深度分析系統</h2>
        <span class="subtitle">（單頁即時分析・純前端計算・尊崇正統中州古訣・支援三盤聯動）</span>
      </div>
    </div>

    <form @submit.prevent="submit" class="form-grid">
      <div class="form-group">
        <label>公曆出生年份</label>
        <input type="number" v-model="year" min="1900" max="2100" required />
      </div>

      <div class="form-group">
        <label>月份</label>
        <select v-model="month">
          <option v-for="m in 12" :key="m" :value="m">{{ m }} 月</option>
        </select>
      </div>

      <div class="form-group">
        <label>日期</label>
        <select v-model="day">
          <option v-for="d in 31" :key="d" :value="d">{{ d }} 日</option>
        </select>
      </div>

      <div class="form-group">
        <label>出生時辰</label>
        <select v-model="hour">
          <option v-for="h in hoursList" :key="h.value" :value="h.value">
            {{ h.label }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>性別</label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" value="男" v-model="gender" /> 乾造 (男)
          </label>
          <label class="radio-label">
            <input type="radio" value="女" v-model="gender" /> 坤造 (女)
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>指定流年 (預測年份)</label>
        <input type="number" v-model="targetYear" min="1900" max="2100" />
      </div>

      <div class="form-group btn-group">
        <button type="submit" class="btn-submit">
          ⚡ 立即排盤
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.input-container {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  border-bottom: 1px solid #334155;
  padding-bottom: 10px;
}

.header-title .icon {
  font-size: 28px;
  color: #f59e0b;
}

.header-title h2 {
  font-size: 20px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0 0 2px 0;
}

.header-title .subtitle {
  font-size: 13px;
  color: #94a3b8;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 14px;
  align-items: flex-end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  color: #cbd5e1;
  font-weight: 500;
}

.form-group input,
.form-group select {
  background: #1e293b;
  border: 1px solid #475569;
  border-radius: 6px;
  color: #f8fafc;
  padding: 8px 10px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #f59e0b;
}

.radio-group {
  display: flex;
  gap: 12px;
  padding: 8px 0;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #f1f5f9;
  cursor: pointer;
}

.btn-group {
  min-width: 130px;
}

.btn-submit {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 9px 16px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.35);
  transition: transform 0.15s, box-shadow 0.15s;
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(217, 119, 6, 0.5);
}
</style>
