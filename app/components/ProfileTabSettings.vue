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
            class="md:w-auto border border-violet-500 bg-white text-violet-500 hover:border-violet-600 active:border-violet-700 hover:text-violet-600 active:text-violet-700 hover:bg-white active:bg-white cursor-pointer"
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
        <OwnerForm v-model="localProfile" :sex="sex" />
        <div class="flex justify-end">
          <UButton
            @click="saveProfile"
            :loading="loading"
            class="bg-violet-500 hover:bg-violet-600 mt-4 active:bg-violet-700"
          >
            Potwierdź
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "~/stores/user";

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

const userStore = useUserStore();

async function deleteAccount() {
  const profileId = userStore.user?.id;
  if (!profileId) return;

  const confirmed = confirm("Czy na pewno chcesz usunąć konto?");
  if (!confirmed) return;

  try {
    await $fetch(`http://localhost:3001/auth/user/${profileId}`, {
      method: "DELETE",
    });

    toast.add({
      title: "Sukces",
      description: "Konto zostało usunięte",
      color: "success",
    });

    userStore.clearUser(); // очищаем Pinia и localStorage
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
