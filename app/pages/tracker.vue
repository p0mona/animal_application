<template>
  <Layout>
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-gray-900">Tracker wagi i wzrostu</h1>

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
        <BaseButton label="Dodaj" />
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
import { ref, onMounted, computed } from "vue";

interface Entry {
  _id?: string;
  date: string;
  weight: number;
  height: number;
}

const entries = ref<Entry[]>([]);
const newEntry = ref<Entry>({
  date: "",
  weight: 0,
  height: 0 
});
const loading = ref(false);
const message = ref("");
const messageClass = ref("");

const maxWeight = 200;
const maxHeight = 250;

function getToken(): string | null {
  return localStorage.getItem('token') || getCookie('token');
}

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function showMessage(text: string, isError = false) {
  message.value = text;
  messageClass.value = isError ? "bg-red-100 text-red-700" : "bg-primary-100 text-primary-700";
  setTimeout(() => {
    message.value = "";
  }, 5000);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pl-PL');
}

function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function loadEntries() {
  try {
    const token = getToken();
    if (!token) {
      showMessage("Nie jesteś zalogowany", true);
      return;
    }

    const res = await fetch("http://localhost:3001/tracker", {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        showMessage("Nie jesteś zalogowany", true);
        return;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    entries.value = data.sort((a: Entry, b: Entry) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error: any) {
    console.error("Błąd ładowania danych:", error);
    showMessage("Błąd przy ładowaniu zapisów: " + error.message, true);
  }
}

async function addEntry() {
  if (!newEntry.value.date || newEntry.value.weight <= 0 || newEntry.value.height <= 0) {
    showMessage("Wszystkie pola są wymagane i muszą być większe niż 0", true);
    return;
  }

  loading.value = true;

  try {
    const token = getToken();
    if (!token) {
      showMessage("Nie jesteś zalogowany", true);
      return;
    }

    const res = await fetch("http://localhost:3001/tracker", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify(newEntry.value),
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage(data.message || "Błąd przy dodawaniu zapisu", true);
      return;
    }

    entries.value.push(data);
    entries.value.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    showMessage("Pomyślnie dodano nowy wpis!");
    newEntry.value = { 
      date: getTodayDate(), 
      weight: 0, 
      height: 0 
    };
  } catch (error: any) {
    console.error("Błąd dodawania:", error);
    showMessage("Błąd przy dodawaniu zapisu: " + error.message, true);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  newEntry.value.date = getTodayDate();
  loadEntries();
});
</script>
