<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <UContainer class="py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Ustawienia</h1>
        <UButton 
          color="primary" 
          variant="ghost" 
          size="lg"
        />
      </div>

      <!-- изменить раположение элементов -->


      <!-- Mobile Navigation -->
      <div class="sm:hidden mb-6">
        <div class="flex justify-around bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
          <UButton
            v-for="item in navItems"
            :key="item.key"
            :icon="item.icon"
            :color="activeTab === item.key ? 'primary' : 'neutral'"
            variant="ghost"
            size="lg"
            :ui="{ rounded: 'rounded-full' }"
            @click="activeTab = item.key"
          />
        </div>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden sm:block mb-6">
        <div class="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
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
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
            @click="activeTab = item.key"
          />
        </div>
      </div>

      <!-- Profile Content -->
      <div v-if="activeTab === 'profile'" class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Profil</h2>
          </template>

          <div class="space-y-6">
            <div class="flex items-center space-x-4">
              
              <div>
                <h3 class="text-lg font-medium">Pupil</h3>
              </div>
            </div>


            <!-- поделить на два столбца для хозяина с животного -->
            <UForm :schema="profileSchema" :state="profile" class="space-y-4">
              <USelectMenu placeholder="Pies" :items="animals" />

              <USelectMenu placeholder="Akita Inu" :items="breeds" />

              <UFormGroup label="Animal_name" name="animal_name">
                <UInput v-model="profile.animal_name" type="name" />
              </UFormGroup>

              <UFormGroup label="Animal_age" name="animal_age">
                <UInput v-model="profile.animal_age" type="number" />
              </UFormGroup>

              <UFormGroup label="Animal_height" name="animal_height">
                <UInput v-model="profile.animal_height" type="number" />
              </UFormGroup>

              <UFormGroup label="Animal_weight" name="animal_weight">
                <UInput v-model="profile.animal_weight" type="number" />
              </UFormGroup>  
            
              <UFormGroup label="Chip" name="chip">
                <UInput v-model="profile.chip" type="text" />
              </UFormGroup>
            </UForm>
          </div>
          <div class="space-y-6">
            <div class="flex items-center space-x-4">
              
              <div>
                <h3 class="text-lg font-medium">Właściciel</h3>
              </div>
            </div>
            <UForm :schema="profileSchema" :state="profile" class="space-y-4">
              <UFormGroup label="Name" name="name">
                <UInput v-model="profile.name" type="name" />
              </UFormGroup>

              

              <UButton type="submit" color="primary" :loading="saving">
                Zapisz zmiany
              </UButton>
            </UForm>
          </div>
        </UCard>
      </div>

      <!-- Security Content -->
      <div v-else-if="activeTab === 'security'" class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Bezpieczeństwo</h2>
          </template>

          <div class="space-y-6">
            <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-green-600 dark:text-green-400" />
                <span class="text-green-800 dark:text-green-200">Twoje konto jest zabezpieczone</span>
              </div>
            </div>

            <UForm :schema="securitySchema" :state="security" class="space-y-4">
              <UFormGroup label="Obecne hasło" name="currentPassword">
                <UInput v-model="security.currentPassword" type="password" />
              </UFormGroup>

              <UFormGroup label="Nowe hasło" name="newPassword">
                <UInput v-model="security.newPassword" type="password" />
              </UFormGroup>

              <UFormGroup label="Potwierdź nowe hasło" name="confirmPassword">
                <UInput v-model="security.confirmPassword" type="password" />
              </UFormGroup>

              <UButton type="submit" color="primary" :loading="saving">
                Zmień hasło
              </UButton>
            </UForm>

            <UDivider />

            <div>
              <h3 class="text-lg font-medium mb-4">Uwierzytelnianie dwuskładnikowe</h3>
              <USwitch v-model="twoFactorEnabled" label="Włącz 2FA" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Notifications Content -->
      <div v-else-if="activeTab === 'notifications'" class="space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Powiadomienia</h2>
          </template>

          <div class="space-y-6">
            <UForm :state="notifications">
              <div class="space-y-4">
                <h3 class="text-lg font-medium">Kanały powiadomień</h3>
                
                <UCheckbox v-model="notifications.email" label="Email" />
                <UCheckbox v-model="notifications.push" label="Powiadomienia push" />
                <UCheckbox v-model="notifications.sms" label="SMS" />

                <UDivider />

                <h3 class="text-lg font-medium">Typy powiadomień</h3>
                
                <UCheckbox v-model="notifications.news" label="Aktualności i ogłoszenia" />
                <UCheckbox v-model="notifications.security" label="Alerty bezpieczeństwa" />
                <UCheckbox v-model="notifications.marketing" label="Oferty marketingowe" />
              </div>

              <UButton type="submit" color="primary" class="mt-6" :loading="saving">
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
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Preferencje</h2>
          </template>

          <div class="space-y-6">
            <UForm :state="preferences">
              <div class="space-y-4">
                <UFormGroup label="Język" name="language">
                  <USelect
                    v-model="preferences.language"
                    :options="languageOptions"
                    placeholder="Wybierz język"
                  />
                </UFormGroup>

                <UFormGroup label="Strefa czasowa" name="timezone">
                  <USelect
                    v-model="preferences.timezone"
                    :options="timezoneOptions"
                    placeholder="Wybierz strefę czasową"
                  />
                </UFormGroup>

                <UFormGroup label="Motyw" name="theme">
                  <USelect
                    v-model="preferences.theme"
                    :options="themeOptions"
                    placeholder="Wybierz motyw"
                  />
                </UFormGroup>
              </div>

              <UButton type="submit" color="primary" class="mt-6" :loading="saving">
                Zapisz preferencje
              </UButton>
            </UForm>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormSubmitEvent } from '#ui/types'

