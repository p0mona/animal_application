import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref<{ id: string; userType: string; avatar?: string } | null>(null);

  // Инициализация на клиенте
  if (process.client) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) user.value = JSON.parse(storedUser);
  }

  const isLoggedIn = computed(() => !!user.value);

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

  return { user, isLoggedIn, setUser, clearUser };
});
