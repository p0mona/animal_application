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
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <FileIcon :fileType="doc.fileType" />
                </div>
                <div>
                  <p class="text-sm">{{ doc.name }}</p>
                  <p class="text-xs text-gray-500">
                    {{ formatFileSize(doc.fileSize) }} •
                    {{ formatDate(doc.createdAt) }}
                  </p>
                </div>
              </div>
              <BorderButton
                class="px-3 py-1 text-sm"
                label="Pogłąd"
                @click="openModal(doc)"
              />
            </div>
            <div
              v-if="documents.length === 0"
              class="text-gray-400 text-sm text-center py-8 border-2 border-dashed border-gray-200 rounded"
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

    <!-- Modal window -->
    <div
      v-if="showModal"
      class="fixed bg-black/50 inset-0 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl border border-gray-200"
      >
        <div class="flex justify-between items-center p-6 border-b">
          <div>
            <h3 class="text-lg font-semibold">{{ selectedDocument?.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ formatFileSize(selectedDocument?.fileSize) }} •
              {{ selectedDocument?.fileType }}
            </p>
          </div>
          <button
            @click="closeModal"
            class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-auto p-6">
          <div
            v-if="loadingDocument"
            class="flex items-center justify-center h-64"
          >
            <div class="text-center">
              <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"
              ></div>
              <p class="text-gray-500">Ładowanie dokumentu...</p>
            </div>
          </div>

          <div
            v-else-if="documentError"
            class="flex items-center justify-center h-64"
          >
            <div class="text-center text-red-600">
              <svg
                class="w-12 h-12 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>
              <p>{{ documentError }}</p>
            </div>
          </div>

          <!-- Document preview -->
          <div v-else class="flex justify-center">
            <!-- PDF -->
            <div v-if="isPdf" class="w-full">
              <iframe
                :src="pdfObjectUrl"
                class="w-full h-96 border rounded"
                frameborder="0"
              ></iframe>
            </div>

            <!-- image -->
            <div v-else-if="isImage" class="text-center">
              <img
                :src="imageObjectUrl"
                :alt="selectedDocument?.name"
                class="max-w-full max-h-96 mx-auto rounded shadow-sm"
              />
            </div>

            <!-- other types of files -->
            <div v-else class="text-center py-12">
              <FileIcon
                :fileType="selectedDocument?.fileType"
                class="w-24 h-24 mx-auto mb-4 text-gray-400"
              />
              <p class="text-gray-500 mb-2">
                Podgląd niedostępny dla tego typu pliku
              </p>
              <p class="text-sm text-gray-400">
                Typ: {{ selectedDocument?.fileType }}
              </p>
              <BorderButton
                @click="downloadDocument(selectedDocument?._id)"
                class="mt-4 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
                label="Pobierz dokument"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <BorderButton
            @click="downloadDocument(selectedDocument?._id)"
            label="Pobierz"
            class="px-6 py-2"
            :disabled="loadingDocument"
          />
          <BaseButton
            @click="deleteDocument(selectedDocument?._id)"
            label="Usuń"
            class="px-6 py-2"
            :disabled="loadingDocument"
          />
        </div>
      </div>
    </div>
  </FullWidthLayout>
</template>

<script setup>
const documents = ref([]);
const documentName = ref("");
const uploading = ref(false);
const error = ref("");
const selectedFile = ref(null);
const fileInput = ref(null);

const showModal = ref(false);
const selectedDocument = ref(null);
const loadingDocument = ref(false);
const documentError = ref("");

const pdfObjectUrl = ref("");
const imageObjectUrl = ref("");

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

const isPdf = computed(() => {
  return selectedDocument.value?.fileType === "application/pdf";
});

const isImage = computed(() => {
  return selectedDocument.value?.fileType?.startsWith("image/");
});

const loadDocumentFile = async (documentId) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Brak tokenu autoryzacji");
  }

  const response = await fetch(
    `http://localhost:3001/documents/${documentId}/file`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.blob();
};

