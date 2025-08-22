<template>
  <div class="min-h-screen bg-primary relative">
    <div class="flex justify-center p-4 bg-primary">
      <div class="max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Strona główna
        </h1>

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
    </div>

    <!-- Круглая SOS кнопка -->
    <UButton
      class="fixed bottom-6 right-6 bg-[#9370DB] hover:bg-[#7B68EE] text-white font-bold w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-xl border-4 border-white"
      :loading="saving"
      @click="handleSOS"
    >
      SOS
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ArticleCard from "/Users/polinabezukladnova/Desktop/animals_app/app/components/ArticleCard.vue";

const saving = ref(false);

function handleSOS() {
  saving.value = true;
  setTimeout(() => {
    alert("Wezwanie SOS wysłane!");
    saving.value = false;
  }, 1500);
}

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
</script>
