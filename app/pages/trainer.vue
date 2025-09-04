<template>
  <Layout>
    <div class="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <!-- Заголовок -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Znajdź behawiorystę</h1>
        <div class="flex justify-end">
          <NuxtLink to="new_announcement">
            <UButton
              type="button"
              class="md:w-auto mt-4 bg-violet-500 hover:bg-violet-600 active:bg-violet-700"
            >
              Dodaj ogłoszenie
            </UButton>
          </NuxtLink>
        </div>
      </div>

      <!-- Сетка карточек -->
      <section
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
              Doświadczenie: {{ selectedTrainer.experience }}
            </p>
            <p class="text-gray-600 mb-2">
              Kontakt: {{ selectedTrainer.contact }}
            </p>
            <p class="text-gray-600">Opis:</p>
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
  </Layout>
</template>

<script setup>
import { ref } from "vue";
import TrainerCard from "~/components/TrainerCard.vue";

const announcements = [
  {
    name: "Kasia",
    image: "/images/trainer1.jpg",
    experience: "2 lata",
    contact: "123-456-789",
  },
  {
    name: "Artur",
    image: "/images/trainer3.jpg",
    experience: "1 rok",
    contact: "123-456-789",
  },
  {
    name: "Julia",
    image: "/images/trainer2.jpg",
    experience: "4 lata",
    contact: "123-456-789",
  },
  {
    name: "David",
    image: "/images/trainer4.jpg",
    experience: "10 lat",
    contact: "123-456-789",
  },
  {
    name: "Zofia",
    image: "/images/trainer5.jpg",
    experience: "5 lat",
    contact: "123-456-789",
  },
  {
    name: "Beata",
    image: "/images/trainer6.jpg",
    experience: "7 rok",
    contact: "123-456-789",
  },
];

const selectedTrainer = ref(null);

function openModal(trainer) {
  selectedTrainer.value = trainer;
}

function closeModal() {
  selectedTrainer.value = null;
}
</script>
