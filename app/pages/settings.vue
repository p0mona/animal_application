<template>
  <div class="min-h-screen bg-primary">
    <div class="flex justify-center p-4 bg-primary">
      <div class="max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <UContainer class="py-8">
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Ustawienia
            </h1>
            <UButton color="primary" variant="ghost" size="lg" />
          </div>

          <!-- изменить раположение элементов -->

          <!-- Mobile Navigation -->
          <div class="sm:hidden mb-6">
            <div
              class="flex justify-around bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm"
            >
              <UButton
                v-for="item in navItems"
                :key="item.key"
                :icon="item.icon"
                :color="activeTab === item.key ? 'primary' : 'neutral'"
                variant="ghost"
                size="lg"
                class="rounded-full"
                @click="activeTab = item.key"
              />
            </div>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden sm:block mb-6">
            <div
              class="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm"
            >
              <UButton
                v-for="item in navItems"
                :key="item.key"
                :icon="item.icon"
                :label="item.label"
                :color="activeTab === item.key ? 'primary' : 'neutral'"
                variant="ghost"
                :class="[
                  'flex items-center space-x-2 px-4 py-3',
                  activeTab === item.key
                    ? 'bg-primary-50 dark:bg-primary-900/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
                @click="activeTab = item.key"
              />
            </div>
          </div>

          <!-- Profile Content -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <UCard>
              <template #header>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Profil
                </h2>
              </template>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Pupil Section -->
                <div>
                  <h3 class="text-lg font-medium mb-4">Pupil</h3>
                  <UForm
                    :schema="profileSchema"
                    :state="profile"
                    class="grid gap-4"
                  >
                    <USelectMenu placeholder="Pies" :items="animals" />
                    <USelectMenu placeholder="Akita Inu" :items="breeds" />

                    <UFormGroup label="Animal_name" name="animal_name">
                      <p class="text-sm mb-1">Imię</p>
                      <UInput
                        v-model="profile.animal_name"
                        type="text"
                        class="w-full"
                      />
                    </UFormGroup>

                    <UFormGroup label="Animal_age" name="animal_age">
                      <p class="text-sm mb-1">Wiek</p>
                      <UInput
                        v-model="profile.animal_age"
                        type="number"
                        class="w-full"
                      />
                    </UFormGroup>

                    <UFormGroup label="Animal_height" name="animal_height">
                      <p class="text-sm mb-1">Wzrost</p>
                      <UInput
                        v-model="profile.animal_height"
                        type="number"
                        class="w-full"
                      />
                    </UFormGroup>

                    <UFormGroup label="Animal_weight" name="animal_weight">
                      <p class="text-sm mb-1">Waga</p>
                      <UInput
                        v-model="profile.animal_weight"
                        type="number"
                        class="w-full"
                      />
                    </UFormGroup>

                    <UFormGroup label="Chip" name="chip">
                      <p class="text-sm mb-1">Nr chipu</p>
                      <UInput
                        v-model="profile.chip"
                        type="text"
                        class="w-full"
                      />
                    </UFormGroup>
                  </UForm>
                </div>

                <!-- Owner Section -->
                <div>
                  <h3 class="text-lg font-medium mb-4">Właściciel</h3>
                  <UForm
                    :schema="profileSchema"
                    :state="profile"
                    class="grid gap-4"
                  >
                    <UFormGroup label="Name" name="name">
                      <p class="text-sm mb-1">Imię</p>
                      <UInput
                        v-model="profile.name"
                        type="text"
                        class="w-full"
                      />
                    </UFormGroup>

                    <URadioGroup
                      v-model="profile.sex"
                      orientation="horizontal"
                      variant="list"
                      :items="sex"
                    />

                    <UFormGroup label="Birthday" name="birthday">
                      <p class="text-sm mb-1">Data urodzenia</p>
                      <UInput
                        id="birthday"
                        type="date"
                        v-model="profile.birthday"
                        class="w-full"
                      />
                    </UFormGroup>

                    <div class="flex justify-end">
                      <UButton type="button" color="primary">
                        Zapisz zmiany
                      </UButton>
                    </div>
                  </UForm>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Security Content -->
          <div v-else-if="activeTab === 'security'" class="space-y-6">
            <UCard class="w-full">
              <template #header>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Bezpieczeństwo
                </h2>
              </template>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div class="w-full min-w-0">
                  <UForm
                    :schema="securitySchema"
                    :state="security"
                    class="space-y-4"
                  >
                    <UFormGroup label="Obecne hasło" name="currentPassword">
                      <p class="text-sm mb-1">Obecne hasło</p>
                      <UInput
                        v-model="security.currentPassword"
                        type="password"
                        class="w-full max-w-full"
                      />
                    </UFormGroup>

                    <UFormGroup label="Nowe hasło" name="newPassword">
                      <p class="text-sm mb-1">Nowe hasło</p>
                      <UInput
                        v-model="security.newPassword"
                        type="password"
                        class="w-full max-w-full"
                      />
                    </UFormGroup>

                    <UFormGroup
                      label="Potwierdź nowe hasło"
                      name="confirmPassword"
                    >
                      <p class="text-sm mb-1">Potwierdź nowe hasło</p>
                      <UInput
                        v-model="security.confirmPassword"
                        type="password"
                        class="w-full max-w-full"
                      />
                    </UFormGroup>

                    <div class="flex justify-end">
                      <UButton type="submit" color="primary" :loading="saving">
                        Zmień hasło
                      </UButton>
                    </div>
                  </UForm>
                </div>

                <div class="w-full min-w-0">
                  <h3 class="text-sm font-medium mb-4">
                    Uwierzytelnianie dwuskładnikowe
                  </h3>
                  <USwitch
                    v-model="twoFactorEnabled"
                    label="Włącz 2FA"
                    class="w-full max-w-full"
                  />
                </div>
              </div>
            </UCard>
          </div>

          <!-- Notifications Content -->
          <div v-else-if="activeTab === 'notifications'" class="space-y-6">
            <UCard>
              <template #header>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Powiadomienia
                </h2>
              </template>

              <div class="space-y-6">
                <UForm :state="notifications">
                  <div class="space-y-4">
                    <h3 class="text-lg font-medium">Kanały powiadomień</h3>

                    <UCheckbox v-model="notifications.email" label="Email" />
                    <UCheckbox
                      v-model="notifications.push"
                      label="Powiadomienia push"
                    />
                    <UCheckbox v-model="notifications.sms" label="SMS" />

                    <UDivider />

                    <h3 class="text-lg font-medium">Typy powiadomień</h3>

                    <UCheckbox
                      v-model="notifications.news"
                      label="Aktualności i ogłoszenia"
                    />
                    <UCheckbox
                      v-model="notifications.security"
                      label="Alerty bezpieczeństwa"
                    />
                    <UCheckbox
                      v-model="notifications.marketing"
                      label="Oferty marketingowe"
                    />
                  </div>

                  <UButton
                    type="submit"
                    color="primary"
                    class="mt-6"
                    :loading="saving"
                  >
                    Zapisz ustawienia
                  </UButton>
                </UForm>
              </div>
            </UCard>
          </div>

          <!-- Preferences Content -->
          <div v-else-if="activeTab === 'preferences'" class="space-y-6">
            <UCard>
              <template #header>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Preferencje
                </h2>
              </template>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UForm :state="preferences">
                  <div class="space-y-4 space-x-4">
                    <UFormGroup label="Język" name="language" class="space-y-4">
                      <p class="text-sm mb-1">Język</p>
                      <USelect
                        v-model="preferences.language"
                        :options="languageOptions"
                        class="w-full"
                      />
                    </UFormGroup>

                    <UFormGroup
                      label="Strefa czasowa"
                      name="timezone"
                      class="space-y-4"
                    >
                      <p class="text-sm mb-1">Strefa czasowa</p>
                      <USelect
                        v-model="preferences.timezone"
                        :options="timezoneOptions"
                        class="w-full"
                      />
                    </UFormGroup>

                    <UFormGroup label="Motyw" name="theme" class="space-y-4">
                      <p class="text-sm mb-1">Motyw</p>
                      <USelect
                        v-model="preferences.theme"
                        :options="themeOptions"
                        class="w-full"
                      />
                    </UFormGroup>
                  </div>

                  <UButton type="submit" color="primary" :loading="saving">
                    Zapisz preferencje
                  </UButton>
                </UForm>
              </div>
            </UCard>
          </div>
        </UContainer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FormSubmitEvent } from "#ui/types";
import type { RadioGroupItem } from "@nuxt/ui";

const activeTab = ref("profile");
const saving = ref(false);

const navItems = [
  { key: "profile", label: "Profil", icon: "i-heroicons-user" },
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
  { value: "de", label: "Deutsch" },
];

const timezoneOptions = [
  { value: "Europe/Warsaw", label: "Warszawa (UTC+1)" },
  { value: "Europe/London", label: "Londyn (UTC+0)" },
  { value: "Europe/Berlin", label: "Berlin (UTC+1)" },
];

const themeOptions = [
  { value: "light", label: "Jasny" },
  { value: "dark", label: "Ciemny" },
  { value: "system", label: "Systemowy" },
];

const profileSchema = {
  firstName: (value: string) =>
    value.length >= 2 || "Imię musi mieć co najmniej 2 znaki",
  lastName: (value: string) =>
    value.length >= 2 || "Nazwisko musi mieć co najmniej 2 znaki",
  email: (value: string) =>
    /.+@.+\..+/.test(value) || "Podaj poprawny adres email",
};

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
</script>

<style scoped>
:deep(.ui-button) {
  transition: all 0.2s ease-in-out;
}

:deep(.ui-button):hover {
  transform: translateY(-1px);
}
</style>
