import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref<any>(null);
  const isLoading = ref(true);

  const isLoggedIn = computed(() => !!user.value);

  function initUser() {
    if (process.client) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) user.value = JSON.parse(storedUser);
      isLoading.value = false;
    }
  }

  function setUser(newUser: any) {
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

  async function getProfile() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("http://localhost:3001/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) user.value = await res.json();
  }

  async function updateProfile(profileData: any) {
  try {  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
      return;
    }

    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("birthday", profileData.birthday);
    formData.append("sex", profileData.sex);
    formData.append("vet", JSON.stringify(profileData.vet));

    if (profileData.image instanceof File) {
      formData.append("image", profileData.image);
    }
    
    const res = await fetch("http://localhost:3001/auth/update-profile", {
      method: "PUT",
      headers: { 
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      user.value = data.user;
      if (process.client) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } else {
      console.error("Server error:", await res.text());
    }
  } catch (error) {
    console.error("Error in updateProfile:", error);
  }
}

  return {
    user,
    isLoggedIn,
    isLoading,
    initUser,
    setUser,
    clearUser,
    getProfile,
    updateProfile,
  };
});
