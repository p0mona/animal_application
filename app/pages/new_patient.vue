<template>
  <FullWidthLayout>
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
    }
  }
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
const message = ref("");
const messageType = ref<"success" | "error">("success");

const savePatient = async () => {
  try {
    saving.value = true;
    message.value = "";

    const token = localStorage.getItem('token');
    if (!token) {
      message.value = "Nie jesteś zalogowany";
      messageType.value = "error";
      saving.value = false;
      return;
    }

    const patientData = {
      name: form.owner.pet.animal_name,
      breed: form.owner.pet.breed,
      image: "/images/example-photo.jpg",
      sex: form.owner.pet.animal_sex,
      animal: form.owner.pet.animal,
      animal_age: form.owner.pet.animal_age,
      animal_height: form.owner.pet.animal_height,
      animal_weight: form.owner.pet.animal_weight,
      chip: form.owner.pet.chip,
      owner: {
        name: form.owner.name,
        birthday: form.owner.birthday,
        sex: form.owner.sex,
        phone: form.owner.phone,
      }
    };

    console.log('Sending patient data:', patientData);

    const response = await $fetch('http://localhost:3001/patients', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientData)
    });

    message.value = "Pacjent został pomyślnie zapisany!";
    messageType.value = "success";
    
    setTimeout(() => {
      router.push('/patients_settings');
    }, 2000);
    resetForm();

  } catch (error: any) {
    console.error('Error saving patient:', error);
    message.value = error.data?.message || "Błąd podczas zapisywania pacjenta";
    messageType.value = "error";
  } finally {
    saving.value = false;
  }
};

const resetForm = () => {
  form.owner.name = "";
  form.owner.birthday = "";
  form.owner.sex = "K";
  form.owner.phone = "";
  form.owner.image = null;
  form.owner.pet.animal = "";
  form.owner.pet.animal_sex = "Samica";
  form.owner.pet.breed = "";
  form.owner.pet.animal_name = "";
  form.owner.pet.animal_age = "";
  form.owner.pet.animal_height = "";
  form.owner.pet.animal_weight = "";
  form.owner.pet.chip = "";
};
</script>