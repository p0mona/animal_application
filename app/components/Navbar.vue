<template>
  <div class="bg-primary">
    <div class="p-4 bg-primary">
      <header
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
        "
      >
        <h1>Logo</h1>

        <div style="display: flex; align-items: center; gap: 10px">
          <UAvatar
            @click="isOpen = true"
            src="/images/example-photo.jpg"
            size="3xl"
          />
        </div>
      </header>

      <!-- Затемнение фона -->
      <div
        v-if="isOpen"
        @click="isOpen = false"
        style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5)"
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
        <ul style="display: flex; flex-direction: column; gap: 15px">
          <li>
            <NuxtLink to="/register" @click="isOpen = false"
              >Zarejestruj się</NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/login" @click="isOpen = false">Zaloguj się</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/account" @click="isOpen = false">Konto</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/settings" @click="isOpen = false">Ustawienia</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const isOpen = ref(false);
</script>
