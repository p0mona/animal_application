<template>
  <UCard>
    <template #header>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Profil</h2>
        </div>

        <div class="flex justify-end">
          <BorderButton label="Usuń konto" @click="deleteAccount" />
        </div>
      </div>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Левая колонка -->
      <div>
        <BaseInput label="Imię" v-model="localProfile.name" />
        <BaseInput label="Miejsce pracy" v-model="localProfile.vet.hospital" />

        <RadioButton v-model="localProfile.sex" :items="sex" />

        <BaseInput
          label="Data urodzenia"
          id="birthday"
          type="date"
          v-model="localProfile.birthday"
        />

        <div class="flex justify-start mt-4">
          <BaseButton label="Zapisz zmiany" @click="saveProfile" />
        </div>
      </div>

      <!-- Правая колонка: фото -->
      <div class="flex justify-center items-start">
        <div class="relative group cursor-pointer">
          <FileUpload v-model="localProfile.image" />
        </div>
      </div>
    </div>
    <!-- Notification Component -->
    <Notification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      :duration="3000"
      @close="showNotification = false"
    />
  </UCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();
const router = useRouter();

const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref<"success" | "error">("success");

const showNotify = (message: string, type: "success" | "error" = "success") => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
};

const sex = ref([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);

const localProfile = ref({
  name: "",
  birthday: "",
  sex: "K",
  image: null,
  vet: {
    hospital: "",
  }
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
    vet: {
      hospital: userStore.user.vet?.hospital || "",
    }
  }
}

async function saveProfile() {
  try {
    await userStore.updateProfile(localProfile.value);
    showNotify("Profil został zapisany!", "success");
  } catch (error) {
    console.error("Save error:", error);
    showNotify("Błąd podczas zapisywania profilu!", "error");
  }
}

async function deleteAccount() {
  const profileId = userStore.user?.id;
  if (!profileId) {
    showNotify("Nie znaleziono ID użytkownika", "error");
    return;
  }

  const confirmed = confirm("Czy na pewno chcesz usunąć konto?");
  if (!confirmed) return;

  try {
    console.log("Deleting profile with ID:", profileId);
    
    const response = await $fetch(`http://localhost:3001/profile/user/${profileId}`, {
      method: "DELETE",
    });

    console.log("Delete response:", response);

    showNotify("Konto zostało usunięte", "success");

    setTimeout(() => {
      userStore.clearUser();
      router.push("/login");
    }, 1000);
    
  } catch (err: any) {
    console.error("Delete error:", err);
    showNotify(err.data?.message || err.message || "Nie udało się usunąć konta", "error");
  }
}
</script>
