<template>
  <FullWidthLayout>
    <h1 class="text-2xl font-bold text-gray-900">Konto</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div class="w-full">
            <p class="text-sm">Wpisz imię pupila</p>
            <UInput v-model="form.animal_name" class="w-full" />
          </div>

          <div class="w-full">
            <p class="text-sm">Wpisz wiek</p>
            <UInput v-model="form.animal_age" class="w-full" />
          </div>

          <div class="w-full">
            <p class="text-sm">Wpisz wzrost</p>
            <UInput v-model="form.animal_height" class="w-full" />
          </div>

          <div class="w-full">
            <p class="text-sm">Wpisz wagę</p>
            <UInput v-model="form.animal_weight" class="w-full" />
          </div>

          <div class="w-full">
            <p class="text-sm">Wprowadź nr czipu</p>
            <UInput v-model="form.chip" class="w-full" />
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
            class="w-full min-h-54"
            :dropzone="true"
          />
        </div>

        <div class="flex flex-col space-y-4 mt-4">
          <h5 class="text-lg font-semibold">Właściciel</h5>

          <div class="w-full">
            <p class="text-sm">Wpisz imię</p>
            <UInput v-model="form.name" class="w-full" />
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

          <div class="flex justify-end">
            <BaseButton label="Potwierdź"/>
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

const sex = ref<RadioGroupItem[]>([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);

const animals = ref(["Pies", "Kot", "Chomik"]);
const breeds = ref(["Akita Inu", "Beagle", "Szpic"]);

const animal_sex = ref<RadioGroupItem[]>([
  { label: "Samica", value: "K" },
  { label: "Samiec", value: "M" },
]);
</script>
