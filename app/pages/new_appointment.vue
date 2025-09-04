<template>
  <Layout>
    <div class="max-w-3xl bg-white rounded-2xl shadow-lg p-6">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        color="neutral"
        class="rounded-full hover:bg-violet-100 active:bg-violet-200 text-violet-500"
        @click="goBack"
      />

      <h1 class="mb-5 text-xl font-bold">Nowa wizyta</h1>
      <div class="space-y-4">
        <div>
          <UFormGroup label="Birthday" name="birthday">
            <p class="text-sm mb-2">Termin</p>
            <UInput id="date" type="date" v-model="form.date" class="w-full" />
          </UFormGroup>
        </div>

        <div>
          <p class="text-sm mb-2">Godzina</p>
          <UInput
            id="oclock"
            v-model="form.oclock"
            type="time"
            class="w-full"
          />
        </div>

        <div>
          <p class="text-sm mb-2">Cel</p>
          <UInput v-model="form.object" type="string" class="w-full" />
        </div>

        <UButton
          type="submit"
          class="bg-violet-500 hover:bg-violet-600 active:bg-violet-700"
          :loading="saving"
        >
          Zapisz
        </UButton>
      </div>
    </div>
  </Layout>
</template>

<script setup>
const goBack = () => {
  navigateTo("/patient");
};

const form = ref({
  birthday: "",
  oclock: "",
  object: "",
});
</script>
