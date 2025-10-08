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
      <!-- Pupil Section -->
      <div>
        <PetForm
          v-model="localProfile"
          :animals="animals"
          :animal_sex="animal_sex"
          animal-placeholder="Pies"
          breed-placeholder="Beagle"
        />
      </div>

      <!-- Owner Section -->
      <div>
        <div>
          <OwnerForm v-model="localProfile" :sex="sex" />
        </div>
        <div class="flex justify-between mt-4">
          <BorderButton label="Generuj QR" @click="generateQR" />
          <BaseButton label="Potwierdź" @click="saveProfile" />
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

    <!-- Modal QR -->
    <div
      v-if="showQRModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-2xl shadow-xl relative">
        <button
          @click="showQRModal = false"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>

        <h3 class="text-lg font-semibold mb-4 text-center">QR Kod</h3>

        <div class="flex justify-center">
          <img :src="qrCodeData" alt="QR Code" v-if="qrCodeData" />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "~/stores/user";
import QRCode from "qrcode";
import animalsData from '~/assets/data/animals.json';


interface SelectItem {
  label: string;
  value: string;
}

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
  sos_phone?: string;
}

interface ProfileData {
  name?: string;
  birthday?: string;
  sex?: string;
  image?: string | null;
  phone?: string;
  owner?: OwnerData;
  [key: string]: any;
}

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

const animals = ref<SelectItem[]>(animalsData);
const sex = ref<SelectItem[]>([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);
const animal_sex = ref<SelectItem[]>([
  { label: "Samica", value: "K" },
  { label: "Samiec", value: "M" },
]);

const localProfile = ref<ProfileData>({
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

const showQRModal = ref(false);
const qrCodeData = ref("");

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

    const response = await $fetch(
      `http://localhost:3001/profile/user/${profileId}`,
      {
        method: "DELETE",
      },
    );

    console.log("Delete response:", response);

    showNotify("Konto zostało usunięte", "success");

    setTimeout(() => {
      userStore.clearUser();
      router.push("/login");
    }, 1000);
  } catch (err: any) {
    console.error("Delete error:", err);
    showNotify(
      err.data?.message || err.message || "Nie udało się usunąć konta",
      "error",
    );
  }
}

async function generateQR() {
  const data = {
    owner: {
      name: localProfile.value.name,
      phone: localProfile.value.phone,
    },
    pet: localProfile.value.owner.pet,
  };

  try {
    qrCodeData.value = await QRCode.toDataURL(JSON.stringify(data));
    showQRModal.value = true;
  } catch (err) {
    console.error("QR generation error:", err);
    showNotify("Błąd podczas generowania QR", "error");
  }
}
</script>
