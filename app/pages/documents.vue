<template>
  <div class="min-h-screen bg-primary">
    <div class="flex justify-center p-4 bg-primary">
      <div class="max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Dokumenty
        </h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="underline cursor-pointer">
            <ul>
              Książka zdrowia
            </ul>
            <ul>
              Paszport
            </ul>
            <ul>
              Metryka
            </ul>
          </div>

          <div>
            <UFileUpload label="Przeciągnij plik tutaj" class="w-full min-h-48 max-w-md" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script></script>
