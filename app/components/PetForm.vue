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
        v-model="localAnimalSex"
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
import { computed, ref, watch, onMounted } from "vue";
import type { SelectItem } from '~/types/pet';


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
  "update:modelValue": [value: ModelValue];
}>();

const breedsList = ref<SelectItem[]>([]);
const breedsLoading = ref(false);

const animalObject = computed({
  get: () => {
    const val = props.modelValue?.animal || props.modelValue?.owner?.pet?.animal || "";
    return props.animals.find(a => a.value === val);
  },
  set: (val: SelectItem | undefined) => {
    updateNestedValue("animal", val?.value || "");
  },
});

const breedObject = computed({
  get: () => {
    const val = props.modelValue?.breed || props.modelValue?.owner?.pet?.breed || "";
    return breedsList.value.find(b => b.value === val);
  },
  set: (val: SelectItem | undefined) => {
    updateNestedValue("breed", val?.value || "");
  },
});

const animalNameValue = computed({
  get: () => props.modelValue?.animal_name || props.modelValue?.owner?.pet?.animal_name || "",
  set: val => updateNestedValue("animal_name", val),
});
const animalAgeValue = computed({
  get: () => String(props.modelValue?.animal_age || props.modelValue?.owner?.pet?.animal_age || ""),
  set: val => updateNestedValue("animal_age", val),
});
const animalHeightValue = computed({
  get: () => String(props.modelValue?.animal_height || props.modelValue?.owner?.pet?.animal_height || ""),
  set: val => updateNestedValue("animal_height", val),
});
const animalWeightValue = computed({
  get: () => String(props.modelValue?.animal_weight || props.modelValue?.owner?.pet?.animal_weight || ""),
  set: val => updateNestedValue("animal_weight", val),
});
const chipValue = computed({
  get: () => props.modelValue?.chip || props.modelValue?.owner?.pet?.chip || "",
  set: val => updateNestedValue("chip", val),
});

const localAnimalSex = ref(props.modelValue?.animal_sex || "K");
watch(localAnimalSex, (val) => {
  updateNestedValue("animal_sex", val);
});

const hasBreeds = computed(() => breedsList.value.length > 0);

const loadBreeds = async (animalType: string) => {
  breedsLoading.value = true;
  breedsList.value = [];
  try {
    if (animalType === "dog") {
      const dogBreeds = await import("~/assets/data/dog_breeds.json");
      breedsList.value = dogBreeds.default || dogBreeds;
    } else if (animalType === "cat") {
      const catBreeds = await import("~/assets/data/cat_breeds.json");
      breedsList.value = catBreeds.default || catBreeds;
    }
  } catch (err) {
    console.error("Error loading breeds:", err);
  } finally {
    breedsLoading.value = false;
  }
};

watch(animalObject, (newVal, oldVal) => {
  if (newVal?.value && newVal.value !== oldVal?.value) loadBreeds(newVal.value);
  if (!newVal) breedsList.value = [];
  breedObject.value = undefined;
});

onMounted(() => {
  const initial = props.modelValue?.animal || props.modelValue?.owner?.pet?.animal;
  if (initial) loadBreeds(initial);
});

// --- Функция обновления modelValue ---
const updateNestedValue = (field: keyof PetData, value: string | number) => {
  const current: ModelValue = { ...props.modelValue };
  if (!current.owner) current.owner = {};
  if (!current.owner.pet) current.owner.pet = {};
  current.owner.pet[field] = String(value); // конвертируем в string
  emit("update:modelValue", current);
};
</script>