<template>
  <div class="input-wrapper">
    <input
      type="text"
      :value="modelValue"
      @input="onInput"
      class="text-input"
    />
  </div>
</template>
  
<script setup lang="ts">
const modelValue = defineModel<string>({ required: true })

function transformInputValue(input: string): string {
  // Modify the input here before assigning to modelValue
  return input.toUpperCase() // placeholder – override in usage if 
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  modelValue.value = transformInputValue(target.value)
}
</script>

<style scoped>

.text-input {
  background-color: #1E1E1E;
  color: #ffffff;
  border: 1px solid #444;
  padding: 3px;
  font-size: 14px;
  border-radius: 4px;
  width: 100%;
  outline: none;
}

.text-input:hover {
  border-color: #666;
}

.text-input::placeholder {
  color: #888;
}
</style>