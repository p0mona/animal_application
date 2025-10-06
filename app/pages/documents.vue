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
        <UFileUpload
          label="Przeciągnij plik tutaj"
          class="w-full min-h-48 max-w-md"
        />
      </div>
    </div>
  </FullWidthLayout>
</template>
<script></script>
