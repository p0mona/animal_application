<template>
  <div class="mt-4">
    <UCalendar
      multiple
      :ui="calendarUI"
      class="[&_thead_th]:text-violet-600 [&_tr_th]:text-violet-600"
    />
  </div>
</template>

<script setup lang="ts">
const calendarUI = {
  cellTrigger: `
    w-8 h-8 rounded-full
    bg-transparent
    [&:hover:not([data-selected])]:bg-violet-100 [&:hover:not([data-selected])]:text-violet-600
    [&[data-selected]]:bg-violet-500 [&[data-selected]]:text-white
    [&[data-today]:not([data-selected])]:text-violet-500 [&[data-today]:not([data-selected])]:font-bold
  `,
};
</script>
