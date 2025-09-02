<template>
  <div class="min-h-screen bg-[#77e177]">
    <div class="flex justify-center p-4 bg-[#77e177]">
      <div
        class="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-6 space-y-4"
      >

        <!-- Заголовок -->
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Znajdź behawiorystę</h1>
        </div>

        <!-- Mobile Navigation -->
        <div class="sm:hidden mb-6">
          <div class="flex justify-around bg-white rounded-lg p-2 shadow-sm">
            <UButton
              v-for="item in navItems"
              :key="item.key"
              :icon="item.icon"
              :color="activeTab === item.key ? undefined : 'neutral'"
              variant="ghost"
              size="lg"
              :class="[
                'rounded-full',
                activeTab === item.key
                  ? 'bg-violet-50 text-violet-500 hover:text-violet-600 hover:bg-violet-100'
                  : '',
              ]"
              @click="activeTab = item.key"
            />
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden sm:block mb-6">
          <div class="flex space-x-1 bg-white rounded-lg p-2 shadow-sm">
            <UButton
              v-for="item in navItems"
              :key="item.key"
              :icon="item.icon"
              :label="item.label"
              :color="activeTab === item.key ? undefined : 'neutral'"
              variant="ghost"
              :class="[
                'flex items-center space-x-2 px-4 py-3',
                activeTab === item.key
                  ? 'bg-violet-50 text-violet-500 hover:text-violet-600 hover:bg-violet-100'
                  : 'hover:bg-gray-100',
              ]"
              @click="activeTab = item.key"
            />
          </div>
        </div>

       
          <!-- Статьи -->
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
            />
          </section>

      </div>
    </div>
  </div>
</template>
<script setup>
import TrainerCard from '~/components/TrainerCard.vue';

const announcements = [
  {
    name: "Kasia",
    image: "/images/trainer1.jpg",
    experience:"2 lata",
    contact: "123-456-789",
  },
  {
    name: "Artur",
    image: "/images/trainer3.jpg",
    experience:"1 rok",
    contact: "123-456-789",
  },
  {
    name: "Julia",
    image: "/images/trainer2.jpg",
    experience:"4 lata",
    contact: "123-456-789",
  },
  {
    name: "David",
    image: "/images/trainer4.jpg",
    experience:"10 lat",
    contact: "123-456-789",
  },
  {
    name: "Zofia",
    image: "/images/trainer5.jpg",
    experience:"5 lat",
    contact: "123-456-789",
  },
  {
    name: "Beata",
    image: "/images/trainer6.jpg",
    experience:"7 rok",
    contact: "123-456-789",
  },

];
</script>
