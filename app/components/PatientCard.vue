<template>
  <div
    class="flex items-center bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 p-4 space-x-4"
  >
    <img
      :src="getImageUrl(image)"
      :alt="name"
      class="w-24 h-24 object-cover rounded-lg flex-shrink-0"
      @error="handleImageError"
    />

    <div class="flex-1">
      <h2 class="text-lg font-semibold text-gray-900">{{ name }}</h2>
      <p class="text-sm text-gray-500">
        <span v-if="formattedBreed"
          >{{ formattedBreed }} - {{ getSexLabel(sex) }}</span
        >
        <span v-else>{{ getSexLabel(sex) }}</span>
      </p>
    </div>

    <BaseButton label="Przejdź" @click="$emit('view-details', patientData)" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { PatientData } from "~/types/patientData";

interface PatientCardProps {
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
    image?: string | File | null;
  };
}

const props = withDefaults(defineProps<PatientCardProps>(), {
  name: "",
  breed: "",
  image: "",
  sex: "",
  owner: () => ({
    name: "",
    birthday: "",
    sex: "",
    phone: "",
    image: "",
  }),
});

const patientData = computed<PatientData>(() => ({
  _id: props._id,
  name: props.name,
  breed: props.breed,
  image: props.image,
  sex: props.sex,
  animal: props.animal,
  animal_age: props.animal_age,
  animal_height: props.animal_height,
  animal_weight: props.animal_weight,
  chip: props.chip,
  owner: props.owner,
}));

const emit = defineEmits<{
  "view-details": [patient: PatientData];
}>();

const dogBreeds = ref<any[]>([]);
const catBreeds = ref<any[]>([]);

onMounted(async () => {
  try {
    const dogData = await import("~/assets/data/dog_breeds.json");
    dogBreeds.value = dogData.default || dogData;

    const catData = await import("~/assets/data/cat_breeds.json");
    catBreeds.value = catData.default || catData;
  } catch (err) {
    console.error("Error loading breed data:", err);
  }
});

const formattedBreed = computed(() => {
  if (!props.breed) return "";
  const catBreed = catBreeds.value.find((b) => b.value === props.breed);
  if (catBreed) return catBreed.label;
  const dogBreed = dogBreeds.value.find((b) => b.value === props.breed);
  if (dogBreed) return dogBreed.label;

  return props.breed;
});

const getImageUrl = (imagePath: string | File | null | undefined) => {
  if (!imagePath || imagePath instanceof File) {
    return "/images/example-photo.jpg";
  }

  if (imagePath === "/images/example-photo.jpg") {
    return "/images/example-photo.jpg";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  if (imagePath.startsWith("/uploads")) {
    return `http://localhost:3001${imagePath}`;
  }

  if (!imagePath.startsWith("/")) {
    return `http://localhost:3001/uploads/${imagePath}`;
  }

  return imagePath;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = "/images/example-photo.jpg";
};

const getSexLabel = (sex: string) => {
  return sex === "K" ? "Samica" : "Samiec";
};
</script>
