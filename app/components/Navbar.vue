<template>
  <div class="bg-[#77e177]">
    <div class="p-4 bg-[#77e177]">
      <header
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
        "
      >
        <NuxtLink to="/" class="inline-block">
          <img src="/images/logo.svg" alt="Logo" class="w-16 h-16" />
        </NuxtLink>

        <div style="display: flex; align-items: center; gap: 10px">
          <UAvatar
            @click="isOpen = true"
            src="/images/example-photo.jpg"
            size="3xl"
            class="shadow-lg"
          />
        </div>
      </header>

      <!-- Затемнение фона -->
      <div
        v-if="isOpen"
        @click="isOpen = false"
        style="
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 50;
        "
      ></div>

      <!-- Боковое меню -->
      <nav
        :style="{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: '250px',
          background: '#fff',
          padding: '20px',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          zIndex: 100,
        }"
      >
        <button
          @click="isOpen = false"
          style="
            background: none;
            border: none;
            font-size: 24px;
            margin-bottom: 20px;
            cursor: pointer;
          "
        >
          ✕
        </button>

        <!-- Список ссылок -->
        <ul style="display: flex; flex-direction: column; gap: 15px">
          <li v-for="link in links" :key="link.to">
            <NuxtLink :to="link.to" @click="isOpen = false">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isOpen = ref(false);
const links = ref([]);

// Генерация ссылок после загрузки клиента
onMounted(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = user.userType;

  links.value = [
    { label: "Strona główna", to: "/" },
    { label: "Załóż konto", to: "/register" },
    { label: "Zaloguj się", to: "/login" },
    ...(userType === "OWNER"
      ? [
          { label: "Konto", to: "/account" },
          { label: "Ustawienia", to: "/settings" },
          { label: "Przypomnienia", to: "/reminders" },
          { label: "Dokumenty", to: "/documents" },
          { label: "Tracker", to: "/tracker" },
        ]
      : []),
    ...(userType === "VET"
      ? [
          { label: "Klinika weterynaryjna", to: "/vet_clinic" },
          { label: "Weterynarz", to: "/vet_settings" },
          { label: "Vet Konto", to: "/vet_account" },
        ]
      : []),
    { label: "Schronisko", to: "/shelter" },
    { label: "Behawiorysta", to: "/trainer" },
    { label: "Wyloguj się", to: "" },
  ];
});
</script>