<template>
  <div
    class="flex items-center bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 p-4 space-x-4"
  >
    <div class="flex-1">
      <h2 class="text-lg font-semibold text-gray-900">
        {{ formatDate(appointment.date) }} - {{ appointment.time }}
      </h2>
      <p class="text-sm text-gray-500">{{ appointment.reason }}</p>
      <p v-if="appointment.notes" class="text-xs text-gray-600 mt-1">
        {{ appointment.notes }}
      </p>
    </div>

    <div class="flex space-x-2">
      <BorderButton 
        label="Odwołaj" 
        @click="$emit('cancel', appointment)"
        class="border-red-500 text-red-500 hover:border-red-600 active:border-red-700 hover:text-red-600 active:text-red-700 aria-disabled:border-red-600"
      />
      <BaseButton 
        label="Edytuj" 
        @click="$emit('edit', appointment)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Appointment } from '~/types/appointments';

interface Props {
  appointment: Appointment;
}

defineProps<Props>();

defineEmits<{
  edit: [appointment: Appointment];
  cancel: [appointment: Appointment];
}>();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pl-PL');
};
</script>
