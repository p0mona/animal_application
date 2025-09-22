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

  async function updateProfile(profileData: any) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("name", profileData.name || "");
      formData.append("birthday", profileData.birthday || "");
      formData.append("sex", profileData.sex || "K");
      formData.append("phone", profileData.phone || "");

      if (user.value?.userType === "OWNER") {
        formData.append(
          "owner",
          JSON.stringify({
            pet: profileData.owner?.pet || {},
            sos_phone: profileData.owner?.sos_phone || "",
          }),
        );
      }

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

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setUser(data.user);
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  async function getProfile() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:3001/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData); // Используем существующую функцию
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  async function changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        "http://localhost:3001/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(passwordData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error changing password");
      }

      return await response.json();
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
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
    changePassword,
  };
});
