<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">SOS</h2>
    </template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <BaseInput label="Wpisz numer komórkowy" v-model="sosPhone" />
        <div class="flex justify-end mt-2">
          <BaseButton label="Zatwierdź" @click="saveSosPhone" />
        </div>
        <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
      </div>
    </div>
  </UCard>

  <Notification
    v-if="showNotification"
    :message="notificationMessage"
    :type="notificationType"
    :duration="3000"
    @close="showNotification = false"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "~/stores/user";

const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref<"success" | "error">("success");
const saving = ref(false);

const showNotify = (message: string, type: "success" | "error" = "success") => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
  
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

const userStore = useUserStore();
const sosPhone = ref("");
const error = ref("");

onMounted(() => {
  if (userStore.user?.owner?.sos_phone) {
    sosPhone.value = userStore.user.owner.sos_phone;
  }
});

const saveSosPhone = async () => {
  if (!sosPhone.value.trim()) {
    error.value = "Proszę wpisać numer telefonu";
    return;
  }

  const digitsOnly = sosPhone.value.replace(/[\s-]/g, "");
  const phoneRegex = /^\d{9}$/;
  if (!phoneRegex.test(digitsOnly)) {
    error.value = "Numer telefonu musi składać się z 9 cyfr";
    showNotify("Numer telefonu musi składać się z 9 cyfr", "error");
    return;
  }

  try {
    saving.value = true;
    error.value = "";
    
    await userStore.updateProfile({
      ...userStore.user,
      owner: {
        ...userStore.user?.owner,
        sos_phone: sosPhone.value.trim(),
      },
    });
    
    showNotify("Numer SOS został pomyślnie zapisany", "success");
  } catch (err: any) {
    error.value = err.message || "Wystąpił błąd podczas zapisywania numeru SOS";
    showNotify(error.value, "error");
  } finally {
    saving.value = false;
  }
};

watch(sosPhone, () => {
  if (error.value) {
    error.value = "";
  }
});
</script>
