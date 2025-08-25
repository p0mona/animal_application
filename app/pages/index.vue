<template>
  <div class="min-h-screen bg-primary relative">
    <div class="flex justify-center p-4 bg-primary">
      <div class="max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Strona główna
        </h1>

        <!-- Mobile Navigation -->
        <div class="sm:hidden mb-6">
          <div
            class="flex justify-around bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm"
          >
            <UButton
              v-for="item in navItems"
              :key="item.key"
              :icon="item.icon"
              :color="activeTab === item.key ? 'primary' : 'neutral'"
              variant="ghost"
              size="lg"
              class="rounded-full"
              @click="activeTab = item.key"
            />
          </div>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden sm:block mb-6">
          <div
            class="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm"
          >
            <UButton
              v-for="item in navItems"
              :key="item.key"
              :icon="item.icon"
              :label="item.label"
              :color="activeTab === item.key ? 'primary' : 'neutral'"
              variant="ghost"
              :class="[
                'flex items-center space-x-2 px-4 py-3',
                activeTab === item.key
                  ? 'bg-primary-50 dark:bg-primary-900/20'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700',
              ]"
              @click="activeTab = item.key"
            />
          </div>
        </div>

        <div v-if="activeTab === 'article'" class="space-y-6">
          <!-- Статьи -->
          <section
            class="max-w-5xl mx-auto p-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <ArticleCard
              v-for="(article, index) in articles"
              :key="index"
              :title="article.title"
              :author="article.author"
              :date="article.date"
              :image="article.image"
              :excerpt="article.excerpt"
            />
          </section>
        </div>

        <div v-if="activeTab === 'abroad'" class="space-y-6">
          <section
            class="max-w-5xl mx-auto p-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <ArticleCard
              v-for="(abroad, index) in abroads"
              :key="index"
              :title="abroad.title"
              :date="abroad.date"
              :image="abroad.image"
              :excerpt="abroad.excerpt"
            />
          </section>
        </div>
      </div>
    </div>

    <!-- Круглая SOS кнопка -->
    <UButton
      class="fixed bottom-6 right-6 bg-[#9370DB] hover:bg-[#7B68EE] text-white font-bold w-20 h-20 rounded-full shadow-lg flex items-center justify-center text-xl border-4 border-white"
      :loading="saving"
    >
      SOS
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ArticleCard from "/Users/polinabezukladnova/Desktop/animals_app/app/components/ArticleCard.vue";
import { any } from "valibot";

const navItems = [
  { key: "article", label: "Artykuły", icon: "heroicons:book-open" },
  { key: "abroad", label: "Za granicą", icon: "heroicons:identification" },
];

const activeTab = ref("article");

const saving = ref(false);

const articles = [
  {
    title: "Artykuł 1",
    author: "Autor 1",
    date: "22 sierpnia 2025",
    image: "/images/dog-article1.jpg",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Artykuł 2",
    author: "Autor 2",
    date: "21 kwietnia 2025",
    image: "/images/cat-article2.jpg",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Artykuł 3",
    author: "Autor 3",
    date: "20 lutego 2025",
    image: "/images/parrot-article3.jpg",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

const abroads = [
  {
    title: "Artykuł 1",
    author: "Autor 1",
    date: "22 sierpnia 2025",
    image: "/images/cat-abroad1.jpeg",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Artykuł 2",
    author: "Autor 2",
    date: "21 kwietnia 2025",
    image: "/images/dog-abroad2.jpg",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Artykuł 3",
    author: "Autor 3",
    date: "20 lutego 2025",
    image: "/images/dog-abroad3.jpg",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];
</script>
