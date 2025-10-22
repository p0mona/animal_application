<template>
  <Layout>
    <BackButton to="/patients_settings" />

    <h1 class="mb-5 text-2xl font-bold">Nowa wizyta</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="space-y-4">
        <!-- Пациент -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Pacjent
          </label>
          <select 
            v-model="form.patient_id"
            class="w-full border border-gray-300 rounded-lg px-3 py-2"
            :class="{ 'border-red-500': errors.patient_id }"
          >
            <option value="">Wybierz pacjenta</option>
            <option 
              v-for="patient in patients" 
              :key="patient._id" 
              :value="patient._id"
            >
              {{ patient.name }} - {{ patient.breed }}
            </option>
          </select>
          <p v-if="errors.patient_id" class="text-red-500 text-sm mt-1">{{ errors.patient_id }}</p>
        </div>
        
        <!-- Дата -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Data
          </label>
          <input 
            type="date"
            v-model="form.date"
            :min="minDate"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.date }"
          />
          <p v-if="errors.date" class="text-red-500 text-sm mt-1">{{ errors.date }}</p>
        </div>
        
        <!-- Время -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Godzina
          </label>
          <select 
            v-model="form.time"
            class="w-full border border-gray-300 rounded-lg px-3 py-2"
            :class="{ 'border-red-500': errors.time }"
          >
            <option value="">Wybierz godzinę</option>
            <option 
              v-for="timeSlot in availableTimeSlots" 
              :key="timeSlot.value" 
              :value="timeSlot.value"
            >
              {{ timeSlot.label }}
            </option>
          </select>
          <p v-if="errors.time" class="text-red-500 text-sm mt-1">{{ errors.time }}</p>
        </div>
      </div>
      <div class="space-y-2">
        <BaseInput label="Termin" id="date" type="date" v-model="form.date" />
        <BaseInput
          label="Godzina"
          id="oclock"
          v-model="form.oclock"
          type="time"
        />
        <BaseInput label="Cel" v-model="form.object" />
        <div class="flex justify-end mt-4">
          <BaseButton label="Zapisz" />
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
const form = ref({
  birthday: "",
  oclock: "",
  object: "",
  animal_name: "",
  name: "",
  contact: "",
});
</script>
