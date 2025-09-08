<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">Powiadomienia</h2>
    </template>

    <div class="space-y-4">
      <UForm :state="localNotifications">
        <div class="space-y-4">
          <h3 class="text-base font-semibold">Kanały powiadomień</h3>

          <BaseCheckbox v-model="notifications.email" label="Email" />
          <BaseCheckbox
            v-model="localNotifications.push"
            label="Powiadomienia push"
          />
          <BaseCheckbox v-model="localNotifications.sms" label="SMS" />

          <UDivider />

          <h3 class="text-base font-semibold">Typy powiadomień</h3>

          <BaseCheckbox
            v-model="localNotifications.news"
            label="Aktualności i ogłoszenia"
          />
          <BaseCheckbox
            v-model="localNotifications.security"
            label="Alerty bezpieczeństwa"
          />
          <BaseCheckbox
            v-model="localNotifications.marketing"
            label="Oferty marketingowe"
          />
        </div>

        <BaseButton label="Zapisz ustawienia" class="mt-4" />
      </UForm>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    news: boolean;
    security: boolean;
    marketing: boolean;
  };
}>();

const emit = defineEmits<{
  (e: "update:notifications", value: typeof props.notifications): void;
}>();

const localNotifications = computed({
  get: () => props.notifications,
  set: (val) => emit("update:notifications", val),
});
</script>
