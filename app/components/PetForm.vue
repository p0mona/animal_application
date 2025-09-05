<template>
  <div class="flex flex-col space-y-4">
    <h5 class="text-lg font-semibold">Pupil</h5>

    <div class="w-full space-y-2">
      <p class="text-sm">Wybierz zwierzę</p>
      <USelectMenu
        :placeholder="animalPlaceholder"
        :items="animals"
        v-model="localForm.animal"
        class="w-full h-8"
      />
    </div>

    <div class="w-full space-y-2">
      <p class="text-sm">Płeć</p>
      <URadioGroup
        v-model="localForm.animal_sex"
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
        v-model="localForm.breed"
        class="w-full h-8"
      />
    </div>

    <BaseInput label="Wpisz imię pupila" v-model="localForm.animal_name"/>
    <BaseInput label="Wpisz wiek" v-model="localForm.animal_age"/>
    <BaseInput label="Wpisz wzrost" v-model="localForm.animal_height"/>
    <BaseInput label="Wpisz wagę" v-model="localForm.animal_weight"/>
    <BaseInput label="Wpisz nr czipu" v-model="localForm.chip"/>
  </div>
</template>

<script setup>
import BaseInput from "@/components/BaseInput.vue";
import { reactive } from "vue";

const props = defineProps({
  modelValue: Object,
  animals: Array,
  breeds: Array,
  animal_sex: Array,
  animalPlaceholder: { type: String, default: "-" },
  breedPlaceholder: { type: String, default: "-" },
});

const emit = defineEmits(["update:modelValue"]);

// Локальная копия формы, чтобы двусторонняя привязка работала корректно
const localForm = reactive({
  ...props.modelValue,
  breed: props.modelValue.breed || "",
  animal: props.modelValue.animal || "",
});

watch(
  localForm,
  (val) => {
    emit("update:modelValue", val);
  },
  { deep: true },
);
</script>
