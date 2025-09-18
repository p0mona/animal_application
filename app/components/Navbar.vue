<template>
  <div class="bg-[#77e177] p-4">
    <header class="flex justify-between items-center p-2">
      <NuxtLink to="/">
        <img src="/images/logo.svg" alt="Logo" class="w-16 h-16" />
      </NuxtLink>

      <div
        v-if="userStore.isLoading"
        class="w-12 h-12 rounded-full bg-gray-200 animate-pulse"
      ></div>
      <UAvatar
        v-else
        @click="isOpen = true"
        :src="avatarSrc"
        size="3xl"
        class="shadow-lg"
      />
    </header>

    <!-- Затемнение -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 bg-black/50 z-50"
    ></div>

    <!-- Боковое меню -->
    <nav
      :class="[
        'fixed top-0 right-0 h-full w-64 bg-white p-5 transition-transform z-100',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      ]"
    >
      <button @click="isOpen = false" class="text-2xl mb-5 cursor-pointer">
        ✕
      </button>
      <ul class="flex flex-col gap-4">
        <li v-for="link in menuLinks" :key="link.label">
          <template v-if="link.action === 'logout'">
            <button @click="logout" class="text-left w-full cursor-pointer">
              {{ link.label }}
            </button>
          </template>
          <template v-else>
            <NuxtLink :to="link.to" @click="isOpen = false">{{
              link.label
            }}</NuxtLink>
          </template>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "~/stores/user";
import { navigateTo } from "#app";

const isOpen = ref(false);
const userStore = useUserStore();

const user = computed(() => userStore.user);

// Меню динамически в зависимости от userType
const menuLinks = computed(() => {
  if (!userStore.isLoggedIn) {
    return [
      { label: "Strona główna", to: "/" },
      { label: "Schronisko", to: "/shelter" },
      { label: "Behawiorysta", to: "/trainer" },
      { label: "Zaloguj się", to: "/login" },
      { label: "Załóż konto", to: "/register" },
    ];
  }

  if (user.value?.userType === "OWNER") {
    return [
      { label: "Konto", to: "/account" },
      { label: "Ustawienia", to: "/settings" },
      { label: "Przypomnienia", to: "/reminders" },
      { label: "Dokumenty", to: "/documents" },
      { label: "Tracker", to: "/tracker" },
      { label: "Schronisko", to: "/shelter" },
      { label: "Behawiorysta", to: "/trainer" },
      { label: "Wyloguj się", action: "logout" },
    ];
  }

  if (user.value?.userType === "VET") {
    return [
      { label: "Klinika weterynaryjna", to: "/vet_clinic" },
      { label: "Weterynarz", to: "/vet_settings" },
      { label: "Vet Konto", to: "/vet_account" },
      { label: "Schronisko", to: "/shelter" },
      { label: "Behawiorysta", to: "/trainer" },
      { label: "Wyloguj się", action: "logout" },
    ];
  }

  return [];
});

// Функция выхода
function logout() {
  userStore.clearUser();
  isOpen.value = false;
  navigateTo("/");
}

// Динамическая аватарка
const avatarSrc = computed(() => {
  if (!user.value) {
    return "/images/guest.jpg";
  }

  if (user.value.userType === "OWNER") {
    return user.value.image 
      ? `http://localhost:3001${user.value.image}`
      : "/images/example-photo.jpg";
  }

  if (user.value.userType === "VET") {
    return user.value.image 
      ? `http://localhost:3001${user.value.image}`
      : "/images/doctor.jpg";
  }

  return "/images/guest.jpg";
});
</script>
