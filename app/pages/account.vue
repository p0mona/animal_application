<template>
  <div class="account-page">
    <h1>Konto</h1>
    <h4>Pupil</h4>

    <div class="two-columns">
      <div class="left-column">
        <USelectMenu placeholder="Wybierz zwierzę" :items="animals" class="w-48" />

        <USelectMenu placeholder="Wybierz rasę" :items="breeds" class="w-48" />

        <div class="form-group">
          <label for="animal-name">Imię pupila</label>
          <input
            id="animal-name"
            v-model="form.animal_name"
            type="text"
            placeholder="Wprowadź imię"
          />
        </div>
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

    <div class="form-group">
      <label for="age">Wiek</label>
      <input
        id="age"
        v-model="form.age"
        type="text"
        placeholder="Wprowadź wiek"
      />
    </div>

    <div class="form-group">
      <label for="height">Wzrost</label>
      <input
        id="height"
        v-model="form.height"
        type="text"
        placeholder="Wprowadź wzrost"
      />
    </div>

    <div class="form-group">
      <label for="weight">Waga</label>
      <input
        id="weight"
        v-model="form.weight"
        type="text"
        placeholder="Wprowadź wagę"
      />
    </div>

    <div class="form-group">
      <label for="chip">Сzip</label>
      <input
        id="chip"
        v-model="form.chip"
        type="text"
        placeholder="Wprowadź numer czipu"
      />
    </div>

    <h4>Właściciel</h4>
    <div class="form-group">
      <label for="name">Imię</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        placeholder="Wprowadź imię"
      />
    </div>

    <URadioGroup v-model="form.sex" orientation="horizontal" variant="list" :items="sex" />

    <div class="form-group">
      <label for="birthday">Data urodzenia</label>
      <input id="birthday" type="date" v-model="form.birthday" />
    </div>

    <button type="submit">Potwierdzam</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { RadioGroupItem } from '@nuxt/ui'

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
