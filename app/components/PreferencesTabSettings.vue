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
import { computed } from "vue";

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

const handlePreferenceChange = async (key: keyof Preferences, value: any) => {
  const stringValue = typeof value === 'object' ? value.value : value;
  
  localPreferences.value[key] = stringValue;
  
  await savePreferenceSetting(key, stringValue);
};
});
</script>
