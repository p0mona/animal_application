<template>
  <div>
    <FileUpload v-model="localForm.image" />

    <div class="flex flex-col space-y-4 mt-4">
      <h5 class="text-lg font-semibold">Właściciel</h5>

      <BaseInput label="Wpisz imię" v-model="localForm.name" />

      <div class="w-full space-y-1">
        <p class="text-sm">Płeć</p>
        <URadioGroup
          v-model="localForm.sex"
          orientation="horizontal"
          variant="list"
          :items="sex"
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

      <BaseInput
        label="Data urodzenia"
        v-model="localForm.birthday"
        id="birthday"
        type="date"
      />

      <div class="flex justify-end">
        <BaseButton label="Potwierdź" @click="saveForm" />
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseInput from "@/components/BaseInput.vue";
import FileUpload from "@/components/FileUpload.vue";
import BaseButton from "@/components/BaseButton.vue";
import { reactive, watch } from "vue";
import { useUserStore } from "@/stores/user";

const props = defineProps({
  modelValue: Object,
  sex: Array,
});

const emit = defineEmits(["update:modelValue"]);

const localForm = reactive({ ...props.modelValue });

watch(
  localForm,
  (val) => {
    emit("update:modelValue", val);
  },
  { deep: true },
);

const userStore = useUserStore();

function saveForm() {
  if (localForm.image) {
    const imageUrl = URL.createObjectURL(localForm.image);

    userStore.setUser({
      ...userStore.user,
      avatar: imageUrl,
    });
  }

  console.log("Form saved", localForm);
}
</script>
