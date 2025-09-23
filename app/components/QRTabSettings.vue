<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">QR</h2>
    </template>
    <div class="w-full flex flex-col items-center">
      <!-- Показываем QR код только после генерации -->
      <div v-if="qrImageUrl" class="mb-4 p-4 bg-white rounded-lg">
        <img :src="qrImageUrl" alt="QR Code" class="w-48 h-48 mx-auto" />
      </div>
      <dev class="space-x-4">
        <UButton
          @click="generateQR"
          :loading="isGenerating"
          class="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white"
        >
          Generuj QR
        </UButton>
        <BorderButton
          @click="downloadQR"
          :disabled="!qrImageUrl"
          label="Pobrać"
          class="disabled:bg-white"
        />
      </dev>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import QRCode from "qrcode";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();
const isGenerating = ref(false);
const qrImageUrl = ref<string | null>(null);

// Получаем данные пользователя
const userData = computed(() => userStore.user);
const ownerInfo = computed(() => {
  if (!userData.value) return null;

  return {
    name: userData.value.name || "",
    phone: userData.value.phone || "",
  };
});

// Генерация QR кода
const generateQR = async () => {
  if (!ownerInfo.value) {
    alert("Brak danych użytkownika. Proszę uzupełnić profil.");
    return;
  }

  if (!ownerInfo.value.name || !ownerInfo.value.phone) {
    alert("Proszę uzupełnić imię i numer telefonu w profilu.");
    return;
  }

  isGenerating.value = true;

  try {
    const cleanPhone = ownerInfo.value.phone.replace(/[\s\-\(\)]/g, "");
    // Создаем текст для QR кода в формате tel: для звонка
    const callLink = `tel:${cleanPhone}`;

    // Генерируем QR код с ссылкой для звонка
    const url = await QRCode.toDataURL(callLink, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    qrImageUrl.value = url;
  } catch (error) {
    console.error("Błąd generowania QR:", error);
    alert("Wystąpił błąd podczas generowania QR kodu.");
  } finally {
    isGenerating.value = false;
  }
};

// Скачивание QR кода
const downloadQR = () => {
  if (!qrImageUrl.value) return;

  try {
    const link = document.createElement("a");
    link.download = `qr-code-${ownerInfo.value?.name || "owner"}.png`;
    link.href = qrImageUrl.value;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Błąd podczas pobierania QR:", error);
    alert("Wystąpił błąd podczas pobierania QR kodu.");
  }
};
</script>
