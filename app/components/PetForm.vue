<template>
  <div class="flex flex-col space-y-4">
    <h5 class="text-lg font-semibold">Pupil</h5>

    <div class="w-full space-y-2">
      <p class="text-sm">Wybierz zwierzę</p>
      <USelectMenu
        :placeholder="animalPlaceholder"
        :items="animals"
        v-model="animalObject"
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

    <div class="w-full space-y-2" v-if="hasBreeds">
      <p class="text-sm">Wybierz rasę</p>
      <USelectMenu
        placeholder="-"
        :items="breedsList"
        v-model="breedObject"
        class="w-full h-8"
        :loading="breedsLoading"
      />
    </div>

    <BaseInput label="Wpisz imię pupila" v-model="animalNameValue" />
    <BaseInput label="Wpisz wiek" v-model="animalAgeValue" />
    <BaseInput label="Wpisz wzrost" v-model="animalHeightValue" />
    <BaseInput label="Wpisz wagę" v-model="animalWeightValue" />
    <BaseInput label="Wpisz nr czipu" v-model="chipValue" />
  </div>
</template>

<script setup lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import { computed, watch, ref, onMounted } from "vue";

interface SelectItem {
  label: string;
  value: string;
}

interface PetData {
  animal?: string;
  breed?: string;
  animal_sex?: string;
  animal_name?: string;
  animal_age?: string | number;
  animal_height?: string | number;
  animal_weight?: string | number;
  chip?: string;
}

interface OwnerData {
  pet?: PetData;
}

interface ModelValue {
  animal?: string;
  breed?: string;
  animal_sex?: string;
  animal_name?: string;
  animal_age?: string | number;
  animal_height?: string | number;
  animal_weight?: string | number;
  chip?: string;
  owner?: OwnerData;
  [key: string]: any;
}

interface Props {
  modelValue: ModelValue;
  animals: SelectItem[];
  animal_sex: SelectItem[];
  animalPlaceholder?: string;
  breedPlaceholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  animalPlaceholder: "-",
  breedPlaceholder: "-",
});

const emit = defineEmits<{
  'update:modelValue': [value: ModelValue]
}>();

// Реактивные переменные для загрузки пород
const breedsList = ref<SelectItem[]>([]);
const breedsLoading = ref(false);

// Для животных - работаем с объектом {label, value}
const animalObject = computed({
  get: () => {
    const animalValue = props.modelValue?.animal || props.modelValue?.owner?.pet?.animal || "";
    return props.animals.find(animal => animal.value === animalValue) || undefined;
  },
  set: (value: SelectItem | undefined) => {
    const animalValue = value?.value || "";
    updateNestedValue("animal", animalValue);
  }
});

// Для пород - работаем с объектом {label, value}
const breedObject = computed({
  get: () => {
    const breedValue = props.modelValue?.breed || props.modelValue?.owner?.pet?.breed || "";
    return breedsList.value.find(breed => breed.value === breedValue) || undefined;
  },
  set: (value: SelectItem | undefined) => {
    const breedValue = value?.value || "";
    updateNestedValue("breed", breedValue);
  }
});

// Остальные computed properties остаются с строковыми значениями
const animalSexValue = computed({
  get: () => {
    return (
      props.modelValue?.animal_sex ||
      props.modelValue?.owner?.pet?.animal_sex ||
      ""
    );
  },
  set: (value: string) => updateNestedValue("animal_sex", value),
});

const animalNameValue = computed({
  get: () => {
    return (
      props.modelValue?.animal_name ||
      props.modelValue?.owner?.pet?.animal_name ||
      ""
    );
  },
  set: (value: string) => updateNestedValue("animal_name", value),
});

const animalAgeValue = computed({
  get: () => {
    return (
      props.modelValue?.animal_age ||
      props.modelValue?.owner?.pet?.animal_age ||
      ""
    );
  },
  set: (value: string) => updateNestedValue("animal_age", value),
});

const animalHeightValue = computed({
  get: () => {
    return (
      props.modelValue?.animal_height ||
      props.modelValue?.owner?.pet?.animal_height ||
      ""
    );
  },
  set: (value: string) => updateNestedValue("animal_height", value),
});

const animalWeightValue = computed({
  get: () => {
    return (
      props.modelValue?.animal_weight ||
      props.modelValue?.owner?.pet?.animal_weight ||
      ""
    );
  },
  set: (value: string) => updateNestedValue("animal_weight", value),
});

const chipValue = computed({
  get: () => {
    return (
      props.modelValue?.chip ||
      props.modelValue?.owner?.pet?.chip ||
      ""
    );
  },
  set: (value: string) => updateNestedValue("chip", value),
});

// Проверяем, есть ли породы для выбранного животного
const hasBreeds = computed(() => {
  return breedsList.value.length > 0;
});

const loadBreeds = async (animalType: string) => {
  breedsLoading.value = true;
  breedsList.value = [];
  
  try {
    if (animalType === 'dog') {
      const dogBreeds = await import('~/assets/data/dog_breeds.json');
      breedsList.value = dogBreeds.default || dogBreeds;
    } else if (animalType === 'cat') {
      const catBreeds = await import('~/assets/data/cat_breeds.json');
      breedsList.value = catBreeds.default || catBreeds;
    }
    // For other animal breeds there is no - leave an empty array
  } catch (error) {
    console.error('Error loading breeds:', error);
    breedsList.value = [];
  } finally {
    breedsLoading.value = false;
  }
};

// We monitor the animal's changes and load the corresponding breeds
watch(animalObject, (newAnimal, oldAnimal) => {
  const animalValue = newAnimal?.value;
  
  if (animalValue && animalValue !== oldAnimal?.value) {
    loadBreeds(animalValue);
  } else if (!animalValue) {
    breedsList.value = [];
  }

  breedObject.value = undefined;
});

watch(() => props.modelValue?.animal || props.modelValue?.owner?.pet?.animal, (newAnimal, oldAnimal) => {
  if (newAnimal && newAnimal !== oldAnimal) {
    loadBreeds(newAnimal);
  }
}, { immediate: true });

onMounted(() => {
  const initialAnimal = props.modelValue?.animal || props.modelValue?.owner?.pet?.animal;
  if (initialAnimal) {
    loadBreeds(initialAnimal);
  }
});

const updateNestedValue = (field: keyof PetData, value: string) => {
  const currentValue: ModelValue = { ...props.modelValue };

  if (!currentValue.owner) {
    currentValue.owner = {};
  }
  if (!currentValue.owner.pet) {
    currentValue.owner.pet = {};
  }

  currentValue.owner.pet[field] = value;

  emit("update:modelValue", currentValue);
};
</script>