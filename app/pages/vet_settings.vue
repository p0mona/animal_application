<template>
  <FullWidthLayout>
    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Konto</h1>
    </div>

    <Navigation :items="navItems" v-model="activeTab" />

    <!-- Profil -->
    <div>
      <div v-if="activeTab === 'account'">
        <UCard>
          <template #header>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Profil</h2>
              </div>

              <div class="flex justify-end">
                <BorderButton @click="deleteAccount" label="Usuń konto" />
              </div>
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Левая колонка -->
            <div>
              <BaseInput label="Imię" v-model="form.name" />
              <BaseInput label="Miejsce pracy" v-model="form.vet.hospital" />

              <RadioButton v-model="form.sex" :items="sex" />
              <BaseInput
                label="Data urodzenia"
                id="birthday"
                type="date"
                v-model="form.birthday"
              />

              <div class="flex justify-start mt-4">
                <BaseButton label="Zapisz zmiany" @click="saveProfile" />
              </div>
            </div>

            <!-- Правая колонка: фото -->
            <div class="flex justify-center items-start">
              <div class="relative group cursor-pointer">
                <FileUpload v-model="form.image" />
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Пациенты -->
      <template v-if="activeTab === 'patients'">
        <div class="space-y-4">
          <PatientCard
            v-for="(patient, index) in patients"
            :key="index"
            :name="patient.name"
            :breed="patient.breed"
            :image="patient.image"
            :sex="patient.sex"
          />
        </div>
        <div class="flex justify-end">
          <NuxtLink to="/new_patient">
            <BaseButton label="Dodać" class="mt-4" />
          </NuxtLink>
        </div>
      </template>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import FileUpload from "~/components/FileUpload.vue";
import { useUserStore } from "~/stores/user";
import type { RadioGroupItem } from "@nuxt/ui";
import PatientCard from "~/components/PatientCard.vue";

const activeTab = ref("account");

const navItems = [
  { key: "account", label: "Profil", icon: "i-heroicons-user" },
  { key: "patients", label: "Pacjenci", icon: "heroicons:identification" },
];

const sex = ref<RadioGroupItem[]>([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);

const patients = [
  {
    name: "Agata",
    breed: "Pudel",
    image: "/images/parrot-article3.jpg",
    sex: "Samica",
  },
  {
    name: "Burek",
    breed: "Labrador",
    image: "/images/dog-article1.jpg",
    sex: "Samiec",
  },
  {
    name: "Mila",
    breed: "Kot Perski",
    image: "/images/cat-article2.jpg",
    sex: "Samica",
  },
];

const userStore = useUserStore();
const toast = useToast();

const form = reactive({
  name: userStore.user?.name || "",
  birthday: userStore.user?.birthday || "",
  sex: userStore.user?.sex || "K",
  image: null as File | null,
  vet: { hospital: userStore.user?.vet?.hospital || "" },
});

const sexOptions = [
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
];

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
  form.vet.hospital = userStore.user.vet?.hospital || "";
}

async function saveProfile() {
  try {
    await userStore.updateProfile(form);
    alert("Profil został zapisany!");
  } catch (error) {
    console.error("Save error:", error);
    alert("Błąd podczas zapisywania profilu!");
  }
}

async function deleteAccount() {
  const profileId = userStore.user?.id;
  if (!profileId) return;

  const confirmed = confirm("Czy na pewno chcesz usunąć konto?");
  if (!confirmed) return;

  try {
    await $fetch(`http://localhost:3001/profile/user/${profileId}`, {
      method: "DELETE",
    });

    toast.add({
      title: "Sukces",
      description: "Konto zostało usunięte",
      color: "success",
    });

    userStore.clearUser(); // очищаем Pinia и localStorage
    navigateTo("/login");
  } catch (err: any) {
    toast.add({
      title: "Błąd",
      description: err.data?.message || "Nie udało się usunąć konta",
      color: "error",
    });
  }
}
</script>

<style scoped>
:deep(.ui-button) {
  transition: all 0.2s ease-in-out;
}

:deep(.ui-button):hover {
  transform: translateY(-1px);
}
</style>
