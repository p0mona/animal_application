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

    <Navigation :items="navItems" v-model="activeTab" />

    <div v-if="activeTab === 'profile'">
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
     <!-- Security Content -->
    <div v-if="activeTab === 'security'">
      <SecurityTabSettings
        v-model:security="security"
        v-model:twoFactorEnabled="twoFactorEnabled"
        :securitySchema="securitySchema"
      />
    </div>

    <!-- Notifications Content -->
    <div v-if="activeTab === 'notifications'">
      <NotificationsTabSettings v-model:notifications="notifications" />
    </div>

    <!-- Preferences Content -->
    <div v-if="activeTab === 'preferences'">
      <PreferencesTabSettings
        v-model:preferences="preferences"
        :languageOptions="languageOptions"
        :timezoneOptions="timezoneOptions"
        :themeOptions="themeOptions"
      />
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

const activeTab = ref("profile");

const navItems = [
  { key: "profile", label: "Profil", icon: "i-heroicons-user" },
  { key: "security", label: "Bezpieczeństwo", icon: "i-heroicons-lock-closed" },
  { key: "notifications", label: "Powiadomienia", icon: "i-heroicons-bell" },
  { key: "preferences", label: "Preferencje", icon: "i-heroicons-cog-6-tooth" },
];

const security = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const notifications = ref({
  email: true,
  push: false,
  sms: false,
  news: true,
  security: true,
  marketing: false,
});

const preferences = ref({
  language: "pl",
  timezone: "Europe/Warsaw",
  theme: "system",
});

const twoFactorEnabled = ref(false);

const languageOptions = [
  { value: "pl", label: "Polski" },
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
];

const timezoneOptions = [
  { value: "Europe/Warsaw", label: "Warszawa (UTC+1)" },
  { value: "Europe/London", label: "Londyn (UTC+0)" },
  { value: "Europe/Berlin", label: "Moskwa (UTC+2)" },
];

const themeOptions = [
  { value: "light", label: "Jasny" },
  { value: "dark", label: "Ciemny" },
  { value: "system", label: "Systemowy" },
];

const securitySchema = {
  newPassword: (value: string) =>
    value.length >= 8 || "Hasło musi mieć co najmniej 8 znaków",
  confirmPassword: (value: string) =>
    value === security.value.newPassword || "Hasła muszą być identyczne",
};

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
