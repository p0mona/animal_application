<template>
  <Layout>
    <div class="space-y-4">
      <h1 class="text-xl font-bold text-gray-900">Tracker wagi i wzrostu</h1>

      <!-- Фальшивый график -->
      <svg class="w-full h-32 bg-gray-100 rounded-lg" viewBox="0 0 100 32">
        <!-- Линия веса -->
        <polyline
          points="0,28 10,26 20,24 30,22 40,23 50,20 60,18 70,19 80,17 90,15 100,16"
          fill="none"
          stroke="mediumpurple"
          stroke-width="2"
        />
        <!-- Линия роста -->
        <polyline
          points="0,30 10,28 20,27 30,26 40,25 50,24 60,23 70,22 80,21 90,20 100,19"
          fill="none"
          stroke="orchid"
          stroke-width="2"
        />
      </svg>

      <!-- Форма для ввода -->
      <form @submit.prevent="addEntry" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold">Data:</label>
          <input
            type="date"
            v-model="newEntry.date"
            class="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-semibold">Waga (kg):</label>
          <input
            type="number"
            v-model.number="newEntry.weight"
            class="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-semibold">Wzrost (cm):</label>
          <input
            type="number"
            v-model.number="newEntry.height"
            class="border p-2 rounded w-full"
            required
          />
        </div>
        <UButton
          type="submit"
          class="bg-violet-500 hover:bg-violet-600 active:bg-violet-700"
          >Dodaj</UButton
        >
      </form>

      <!-- История записей -->
      <div v-if="entries.length" class="space-y-4">
        <h2 class="font-semibold text-lg mt-4">Historia:</h2>

        <!-- Список с данными -->
        <ul class="divide-y">
          <li
            v-for="(entry, index) in entries"
            :key="index"
            class="py-2 flex justify-between items-center"
          >
            <span>{{ entry.date }}</span>
            <div class="flex-1 ml-4 space-y-1">
              <div class="text-sm">Waga: {{ entry.weight }} kg</div>
              <div class="w-full bg-gray-200 rounded h-2">
                <div
                  class="bg-[#9370DB] h-2 rounded"
                  :style="{
                    width: (entry.weight / maxWeight) * 100 + '%',
                  }"
                ></div>
              </div>
              <div class="text-sm">Wzrost: {{ entry.height }} cm</div>
              <div class="w-full bg-gray-200 rounded h-2">
                <div
                  class="bg-[#DA70D6] h-2 rounded"
                  :style="{
                    width: (entry.height / maxHeight) * 100 + '%',
                  }"
                ></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Entry {
  date: string;
  weight: number;
  height: number;
}

const entries = ref<Entry[]>([]);

const newEntry = ref<Entry>({
  date: "",
  weight: 0,
  height: 0,
});

// Максимальные значения для прогресс-баров и графика
const maxWeight = 200;
const maxHeight = 200;

function addEntry() {
  entries.value.push({ ...newEntry.value });
  newEntry.value = { date: "", weight: 0, height: 0 };
}
</script>
