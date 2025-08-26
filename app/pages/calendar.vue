<template>
  <div class="min-h-screen bg-primary">
    <div class="flex justify-center p-4 bg-primary">
      <div class="max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h1 class="text-xl font-bold text-gray-900">Przypomnienia</h1>
            <!-- Поменять цвет для дней недели и поправить график-не хватает одной линии-->
            <UCalendar
              multiple
              :ui="{
                cellTrigger: `
        w-8 h-8 rounded-full
        bg-transparent
        [&:hover:not([data-selected])]:bg-violet-100 [&:hover:not([data-selected])]:text-violet-600
        [&[data-selected]]:bg-violet-500 [&[data-selected]]:text-white
        [&[data-today]:not([data-selected])]:text-violet-500 [&[data-today]:not([data-selected])]:font-bold
      `,
              }"
              class="[&_thead_th]:text-violet-600 [&_tr_th]:text-violet-600"
            />
            <div class="space-y-1">
              <h5 class="font-semibold">Najbliższe szczepienie:</h5>
              <p>Termin: -----</p>
              <p>Przychodnia: -----</p>
              <p>Nazwa szczepienia: -----</p>

              <h5 class="font-semibold">
                Najbliższa terapia przeciwpasożytnicza:
              </h5>
              <p>Termin: -----</p>
              <p>Lek: -----</p>
            </div>
          </div>

          <div class="space-y-4">
            <h1 class="text-xl font-bold text-gray-900">
              Tracker wagi i wzrostu
            </h1>

            <!-- Фальшивый график -->
            <svg
              class="w-full h-32 bg-gray-100 rounded-lg"
              viewBox="0 0 100 32"
            >
              <!-- Линия веса -->
              <polyline
                points="0,28 10,26 20,24 30,22 40,23 50,20 60,18 70,19 80,17 90,15 100,16"
                fill="none"
                stroke="mediumpurple"
                stroke-width="2"
              />
              <!-- Линия роста -->
              <polyline
                points="2"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

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

// Преобразуем данные в точки для SVG (0-100 по оси X)
const weightPoints = computed(() => {
  if (!entries.value.length) return "";
  const step = 100 / (entries.value.length - 1 || 1);
  return entries.value
    .map((e, i) => `${i * step},${32 - (e.weight / maxWeight) * 32}`)
    .join(" ");
});

const heightPoints = computed(() => {
  if (!entries.value.length) return "";
  const step = 100 / (entries.value.length - 1 || 1);
  return entries.value
    .map((e, i) => `${i * step},${32 - (e.height / maxHeight) * 32}`)
    .join(" ");
});
</script>
