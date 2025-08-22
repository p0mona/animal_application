<template>
  <div class="min-h-screen bg-primary">
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
  </div>
</template>

<script setup lang="ts">
import ArticleCard from "/Users/polinabezukladnova/Desktop/animals_app/app/components/ArticleCard.vue";

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
