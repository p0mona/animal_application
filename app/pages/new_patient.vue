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

      <div>
        <OwnerForm v-model="form.owner" :sex="sex" />
      </div>
    </div>

    <div class="flex justify-end">
      <BaseButton label="Dodaj" @click="savePatient" />
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
</script>
