<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import api from './services/api';

const auth = useAuthStore();

// Form & View State
const activeTab = ref('inventory');
const loginForm = reactive({ username: '', password: '' });
const loginError = ref('');
const isSubmitting = ref(false);

// Inventory Data State
const items = ref([]);
const categories = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

// Modal States
const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const itemToDelete = ref(null);

const newItem = reactive({
  item_code: '',
  category_id: '',
  title: '',
  value_amount: '',
  file: null
});

// Toast Notification
const toastMessage = ref('');
function showToast(msg) {
  toastMessage.value = msg;
  setTimeout(() => { toastMessage.value = ''; }, 3000);
}

// 1. Authentication Handlers
async function handleLogin() {
  loginError.value = '';
  isSubmitting.value = true;
  try {
    await auth.login(loginForm.username, loginForm.password);
    showToast('เข้าสู่ระบบสำเร็จ');
    await loadData();
  } catch (err) {
    loginError.value = err.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
  } finally {
    isSubmitting.value = false;
  }
}

function handleLogout() {
  auth.logout();
  showToast('ออกจากระบบเรียบร้อย');
}

// 2. Data Fetching
async function loadData() {
  if (!auth.token) return;
  try {
    const [itemsRes, catRes] = await Promise.all([
      api.get('/items'),
      api.get('/categories')
    ]);
    items.value = itemsRes.data.data || [];
    categories.value = catRes.data.data || [];
  } catch (err) {
    console.error('Failed to load data', err);
  }
}

// 3. Computed Filters & Pagination
const filteredItems = computed(() => {
  return items.value.filter(item => {
    const matchSearch = searchQuery.value === '' || 
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.item_code.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCat = !selectedCategory.value || item.category_id === Number(selectedCategory.value);
    return matchSearch && matchCat;
  });
});

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage) || 1);
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredItems.value.slice(start, start + itemsPerPage);
});

// 4. Create Item with File Upload
function onFileChange(e) {
  newItem.file = e.target.files[0] || null;
}

async function handleCreateItem() {
  try {
    const formData = new FormData();
    formData.append('item_code', newItem.item_code);
    formData.append('category_id', newItem.category_id);
    formData.append('title', newItem.title);
    formData.append('value_amount', newItem.value_amount);
    if (newItem.file) formData.append('file', newItem.file);

    await api.post('/items', formData);
    showToast('บันทึกข้อมูลสำเร็จ');
    showCreateModal.value = false;
    newItem.item_code = '';
    newItem.title = '';
    newItem.value_amount = '';
    newItem.file = null;
    await loadData();
  } catch (err) {
    alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
  }
}

// 5. Delete Item Modal
function confirmDelete(item) {
  itemToDelete.value = item;
  showDeleteModal.value = true;
}

async function executeDelete() {
  if (!itemToDelete.value) return;
  try {
    await api.delete('/items/' + itemToDelete.value.id);
    showToast('ลบข้อมูลเรียบร้อยแล้ว');
    showDeleteModal.value = false;
    itemToDelete.value = null;
    await loadData();
  } catch (err) {
    alert(err.response?.data?.message || 'ไม่สามารถลบข้อมูลได้');
  }
}

