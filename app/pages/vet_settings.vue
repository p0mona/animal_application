<template>
  <FullWidthLayout>
    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Konto</h1>
    </div>

    <Navigation :items="navItems" v-model="activeTab" />

    <!-- Profile Content -->
    <div v-if="activeTab === 'profile'">
      <VetProfileTabSettings/>
    </div>
    
    <!-- Security Content -->
    <div v-if="activeTab === 'security'">
      <SecurityTabSettings
        v-model:security="security"
        v-model:twoFactorEnabled="twoFactorEnabled"
        :securitySchema="securitySchema"
      />
    </div>

    <!-- Notifications Content -->
    <div v-if="activeTab === 'notifications'">
      <NotificationsTabSettings v-model:notifications="notifications" />
    </div>

    <!-- Preferences Content -->
    <div v-if="activeTab === 'preferences'">
      <PreferencesTabSettings
        v-model:preferences="preferences"
        :languageOptions="languageOptions"
        :timezoneOptions="timezoneOptions"
        :themeOptions="themeOptions"
      />
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();

const activeTab = ref("profile");

const navItems = [
  { key: "profile", label: "Profil", icon: "i-heroicons-user" },
  { key: "security", label: "Bezpieczeństwo", icon: "i-heroicons-lock-closed" },
  { key: "notifications", label: "Powiadomienia", icon: "i-heroicons-bell" },
  { key: "preferences", label: "Preferencje", icon: "i-heroicons-cog-6-tooth" },
];

const security = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const notifications = ref({
  email: true,
  push: false,
  sms: false,
  news: true,
  security: true,
  marketing: false,
});

const preferences = ref({
  language: "pl",
  timezone: "Europe/Warsaw",
  theme: "system",
});

const twoFactorEnabled = ref(false);

const languageOptions = [
  { value: "pl", label: "Polski" },
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
];

const timezoneOptions = [
  { value: "Europe/Warsaw", label: "Warszawa (UTC+1)" },
  { value: "Europe/London", label: "Londyn (UTC+0)" },
  { value: "Europe/Berlin", label: "Moskwa (UTC+2)" },
];

const themeOptions = [
  { value: "light", label: "Jasny" },
  { value: "dark", label: "Ciemny" },
  { value: "system", label: "Systemowy" },
];

const securitySchema = {
  newPassword: (value: string) =>
    value.length >= 8 || "Hasło musi mieć co najmniej 8 znaków",
  confirmPassword: (value: string) =>
    value === security.value.newPassword || "Hasła muszą być identyczne",
};

const form = reactive({
  name: userStore.user?.name || "",
  birthday: userStore.user?.birthday || "",
  sex: userStore.user?.sex || "K",
  image: null as File | null,
  vet: { hospital: userStore.user?.vet?.hospital || "" },
});

onMounted(async () => {
  if (!userStore.user) {
    await userStore.getProfile();
  }
  updateFormFromStore();
});

function updateFormFromStore() {
  if (!userStore.user) return;

  form.name = userStore.user.name || "";
  form.birthday = userStore.user.birthday || "";
  form.sex = userStore.user.sex || "K";
  form.vet.hospital = userStore.user.vet?.hospital || "";
}
</script>
