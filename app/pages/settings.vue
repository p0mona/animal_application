<template>
  <div class="min-h-screen bg-primary">
    <UContainer class="py-8">
      <h1 class="text-2xl font-bold mb-6 text-white">Ustawienia</h1>

      <UTabs v-model="tab" :items="[
        { key: 'account', label: 'Informacje osobiste' },
        { key: 'password', label: 'Hasło i bezpieczeństwo' },
        { key: 'notifications', label: 'Powiadomienia' },
        { key: 'help', label: 'Pomoc' },
      ]" 
      
      />

      <div v-if="tab === 'profil'" class="mt-6">
        ...
      </div>

      <div v-else-if="tab === 'powiadomienia'" class="mt-6">
        <UForm :state="notifications">
          <UCheckbox v-model="notifications.email" label="E-mail" />
          <UCheckbox v-model="notifications.push" label="Powiadomienia push" class="mt-2" />
          <UCheckbox v-model="notifications.sms" label="SMS" class="mt-2" />

          <UButton class="mt-6">Zapisz ustawienia</UButton>
        </UForm>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const profile = ref({
  name: '',
  email: '',
  phone: '',
})

const password = ref({
  old: '',
  new: '',
  confirm: '',
})

const notifications = ref({
  email: true,
  push: false,
  sms: false,
})

const tab = ref('profil')
</script>