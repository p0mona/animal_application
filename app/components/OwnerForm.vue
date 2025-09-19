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

      <BaseInput
        label="Data urodzenia"
        v-model="form.birthday"
        type="date"
      />

      <div class="flex justify-end">
        <UButton
          @click="saveProfile"
          :loading="loading"
          class="bg-violet-500 hover:bg-violet-600"
        >
          Potwierdź
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseInput from "@/components/BaseInput.vue";
import FileUpload from "@/components/FileUpload.vue";
import { ref, reactive, onMounted } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const loading = ref(false);

const sexOptions = [
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
];

// Форма с данными
const form = reactive({
  name: "",
  birthday: "",
  sex: "K",
  image: null,
});

onMounted(async () => {
  if (!userStore.user) {
    await userStore.getProfile();
  }
  updateFormFromStore();
});

function updateFormFromStore() {
  if (!userStore.user) return;

  form.name = userStore.user.name || "";
  form.birthday = userStore.user.birthday || "";
  form.sex = userStore.user.sex || "K";
}

async function saveProfile() {
  loading.value = true;

  try {
    await userStore.updateProfile(form);

    useToast().add({
      title: 'Sukces!',
      description: 'Profil został zapisany',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    });
    
  } catch (error) {
    console.error("Save error:", error);
    
    useToast().add({
      title: 'Błąd',
      description: 'Błąd podczas zapisywania profilu',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    });
    
  } finally {
    loading.value = false;
  }
}
</script>