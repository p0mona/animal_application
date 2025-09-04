<template>
  <FullWidthLayout>
    <h1 class="text-2xl font-bold text-gray-900">Klinika weterynaryjna</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h5 class="font-semibold">Moja przychodnia</h5>
        <p>Nazwa: -----</p>
        <p>Adres: -----</p>
        <p>Godziny otwarcia: -----</p>
        <p>Kontakt: -----</p>
      </div>

      <div>
        <h5 class="font-semibold">Mój weterynarz</h5>
        <p>Imię: -----</p>
        <p>Kontakt: -----</p>
      </div>
    </div>

    <div>
      <h5 class="font-semibold mb-4">Mapa najbliższych przychodni</h5>
      <div class="relative w-full h-64 md:h-96">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d39098.03758346017!2d20.90128041159512!3d52.23198784773207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sklinika%20weterynaryjna!5e0!3m2!1sen!2spl!4v1756117126613!5m2!1sen!2spl"
          class="absolute top-0 left-0 w-full h-full rounded-xl"
          style="border: 0"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </FullWidthLayout>
</template>
<script></script>
