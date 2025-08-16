<template>
  <div class="account-page">
    <h1>Konto</h1>
    <h4>Pupil</h4>

    <img
      src="@/images/example-photo.jpg"
      alt="Example-photo"
      class="example-photo"
    />

    <div class="form-group">
      <label for="animal">Wybierz zwięrzę</label>
      <select id="animal" v-model="form.animal">
        <option value="cat">Kot</option>
        <option value="dog">Pies</option>
        <option value="hamster">Chomik</option>
      </select>
    </div>

    <div class="form-group">
      <label for="breed">Wybierz rasę</label>
      <select id="breed" v-model="form.breed">
        <option value="-">-</option>
        <option value="akita-inu">Akita Inu</option>
        <option value="beagle">Beagle</option>
        <option value="Spitz">Szpic</option>
      </select>
    </div>

    <div class="form-group">
      <label for="animal-name">Imię pupila</label>
      <input
        id="animal-name"
        v-model="form.animal_name"
        type="animal-name"
        placeholder="Wprowadź imię"
      />
    </div>

    <div class="form-group">
      <label for="age">Wiek</label>
      <input
        id="age"
        v-model="form.age"
        type="age"
        placeholder="Wprowadź wiek"
      />
    </div>

    <div class="form-group">
      <label for="height">Wzrost</label>
      <input
        id="height"
        v-model="form.height"
        type="height"
        placeholder="Wprowadź wzrost"
      />
    </div>

    <div class="form-group">
      <label for="weight">Waga</label>
      <input
        id="weight"
        v-model="form.weight"
        type="weight"
        placeholder="Wprowadź wagę"
      />
    </div>

    <h4>Właściciel</h4>
    <div class="form-group">
      <label for="name">Imię</label>
      <input
        id="name"
        v-model="form.name"
        type="name"
        placeholder="Wprowadź imię"
      />
    </div>

    <div class="form-group">
      <label for="sex">Płeć</label>
      <select id="sex" v-model="form.sex">
        <option value="w">K</option>
        <option value="m">M</option>
      </select>
    </div>

    <div class="form-group">
      <label for="birthday">Data urodzenia</label>
      <input id="birthday" type="date" v-model="form.birthday" />
    </div>

    <button type="submit">Potwierdzam</button>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const form = reactive({
  animal: "dog",
  breed: "-",
  sex: "w",
});
</script>

<style scoped>
.account-page {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

select {
  width: 50%;
  padding: 8px;
  margin-left: 10px;
}

input {
  width: 90%;
  padding: 8px;
}

.example-photo {
  width: 50px;
  height: 70px;
}
</style>
