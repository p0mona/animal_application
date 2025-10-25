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

const loadNotifications = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const response = await $fetch<{ notifications: Notifications }>('http://localhost:3001/profile/notifications', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


    if (response.notifications) {
      localNotifications.value = response.notifications;
      emit("update:notifications", response.notifications);
    }
  } catch (error: any) {
    console.error("Error loading notifications:", error);
    const defaultNotifications: Notifications = {
      email: true,
      push: true,
      sms: true,
      news: true,
      security: true,
      marketing: true
    };
    localNotifications.value = defaultNotifications;
    emit("update:notifications", defaultNotifications);
  }
};

const saveNotificationSetting = async (key: keyof Notifications, value: boolean) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    console.log(`Saving ${key}:`, value);

    const response = await $fetch('http://localhost:3001/profile/notifications', {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [key]: value
      }),
    });

    saveStatus.value = 'success';
    setTimeout(() => { saveStatus.value = 'idle'; }, 2000);
  } catch (error: any) {
    console.error("Error saving notification setting:", error);
    saveStatus.value = 'error';
    setTimeout(() => { saveStatus.value = 'idle'; }, 2000);
    
    localNotifications.value[key] = !value;
  }
};

onMounted(() => {
  loadNotifications();
});
</script>