const createObjectUrlFromBlob = (blob, fileType) => {
  if (fileType === "application/pdf") {
    return URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
  } else {
    return URL.createObjectURL(blob);
  }
};

const openModal = async (doc) => {
  selectedDocument.value = doc;
  showModal.value = true;
  documentError.value = "";
  loadingDocument.value = true;

  if (pdfObjectUrl.value) URL.revokeObjectURL(pdfObjectUrl.value);
  if (imageObjectUrl.value) URL.revokeObjectURL(imageObjectUrl.value);
  pdfObjectUrl.value = "";
  imageObjectUrl.value = "";

  try {
    const blob = await loadDocumentFile(doc._id);

    const objectUrl = createObjectUrlFromBlob(blob, doc.fileType);

    if (doc.fileType === "application/pdf") {
      pdfObjectUrl.value = objectUrl;
    } else if (doc.fileType.startsWith("image/")) {
      imageObjectUrl.value = objectUrl;

      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = objectUrl;
      });
    }

    loadingDocument.value = false;
  } catch (error) {
    console.error("Error loading document:", error);
    documentError.value = "Nie można załadować dokumentu: " + error.message;
    loadingDocument.value = false;
  }
};

const closeModal = () => {
  if (pdfObjectUrl.value) {
    URL.revokeObjectURL(pdfObjectUrl.value);
    pdfObjectUrl.value = "";
  }
  if (imageObjectUrl.value) {
    URL.revokeObjectURL(imageObjectUrl.value);
    imageObjectUrl.value = "";
  }

  showModal.value = false;
  selectedDocument.value = null;
  documentError.value = "";
  loadingDocument.value = false;
};

const FileIcon = {
  props: ["fileType", "class"],
  setup(props) {
    const icon = computed(() => {
      if (props.fileType === "application/pdf") return "📄";
      if (props.fileType?.startsWith("image/")) return "🖼️";
      if (
        props.fileType?.includes("word") ||
        props.fileType?.includes("document")
      )
        return "📝";
      return "📎";
    });

    return () => h("span", { class: props.class }, icon.value);
  },
};

const loadDocuments = async () => {
  try {
    const token = getAuthToken();
    const response = await $fetch("http://localhost:3001/documents", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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

const downloadDocument = async (id) => {
  try {
    const token = getAuthToken();
    const response = await fetch(
      `http://localhost:3001/documents/${id}/download`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const doc = documents.value.find((d) => d._id === id);
      a.download = doc?.originalName || "document";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      throw new Error("Download failed");
    }
  } catch (error) {
    console.error("Błąd download:", error);
    alert(
      "Błąd podczas pobierania dokumentu: " +
        (error.message || "Sprawdź autoryzację"),
    );
  }
};

const deleteDocument = async (id) => {
  if (!confirm("Czy na pewno chcesz usunąć ten dokument?")) {
    return;
  }

  try {
    const token = getAuthToken();
    if (!token) {
      alert("Błąd autoryzacji. Zaloguj się ponownie.");
      return;
    }

    await $fetch(`http://localhost:3001/documents/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    closeModal();
    await loadDocuments();
  } catch (error) {
    console.error("Błąd usuwania:", error);
    alert(
      "Błąd podczas usuwania dokumentu: " +
        (error.data?.message || "Spróbuj ponownie"),
    );
  }
};

const resetForm = () => {
  documentName.value = "";
  selectedFile.value = null;
  if (fileInput.value) fileInput.value.value = "";
};

const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("pl-PL");
};

onMounted(() => {
  loadDocuments();
});

onUnmounted(() => {
  if (pdfObjectUrl.value) URL.revokeObjectURL(pdfObjectUrl.value);
  if (imageObjectUrl.value) URL.revokeObjectURL(imageObjectUrl.value);
});
</script>