const activeTab = ref('profile')
const saving = ref(false)

const navItems = [
  { key: 'profile', label: 'Profil', icon: 'i-heroicons-user' },
  { key: 'security', label: 'Bezpieczeństwo', icon: 'i-heroicons-lock-closed' },
  { key: 'notifications', label: 'Powiadomienia', icon: 'i-heroicons-bell' },
  { key: 'preferences', label: 'Preferencje', icon: 'i-heroicons-cog-6-tooth' }
]

const profile = ref({
  animal_name: 'Lucky',
  animal_age: 2,
  animal_height: 50,
  animal_weight: 4,
  chip: "123456789012345",
  name: "Beata"
})

const security = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notifications = ref({
  email: true,
  push: false,
  sms: false,
  news: true,
  security: true,
  marketing: false
})

const preferences = ref({
  language: 'pl',
  timezone: 'Europe/Warsaw',
  theme: 'system'
})

const twoFactorEnabled = ref(false)

const languageOptions = [
  { value: 'pl', label: 'Polski' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' }
]

const timezoneOptions = [
  { value: 'Europe/Warsaw', label: 'Warszawa (UTC+1)' },
  { value: 'Europe/London', label: 'Londyn (UTC+0)' },
  { value: 'Europe/Berlin', label: 'Berlin (UTC+1)' }
]

const themeOptions = [
  { value: 'light', label: 'Jasny' },
  { value: 'dark', label: 'Ciemny' },
  { value: 'system', label: 'Systemowy' }
]

const profileSchema = {
  firstName: (value: string) => value.length >= 2 || 'Imię musi mieć co najmniej 2 znaki',
  lastName: (value: string) => value.length >= 2 || 'Nazwisko musi mieć co najmniej 2 znaki',
  email: (value: string) => /.+@.+\..+/.test(value) || 'Podaj poprawny adres email'
}

const securitySchema = {
  newPassword: (value: string) => value.length >= 8 || 'Hasło musi mieć co najmniej 8 znaków',
  confirmPassword: (value: string) => value === security.value.newPassword || 'Hasła muszą być identyczne'
}

async function handleSubmit(event: FormSubmitEvent<any>) {
  saving.value = true
  // Symulacja zapisu
  await new Promise(resolve => setTimeout(resolve, 1000))
  saving.value = false
}

const animals = ref(["Pies", "Kot", "Chomik"]);
const breeds = ref(["Akita Inu", "Beagle", "Szpic"]);
</script>

<style scoped>
:deep(.ui-button) {
  transition: all 0.2s ease-in-out;
}

:deep(.ui-button):hover {
  transform: translateY(-1px);
}
</style>