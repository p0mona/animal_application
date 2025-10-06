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
              class="text-gray-500 text-center py-4"
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
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
