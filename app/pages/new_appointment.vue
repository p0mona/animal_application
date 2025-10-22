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
