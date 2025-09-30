<template>
  <FullWidthLayout>
    <BackButton to="/trainer" />

    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Ogłoszenie</h1>
    </div>

    <!-- Notifications -->
    <Notification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      :duration="3000"
      @close="showNotification = false"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <BaseInput label="Wpisz imię" v-model="form.name" />
        <BaseInput
          label="Doświadczenie (w latach)"
          v-model="form.experience"
          type="number"
        />
        <BaseInput label="Wpisz kontakt" v-model="form.contact" />
        <BaseInput label="Dodaj opis" v-model="form.description" />
      </div>

      <div>
        <FileUpload v-model="form.image" class="mt-4" />
        <div class="flex justify-end mt-4">
          <BaseButton 
            label="Dodaj" 
            :loading="loading"
            @click="submitForm"
          />
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";

const form = reactive({
  name: "",
  experience: "",
  contact: "",
  image: null as File | null,
  description: "",
});

const loading = ref(false);

// Notifications
const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref<"success" | "error">("success");

const notificationClass = computed(() => {
  return {
    success: "bg-green-100 border border-green-400 text-green-700",
    error: "bg-red-100 border border-red-400 text-red-700",
  }[notificationType.value];
});

const showNotify = (message: string, type: "success" | "error" = "success") => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
};

const submitForm = async () => {
  if (!form.name.trim()) return showNotify("Imię jest wymagane", "error");
  if (!form.experience || parseInt(form.experience) < 0) return showNotify("Doświadczenie jest wymagane i musi być liczbą dodatnią", "error");
  if (!form.contact.trim()) return showNotify("Kontakt jest wymagany", "error");
  if (!form.description.trim()) return showNotify("Opis jest wymagany", "error");
  if (form.description.length < 10) return showNotify("Opis musi mieć co najmniej 10 znaków", "error");
  if (!form.image) return showNotify("Zdjęcie jest wymagane", "error");

  loading.value = true;
  showNotification.value = false;

  try {
    const formData = new FormData()
    
    // Добавляем поля как строки
    formData.append('name', form.name.trim())
    formData.append('experience', form.experience.toString())
    formData.append('contact', form.contact.trim())
    formData.append('description', form.description.trim())
    
    if (form.image) {
      formData.append('image', form.image)
    }

    const API_URL = "http://localhost:3001/announcement";
    const response = await fetch(API_URL, { method: "POST", body: formData });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();

    showNotify(result.message || "Ogłoszenie zostało pomyślnie dodane!", "success");

    // reset form
    form.name = "";
    form.experience = "";
    form.contact = "";
    form.description = "";
    form.image = null;

  } catch (error: any) {
    console.error(error);
    showNotify(error.message || "Wystąpił błąd podczas dodawania ogłoszenia", "error");
  } finally {
    loading.value = false;
  }
};
</script>