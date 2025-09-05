<template>
  <FullWidthLayout>
    <BackButton to="/vet_settings" />

    <!-- Заголовок -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Nowy pacjent</h1>
    </div>

    <div>
      <BaseButton label="Zeskanuj QR">
        <UIcon name="heroicons:camera" class="w-4 h-4 text-white" />
      </BaseButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- левая колонка -->
      <div>
        <div class="flex flex-col space-y-4">
          <h5 class="text-lg font-semibold">Pupil</h5>

          <div class="w-full">
            <p class="text-sm">Wybierz zwierzę</p>
            <USelectMenu placeholder="-" :items="animals" class="w-full" />
          </div>

          <div class="w-full">
            <p class="text-sm">Płeć</p>
            <URadioGroup
              v-model="form.animal_sex"
              orientation="horizontal"
              variant="list"
              :items="animal_sex"
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
            <p class="text-sm">Wybierz rasę</p>
            <USelectMenu placeholder="-" :items="breeds" class="w-full" />
          </div>

          <BaseInput label="Wpisz imię pupila" v-model="form.animal_name" />
          <BaseInput label="Wpisz wiek" v-model="form.animal_age" />
          <BaseInput label="Wpisz wzrost" v-model="form.animal_height" />
          <BaseInput label="Wpisz wagę" v-model="form.animal_weight" />
          <BaseInput label="Wpisz nr czipu" v-model="form.chip" />
        </div>
      </div>

      <!-- правая колонка -->
      <div>
        <div class="w-full">
          <UFileUpload
            v-model="form.image"
            color="neutral"
            highlight
            label="Przeciągnij zdięcie tutaj "
            description="SVG, PNG, JPG or GIF (maks. 2MB)"
            class="w-full min-h-54"
            :dropzone="true"
          />
        </div>

        <div class="flex flex-col space-y-4 mt-4">
          <h5 class="text-lg font-semibold">Właściciel</h5>

          <BaseInput label="Wpisz imię" v-model="form.name" />

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

          <BaseInput
            label="Data urodzenia"
            v-model="form.birthday"
            id="birthday"
            type="date"
          />

          <div class="flex justify-end">
            <BaseButton label="Potwierdź" />
          </div>
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { RadioGroupItem } from "@nuxt/ui";

const form = reactive({
  animal_type: "",
  breed: "",
  animal_name: "",
  animal_age: "",
  animal_height: "",
  animal_weight: "",
  chip: "",
  name: "",
  birthday: "",
  sex: "K",
  animal_sex: "K",
  image: null as File | null,
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
