<template>
  <div class="login-page">
    <h1>Zaloguj się</h1>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" placeholder="Wprowadź email" />
<<<<<<< HEAD
        <UFormMessage type="error" />
      </UFormField>

      <UFormField label="Hasło" name="password">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Wprowadź hasło"
        />
        <UFormMessage type="error" />
=======
        <UFormMessage />
      </UFormField>

      <UFormField label="Hasło" name="password">
        <UInput v-model="state.password" type="password" placeholder="Wprowadź hasło" />
        <UFormMessage />
>>>>>>> a7a9135 (changed forms for authorization and registration)
      </UFormField>

      <UButton type="submit">Zaloguj się</UButton>
    </UForm>
<<<<<<< HEAD

    <p class="register-link">
      Nie masz jeszcze konta?
      <NuxtLink to="/register">Zarejestruj się</NuxtLink>
    </p>

    <p class="forget-password-link">
      Nie pamiętasz hasło?
      <NuxtLink to="/forget-password">Zmień hasło</NuxtLink>
    </p>
=======
    <p class="register-link"> Nie masz jeszcze konta? <NuxtLink to="/register">Zarejestruj się</NuxtLink> </p> 
      <p class="forget-password-link"> Nie pamiętasz hasło? <NuxtLink to="/forget-password">Zmień hasło</NuxtLink> </p>
>>>>>>> a7a9135 (changed forms for authorization and registration)
  </div>
</template>

<script setup lang="ts">
<<<<<<< HEAD
import { reactive } from "vue";
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = v.object({
  email: v.pipe(v.string(), v.email("Nieprawidłowy email")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Hasło musi mieć co najmniej 8 znaków"),
  ),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive<Schema>({
  email: "",
  password: "",
});

const toast = useToast();
=======
import { reactive } from "vue"
import * as v from "valibot"
import type { FormSubmitEvent } from "@nuxt/ui"

const schema = v.object({
  email: v.pipe(v.string(), v.email("Nieprawidłowy email")),
  password: v.pipe(v.string(), v.minLength(8, "Hasło musi mieć co najmniej 8 znaków")),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  email: "",
  password: "",
})

const toast = useToast()
>>>>>>> a7a9135 (changed forms for authorization and registration)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Sukces",
    description: "Formularz został wysłany.",
    color: "success",
<<<<<<< HEAD
  });
  console.log(event.data);
=======
  })
>>>>>>> a7a9135 (changed forms for authorization and registration)
}
</script>

<style scoped>
.login-page {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}

.register-link {
  margin-top: 10px;
}
</style>
