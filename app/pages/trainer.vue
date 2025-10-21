<template>
  <FullWidthLayout>
    <!-- Компонент уведомлений -->
    <Notification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      :duration="3000"
      @close="showNotification = false"
    />

    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Znajdź behawiorystę</h1>
      <div class="flex justify-end">
        <NuxtLink to="new_announcement">
          <BaseButton label="Dodaj ogłoszenie" />
        </NuxtLink>
      </div>
    </div>

    <!-- Сообщения о загрузке и ошибках -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Ładowanie ogłoszeń...</p>
    </div>

    <div
      v-if="errorMessage"
      class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
    >
      {{ errorMessage }}
    </div>

    <!-- Сетка карточек -->
    <section
      v-if="!loading && announcements.length > 0"
      class="max-w-5xl mx-auto p-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <TrainerCard
        v-for="(announcement, index) in announcements"
        :key="announcement._id || index"
        :name="announcement.name"
        :image="announcement.image"
        :experience="announcement.experience"
        :contact="announcement.contact"
        :canDelete="isOwner(announcement)"
        @click="openModal(announcement)"
        class="cursor-pointer hover:scale-105 transition-transform"
      />
    </section>

    <!-- Сообщение если нет объявлений -->
    <div v-if="!loading && announcements.length === 0" class="text-center py-8">
      <p class="text-gray-500">Brak ogłoszeń. Dodaj pierwsze ogłoszenie!</p>
    </div>

    <!-- Модальное окно -->
    <div
      v-if="selectedTrainer"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full relative">
        <button
          @click="closeModal"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 class="text-xl font-bold mb-2">{{ selectedTrainer.name }}</h2>
            <p class="text-gray-600 mb-2">
              <strong>Doświadczenie:</strong>
              {{ selectedTrainer.experience || 0 }} lat
            </p>
            <p class="text-gray-600 mb-2">
              <strong>Kontakt:</strong> {{ selectedTrainer.contact }}
            </p>
            <p class="text-gray-600 font-semibold">Opis:</p>
            <p class="text-gray-600">
              {{ selectedTrainer.description }}
            </p>
          </div>

          <div>
            <img
              :src="getImageUrl(selectedTrainer.image)"
              :alt="selectedTrainer.name"
              class="w-full rounded-xl mb-4"
            />
            <div class="flex justify-end" v-if="isOwner(selectedTrainer)">
              <BorderButton
                label="Usuń"
                class="border-red-600 text-red-600"
                @click="deleteAnnouncement"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";

const announcements = ref([]);
const selectedTrainer = ref(null);
const loading = ref(true);
const deleting = ref(false);
const errorMessage = ref("");
const currentUserId = ref(null);

const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref("success");

async function deleteAnnouncement() {
  if (!selectedTrainer.value) return;

  const confirmDelete = confirm("Czy na pewno chcesz usunąć to ogłoszenie?");
  if (!confirmDelete) return;

  deleting.value = true;
  errorMessage.value = "";

  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Musisz być zalogowany, aby usunąć ogłoszenie");
    }

    const response = await fetch(
      `http://localhost:3001/announcement/${selectedTrainer.value._id}`,
      {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    announcements.value = announcements.value.filter(
      (announcement) => announcement._id !== selectedTrainer.value._id,
    );

    closeModal();
    showNotificationMessage("Ogłoszenie zostało pomyślnie usunięte", "success");
  } catch (error) {
    console.error("Error deleting announcement:", error);
    errorMessage.value = error.message || "Wystąpił błąd podczas usuwania ogłoszenia";
    showNotificationMessage(error.message || "Wystąpił błąd podczas usuwania ogłoszenia", "error");
  } finally {
    deleting.value = false;
  }
}

const getAuthToken = () => {
  if (process.client) {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  return null;
};

const getCurrentUserId = () => {
  try {
    const token = getAuthToken();
    if (!token) return null;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
};

const isOwner = (announcement) => {
  if (!currentUserId.value || !announcement?.createdBy) return false;
  return announcement.createdBy._id === currentUserId.value;
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return "/images/default-trainer.jpg";

  if (imagePath.startsWith("http")) return imagePath;

  if (imagePath.startsWith("/uploads")) {
    return `http://localhost:3001${imagePath}`;
  }

  return imagePath;
};

const showNotificationMessage = (message, type = "success") => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
};

const loadAnnouncements = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch("http://localhost:3001/announcement");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    announcements.value = data;
  } catch (error) {
    console.error("Error loading announcements:", error);
    errorMessage.value = "Wystąpił błąd podczas ładowania ogłoszeń";
    showNotificationMessage(
      "Wystąpił błąd podczas ładowania ogłoszeń",
      "error",
    );
  } finally {
    loading.value = false;
  }
};

function openModal(trainer) {
  selectedTrainer.value = trainer;
}

function closeModal() {
  selectedTrainer.value = null;
}

onMounted(() => {
  currentUserId.value = getCurrentUserId();
  loadAnnouncements();
});
</script>
