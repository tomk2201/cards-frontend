<template>
  <div class="flex items-center justify-center min-h-screen bg-[#0A0A0A] font-sans">
    <div class="w-full max-w-md p-8 space-y-8 bg-[#141414] rounded-2xl border border-neutral-800">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-white">Secure Login</h1>
        <p class="mt-2 text-neutral-400">Welcome to the Card Management Platform</p>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-neutral-300">Email Address</label>
          <div class="mt-2">
            <input v-model="form.email" id="email" type="email" required class="w-full px-4 py-3 bg-[#0A0A0A] border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
          </div>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-neutral-300">Password</label>
          <div class="mt-2">
            <input v-model="form.password" id="password" type="password" required class="w-full px-4 py-3 bg-[#0A0A0A] border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
          </div>
        </div>
        <transition name="fade">
          <div v-if="error" class="p-3 bg-red-900/50 text-red-300 rounded-md text-sm text-center border border-red-800">
            {{ error }}
          </div>
        </transition>
        <div>
          <button type="submit" :disabled="loading" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-md font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-neutral-900 transition-all transform hover:scale-[1.02] disabled:opacity-50">
            <span v-if="!loading">Sign In</span>
            <span v-else>Verifying...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
const router = useRouter();
const form = ref({ email: 'admin@example.com', password: 'password' });
const loading = ref(false);
const error = ref(null);
const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await authService.login(form.value);
    authService.setToken(response.data.access_token);
    router.push('/cards');
  } catch (err) {
    error.value = 'Login failed. Please check credentials.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>