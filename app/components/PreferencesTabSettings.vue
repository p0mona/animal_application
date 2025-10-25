<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">Preferencje</h2>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UForm :state="localPreferences">
        <div class="space-y-4 space-x-4">
          <UFormGroup label="Język" name="language" class="space-y-2">
            <p class="text-sm">Język</p>
            <BaseSelect
              v-model="localPreferences.language"
              :items="languageOptions"
            />
          </UFormGroup>

          <UFormGroup label="Strefa czasowa" name="timezone" class="space-y-2">
            <p class="text-sm">Strefa czasowa</p>
            <BaseSelect
              v-model="localPreferences.timezone"
              :items="timezoneOptions"
            />
          </UFormGroup>

          <UFormGroup label="Motyw" name="theme" class="space-y-2">
            <p class="text-sm">Motyw</p>
            <BaseSelect
              v-model="localPreferences.theme"
              :items="themeOptions"
            />
          </UFormGroup>
        </div>

        <BaseButton label="Zapisz" class="mt-6" />
      </UForm>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Preferences {
    language: string;
    timezone: string;
    theme: string;
}

const props = defineProps<{
  preferences: Preferences;
  languageOptions: { value: string; label: string }[];
  timezoneOptions: { value: string; label: string }[];
  themeOptions: { value: string; label: string }[];
}>();

const emit = defineEmits<{
  (e: "update:preferences", value: Preferences): void;
}>();

const localPreferences = ref<Preferences>({ ...props.preferences });
const saving = ref(false);
const saveStatus = ref<'idle' | 'success' | 'error'>('idle');
const errorMessage = ref('');

const loadPreferences = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const response = await $fetch<{ preferences: Preferences }>('http://localhost:3001/profile/preferences', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.preferences) {
      localPreferences.value = response.preferences;
      emit("update:preferences", response.preferences);
    }
  } catch (error: any) {
    console.error("Error loading preferences:", error);
    const defaultPreferences: Preferences = {
      language: "pl",
      timezone: "Europe/Warsaw",
      theme: "system"
    };
    localPreferences.value = defaultPreferences;
    emit("update:preferences", defaultPreferences);
  }
};

const handlePreferenceChange = async (key: keyof Preferences, value: any) => {
  const stringValue = typeof value === 'object' ? value.value : value;
  
  localPreferences.value[key] = stringValue;
  
  await savePreferenceSetting(key, stringValue);
};

const savePreferenceSetting = async (key: keyof Preferences, value: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const response = await $fetch('http://localhost:3001/profile/preferences', {
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
    console.error("Error saving preference setting:", error);
    errorMessage.value = error.data?.message || error.message || "Nieznany błąd";
    saveStatus.value = 'error';
    setTimeout(() => { saveStatus.value = 'idle'; }, 2000);
  }
};

const saveAllPreferences = async () => {
  try {
    saving.value = true;
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const response = await $fetch('http://localhost:3001/profile/preferences', {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(localPreferences.value),
    });

    saveStatus.value = 'success';
    setTimeout(() => { saveStatus.value = 'idle'; }, 2000);
  } catch (error: any) {
    console.error("Error saving preferences:", error);
    errorMessage.value = error.data?.message || error.message || "Nieznany błąd";
    saveStatus.value = 'error';
    setTimeout(() => { saveStatus.value = 'idle'; }, 2000);
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadPreferences();
});
</script>
