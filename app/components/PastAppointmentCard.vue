<template>
  <div
    class="flex items-center bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 p-4 space-x-4"
  >
    <div class="flex-1">
      <h2 class="text-lg font-semibold text-gray-900">
        {{ formatDate(appointment.date) }} - {{ appointment.time }}
      </h2>
      <p class="text-sm text-gray-500">{{ appointment.reason }}</p>
      <p class="text-xs text-gray-400">
        Status: {{ getStatusLabel(appointment.status) }}
      </p>
      <p v-if="appointment.notes" class="text-xs text-gray-600 mt-1">
        {{ appointment.notes }}
      </p>
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pl-PL');
};

const getStatusLabel = (status: string) => {
  const statuses: { [key: string]: string } = {
    completed: 'Zakończona',
    cancelled: 'Odwołana',
    scheduled: 'Zaplanowana'
  };
  return statuses[status] || status;
};
</script>
