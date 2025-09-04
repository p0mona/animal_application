<template>
  <Layout>
    <div class="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h1 class="text-xl font-bold text-gray-900">Konto</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div class="flex flex-col space-y-4 mt-4">
            <div class="w-full">
              <p class="text-sm">Wpisz imię</p>
              <UInput v-model="form.name" class="w-full" />
            </div>

            <div class="w-full">
              <p class="text-sm">Wpisz miejsce pracy</p>
              <UInput v-model="form.hospital" class="w-full" />
            </div>

            <div class="w-full">
              <p class="text-sm">Płeć</p>
              <URadioGroup
                v-model="form.sex"
                orientation="horizontal"
                variant="list"
                :items="sex"
                :ui="{
                  base: 'ui-radio',
                  container: 'w-full',
                  indicator: 'bg-violet-500',
                  label: 'ui-label',
                  description: 'ui-description',
                }"
                class="w-full"
              />
            </div>

            <div class="w-full">
              <label for="birthday" class="text-sm block">Data urodzenia</label>
              <UInput
                id="birthday"
                type="date"
                v-model="form.birthday"
                class="w-full"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="w-full">
            <UFileUpload
              v-model="form.image"
              color="neutral"
              highlight
              label="Przeciągnij zdięcie tutaj "
              description="SVG, PNG, JPG or GIF (maks. 2MB)"
              class="w-full min-h-54 mb-4"
              :dropzone="true"
            />
          </div>
          <div>
            <div class="flex justify-end">
              <UButton
                type="button"
                class="md:w-auto bg-violet-500 hover:bg-violet-600 active:bg-violet-700"
                >Potwierdź</UButton
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { RadioGroupItem } from "@nuxt/ui";

const form = reactive({
  name: "",
  birthday: "",
  sex: "K",
  hospital: "",
  image: null as File | null,
});

const sex = ref<RadioGroupItem[]>([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);
</script>
