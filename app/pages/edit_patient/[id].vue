<template>
  <FullWidthLayout>
    <Notification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      :duration="3000"
      @close="showNotification = false"
    />

    <QrScannerModal
      v-if="showQrScanner"
      @close="showQrScanner = false"
      @scanned="handleQrScanned"
    />

    <BackButton to="/patients_settings" />

    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Edytuj pacjenta</h1>
      <BaseButton label="Zeskanuj QR" @click="showQrScanner = true" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PetForm
        v-model="form.pet"
        :animals="animals"
        :breeds="breeds"
        :animal_sex="animal_sex"
      />

      <div class="mt-8">
        <OwnerForm v-model="form.owner" :sex="sex" />
        <div class="mt-8 flex justify-end space-x-4">
          <BorderButton label="Anuluj" @click="goBack" />
          <BaseButton
            label="Zapisz zmiany"
            @click="updatePatient"
            :loading="saving"
          />
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();

const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref<"success" | "error">("success");
const showQrScanner = ref(false);
const saving = ref(false);
const loading = ref(true);

interface PatientResponse {
  _id: string;
  name?: string;
  breed?: string;
  image?: string;
  sex?: string;
  animal?: string;
  animal_age?: string;
  animal_height?: string;
  animal_weight?: string;
  chip?: string;
  owner?: {
    name?: string;
    birthday?: string;
    sex?: string;
    phone?: string;
    image?: string;
  };
}

interface PetFormData {
  animal_name: string;
  breed: string;
  animal_sex: string;
  animal: string;
  animal_age: string;
  animal_height: string;
  animal_weight: string;
  chip: string;
}

interface OwnerFormData {
  name: string;
  birthday: string;
  sex: string;
  phone: string;
  image: File | null;
}

interface FormData {
  pet: PetFormData;
  owner: OwnerFormData;
}

const form = reactive<FormData>({
  pet: {
    animal_name: "",
    breed: "",
    animal_sex: "K",
    animal: "",
    animal_age: "",
    animal_height: "",
    animal_weight: "",
    chip: "",
  },
  owner: {
    name: "",
    birthday: "",
    sex: "K",
    phone: "",
    image: null,
  },
});

const showNotify = (message: string, type: "success" | "error" = "success") => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
};

const loadPatient = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return showNotify("Nie jesteś zalogowany", "error");

    const patientId = route.params.id as string;
    const response = (await $fetch(
      `http://localhost:3001/patients/${patientId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )) as PatientResponse;

    if (response) {
      form.pet.animal_name = response.name || "";
      form.pet.breed = response.breed || "";
      form.pet.animal_sex = response.sex || "K";
      form.pet.animal = response.animal || "";
      form.pet.animal_age = response.animal_age || "";
      form.pet.animal_height = response.animal_height || "";
      form.pet.animal_weight = response.animal_weight || "";
      form.pet.chip = response.chip || "";

      if (response.owner) {
        form.owner.name = response.owner.name || "";
        form.owner.birthday = response.owner.birthday || "";
        form.owner.sex = response.owner.sex || "K";
        form.owner.phone = response.owner.phone || "";
      }
    }
  } catch (error: any) {
    showNotify(error.data?.message || "Błąd podczas ładowania danych", "error");
  } finally {
    loading.value = false;
  }
};

const updatePatient = async () => {
  try {
    saving.value = true;
    const token = localStorage.getItem("token");
    if (!token) return showNotify("Nie jesteś zalogowany", "error");

    const formData = new FormData();

    formData.append("name", form.pet.animal_name);
    formData.append("breed", form.pet.breed);
    formData.append("sex", form.pet.animal_sex);
    formData.append("animal", form.pet.animal);
    formData.append("animal_age", form.pet.animal_age);
    formData.append("animal_height", form.pet.animal_height);
    formData.append("animal_weight", form.pet.animal_weight);
    formData.append("chip", form.pet.chip);

    formData.append("owner_name", form.owner.name);
    formData.append("owner_birthday", form.owner.birthday);
    formData.append("owner_sex", form.owner.sex);
    formData.append("owner_phone", form.owner.phone);

    if (form.owner.image) {
      formData.append("image", form.owner.image);
    }

    await $fetch(`http://localhost:3001/patients/${route.params.id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    showNotify("Dane pacjenta zostały zaktualizowane!", "success");
    setTimeout(() => router.push("/patients_settings"), 2000);
  } catch (error: any) {
    showNotify(error.data?.message || "Błąd podczas aktualizacji", "error");
  } finally {
    saving.value = false;
  }
};

const handleQrScanned = (qrData: any) => {
  const updates: string[] = [];

  if (qrData.owner) {
    const ownerKeys: (keyof OwnerFormData)[] = [
      "name",
      "birthday",
      "sex",
      "phone",
    ];
    ownerKeys.forEach((key) => {
      if (qrData.owner[key]) {
        (form.owner[key] as string) = qrData.owner[key];
        updates.push(`owner.${key}`);
      }
    });
  }

  if (qrData.pet) {
    const petMappings: Record<string, keyof PetFormData> = {
      animal_name: "animal_name",
      breed: "breed",
      animal_sex: "animal_sex",
      animal: "animal",
      animal_age: "animal_age",
      animal_height: "animal_height",
      animal_weight: "animal_weight",
      chip: "chip",
    };

    Object.entries(petMappings).forEach(([qrKey, formKey]) => {
      if (qrData.pet[qrKey]) {
        form.pet[formKey] = qrData.pet[qrKey];
        updates.push(`pet.${qrKey}`);
      }
    });
  }

  showNotify(
    updates.length > 0
      ? "Załadowano dane z kodu QR"
      : "Brak danych do załadowania",
    updates.length > 0 ? "success" : "error",
  );
};

const goBack = () => router.push("/patients_settings");

interface SelectItem {
  label: string;
  value: string;
}

const animals: SelectItem[] = [
  { label: "Kot", value: "cat" },
  { label: "Pies", value: "dog" },
];

const breeds: SelectItem[] = [];

const sex: SelectItem[] = [
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
];

const animal_sex: SelectItem[] = [
  { label: "Samica", value: "K" },
  { label: "Samiec", value: "M" },
];

onMounted(loadPatient);
</script>
