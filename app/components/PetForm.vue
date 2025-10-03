<template>
  <div class="flex flex-col space-y-4">
    <h5 class="text-lg font-semibold">Pupil</h5>

    <div class="w-full space-y-2">
      <p class="text-sm">Wybierz zwierzę</p>
      <USelectMenu
        :placeholder="animalPlaceholder"
        :items="animals"
        v-model="animalValue"
        class="w-full h-8"
      />
    </div>

    <div class="w-full space-y-2">
      <p class="text-sm">Płeć</p>
      <URadioGroup
        v-model="animalSexValue"
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
        v-model="breedValue"
        class="w-full h-8"
      />
    </div>

    <BaseInput label="Wpisz imię pupila" v-model="animalNameValue" />
    <BaseInput label="Wpisz wiek" v-model="animalAgeValue" />
    <BaseInput label="Wpisz wzrost" v-model="animalHeightValue" />
    <BaseInput label="Wpisz wagę" v-model="animalWeightValue" />
    <BaseInput label="Wpisz nr czipu" v-model="chipValue" />
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

const animalValue = computed({
  get: () =>
    props.modelValue?.animal || props.modelValue?.owner?.pet?.animal || "",
  set: (value) => updateNestedValue("animal", value),
});

const animalSexValue = computed({
  get: () =>
    props.modelValue?.animal_sex ||
    props.modelValue?.sex ||
    props.modelValue?.owner?.pet?.animal_sex ||
    "",
  set: (value) => updateNestedValue("animal_sex", value),
});

const breedValue = computed({
  get: () =>
    props.modelValue?.breed || props.modelValue?.owner?.pet?.breed || "",
  set: (value) => updateNestedValue("breed", value),
});

const animalNameValue = computed({
  get: () =>
    props.modelValue?.animal_name ||
    props.modelValue?.name ||
    props.modelValue?.owner?.pet?.animal_name ||
    "",
  set: (value) => updateNestedValue("animal_name", value),
});

const animalAgeValue = computed({
  get: () =>
    props.modelValue?.animal_age ||
    props.modelValue?.owner?.pet?.animal_age ||
    "",
  set: (value) => updateNestedValue("animal_age", value),
});

const animalHeightValue = computed({
  get: () =>
    props.modelValue?.animal_height ||
    props.modelValue?.owner?.pet?.animal_height ||
    "",
  set: (value) => updateNestedValue("animal_height", value),
});

const animalWeightValue = computed({
  get: () =>
    props.modelValue?.animal_weight ||
    props.modelValue?.owner?.pet?.animal_weight ||
    "",
  set: (value) => updateNestedValue("animal_weight", value),
});

const chipValue = computed({
  get: () => props.modelValue?.chip || props.modelValue?.owner?.pet?.chip || "",
  set: (value) => updateNestedValue("chip", value),
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