onMounted(() => {
  if (auth.token) loadData();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans">
    
    <!-- Toast Notification -->
    <div v-if="toastMessage" class="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
      {{ toastMessage }}
    </div>

    <!-- VIEW 1: LOGIN -->
    <div v-if="!auth.token" class="flex items-center justify-center min-h-screen p-4">
      <div class="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 class="text-xl font-bold text-center text-slate-900">เข้าสู่ระบบ (Login)</h2>
        <form @submit.prevent="handleLogin" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">ชื่อผู้ใช้ (Username)</label>
            <input v-model="loginForm.username" type="text" required placeholder="admin / officer1 / user2"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">รหัสผ่าน (Password)</label>
            <input v-model="loginForm.password" type="password" required placeholder="รหัสผ่าน"
              class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div v-if="loginError" class="p-2 rounded bg-rose-50 border border-rose-200 text-rose-600 text-xs">
            {{ loginError }}
          </div>
          <button type="submit" :disabled="isSubmitting"
            class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition">
            {{ isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ (Sign In)' }}
          </button>
        </form>
      </div>
    </div>

    <!-- VIEW 2: APP DASHBOARD -->
    <div v-else class="max-w-6xl mx-auto p-4 md:p-6 space-y-4">
      <!-- Top Bar -->
      <header class="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h1 class="text-xl font-bold text-slate-900">DevOps Asset Center (Vue 3)</h1>
          <p class="text-xs text-slate-500">ระบบบริหารจัดการอุปกรณ์และข้อมูลสารสนเทศ</p>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span>ผู้ใช้: <strong>{{ auth.user?.full_name || auth.user?.username }}</strong></span>
          <span class="px-2 py-0.5 rounded-full font-bold uppercase text-[10px]"
            :class="{
              'bg-purple-100 text-purple-800': auth.role === 'admin',
              'bg-blue-100 text-blue-800': auth.role === 'user1',
              'bg-slate-100 text-slate-800': auth.role === 'user2'
            }">
            {{ auth.role }}
          </span>
          <button @click="handleLogout" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 font-medium transition">
            ออกจากระบบ
          </button>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <div class="flex gap-2 border-b border-slate-200 pb-2 text-xs">
        <button @click="activeTab = 'inventory'" :class="activeTab === 'inventory' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border'"
          class="px-3 py-1.5 rounded-lg font-medium transition">รายการอุปกรณ์</button>
        <button @click="activeTab = 'dashboard'" :class="activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border'"
          class="px-3 py-1.5 rounded-lg font-medium transition">ภาพรวมสถิติ</button>
      </div>

      <!-- INVENTORY SECTION -->
      <div v-if="activeTab === 'inventory'" class="space-y-4">
        <!-- Controls Toolbar -->
        <div class="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-xl border border-slate-200">
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <input v-model="searchQuery" type="text" placeholder="ค้นหารหัส หรือชื่ออุปกรณ์..."
              class="px-3 py-1.5 border rounded-lg w-48 sm:w-64" />
            <select v-model="selectedCategory" class="px-3 py-1.5 border rounded-lg">
              <option value="">ทุกหมวดหมู่</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <!-- Add Button (Admin & User 1 Only) -->
          <button v-if="auth.canCreate" @click="showCreateModal = true"
            class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition">
            + เพิ่มรายการใหม่
          </button>
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="bg-slate-100 border-b border-slate-200 font-semibold text-slate-700">
              <tr>
                <th class="p-2.5">รหัส</th>
                <th class="p-2.5">ชื่อรายการ</th>
                <th class="p-2.5">หมวดหมู่</th>
                <th class="p-2.5">มูลค่า (บาท)</th>
                <th class="p-2.5">ไฟล์แนบ</th>
                <th v-if="auth.role === 'admin'" class="p-2.5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr v-for="item in paginatedItems" :key="item.id">
                <td class="p-2.5 font-mono font-bold">{{ item.item_code }}</td>
                <td class="p-2.5 font-medium">{{ item.title }}</td>
                <td class="p-2.5">{{ item.category_name || item.category_id }}</td>
                <td class="p-2.5">{{ Number(item.value_amount).toLocaleString() }}</td>
                <td class="p-2.5">
                  <a v-if="item.attachment_path" :href="item.attachment_path" target="_blank"
                    class="text-blue-600 hover:underline">ดาวน์โหลด</a>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td v-if="auth.role === 'admin'" class="p-2.5 text-center">
                  <button @click="confirmDelete(item)" class="px-2 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded">
                    ลบ
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedItems.length === 0">
                <td colspan="6" class="p-4 text-center text-slate-400">ไม่พบข้อมูลที่ตรงกับเงื่อนไข</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar -->
        <div class="flex items-center justify-between text-xs text-slate-500">
          <span>แสดง {{ paginatedItems.length }} จากทั้งหมด {{ filteredItems.length }} รายการ</span>
          <div class="flex gap-1">
            <button :disabled="currentPage <= 1" @click="currentPage--"
              class="px-2.5 py-1 border rounded bg-white disabled:opacity-40">ย้อนกลับ</button>
            <span class="px-2.5 py-1">หน้า {{ currentPage }} / {{ totalPages }}</span>
            <button :disabled="currentPage >= totalPages" @click="currentPage++"
              class="px-2.5 py-1 border rounded bg-white disabled:opacity-40">ถัดไป</button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
          <h3 class="font-bold text-base text-slate-900">ยืนยันการลบข้อมูล</h3>
          <p class="text-xs text-slate-600">
            คุณต้องการลบรายการ <strong class="text-rose-600">{{ itemToDelete?.title }}</strong> ใช่หรือไม่?
          </p>
          <div class="flex justify-end gap-2 text-xs">
            <button @click="showDeleteModal = false" class="px-3 py-1.5 border rounded-lg">ยกเลิก</button>
            <button @click="executeDelete" class="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-semibold">ยืนยันการลบ</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>