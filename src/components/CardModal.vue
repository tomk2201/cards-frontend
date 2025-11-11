<template>
  <div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-[#141414] border border-neutral-800 rounded-lg shadow-2xl max-w-md w-full p-8 text-white">
      <h2 class="text-2xl font-bold mb-6">
        {{ mode === 'create' ? 'Issue New Card' : 'Edit Card' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-neutral-300 mb-1">Card Number (20 digits)</label>
          <input
            v-model="form.card_number"
            type="text"
            maxlength="20"
            required
            class="w-full px-4 py-2 bg-[#0A0A0A] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500/50': serverErrors.card_number }"
          />
          <p v-if="serverErrors.card_number" class="text-red-400 text-xs mt-1">{{ serverErrors.card_number[0] }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-300 mb-1">PIN (4 digits)</label>
          <input
            v-model="form.pin"
            type="password"
            maxlength="4"
            required
            class="w-full px-4 py-2 bg-[#0A0A0A] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500/50': serverErrors.pin }"
          />
           <p v-if="serverErrors.pin" class="text-red-400 text-xs mt-1">{{ serverErrors.pin[0] }}</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-1">Activation Date</label>
            <input
              v-model="form.activation_date"
              type="datetime-local"
              required
              class="w-full px-4 py-2 bg-[#0A0A0A] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500/50': serverErrors.activation_date }"
            />
            <p v-if="serverErrors.activation_date" class="text-red-400 text-xs mt-1">{{ serverErrors.activation_date[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-300 mb-1">Expiry Date</label>
            <input
              v-model="form.expiry_date"
              type="date"
              required
              class="w-full px-4 py-2 bg-[#0A0A0A] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500/50': serverErrors.expiry_date }"
            />
            <p v-if="serverErrors.expiry_date" class="text-red-400 text-xs mt-1">{{ serverErrors.expiry_date[0] }}</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-300 mb-1">Balance (PLN)</label>
          <input
            v-model="form.balance"
            type="number"
            step="0.01"
            min="0"
            required
            class="w-full px-4 py-2 bg-[#0A0A0A] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500/50': serverErrors.balance }"
          />
          <p v-if="serverErrors.balance" class="text-red-400 text-xs mt-1">{{ serverErrors.balance[0] }}</p>
        </div>

        <div class="flex gap-4 pt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-md hover:bg-neutral-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all font-medium"
          >
            {{ mode === 'create' ? 'Create' : 'Update' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// sk
import { ref, watch } from 'vue';
const props = defineProps({
  card: { type: Object, default: null },
  mode: { type: String, required: true },
  serverErrors: { type: Object, default: () => ({}) }
});
const emit = defineEmits(['close', 'save']);
const form = ref({ card_number: '', pin: '', activation_date: '', expiry_date: '', balance: '' });
const formatDateTimeForInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};
const formatDateForInput = (isoString) => isoString ? isoString.split('T')[0] : '';
watch(() => props.card, (newCard) => {
  if (newCard) {
    form.value = {
      card_number: newCard.card_number,
      pin: '',
      activation_date: formatDateTimeForInput(newCard.activation_date),
      expiry_date: formatDateForInput(newCard.expiry_date),
      balance: newCard.balance
    };
  } else {
    form.value = { card_number: '', pin: '', activation_date: '', expiry_date: '', balance: '' };
  }
}, { immediate: true });
const handleSubmit = () => emit('save', form.value);
</script>