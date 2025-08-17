<template>
  <div class="account-page">
    <h1>Konto</h1>
    <h4>Pupil</h4>

    <div class="two-columns">
      <div class="left-column">
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
            type="text"
            placeholder="Wprowadź imię"
          />
        </div>
      </div>

      <div class="right-column">
        <img
          src="@/images/example-photo.jpg"
          alt="Example-photo"
          class="example-photo"
        />
      </div>
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

.example-photo {
  width: 100%;
  height: auto;
  object-fit: cover;
  border: 3px solid #8b4513;
  border-radius: 8px;
}
</style>
