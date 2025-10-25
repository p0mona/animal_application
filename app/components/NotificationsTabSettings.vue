<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">Powiadomienia</h2>
    </template>

    <div class="space-y-4">
      <UForm :state="localNotifications">
        <div class="space-y-4">
          <h3 class="text-base font-semibold">Kanały powiadomień</h3>

          <BaseCheckbox
            v-model="localNotifications.email"
            label="Email"
          />
          <BaseCheckbox
            v-model="localNotifications.push"
            label="Powiadomienia push"
          />
          <BaseCheckbox
            v-model="localNotifications.sms"
            label="SMS"
          />

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

        <div class="flex justify-between items-center mt-6">
          <BaseButton 
            label="Zapisz ustawienia" 
            @click="saveAllSettings"
          />
        </div>
      </UForm>
    </div>

    <Notification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      :duration="3000"
      @close="showNotification = false"
    />
  </UCard>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref<"success" | "error">("success");

const showNotify = (message: string, type: "success" | "error" = "success") => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
  
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

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
const saving = ref(false);

watch(() => props.notifications, (newVal) => {
  localNotifications.value = { ...newVal };
}, { deep: true });

const handleCheckboxChange = async (key: keyof Notifications, value: boolean | 'indeterminate') => {
  const boolValue = value === true;
  
  localNotifications.value[key] = boolValue;
  
  try {
    await saveNotificationSetting(key, boolValue);
    showNotify(`Ustawienie ${key} zostało zapisane`, 'success');
  } catch (error) {
    localNotifications.value[key] = !boolValue;
    showNotify(`Błąd podczas zapisywania ustawienia ${key}`, 'error');
  }
};

const loadNotifications = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotify("Błąd autoryzacji", "error");
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
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

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

  return response;
};

const saveAllSettings = async () => {
  try {
    saving.value = true;
    const token = localStorage.getItem("token");
    if (!token) {
      showNotify("Błąd autoryzacji", "error");
      return;
    }


    const response = await $fetch('http://localhost:3001/profile/notifications', {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(localNotifications.value),
    });

    showNotify("Ustawienia zostały zapisane", "success");
    emit("update:notifications", { ...localNotifications.value });
  } catch (error: any) {
    console.error("Error saving notifications:", error);
    showNotify("Błąd podczas zapisywania ustawień", "error");
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadNotifications();
});
</script>
