<template>
  <Layout>
    <h1 class="text-2xl font-bold text-gray-900">Strona główna</h1>

    <Navigation :items="navItems" v-model="activeTab" />

    <div v-if="activeTab === 'article'" class="space-y-6">
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

    <div v-if="activeTab === 'advice'" class="space-y-6">
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

    <!-- Круглая SOS кнопка -->
    <UButton
      v-if="userStore.user?.userType === 'OWNER'"
      class="fixed bottom-6 right-6 cursor-pointer bg-[#FF2400] hover:bg-[#e62000] active:bg-[#c9260d] text-white font-bold w-20 h-20 rounded-full shadow-lg flex items-center justify-center text-xl border-4 border-white"
      @click="handleSosCall"
    >
      SOS
    </UButton>
  </Layout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();

const navItems = [
  { key: "article", label: "Artykuły", icon: "heroicons:book-open" },
  { key: "abroad", label: "Za granicą", icon: "heroicons:identification" },
  { key: "advice", label: "Porady", icon: "heroicons:arrow-trending-up-solid" },
];

const activeTab = ref("article");

// Получаем сохраненный номер SOS из store
const sosPhone = computed(() => {
  return userStore.user?.owner?.sos_phone || '';
});

const formatPhone = (phone: string) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  return phone;
};

const handleSosCall = () => {
  if (!sosPhone.value) {
    alert('Nie ustawiono numeru SOS. Proszę dodać numer telefonu w zakładce profilu.');
    return;
  }
  
  // Подтверждение звонка
  const confirmed = confirm(`Czy chcesz zadzwonić pod numer awaryjny?\n${formatPhone(sosPhone.value)}`);
  
  if (confirmed) {
    makeSosCall();
  }
};

const makeSosCall = () => {
  try {
    const phoneNumber = sosPhone.value.replace(/(?!^\+)\D/g, '');
    const telLink = `tel:${phoneNumber}`;
    
    // Пытаемся открыть приложение телефона
    window.location.href = telLink;
    
  } catch (error) {
    console.error('Błąd podczas inicjowania połączenia:', error);
    
    alert(`Nie można zainicjować połączenia. Proszę zadzwonić ręcznie pod numer: ${formatPhone(sosPhone.value)}`);
  }
};

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
    date: "22 sierpnia 2025",
    image: "/images/cat-abroad1.jpeg",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Artykuł 2",
    date: "21 kwietnia 2025",
    image: "/images/dog-abroad2.jpg",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Artykuł 3",
    date: "20 lutego 2025",
    image: "/images/dog-abroad3.jpg",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

const advie = [
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