<template>
  <FullWidthLayout>
    <!-- Notification Component -->
    <Notification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      :duration="3000"
      @close="showNotification = false"
    />
    <BackButton to="/patients_settings" />

    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Nowy pacjent</h1>
      <div>
        <BaseButton label="Zeskanuj QR" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <PetForm
          v-model="form.owner.pet"
          :animals="animals"
          :breeds="breeds"
          :animal_sex="animal_sex"
        />
      </div>

      <div class="mt-8">
        <OwnerForm v-model="form.owner" :sex="sex" />
        <div class="mt-8 flex justify-end">
          <BaseButton label="Dodaj" @click="savePatient" />
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { RadioGroupItem } from "@nuxt/ui";

const router = useRouter();

const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref<"success" | "error">("success");

const showNotify = (message: string, type: "success" | "error" = "success") => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
};

interface OwnerForm {
  name: string;
  birthday: string;
  sex: string;
  phone: string;
  image: File | null;
  pet: {
    animal: string;
    animal_sex: string;
    breed: string;
    animal_name: string;
    animal_age: string;
    animal_height: string;
    animal_weight: string;
    chip: string;
  };
}

interface PatientForm {
  owner: OwnerForm;
}

const form = reactive<PatientForm>({
  owner: {
    name: "",
    birthday: "",
    sex: "K",
    phone: "",
    image: null,
    pet: {
      animal: "",
      animal_sex: "K",
      breed: "",
      animal_name: "",
      animal_age: "",
      animal_height: "",
      animal_weight: "",
      chip: "",
    },
  },
});

const animals = ref(["Pies", "Kot", "Chomik"]);
const breeds = ref(["Akita Inu", "Beagle", "Szpic"]);

const sex = ref<RadioGroupItem[]>([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);

const animal_sex = ref<RadioGroupItem[]>([
  { label: "Samica", value: "K" },
  { label: "Samiec", value: "M" },
]);

const saving = ref(false);

const savePatient = async () => {
  try {
    saving.value = true;

    const token = localStorage.getItem("token");
    if (!token) {
      showNotify("Nie jesteś zalogowany", "error");
      return;
    }

    const formData = new FormData();

    formData.append("name", form.owner.pet.animal_name);
    formData.append("breed", form.owner.pet.breed);
    formData.append("sex", form.owner.pet.animal_sex);
    formData.append("animal", form.owner.pet.animal);
    formData.append("animal_age", form.owner.pet.animal_age);
    formData.append("animal_height", form.owner.pet.animal_height);
    formData.append("animal_weight", form.owner.pet.animal_weight);
    formData.append("chip", form.owner.pet.chip);

    if (form.owner.image) {
      formData.append("image", form.owner.image);
    }

    await $fetch("http://localhost:3001/patients", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    showNotify("Pacjent został pomyślnie zapisany!", "success");

    setTimeout(() => {
      router.push("/patients_settings");
    }, 2000);
  } catch (error: any) {
    console.error("Error saving patient:", error);
    showNotify(error.data?.message || "Błąd podczas zapisywania pacjenta", "error");
  } finally {
    saving.value = false;
  }
};
</script>
