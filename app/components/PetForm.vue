<template>
  <div class="flex flex-col space-y-4">
    <h5 class="text-lg font-semibold">Pupil</h5>

    <div class="w-full space-y-2">
      <p class="text-sm">Wybierz zwierzę</p>
      <USelectMenu
        :placeholder="animalPlaceholder"
        :items="animals"
        v-model="animal"
        class="w-full h-8"
      />
    </div>

    <div class="w-full space-y-2">
      <p class="text-sm">Płeć</p>
      <URadioGroup
        v-model="animalSex"
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

    <div class="w-full space-y-2">
      <p class="text-sm">Wybierz rasę</p>
      <USelectMenu
        :placeholder="breedPlaceholder"
        :items="breeds"
        v-model="breed"
        class="w-full h-8"
      />
    </div>

    <BaseInput label="Wpisz imię pupila" v-model="animal_name" />
    <BaseInput label="Wpisz wiek" v-model="animal_age" />
    <BaseInput label="Wpisz wzrost" v-model="animal_height" />
    <BaseInput label="Wpisz wagę" v-model="animal_weight" />
    <BaseInput label="Wpisz nr czipu" v-model="chip" />
  </div>
</template>

<script setup>
import BaseInput from "@/components/BaseInput.vue";
import { computed } from "vue";

const props = defineProps({
  modelValue: Object,
  animals: Array,
  breeds: Array,
  animal_sex: Array,
  animalPlaceholder: { type: String, default: "-" },
  breedPlaceholder: { type: String, default: "-" },
});

const emit = defineEmits(["update:modelValue"]);

// КАСТЫЛЬ / workaround
const animal = computed({
  get: () => props.modelValue?.animal || props.modelValue?.owner?.pet?.animal || "",
  set: (value) => updateNestedValue('animal', value)
});

const animal_sex = computed({
  get: () => props.modelValue?.animal_sex || props.modelValue?.sex || props.modelValue?.owner?.pet?.animal_sex || "",
  set: (value) => updateNestedValue('animal_sex', value)
});

const breed = computed({
  get: () => props.modelValue?.breed || props.modelValue?.owner?.pet?.breed || "",
  set: (value) => updateNestedValue('breed', value)
});

const animal_name = computed({
  get: () => props.modelValue?.animal_name || props.modelValue?.name || props.modelValue?.owner?.pet?.animal_name || "",
  set: (value) => updateNestedValue('animal_name', value)
});

const animal_age = computed({
  get: () => props.modelValue?.animal_age || props.modelValue?.owner?.pet?.animal_age || "",
  set: (value) => updateNestedValue('animal_age', value)
});

const animal_height = computed({
  get: () => props.modelValue?.animal_height || props.modelValue?.owner?.pet?.animal_height || "",
  set: (value) => updateNestedValue('animal_height', value)
});

const animal_weight = computed({
  get: () => props.modelValue?.animal_weight || props.modelValue?.owner?.pet?.animal_weight || "",
  set: (value) => updateNestedValue('animal_weight', value)
});

const chip = computed({
  get: () => props.modelValue?.chip || props.modelValue?.owner?.pet?.chip || "",
  set: (value) => updateNestedValue('chip', value)
});

const updateNestedValue = (field, value) => {
  const currentValue = { ...props.modelValue };
  
  if (currentValue.owner?.pet) {
    if (!currentValue.owner.pet) currentValue.owner.pet = {};
    currentValue.owner.pet[field] = value;
  } else if (currentValue.owner) {
    currentValue.owner[field] = value;
  } else {
    currentValue[field] = value;
  }
  
  emit("update:modelValue", currentValue);
};
</script>