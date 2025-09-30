<template>
  <FullWidthLayout>
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
    
    <div v-if="errorMessage" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ errorMessage }}
    </div>

    <!-- Сетка карточек -->
    <section
      v-if="!loading && announcements.length > 0"
      class="max-w-5xl mx-auto p-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <TrainerCard
        v-for="(announcement, index) in announcements"
        :key="index"
        :name="announcement.name"
        :image="announcement.image"
        :experience="announcement.experience"
        :contact="announcement.contact"
        @click="openModal(announcement)"
        class="cursor-pointer hover:scale-105 transition-transform"
      />
    </section>

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
              <strong>Doświadczenie:</strong> {{ selectedTrainer.experience }}
            </p>
            <p class="text-gray-600 mb-2">
              <strong>Kontakt:</strong> {{ selectedTrainer.contact }}
            </p>
            <p class="text-gray-600 font-semibold">Opis:</p>
            <p class="text-gray-600">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat."
            </p>
          </div>

          <div>
            <img
              :src="selectedTrainer.image"
              :alt="selectedTrainer.name"
              class="w-full rounded-xl mb-4"
            />
          </div>
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TrainerCard from "~/components/TrainerCard.vue";

const announcements = ref([]);
const selectedTrainer = ref(null);
const loading = ref(false);
const errorMessage = ref("");

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/default-trainer.jpg';
  
  if (imagePath.startsWith('http')) return imagePath;
  
  if (imagePath.startsWith('/uploads')) {
    return `http://localhost:3001${imagePath}`;
  }
  
  return imagePath;
};

const loadAnnouncements = async () => {
  loading.value = true;
  errorMessage.value = "";
  
  try {
    const response = await fetch('http://localhost:3001/announcement');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    announcements.value = data;
    console.log('Loaded announcements:', data);
    
  } catch (error) {
    console.error('Error loading announcements:', error);
    errorMessage.value = "Wystąpił błąd podczas ładowania ogłoszeń";
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
  loadAnnouncements();
});
</script>
