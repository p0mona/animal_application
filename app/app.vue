<template>
  <div>
    <Navbar />
    <NuxtPage />
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();

onMounted(() => {
  userStore.initUser();
});
</script>
