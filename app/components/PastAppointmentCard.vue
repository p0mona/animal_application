<template>
  <div
    class="flex items-center bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 p-4 space-x-4"
  >
    <div class="flex-1">
      <h2 class="text-lg font-semibold text-gray-900">
        {{ formatDate(appointment.date) }} - {{ appointment.time }}
      </h2>
      <p class="text-sm text-gray-500">{{ appointment.reason }}</p>
    </div>

    <BaseButton 
      label="Szczegóły" 
      @click="$emit('view-details', appointment)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Appointment } from '~/types/appointments';

interface Props {
  appointment: Appointment;
}

defineProps<Props>();

defineEmits<{
  'view-details': [appointment: Appointment];
}>();
</script>
