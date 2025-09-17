import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref<{ id: string; userType: string; avatar?: string } | null>(
    null,
  );
  const isLoading = ref(true); // Добавляем состояние загрузки

  const isLoggedIn = computed(() => !!user.value);

  function initUser() {
    if (process.client) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        user.value = JSON.parse(storedUser);
      }
      isLoading.value = false; // Загрузка завершена
    }
  }

  function setUser(newUser: { id: string; userType: string; avatar?: string }) {
    user.value = newUser;
    if (process.client) localStorage.setItem("user", JSON.stringify(newUser));
  }

  function clearUser() {
    user.value = null;
    if (process.client) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }

  return { user, isLoggedIn, isLoading, initUser, setUser, clearUser };
});
