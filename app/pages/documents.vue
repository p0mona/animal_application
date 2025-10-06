<template>
  <FullWidthLayout>
    <h1 class="text-xl font-semibold mb-4">Dokumenty</h1>
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
  </FullWidthLayout>
</template>
<script></script>
