<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import api from './services/api';

const auth = useAuthStore();

// Form & Data State
const loginForm = reactive({ username: '', password: '' });
const loginError = ref('');
const isSubmitting = ref(false);

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

// Toast
const toastMessage = ref('');
function showToast(msg) {
  toastMessage.value = msg;
  setTimeout(() => { toastMessage.value = ''; }, 3000);
}

// 1. Auth Handlers
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

// 2. Load Data
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

// 3. Filters & Pagination
const filteredItems = computed(() => {
  return items.value.filter(item => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchSearch = !q || item.title.toLowerCase().includes(q) || item.item_code.toLowerCase().includes(q);
    const matchCat = !selectedCategory.value || item.category_id === Number(selectedCategory.value);
    return matchSearch && matchCat;
  });
});

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage) || 1);
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredItems.value.slice(start, start + itemsPerPage);
});

// 4. Create Item
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

// 5. Delete Item
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
  <div class="p-4 max-w-4xl mx-auto font-sans text-sm text-gray-800">
    
    <!-- Toast Message -->
    <div v-if="toastMessage" class="fixed top-3 right-3 bg-green-600 text-white px-3 py-1.5 rounded shadow">
      {{ toastMessage }}
    </div>

    <!-- VIEW 1: LOGIN -->
    <div v-if="!auth.token" class="max-w-sm mx-auto mt-16 p-6 border rounded-lg bg-white shadow-sm">
      <h2 class="text-lg font-bold mb-4 text-center">เข้าสู่ระบบ (Login)</h2>
      <form @submit.prevent="handleLogin" class="space-y-3">
        <div>
          <label class="block text-xs font-semibold mb-1">ชื่อผู้ใช้</label>
          <input v-model="loginForm.username" type="text" required placeholder="admin / officer1 / user2"
            class="w-full border px-2 py-1.5 rounded text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold mb-1">รหัสผ่าน</label>
          <input v-model="loginForm.password" type="password" required placeholder="รหัสผ่าน"
            class="w-full border px-2 py-1.5 rounded text-sm" />
        </div>
        <div v-if="loginError" class="text-red-600 text-xs">{{ loginError }}</div>
        <button type="submit" :disabled="isSubmitting"
          class="w-full bg-blue-600 text-white py-1.5 rounded font-semibold hover:bg-blue-700">
          {{ isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
        </button>
      </form>
    </div>

    <!-- VIEW 2: APP / INVENTORY -->
    <div v-else class="space-y-4">
      <!-- Header -->
      <header class="flex justify-between items-center border-b pb-3">
        <h1 class="text-lg font-bold">ระบบบริหารจัดการอุปกรณ์ (DevOps App)</h1>
        <div class="flex items-center gap-2">
          <span>ผู้ใช้: <b>{{ auth.user?.username }}</b></span>
          <button @click="handleLogout" class="border px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-xs">
            ออกจากระบบ
          </button>
        </div>
      </header>

      <!-- Search & Controls Toolbar -->
      <div class="flex justify-between items-center gap-2">
        <div class="flex gap-2">
          <input v-model="searchQuery" type="text" placeholder="ค้นหารหัส หรือชื่ออุปกรณ์..."
            class="border px-2 py-1 rounded w-52 text-xs" />
          <select v-model="selectedCategory" class="border px-2 py-1 rounded text-xs">
            <option value="">ทุกหมวดหมู่</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <!-- Add Button (Admin & User 1 Only) -->
        <button v-if="auth.canCreate" @click="showCreateModal = true"
          class="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-700">
          + เพิ่มรายการ
        </button>
      </div>

      <!-- Data Table -->
      <table class="w-full border border-collapse text-left text-xs">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="p-2 border">รหัส</th>
            <th class="p-2 border">ชื่อรายการ</th>
            <th class="p-2 border">หมวดหมู่</th>
            <th class="p-2 border">มูลค่า (บาท)</th>
            <th class="p-2 border">ไฟล์แนบ</th>
            <th v-if="auth.role === 'admin'" class="p-2 border text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedItems" :key="item.id" class="border-b hover:bg-gray-50">
            <td class="p-2 border font-mono font-bold">{{ item.item_code }}</td>
            <td class="p-2 border">{{ item.title }}</td>
            <td class="p-2 border">{{ item.category_name || item.category_id }}</td>
            <td class="p-2 border">{{ Number(item.value_amount).toLocaleString() }}</td>
            <td class="p-2 border text-center">
              <a v-if="item.attachment_path" :href="item.attachment_path" target="_blank"
                class="text-blue-600 underline">ดาวน์โหลด</a>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td v-if="auth.role === 'admin'" class="p-2 border text-center">
              <button @click="confirmDelete(item)" class="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded hover:bg-red-100">
                ลบ
              </button>
            </td>
          </tr>
          <tr v-if="paginatedItems.length === 0">
            <td colspan="6" class="p-4 text-center text-gray-400">ไม่พบข้อมูล</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-between items-center text-xs text-gray-600">
        <span>รายการ {{ paginatedItems.length }} จาก {{ filteredItems.length }}</span>
        <div class="flex gap-1">
          <button :disabled="currentPage <= 1" @click="currentPage--"
            class="border px-2 py-0.5 rounded bg-white disabled:opacity-30">ย้อนกลับ</button>
          <span class="px-2 py-0.5">หน้า {{ currentPage }} / {{ totalPages }}</span>
          <button :disabled="currentPage >= totalPages" @click="currentPage++"
            class="border px-2 py-0.5 rounded bg-white disabled:opacity-30">ถัดไป</button>
        </div>
      </div>

      <!-- Add Item Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
        <div class="bg-white p-5 rounded-lg border max-w-md w-full space-y-3 shadow-lg">
          <h3 class="font-bold text-sm">เพิ่มรายการอุปกรณ์ใหม่</h3>
          <form @submit.prevent="handleCreateItem" class="space-y-2 text-xs">
            <div>
              <label class="block font-semibold mb-0.5">รหัสอุปกรณ์</label>
              <input v-model="newItem.item_code" type="text" required placeholder="เช่น NET-002" class="w-full border p-1.5 rounded" />
            </div>
            <div>
              <label class="block font-semibold mb-0.5">หมวดหมู่</label>
              <select v-model="newItem.category_id" required class="w-full border p-1.5 rounded">
                <option value="" disabled>เลือกหมวดหมู่</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold mb-0.5">ชื่อรายการ</label>
              <input v-model="newItem.title" type="text" required placeholder="ชื่ออุปกรณ์" class="w-full border p-1.5 rounded" />
            </div>
            <div>
              <label class="block font-semibold mb-0.5">มูลค่า (บาท)</label>
              <input v-model="newItem.value_amount" type="number" step="0.01" required placeholder="0.00" class="w-full border p-1.5 rounded" />
            </div>
            <div>
              <label class="block font-semibold mb-0.5">ไฟล์แนบ (รูปภาพ/PDF)</label>
              <input type="file" @change="onFileChange" class="w-full border p-1 rounded" />
            </div>
            <div class="flex justify-end gap-2 pt-2 border-t">
              <button type="button" @click="showCreateModal = false" class="border px-3 py-1 rounded">ยกเลิก</button>
              <button type="submit" class="bg-green-600 text-white px-3 py-1 rounded font-semibold">บันทึก</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal (Admin only) -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
        <div class="bg-white p-5 rounded-lg border max-w-sm w-full space-y-3 shadow-lg text-xs">
          <h3 class="font-bold text-sm text-red-600">ยืนยันการลบข้อมูล</h3>
          <p>คุณต้องการลบรายการ <b>{{ itemToDelete?.title }}</b> ใช่หรือไม่?</p>
          <div class="flex justify-end gap-2 pt-2 border-t">
            <button @click="showDeleteModal = false" class="border px-3 py-1 rounded">ยกเลิก</button>
            <button @click="executeDelete" class="bg-red-600 text-white px-3 py-1 rounded font-semibold">ยืนยันลบ</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>