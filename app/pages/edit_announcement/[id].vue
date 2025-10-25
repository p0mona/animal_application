<template>
  <FullWidthLayout>
    <BackButton to="/trainer" />

    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Edytuj ogłoszenie</h1>
    </div>

    <Notification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      :duration="3000"
      @close="showNotification = false"
    />

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Ładowanie ogłoszenia...</p>
    </div>

    <div
      v-else-if="errorMessage"
      class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
    >
      {{ errorMessage }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <BaseInput label="Wpisz imię" v-model="form.name" />
        <BaseInput
          label="Doświadczenie (w latach)"
          v-model="form.experience"
          type="number"
        />
        <BaseInput label="Wpisz kontakt" v-model="form.contact" />
        <BaseInput label="Dodaj opis" v-model="form.description" />
        <FileUpload v-model="form.newImage" class="mt-4" />
        <p class="text-sm text-gray-500 mt-1">
          Zostaw puste, aby zachować obecne zdjęcie
        </p>
      </div>

      <div>
        <div class="mb-4">
          <p class="text-sm text-gray-700 mb-2">Aktualne zdjęcie:</p>
          <img
            :src="getImageUrl(currentImage)"
            :alt="form.name"
            class="w-full max-w-xs rounded-lg"
          />
        </div>

        <div class="flex justify-end space-x-2 mt-4">
          <BorderButton label="Anuluj" @click="navigateTo('/trainer')" />
          <BaseButton label="Zapisz zmiany" @click="submitForm" />
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const announcementId = route.params.id;

const form = reactive({
  name: "",
  experience: "",
  contact: "",
  description: "",
  newImage: null,
});

const currentImage = ref("");
const loading = ref(true);
const saving = ref(false);
const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref("success");
const errorMessage = ref("");

const getAuthToken = () => {
  if (process.client) {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }
  return null;
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return "/images/default-trainer.jpg";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/uploads")) {
    return `http://localhost:3001${imagePath}`;
  }
  return imagePath;
};

const showNotify = (message, type = "success") => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
};

const loadAnnouncement = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Musisz być zalogowany, aby edytować ogłoszenie");
    }

    const response = await fetch(
      `http://localhost:3001/announcement/${announcementId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const announcement = await response.json();

    // Check if the user is the owner
    const currentUserId = getCurrentUserId();
    if (announcement.createdBy._id !== currentUserId) {
      throw new Error("Nie masz uprawnień do edycji tego ogłoszenia");
    }

    // Fill the form with data
    form.name = announcement.name;
    form.experience = announcement.experience.toString();
    form.contact = announcement.contact;
    form.description = announcement.description;
    currentImage.value = announcement.image;
  } catch (error) {
    console.error("Error loading announcement:", error);
    errorMessage.value =
      error.message || "Wystąpił błąd podczas ładowania ogłoszenia";
    showNotify(
      error.message || "Wystąpił błąd podczas ładowania ogłoszenia",
      "error",
    );
  } finally {
    loading.value = false;
  }
};

// Get user ID from token
const getCurrentUserId = () => {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch (error) {
    console.error("Error getting user ID from token:", error);
    return null;
  }
};

const submitForm = async () => {
  if (!form.name.trim()) return showNotify("Imię jest wymagane", "error");
  if (!form.experience || parseInt(form.experience) < 0)
    return showNotify(
      "Doświadczenie jest wymagane i musi być liczbą dodatnią",
      "error",
    );
  if (!form.contact.trim()) return showNotify("Kontakt jest wymagany", "error");
  if (!form.description.trim())
    return showNotify("Opis jest wymagany", "error");
  if (form.description.length < 10)
    return showNotify("Opis musi mieć co najmniej 10 znaków", "error");

  saving.value = true;
  showNotification.value = false;

  try {
    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("experience", form.experience.toString());
    formData.append("contact", form.contact.trim());
    formData.append("description", form.description.trim());

    if (form.newImage) {
      formData.append("image", form.newImage);
    }

    const token = getAuthToken();
    if (!token) {
      throw new Error("Musisz być zalogowany, aby edytować ogłoszenie");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(
      `http://localhost:3001/announcement/${announcementId}`,
      {
        method: "PUT",
        body: formData,
        headers,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    const result = await response.json();

    showNotify("Ogłoszenie zostało pomyślnie zaktualizowane!", "success");

    setTimeout(() => {
      navigateTo("/trainer");
    }, 1500);
  } catch (error) {
    console.error("Update error:", error);
    showNotify(
      error.message || "Wystąpił błąd podczas aktualizacji ogłoszenia",
      "error",
    );
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadAnnouncement();
});
</script>

<script>
export default {
  ssr: false,
};
</script>
