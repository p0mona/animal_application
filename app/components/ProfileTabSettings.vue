<template>
  <UCard>
    <template #header>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Profil</h2>
        </div>

        <div class="flex justify-end">
          <BorderButton label="Usuń konto" @click="deleteAccount"/>
        </div>
      </div>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Pupil Section -->
      <div>
        <PetForm
          v-model="localProfile"
          :animals="animals"
          :breeds="breeds"
          :animal_sex="animal_sex"
          animal-placeholder="Pies"
          breed-placeholder="Beagle"
        />
      </div>

      <!-- Owner Section -->
      <div>
        <OwnerForm v-model="localProfile" :sex="sex" />
        <div class="flex justify-end">
          <UButton
            @click="saveProfile"
            class="bg-violet-500 hover:bg-violet-600 mt-4 active:bg-violet-700"
          >
            Potwierdź
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();
const toast = useToast();

const animals = ref(["Pies", "Kot", "Królik", "Chomik", "Ptak"]);
const breeds = ref(["Beagle", "Labrador", "Owczarek", "Perski", "Syjamski"]);
const sex = ref([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);
const animal_sex = ref([
  { label: "Samica", value: "K" },
  { label: "Samiec", value: "M" },
]);

const localProfile = ref({
  name: "",
  birthday: "",
  sex: "K",
  image: null,
  phone: "",
  owner: {
    pet: {
      animal: "",
      animal_sex: "K",
      breed: "",
      animal_name: "",
      animal_age: "",
      animal_height: "",
      animal_weight: "",
      chip: "",
    },
  },
});

// Загружаем данные при монтировании
onMounted(async () => {
  if (!userStore.user) {
    await userStore.getProfile();
  }
  updateLocalProfileFromStore();
});

function updateLocalProfileFromStore() {
  if (!userStore.user) return;

  localProfile.value = {
    name: userStore.user.name || "",
    birthday: userStore.user.birthday || "",
    sex: userStore.user.sex || "K",
    image: null,
    phone: userStore.user.phone || "",
    owner: {
      pet: userStore.user.owner?.pet || {
        animal: "",
        animal_sex: "K",
        breed: "",
        animal_name: "",
        animal_age: "",
        animal_height: "",
        animal_weight: "",
        chip: "",
      },
    },
  };
}

async function saveProfile() {
  try {
    await userStore.updateProfile(localProfile.value);
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
    await $fetch(`http://localhost:3001/auth/user/${profileId}`, {
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
