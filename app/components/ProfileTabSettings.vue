<template>
  <UCard>
    <template #header>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Profil</h2>
        </div>

        <div class="flex justify-end">
          <UButton
            type="button"
            @click="deleteAccount"
            class="md:w-auto border border-violet-500 bg-white text-violet-500 hover:border-violet-600 active:border-violet-700 hover:text-violet-600 active:text-violet-700 hover:bg-white active:bg-white"
          >
            Usuń konto
          </UButton>
        </div>
      </div>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Pupil Section -->
      <div>
        <PetForm
          v-model="localProfile"
          :animals="animals"
          :breeds="breeds"
          :animal_sex="animal_sex"
          animal-placeholder="Pies"
          breed-placeholder="Beagle"
        />
      </div>

      <!-- Owner Section -->
      <div>
        <h3 class="text-base font-semibold mb-4">Właściciel</h3>
        <OwnerForm v-model="localProfile" :sex="sex" />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  profile: any;
  animals: string[];
  breeds: string[];
  sex: any[];
  animal_sex: any[];
}>();

const emit = defineEmits<{
  (e: "update:profile", value: any): void;
}>();

const localProfile = computed({
  get: () => props.profile,
  set: (val) => emit("update:profile", val),
});

const profile = computed(() => localProfile.value);
const toast = useToast();

// закончить подвязку к кнопке (id пользователя?????)
async function deleteAccount() {
  console.log("Profile ID:", profile.value?._id);
  if (!profile.value?._id) return;

  const confirmed = confirm("Czy na pewno chcesz usunąć konto?");
  if (!confirmed) return;

  try {
    await $fetch(`http://localhost:3001/auth/user/${profile.value._id}`, {
      method: "DELETE",
    });

    toast.add({
      title: "Sukces",
      description: "Konto zostało usunięte",
      color: "success",
    });

    navigateTo("/login");
  } catch (err: any) {
    toast.add({
      title: "Błąd",
      description: err.data?.message || "Nie udało się usunąć konta",
      color: "error",
    });
  }
}
</script>
