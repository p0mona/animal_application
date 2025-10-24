<template>
  <FullWidthLayout>
    <Notification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      :duration="3000"
      @close="showNotification = false"
    />

    <!-- QR Scanner Modal -->
    <QrScannerModal
      v-if="showQrScanner"
      @close="showQrScanner = false"
      @scanned="handleQrScanned"
    />

    <BackButton to="/patients_settings" />

    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Nowy pacjent</h1>
      <div>
        <BaseButton label="Zeskanuj QR" @click="showQrScanner = true" />
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
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { SelectItem } from "~/types/pet";
import type { OwnerFormData } from "~/types/ownerData";
import animalsData from "~/assets/data/animals.json";

const router = useRouter();

const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref<"success" | "error">("success");
const showQrScanner = ref(false);
const saving = ref(false);

const showNotify = (message: string, type: "success" | "error" = "success") => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
};

interface PatientForm {
  owner: OwnerFormData; // используем OwnerFormData
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

const handleQrScanned = (qrData: any) => {
  if (qrData.owner) {
    if (qrData.owner.name) {
      form.owner.name = qrData.owner.name;
      console.log("Set owner.name:", qrData.owner.name);
    }
    if (qrData.owner.birthday) {
      form.owner.birthday = qrData.owner.birthday;
      console.log("Set owner.birthday:", qrData.owner.birthday);
    }
    if (qrData.owner.sex) {
      form.owner.sex = qrData.owner.sex;
      console.log("Set owner.sex:", qrData.owner.sex);
    }
    if (qrData.owner.phone) {
      form.owner.phone = qrData.owner.phone;
      console.log("Set owner.phone:", qrData.owner.phone);
    }
  }

  if (qrData.pet) {
    if (qrData.pet.animal) {
      form.owner.pet.animal = qrData.pet.animal;
    }
    if (qrData.pet.animal_sex) {
      form.owner.pet.animal_sex = qrData.pet.animal_sex;
    }
    if (qrData.pet.breed) {
      form.owner.pet.breed = qrData.pet.breed;
    }
    if (qrData.pet.animal_name) {
      form.owner.pet.animal_name = qrData.pet.animal_name;
    }
    if (qrData.pet.animal_age) {
      form.owner.pet.animal_age = qrData.pet.animal_age;
    }
    if (qrData.pet.animal_height) {
      form.owner.pet.animal_height = qrData.pet.animal_height;
    }
    if (qrData.pet.animal_weight) {
      form.owner.pet.animal_weight = qrData.pet.animal_weight;
    }
    if (qrData.pet.chip) {
      form.owner.pet.chip = qrData.pet.chip;
    }
  }

  const loadedFields: string[] = [];

  if (qrData.owner) {
    Object.entries(qrData.owner).forEach(([key, value]) => {
      if (value && String(value).trim() !== "") {
        loadedFields.push(`owner.${key}`);
      }
    });
  }

  if (qrData.pet) {
    Object.entries(qrData.pet).forEach(([key, value]) => {
      if (value && String(value).trim() !== "") {
        loadedFields.push(`pet.${key}`);
      }
    });
  }

  if (loadedFields.length > 0) {
    showNotify("Załadowano dane z kodu QR", "success");
  } else {
    showNotify(
      "Kod QR został zeskanowany, ale nie zawierał danych do załadowania",
      "error",
    );
  }
};

const savePatient = async () => {
  try {
    saving.value = true;

    const token = localStorage.getItem("token");
    if (!token) {
      showNotify("Nie jesteś zalogowany", "error");
      return;
    }

    const formData = new FormData();

    // Добавляем хелпер для безопасного добавления в FormData
    const appendIfDefined = (key: string, value: string | number | undefined) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    };

    // Используем безопасное добавление
    appendIfDefined("name", form.owner.pet.animal_name);
    appendIfDefined("breed", form.owner.pet.breed);
    appendIfDefined("sex", form.owner.pet.animal_sex);
    appendIfDefined("animal", form.owner.pet.animal);
    appendIfDefined("animal_age", form.owner.pet.animal_age);
    appendIfDefined("animal_height", form.owner.pet.animal_height);
    appendIfDefined("animal_weight", form.owner.pet.animal_weight);
    appendIfDefined("chip", form.owner.pet.chip);

    appendIfDefined("owner_name", form.owner.name);
    appendIfDefined("owner_birthday", form.owner.birthday);
    appendIfDefined("owner_sex", form.owner.sex);
    appendIfDefined("owner_phone", form.owner.phone);

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
    showNotify(
      error.data?.message || "Błąd podczas zapisywania pacjenta",
      "error",
    );
  } finally {
    saving.value = false;
  }
};

const animals = computed<SelectItem[]>(() =>
  (animalsData as any[]).map((item) => ({
    label: item.label,
    value: item.value,
  })),
);

const breeds = computed<SelectItem[]>(() => []);

const sex = computed<SelectItem[]>(() => [
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);

const animal_sex_raw = [
  { label: "Samica", value: "K" },
  { label: "Samiec", value: "M" },
];

const animal_sex = computed<SelectItem[]>(() =>
  animal_sex_raw.map((item) => ({
    label: item.label,
    value: item.value,
  })),
);
</script>
