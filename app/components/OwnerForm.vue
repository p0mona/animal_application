<template>
  <div>
    <FileUpload v-model="form.image" />

    <div class="flex flex-col space-y-4 mt-4">
      <h5 class="text-lg font-semibold">Właściciel</h5>

      <BaseInput label="Wpisz imię" v-model="form.name" />

      <div class="w-full space-y-1">
        <p class="text-sm">Płeć</p>
        <URadioGroup
          v-model="form.sex"
          orientation="horizontal"
          variant="list"
          :items="sexOptions"
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

      <BaseInput label="Data urodzenia" v-model="form.birthday" type="date" />

      <BaseInput label="Numer telefonu" v-model="form.owner.phone" />
    </div>
  </div>
</template>

<script setup>
import BaseInput from "@/components/BaseInput.vue";
import FileUpload from "@/components/FileUpload.vue";
import { computed } from "vue";

const props = defineProps({
  modelValue: Object,
  sex: Array,
});

const emit = defineEmits(["update:modelValue"]);

const sexOptions = props.sex || [
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
];

// Синхронизация с родителем через v-model
const form = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
