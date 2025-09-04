<template>
  <Layout>
    <div class="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6">
      <div class="space-y-4">
        <h1 class="text-xl font-bold text-gray-900">Przypomnienia</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mt-4">
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
          </div>
          <div class="space-y-2 mt-4 ml-4">
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
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts"></script>
