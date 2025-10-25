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

        <BaseButton label="Zapisz ustawienia" class="mt-6" />
      </UForm>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Notifications {
    email: boolean;
    push: boolean;
    sms: boolean;
    news: boolean;
    security: boolean;
    marketing: boolean;
}

const props = defineProps<{
  notifications: Notifications;
}>();

const emit = defineEmits<{
  (e: "update:notifications", value: Notifications): void;
}>();

const localNotifications = ref<Notifications>({ ...props.notifications });

const handleCheckboxChange = (key: keyof Notifications, value: boolean | 'indeterminate') => {
  const boolValue = value === true;
  
  localNotifications.value[key] = boolValue;
  
  saveNotificationSetting(key, boolValue);
};

});
</script>
