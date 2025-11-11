<template>
  <div class="min-h-screen bg-[#0A0A0A] font-sans text-neutral-300">
    <!-- header -->
    <header class="bg-[#141414]/80 backdrop-blur-lg border-b border-neutral-800 sticky top-0 z-20">
      <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-xl font-bold text-white tracking-wider">Bon<span class="text-blue-400">Card</span></h1>
          <button @click="handleLogout" class="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:text-white font-medium rounded-md hover:bg-neutral-800 transition-colors">
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- main-->
    <main class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Toolbar -->
      <div class="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div class="relative w-full sm:max-w-xs">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="w-5 h-5 text-neutral-500" />
          </div>
          <input
            v-model="searchTerm"
            @input="debouncedSearch"
            type="text"
            placeholder="Search by card number..."
            class="w-full pl-10 pr-4 py-2 bg-[#141414] border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>
        <button
          @click="openCreateModal"
          class="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition-all transform hover:scale-105"
        >
          <Plus class="w-5 h-5" />
          <span>New Card</span>
        </button>
      </div>

      <!-- Cards Table -->
      <div class="bg-[#141414] border border-neutral-800 rounded-lg shadow-2xl shadow-black/20 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="border-b border-neutral-800">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Card Number</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">PIN</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Activation Date</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Expiry Date</th>
                <th class="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right">Balance</th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-800">
              <tr v-if="cardStore.loading && cardStore.cards.length === 0">
                <td colspan="6" class="text-center py-16 text-neutral-500">Loading data...</td>
              </tr>
              <tr v-else-if="cardStore.cards.length === 0">
                <td colspan="6" class="text-center py-16 text-neutral-500">No cards found.</td>
              </tr>
              <tr v-for="(card, index) in cardStore.cards" :key="card.id" class="stagger-in hover:bg-neutral-800/50 transition-colors" :style="{ '--stagger-index': index }">
                <td class="px-6 py-4 whitespace-nowrap font-mono text-sm text-neutral-300">{{ card.card_number }}</td>
                
                <td class="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  <div class="flex items-center gap-2">
                    <span :class="visiblePins[card.id] ? 'text-neutral-300' : 'text-neutral-500'">
                      {{ visiblePins[card.id] ? card.pin : '••••' }}
                    </span>
                    <button @click="togglePinVisibility(card.id)" class="text-neutral-500 hover:text-white transition-colors">
                      <Eye v-if="!visiblePins[card.id]" class="w-4 h-4" />
                      <EyeOff v-else class="w-4 h-4" />
                    </button>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{{ formatDateTime(card.activation_date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">{{ formatDate(card.expiry_date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-400 text-right">{{ formatCurrencyPLN(card.balance) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                  <button @click="openEditModal(card)" class="p-2 text-neutral-400 hover:text-blue-400 transition-colors rounded-md hover:bg-neutral-700"><Pencil class="w-4 h-4" /></button>
                  <button @click="handleDelete(card.id)" class="p-2 text-neutral-400 hover:text-red-400 transition-colors rounded-md hover:bg-neutral-700"><Trash2 class="w-4 h-4" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!--paginacj-->
        <div 
          v-if="cardStore.pagination && cardStore.pagination.lastPage > 1"
          class="p-4 flex justify-center items-center gap-2 text-sm border-t border-neutral-800"
        >
          <button
            @click="changePage(cardStore.pagination.currentPage - 1)"
            :disabled="cardStore.pagination.currentPage === 1"
            class="px-3 py-1.5 rounded-md bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <span class="text-neutral-400">
            Page {{ cardStore.pagination.currentPage }} of {{ cardStore.pagination.lastPage }}
          </span>

          <button
            @click="changePage(cardStore.pagination.currentPage + 1)"
            :disabled="cardStore.pagination.currentPage === cardStore.pagination.lastPage"
            class="px-3 py-1.5 rounded-md bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>

      </div>
    </main>

    <transition name="modal-fade">
      <CardModal
        v-if="showModal"
        :card="selectedCard"
        :mode="modalMode"
        :server-errors="serverErrors"
        @close="closeModal"
        @save="handleSave"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCardStore } from '../stores/cardStore';
import { authService } from '../services/authService';
import CardModal from '../components/CardModal.vue';
import { Search, Plus, LogOut, Pencil, Trash2, Eye, EyeOff } from 'lucide-vue-next';

const router = useRouter();
const cardStore = useCardStore();
const searchTerm = ref('');
const showModal = ref(false);
const modalMode = ref('create');
const selectedCard = ref(null);
const serverErrors = ref({});
const visiblePins = ref({});

const togglePinVisibility = (cardId) => {
  visiblePins.value[cardId] = !visiblePins.value[cardId];
};

onMounted(() => cardStore.fetchCards());

let debounceTimer;
const debouncedSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => cardStore.fetchCards(1, searchTerm.value), 300);
};

const openCreateModal = () => {
  modalMode.value = 'create'; selectedCard.value = null; serverErrors.value = {}; showModal.value = true;
};
const openEditModal = (card) => {
  modalMode.value = 'edit'; selectedCard.value = { ...card }; serverErrors.value = {}; showModal.value = true;
};
const closeModal = () => showModal.value = false;

const handleSave = async (cardData) => {
  serverErrors.value = {};
  try {
    if (modalMode.value === 'create') {
      await cardStore.createCard(cardData);
    } else {
      await cardStore.updateCard(selectedCard.value.id, cardData);
    }
    closeModal();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      serverErrors.value = error.response.data.errors;
    } else {
      console.error(error); // Warto logować inne błędy
      alert('An unexpected error occurred.');
    }
  }
};

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this card?')) {
    await cardStore.deleteCard(id);
  }
};

const changePage = (page) => {
  cardStore.fetchCards(page, searchTerm.value);
};

const formatCurrencyPLN = (value) => {
  if (value === null || isNaN(value)) {
    return '0,00 zł';
  }
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(value);
};

const formatDateTime = (dateString) => new Date(dateString).toLocaleString('pl-PL');
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pl-PL');

const handleLogout = () => {
  authService.removeToken();
  router.push('/login');
};
</script>

<style scoped>
.stagger-in {
  animation: enter 0.5s ease-out forwards;
  opacity: 0;
  animation-delay: calc(var(--stagger-index) * 60ms);
}

@keyframes enter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.95); }
</style>