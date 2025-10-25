<template>
  <Layout>
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-gray-900">Tracker wagi i wzrostu</h1>

      <div v-if="message" :class="messageClass" class="p-3 rounded">
        {{ message }}
      </div>

      <div v-if="entries.length" class="bg-gray-100 rounded-lg p-4">
        <h3 class="font-semibold mb-2">Wykres:</h3>
        <svg class="w-full h-40" viewBox="0 0 100 40">
          <line
            x1="0"
            y1="40"
            x2="100"
            y2="40"
            stroke="gray"
            stroke-width="1"
          />
          <line x1="0" y1="0" x2="0" y2="40" stroke="gray" stroke-width="1" />

          <polyline
            :points="weightLine"
            fill="none"
            stroke="mediumpurple"
            stroke-width="2"
          />

          <polyline
            :points="heightLine"
            fill="none"
            stroke="orchid"
            stroke-width="2"
          />

          <text x="5" y="10" fill="mediumpurple" font-size="3">Waga</text>
          <text x="5" y="15" fill="orchid" font-size="3">Wzrost</text>
        </svg>
      </div>

      <form @submit.prevent="addEntry" class="space-y-4 p-4 border rounded">
        <h3 class="font-semibold">Dodaj nowy wpis:</h3>
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
            min="0"
            max="200"
            step="0.1"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-semibold">Wzrost (cm):</label>
          <input
            type="number"
            v-model.number="newEntry.height"
            class="border p-2 rounded w-full"
            min="0"
            max="250"
            step="0.1"
            required
          />
        </div>
        <BaseButton type="submit" label="Dodaj" />
      </form>

      <div v-if="entries.length" class="space-y-4">
        <h2 class="font-semibold text-lg mt-4">Historia:</h2>
        <ul class="divide-y">
          <li
            v-for="entry in entries"
            :key="entry._id"
            class="py-2 flex justify-between items-center"
          >
            <span class="font-medium">{{ formatDate(entry.date) }}</span>
            <div class="flex-1 ml-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Waga:</span>
                <span class="font-medium">{{ entry.weight }} kg</span>
              </div>
              <div class="w-full bg-gray-200 rounded h-2">
                <div
                  class="bg-[#9370DB] h-2 rounded transition-all"
                  :style="{
                    width:
                      Math.min((entry.weight / maxWeight) * 100, 100) + '%',
                  }"
                ></div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Wzrost:</span>
                <span class="font-medium">{{ entry.height }} cm</span>
              </div>
              <div class="w-full bg-gray-200 rounded h-2">
                <div
                  class="bg-[#DA70D6] h-2 rounded transition-all"
                  :style="{
                    width:
                      Math.min((entry.height / maxHeight) * 100, 100) + '%',
                  }"
                ></div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        Brak zapisów. Dodaj pierwszy wpis!
      </div>
    </div>
  </Layout>
  <Notification
    v-if="showNotification"
    :message="notificationMessage"
    :type="notificationType"
    :duration="3000"
    @close="showNotification = false"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref<"success" | "error">("success");

const showNotify = (message: string, type: "success" | "error" = "success") => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;

  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

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
  height: 0,
});
const loading = ref(false);
const message = ref("");
const messageClass = ref("");

const maxWeight = 200;
const maxHeight = 250;

function getToken(): string | null {
  return localStorage.getItem("token");
}

function showMessage(text: string, isError = false) {
  message.value = text;
  messageClass.value = isError
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700";
  setTimeout(() => {
    message.value = "";
  }, 5000);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pl-PL");
}

function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function loadEntries() {
  try {
    const token = getToken();
    if (!token) {
      showMessage("Nie jesteś zalogowany", true);
      showNotify("Błąd autoryzacji. Zaloguj się ponownie.", "error");
      return;
    }

    const res = await fetch("http://localhost:3001/tracker", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        showMessage("Nie jesteś zalogowany", true);
        showNotify("Błąd autoryzacji. Zaloguj się ponownie.", "error");
        return;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    entries.value = data.sort(
      (a: Entry, b: Entry) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    if (entries.value.length > 0) {
    }
  } catch (error: any) {
    console.error("Błąd ładowania danych:", error);
    showMessage("Błąd przy ładowaniu zapisów: " + error.message, true);
    showNotify("Błąd podczas ładowania danych", "error");
  }
}

async function addEntry() {
  if (
    !newEntry.value.date ||
    newEntry.value.weight <= 0 ||
    newEntry.value.height <= 0
  ) {
    showMessage("Wszystkie pola są wymagane i muszą być większe niż 0", true);
    showNotify("Wszystkie pola są wymagane i muszą być większe niż 0", "error");
    return;
  }

  const selectedDate = new Date(newEntry.value.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    showMessage("Nie można dodać wpisu z przyszłą datą", true);
    showNotify("Nie można dodać wpisu z przyszłą datą", "error");
    return;
  }

  const existingEntry = entries.value.find(
    (entry) => entry.date === newEntry.value.date,
  );
  if (existingEntry) {
    showMessage("Wpis dla tej daty już istnieje", true);
    showNotify("Wpis dla tej daty już istnieje", "error");
    return;
  }

  loading.value = true;

  try {
    const token = getToken();
    if (!token) {
      showMessage("Nie jesteś zalogowany", true);
      showNotify("Błąd autoryzacji. Zaloguj się ponownie.", "error");
      return;
    }

    const res = await fetch("http://localhost:3001/tracker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newEntry.value),
    });

    if (!res.ok) {
      const errorData = await res.json();
      showMessage(errorData.message || "Błąd przy dodawaniu zapisu", true);
      showNotify(errorData.message || "Błąd przy dodawaniu zapisu", "error");
      return;
    }

    const data = await res.json();

    entries.value.push(data);
    entries.value.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    showMessage("Pomyślnie dodano nowy wpis!", false);

    newEntry.value = {
      date: getTodayDate(),
      weight: 0,
      height: 0,
    };
  } catch (error: any) {
    console.error("Błąd dodawania:", error);
    showMessage("Błąd przy dodawaniu zapisu: " + error.message, true);
    showNotify("Błąd podczas dodawania wpisu", "error");
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  newEntry.value.date = getTodayDate();
  loadEntries();
});

const weightLine = computed(() => {
  if (!entries.value.length) return "";
  const step = 100 / (entries.value.length - 1 || 1);
  return entries.value
    .map((e, i) => `${i * step},${40 - (e.weight / maxWeight) * 40}`)
    .join(" ");
});

const heightLine = computed(() => {
  if (!entries.value.length) return "";
  const step = 100 / (entries.value.length - 1 || 1);
  return entries.value
    .map((e, i) => `${i * step},${40 - (e.height / maxHeight) * 40}`)
    .join(" ");
});
</script>
