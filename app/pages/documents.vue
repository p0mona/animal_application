<template>
  <Layout>
    <div class="max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h1 class="text-xl font-bold text-gray-900">Dokumenty</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ul class="list-disc list-inside underline cursor-pointer">
          <li>Książka zdrowia</li>
          <li>Paszport</li>
          <li>Metryka</li>
        </ul>
        <div>
          <UFileUpload
            label="Przeciągnij plik tutaj"
            class="w-full min-h-48 max-w-md"
          />
        </div>
      </div>
    </div>
  </Layout>
</template>
<script></script>
