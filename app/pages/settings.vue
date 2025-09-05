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
          <div v-if="activeTab === 'profile'" class="space-y-4">
            <UCard>
              <template #header>
                <h2 class="text-lg font-semibold text-gray-900">Profil</h2>
              </template>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Pupil Section -->
                <div>
                  <h3 class="text-base font-semibold mb-4">Pupil</h3>
                  <UForm
                    :schema="profileSchema"
                    :state="profile"
                    class="grid gap-4"
                  >
                    <USelectMenu placeholder="Pies" :items="animals" />
                    <USelectMenu placeholder="Akita Inu" :items="breeds" />

                    <div class="w-full">
                      <p class="text-sm">Płeć</p>
                      <URadioGroup
                        v-model="profile.animal_sex"
                        orientation="horizontal"
                        variant="list"
                        :items="animal_sex"
                        :ui="{
                          base: 'ui-radio',
                          container: 'w-full',
                          indicator: 'bg-violet-500',
                          label: 'ui-label',
                          description: 'ui-description',
                        }"
                        class="w-full"
                      />
                    </div>

                    <UFormGroup label="Animal_name" name="animal_name">
                      <BaseInput label="Imię" v-model="profile.animal_name" />
                    </UFormGroup>

                    <UFormGroup label="Animal_age" name="animal_age">
                      <BaseInput
                        label="Wiek"
                        v-model="profile.animal_age"
                        type="number"
                      />
                    </UFormGroup>

                    <UFormGroup label="Animal_height" name="animal_height">
                      <BaseInput
                        label="Wzrost"
                        v-model="profile.animal_height"
                        type="number"
                      />
                    </UFormGroup>

                    <UFormGroup label="Animal_weight" name="animal_weight">
                      <BaseInput
                        label="Waga"
                        v-model="profile.animal_weight"
                        type="number"
                      />
                    </UFormGroup>

                    <UFormGroup label="Chip" name="chip">
                      <BaseInput label="Nr chip" v-model="profile.chip" />
                    </UFormGroup>
                  </UForm>
                </div>

                <div>
                  <div
                    class="relative w-48 h-48 mx-auto mb-4 group cursor-pointer"
                  >
                    <img
                      src="/images/example-photo.jpg"
                      class="w-full h-full object-cover rounded-2xl transition duration-300 group-hover:brightness-75"
                    />

                    <!-- Overlay текст -->
                    <div
                      class="absolute inset-0 flex items-center justify-center text-sm text-white font-semibold text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      Zmień zdjęcie
                    </div>
                  </div>

                  <!-- Owner Section -->
                  <h3 class="text-base font-semibold mb-4">Właściciel</h3>
                  <UForm
                    :schema="profileSchema"
                    :state="profile"
                    class="grid gap-4"
                  >
                    <UFormGroup label="Name" name="name">
                      <BaseInput label="Imię" v-model="profile.name" />
                    </UFormGroup>

                    <URadioGroup
                      v-model="profile.sex"
                      orientation="horizontal"
                      variant="list"
                      :items="sex"
                      :ui="{
                        base: 'ui-radio',
                        container: 'w-full',
                        indicator: 'bg-violet-500',
                        label: 'ui-label',
                        description: 'ui-description',
                      }"
                    />

                    <UFormGroup label="Birthday" name="birthday">
                      <BaseInput
                        label="Data urodzenia"
                        id="birthday"
                        type="date"
                        v-model="profile.birthday"
                      />
                    </UFormGroup>

                    <div class="flex justify-end">
                      <BaseButton label="Zapisz zmiany" />
                    </div>
                  </UForm>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Security Content -->
          <div v-else-if="activeTab === 'security'" class="space-y-4">
            <UCard class="w-full">
              <template #header>
                <h2 class="text-lg font-semibold text-gray-900">
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
                      <BaseInput
                        label="Obecne hasło"
                        v-model="security.currentPassword"
                        type="password"
                      />
                    </UFormGroup>

                    <UFormGroup label="Nowe hasło" name="newPassword">
                      <BaseInput
                        label="Nowe hasło"
                        v-model="security.newPassword"
                        type="password"
                      />
                    </UFormGroup>

                    <UFormGroup
                      label="Potwierdź nowe hasło"
                      name="confirmPassword"
                    >
                      <BaseInput
                        label="Potwierdź nowe hasło"
                        v-model="security.confirmPassword"
                        type="password"
                      />
                    </UFormGroup>

                    <div class="flex justify-end">
                      <BaseButton label="Zmień hasło" />
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
                    class="w-full max-w-full [&_[data-state=checked]]:bg-violet-500 [&_[data-state=checked]_.bg-default]:bg-white"
                  />
                </div>
              </div>
            </UCard>
          </div>

          <!-- Notifications Content -->
          <div v-else-if="activeTab === 'notifications'" class="space-y-4">
            <UCard>
              <template #header>
                <h2 class="text-lg font-semibold text-gray-900">
                  Powiadomienia
                </h2>
              </template>

              <div class="space-y-4">
                <UForm :state="notifications">
                  <div class="space-y-4">
                    <h3 class="text-base font-semibold">Kanały powiadomień</h3>

                    <UCheckbox
                      v-model="notifications.email"
                      class="[&_[data-state=checked]]:bg-violet-500"
                      label="Email"
                    />
                    <UCheckbox
                      v-model="notifications.push"
                      label="Powiadomienia push"
                      class="[&_[data-state=checked]]:bg-violet-500"
                    />
                    <UCheckbox
                      v-model="notifications.sms"
                      class="[&_[data-state=checked]]:bg-violet-500"
                      label="SMS"
                    />

                    <UDivider />

                    <h3 class="text-base font-semibold">Typy powiadomień</h3>

                    <UCheckbox
                      v-model="notifications.news"
                      label="Aktualności i ogłoszenia"
                      class="[&_[data-state=checked]]:bg-violet-500"
                    />
                    <UCheckbox
                      v-model="notifications.security"
                      label="Alerty bezpieczeństwa"
                      class="[&_[data-state=checked]]:bg-violet-500"
                    />
                    <UCheckbox
                      v-model="notifications.marketing"
                      label="Oferty marketingowe"
                      class="[&_[data-state=checked]]:bg-violet-500"
                    />
                  </div>

                  <BaseButton label="Zapisz ustawienia" />
                </UForm>
              </div>
            </UCard>
          </div>

          <!-- Preferences Content -->
          <div v-else-if="activeTab === 'preferences'" class="space-y-4">
            <UCard>
              <template #header>
                <h2 class="text-lg font-semibold text-gray-900">Preferencje</h2>
              </template>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UForm :state="preferences">
                  <div class="space-y-4 space-x-4">
                    <UFormGroup label="Język" name="language" class="space-y-2">
                      <p class="text-sm">Język</p>
                      <USelect
                        v-model="preferences.language"
                        :items="languageOptions"
                        class="w-full"
                      />
                    </UFormGroup>

                    <UFormGroup
                      label="Strefa czasowa"
                      name="timezone"
                      class="space-y-2"
                    >
                      <p class="text-sm">Strefa czasowa</p>
                      <USelect
                        v-model="preferences.timezone"
                        :items="timezoneOptions"
                        class="w-full"
                      />
                    </UFormGroup>

                    <UFormGroup label="Motyw" name="theme" class="space-y-2">
                      <p class="text-sm">Motyw</p>
                      <USelect
                        v-model="preferences.theme"
                        :items="themeOptions"
                        class="w-full"
                      />
                    </UFormGroup>
                  </div>

                  <BaseButton label="Zapisz" />
                </UForm>
              </div>
            </UCard>
          </div>

          <!-- QR Content -->
          <div v-else-if="activeTab === 'qr'" class="space-y-4">
            <UCard>
              <template #header>
                <h2 class="text-lg font-semibold text-gray-900">QR</h2>
              </template>
              <div class="w-full flex flex-col items-center">
                <img src="/images/qr.svg" class="mb-4" />
                <BaseButton label="Generuj QR" />
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
import type { RadioGroupItem } from "@nuxt/ui";

const activeTab = ref("profile");
const saving = ref(false);

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
