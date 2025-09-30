<template>
  <FullWidthLayout>
    <BackButton to="/trainer" />

    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Ogłoszenie</h1>
    </div>

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
import { reactive, ref } from 'vue'

const form = reactive({
  name: "",
  experience: "",
  contact: "",
  image: null as File | null,
  description: "",
});

const loading = ref(false)
const errorMessage = ref("")
const successMessage = ref("")

const submitForm = async () => {
  if (!form.name.trim()) {
    errorMessage.value = "Imię jest wymagane"
    return
  }

  if (!form.experience || parseInt(form.experience) < 0) {
    errorMessage.value = "Doświadczenie jest wymagane i musi być liczbą dodatnią"
    return
  }

  if (!form.contact.trim()) {
    errorMessage.value = "Kontakt jest wymagany"
    return
  }

  if (!form.description.trim()) {
    errorMessage.value = "Opis jest wymagany"
    return
  }

  if (form.description.length < 10) {
    errorMessage.value = "Opis musi mieć co najmniej 10 znaków"
    return
  }

  if (!form.image) {
    errorMessage.value = "Zdjęcie jest wymagane"
    return
  }

  loading.value = true
  errorMessage.value = ""
  successMessage.value = ""

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

    const API_URL = 'http://localhost:3001/announcement';
    console.log('Sending to:', API_URL);

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    })

    console.log('Response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('Response data:', result)

    successMessage.value = result.message || "Ogłoszenie zostało pomyślnie dodane!"
    resetForm()
    
  } catch (error: any) {
    console.error('Fetch error:', error)
    errorMessage.value = error.message || "Wystąpił błąd podczas dodawania ogłoszenia"
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.name = ""
  form.experience = ""
  form.contact = ""
  form.image = null
  form.description = ""
}
</script>
