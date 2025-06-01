<template>
  <label class="select-wrapper">
    <select v-model="model">
      <option 
        v-for="(option, index) in options" 
        :key="index" 
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </label>
</template>
  
<script setup lang="ts">
const model = defineModel<any>()
const props = defineProps<{
  options: { label: string; value: any }[]
}>()
</script>
  
<style scoped>
.select-wrapper {
  position: relative;
  display: inline-block;
}

select {
  background-color: #1e1e1e;
  color: #f0f0f0;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 4px 24px 4px 8px;
  font-size: 13px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  outline: none;
  cursor: pointer;
  min-width: 100px;
}

/* Custom arrow */
.select-wrapper::after {
  content: '▾';
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #aaa;
  font-size: 10px;
}

select:hover {
  border-color: #666;
}

select:focus {
  border-color: #888;
  box-shadow: 0 0 0 1px #888;
}
</style>