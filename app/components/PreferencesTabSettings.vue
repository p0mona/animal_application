<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">Preferencje</h2>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UForm :state="localPreferences">
        <div class="space-y-4">
          <UFormGroup label="Język" name="language" class="space-y-2">
            <p class="text-sm">Język</p>
            <BaseSelect
              :model-value="localPreferences.language"
              :items="languageOptions"
              @update:modelValue="(value) => handlePreferenceChange('language', value)"
            />
          </UFormGroup>

          <UFormGroup label="Strefa czasowa" name="timezone" class="space-y-2">
            <p class="text-sm">Strefa czasowa</p>
            <BaseSelect
              :model-value="localPreferences.timezone"
              :items="timezoneOptions"
              @update:modelValue="(value) => handlePreferenceChange('timezone', value)"
            />
          </UFormGroup>

          <UFormGroup label="Motyw" name="theme" class="space-y-2">
            <p class="text-sm">Motyw</p>
            <BaseSelect
              :model-value="localPreferences.theme"
              :items="themeOptions"
              @update:modelValue="(value) => handlePreferenceChange('theme', value)"
            />
          </UFormGroup>
        </div>

        <div class="flex justify-between items-center mt-6">
          <BaseButton 
            label="Zapisz ustawienia" 
            @click="saveAllPreferences"
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
const errorMessage = ref('');

watch(() => props.preferences, (newVal) => {
  localPreferences.value = { ...newVal };
}, { deep: true });

const loadPreferences = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      showNotify("Błąd autoryzacji", "error");
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
};

const saveAllPreferences = async () => {
  try {
    saving.value = true;
    const token = localStorage.getItem("token");
    if (!token) {
      showNotify("Błąd autoryzacji", "error");
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

    showNotify("Preferencje zostały zapisane", "success");
    emit("update:preferences", { ...localPreferences.value });
  } catch (error: any) {
    console.error("Error saving preferences:", error);
    showNotify("Błąd podczas zapisywania preferencji", "error");
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadPreferences();
});
</script>
