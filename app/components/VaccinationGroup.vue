<template>
  <div class="bg-white p-4 space-y-2">
    <h3 class="text-base font-semibold mb-2">{{ title }}</h3>
    <UCheckbox
      v-for="vaccine in vaccines"
      :key="vaccine.key"
      :model-value="Boolean(model[vaccine.key])"
      class="[&_[data-state=checked]]:bg-violet-500"
      :label="vaccine.label"
      @update:modelValue="handleChange(vaccine.key, $event)"
    />
  </div>
</template>

<script setup lang="ts">
interface Vaccine {
  key: string;
  label: string;
}

const props = defineProps<{
  title: string;
  vaccines: Vaccine[];
  model: Record<string, any>;
  patientId?: string;
}>();

const emit = defineEmits<{
  'vaccination-change': [key: string, value: boolean];
}>();

const handleChange = (key: string, value: boolean | 'indeterminate') => {
  const boolValue = value === true;
  
  emit('vaccination-change', key, boolValue);
  
  if (props.patientId) {
    saveToServer(key, boolValue);
  }
};

const saveToServer = async (key: string, value: boolean) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Nie jesteś zalogowany");
      return;
    }

    await $fetch(`http://localhost:3001/patients/${props.patientId}/vaccinations`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [key]: value
      }),
    });

    console.log(`Vaccination ${key} updated to ${value}`);
  } catch (error: any) {
    console.error("Error saving vaccination:", error);
  }
};
</script>
