<template>
  <FullWidthLayout>
    <h1 class="text-2xl font-bold text-gray-900">Konto</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <BaseInput label="Wpisz imię" v-model="form.name" />
        <BaseInput label="Wpisz miejsce pracy" v-model="form.vet.hospital" />

        <div class="w-full mt-2">
          <p class="text-sm">Płeć</p>
          <RadioButton v-model="form.sex" :items="sexOptions" />
        </div>

        <BaseInput label="Data urodzenia" type="date" v-model="form.birthday" />
      </div>

      <div>
        <div v-if="form.imageUrl" class="mb-2">
          <img :src="form.imageUrl" alt="avatar" class="w-32 h-32 object-cover rounded-full" />
        </div>

        <input type="file" @change="handleFileUpload" accept="image/*" />
        <div class="flex justify-end">
          <UButton
            type="button"
            @click="saveProfile"
            class="md:w-auto mt-4 bg-violet-500 hover:bg-violet-600 active:bg-violet-70 cursor-pointer"
          >
            Potwierdź
          </UButton>
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();

const form = reactive({
  name: "",
  birthday: "",
  sex: "K",
  image: null as File | null,
  imageUrl: "",
  vet: { hospital: "" },
});

const sexOptions = [
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
];

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    form.image = target.files[0];
    form.imageUrl = URL.createObjectURL(target.files[0]);
  }
}

onMounted(async () => {
  await userStore.getProfile();
  if (userStore.user) {
    form.name = userStore.user.name || "";
    form.birthday = userStore.user.birthday || "";
    form.sex = userStore.user.sex || "K";
    form.vet.hospital = userStore.user.vet?.hospital || "";
    form.imageUrl = userStore.user.image ? `http://localhost:3001${userStore.user.image}` : "";
  }
});

async function saveProfile() {
  try {
    await userStore.updateProfile(form);
    alert("Profil został zapisany!");
  } catch (error) {
    console.error("Save error:", error);
  }
}
</script>