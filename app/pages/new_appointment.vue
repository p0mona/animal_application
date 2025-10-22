<template>
  <Layout>
    <BackButton to="/patients_settings" />

    <h1 class="mb-5 text-2xl font-bold">Nowa wizyta</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <BaseInput label="Imię pupila" v-model="form.animal_name" />
        <BaseInput label="Imię właściciela" v-model="form.name" />
        <BaseInput label="Kontakt" v-model="form.contact" />
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
