<template>
  <FullWidthLayout>
    <h1 class="text-xl font-semibold mb-4">Dokumenty</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-6">
        <div>
          <h2 class="text-base font-semibold mb-3">Twoje dokumenty</h2>
          <div class="space-y-2">
            <div
              v-for="doc in documents"
              :key="doc._id"
              class="p-3 rounded flex justify-between items-center"
            >
              <div>
                <p class="text-sm">{{ doc.name }}</p>
                <p class="text-sm text-gray-400">
                  {{ formatFileSize(doc.fileSize) }}
                </p>
              </div>
              <!--     @click="downloadDocument(doc._id)" -->
              <BorderButton class="px-3 py-1 text-sm" label="Pogłąd" />
            </div>
            <div
              v-if="documents.length === 0"
              class="text-gray-400 text-sm text-center py-4"
            >
              Brak dokumentów
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 class="text-base font-semibold mb-3">Dodaj dokument</h2>
        <div class="space-y-2">
          <input
            type="text"
            v-model="documentName"
            placeholder="Nazwa dokumentu"
            class="w-full p-2 border rounded border-violet-500 text-sm"
          />
          
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            class="w-full p-2 border rounded border-violet-500 text-sm text-gray-400"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
          />

          <div class="flex justify-end">
            <BaseButton
              @click="uploadDocument"
              :disabled="uploading || !selectedFile"
              class="p-2 disabled:bg-gray-400"
              :label="uploading ? 'Ładowanie...' : 'Zapisz dokument'"
            />
          </div>

          <div v-if="error" class="p-2 bg-red-100 text-red-700 rounded text-sm">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup>
const documents = ref([]);
const documentName = ref("");
const selectedCategory = ref("health");
const uploading = ref(false);
const error = ref("");
const selectedFile = ref(null);
const fileInput = ref(null);

const getAuthToken = () => {
  if (process.client) {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken")
    );
  }
  return null;
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    console.warn("Token not found");
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const loadDocuments = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await $fetch("http://localhost:3001/documents", {
      method: "GET",
      headers: headers,
    });
    documents.value = response;
  } catch (error) {
    console.error("Błąd ładowania:", error);
    if (error.status === 403) {
      error.value = "Błąd autoryzacji. Zaloguj się ponownie.";
    }
  }
};

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0];
  error.value = "";
  if (selectedFile.value && !documentName.value) {
    documentName.value = selectedFile.value.name.replace(/\.[^/.]+$/, "");
  }
};

const uploadDocument = async () => {
  if (!selectedFile.value || !documentName.value) {
    error.value = "Proszę wybrać plik i podać nazwę";
    return;
  }

  uploading.value = true;
  error.value = "";

  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("document", selectedFile.value);
    formData.append("name", documentName.value);

    const response = await $fetch("http://localhost:3001/documents", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await loadDocuments();
    resetForm();
  } catch (error) {
    console.error("Błąd upload:", error);
    if (error.status === 403) {
      error.value = "Błąd autoryzacji. Zaloguj się ponownie.";
    } else {
      error.value = error.data?.message || "Błąd podczas zapisywania dokumentu";
    }
  } finally {
    uploading.value = false;
  }
};

const resetForm = () => {
  documentName.value = "";
  selectedCategory.value = "health";
  selectedFile.value = null;
  if (fileInput.value) fileInput.value.value = "";
};

// const downloadDocument = async (id) => {
//   try {
//     const token = getAuthToken()
//     if (!token) {
//       alert('Błąd autoryzacji. Zaloguj się ponownie.')
//       return
//     }

//     const downloadUrl = `http://localhost:3001/documents/${id}/download`

//     const response = await fetch(downloadUrl, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     })

//     if (response.ok) {
//       const blob = await response.blob()
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url

//       const doc = documents.value.find(d => d._id === id)
//       a.download = doc?.originalName || 'document'

//       document.body.appendChild(a)
//       a.click()
//       document.body.removeChild(a)
//       window.URL.revokeObjectURL(url)
//     } else {
//       throw new Error('Download failed')
//     }

//   } catch (error) {
//     console.error('Błąd download:', error)
//     alert('Błąd podczas pobierania dokumentu: ' + (error.message || 'Sprawdź autoryzację'))
//   }
// }

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

onMounted(() => {
  loadDocuments();
});
</script>
