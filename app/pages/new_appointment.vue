<template>
  <Layout>
    <BackButton to="/patient" />

    <h1 class="mb-5 text-2xl font-bold">Nowa wizyta</h1>
    <div class="space-y-4">
      <BaseInput label="Termin" id="date" type="date" v-model="form.date" />
      <BaseInput
        label="Godzina"
        id="oclock"
        v-model="form.oclock"
        type="time"
      />
      <BaseInput label="Cel" v-model="form.object" />

      <BaseButton label="Zapisz" />
    </div>
  </Layout>
</template>

<script setup>
const form = ref({
  birthday: "",
  oclock: "",
  object: "",
});
</script>
