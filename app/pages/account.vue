<template>
  <div class="flex justify-center p-4">
    <div class="max-w-2xl mx-auto space-y-4">
      <h1>Konto</h1>
      <h4>Pupil</h4>

      <div class="flex flex-col gap-4">
        <div class="w-full">
          <UFileUpload
            v-model="form.image"
            color="neutral"
            highlight
            label="Drop your image here"
            description="SVG, PNG, JPG or GIF (max. 2MB)"
            class="w-full min-h-24"
            :dropzone="true"
          />
        </div>

        <div class="w-full">
          <p class="text-sm mb-1">Wybierz zwierzę</p>
          <USelectMenu placeholder="-" :items="animals" class="w-full" />
        </div>

        <div class="w-full">
          <p class="text-sm mb-1">Wybierz rasę</p>
          <USelectMenu placeholder="-" :items="breeds" class="w-full" />
        </div>

        <div class="w-full">
          <p class="text-sm mb-1">Wpisz imię pupila</p>
          <UInput v-model="form.animal_name" class="w-full" />
        </div>

        <div class="w-full">
          <p class="text-sm mb-1">Wpisz wiek</p>
          <UInput v-model="form.age" class="w-full" />
        </div>

        <div class="w-full">
          <p class="text-sm mb-1">Wpisz wzrost</p>
          <UInput v-model="form.height" class="w-full" />
        </div>

        <div class="w-full">
          <p class="text-sm mb-1">Wpisz wagę</p>
          <UInput v-model="form.weight" class="w-full" />
        </div>

        <div class="w-full">
          <p class="text-sm mb-1">Wprowadź nr czipu</p>
          <UInput v-model="form.chip" class="w-full" />
        </div>
      </div>

      <h4>Właściciel</h4>

      <div class="w-full">
        <p class="text-sm mb-1">Wpisz imię</p>
        <UInput v-model="form.name" class="w-full" />
      </div>

      <div class="w-full">
        <p class="text-sm mb-1">Płeć</p>
        <URadioGroup
          v-model="form.sex"
          orientation="horizontal"
          variant="list"
          :items="sex"
          class="w-full"
        />
      </div>

      <div class="w-full">
        <label for="birthday" class="text-sm mb-1 block">Data urodzenia</label>
        <UInput
          id="birthday"
          type="date"
          v-model="form.birthday"
          class="w-full"
        />
      </div>

      <div class="w-full">
        <UButton type="button" class="w-full md:w-auto">Potwierdź</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { RadioGroupItem } from "@nuxt/ui";

const form = reactive({
  animal_type: "",
  breed: "",
  animal_name: "",
  age: "",
  height: "",
  weight: "",
  chip: "",
  name: "",
  birthday: "",
  sex: "K",
  image: null as File | null,
});

const sex = ref<RadioGroupItem[]>([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" },
]);

const animals = ref(["Pies", "Kot", "Chomik"]);
const breeds = ref(["Akita Inu", "Beagle", "Szpic"]);
</script>
