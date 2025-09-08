<template>
  <div class="min-h-screen bg-[#77e177]">
    <div class="flex justify-center p-4 bg-[#77e177]">
      <div
        class="max-w-4xl bg-white w-full rounded-2xl shadow-lg p-6 space-y-4"
      >
        <UContainer class="py-8">
          <!-- Заголовок -->
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Ustawienia</h1>
          </div>

          <!-- Навигация -->
          <Navigation :items="navItems" v-model="activeTab" />

          <!-- Profile Content -->
          <div v-if="activeTab === 'profile'">
            <ProfileTabSettings 
              v-model:profile="profile"
              :animals="animals"
              :breeds="breeds"
              :sex="sex"
              :animal_sex="animal_sex"
            />
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
            <NotificationsTabSettings
              v-model:notifications="notifications"
            />
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

          <!-- QR Content -->
          <div v-if="activeTab === 'qr'">
            <QRTabSettings/>
          </div>
        </UContainer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { RadioGroupItem } from "@nuxt/ui";

const activeTab = ref("profile");

const navItems = [
  { key: "profile", label: "Profil", icon: "i-heroicons-user" },
  { key: "qr", label: "QR", icon: "heroicons:qr-code" },
  { key: "security", label: "Bezpieczeństwo", icon: "i-heroicons-lock-closed" },
  { key: "notifications", label: "Powiadomienia", icon: "i-heroicons-bell" },
  { key: "preferences", label: "Preferencje", icon: "i-heroicons-cog-6-tooth" },
];

const profile = ref({
  animal_name: "Lucky",
  animal_age: 2,
  animal_height: 50,
  animal_weight: 4,
  chip: "123456789012345",
  name: "Beata",
  sex: "K",
  birthday: "",
  animal_sex: "K",
});

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

const animals = ref(["Pies", "Kot", "Chomik"]);
const breeds = ref(["Akita Inu", "Beagle", "Szpic"]);

const sex = ref<RadioGroupItem[]>([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);

const animal_sex = ref<RadioGroupItem[]>([
  { label: "Samica", value: "K" },
  { label: "Samiec", value: "M" },
]);
</script>

<style scoped>
:deep(.ui-button) {
  transition: all 0.2s ease-in-out;
}

:deep(.ui-button):hover {
  transform: translateY(-1px);
}
</style>
