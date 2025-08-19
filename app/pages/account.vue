<template>
  <div class="account-page">
    <h1>Konto</h1>
    <h4>Pupil</h4>

    <div class="two-columns">
      <div class="left-column">
        <USelectMenu placeholder="Wybierz zwierzę" :items="animals" class="w-48" />

        <USelectMenu placeholder="Wybierz rasę" :items="breeds" class="w-48" />

        <UInput placeholder="Wpisz imię pupila" />
      </div>

        <UFileUpload
          color="neutral"
          highlight
          label="Drop your image here"
          description="SVG, PNG, JPG or GIF (max. 2MB)"
          class="w-48 min-h-24"
          :dropzone="true"
        />
    </div>

    <UInput placeholder="Wpisz wiek" />
    <UInput placeholder="Wpisz wzrost" />
    <UInput placeholder="Wpisz wagę" />
    <UInput placeholder="Wprowadź numer czipu" />

    <h4>Właściciel</h4>
    <UInput placeholder="Wpisz imię" />

    <URadioGroup v-model="form.sex" orientation="horizontal" variant="list" :items="sex" />

    <div class="form-group">
      <label for="birthday">Data urodzenia</label>
    </div>

    <UInput type="date" v-model="form.birthday" />

    <UButton type="button">Potwierdź</UButton>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { RadioGroupItem,  } from '@nuxt/ui'
import { CalendarDate } from '@internationalized/date'

const form = reactive({
  animal_name: "",
  age: "",
  height: "",
  weight: "",
  chip: "",
  name: "",
  birthday: "",
  sex: "K",
})

const sex = ref<RadioGroupItem[]>([
  { label: "Kobieta", value: "K" },
  { label: "Mężczyzna", value: "M" }
])

const animals = ref(['Pies', 'Kot', 'Chomik'])

const breeds = ref(['Akita Inu', 'Beagle', 'Szpic'])

const value = ref(new CalendarDate(2022, 2, 3))
</script>

<style scoped>
.account-page {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}

.two-columns {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  margin-bottom: 20px;
}

.left-column,
.right-column {
  flex: 1;
}

.form-group {
  margin-bottom: 15px;
  padding-right: 5px;
}

select,
input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  box-sizing: border-box;
}
</style>
