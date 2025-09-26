<template>
  <FullWidthLayout>
    <Notification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      :duration="3000"
      @close="showNotification = false"
    />
    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Konto</h1>
    </div>

    <div>
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
  </FullWidthLayout>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import FileUpload from "~/components/FileUpload.vue";
import { useUserStore } from "~/stores/user";
import type { RadioGroupItem } from "@nuxt/ui";

const router = useRouter();

const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref<"success" | "error">("success");

const showNotify = (message: string, type: "success" | "error" = "success") => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
};

const sex = ref<RadioGroupItem[]>([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);

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
