// ==============================================================================
// WEBPAGE FRONTEND (REACT): frontend/src/App.jsx
// โครงการแข่งขันทักษะเทคโนโลยีสารสนเทศ (DevOps & Web Application)
// โค้ดถูกเขียนตามมาตรฐาน Clean Code, เข้าใจง่าย, แบ่ง 10 Section ชัดเจน
// รองรับระบบสิทธิ์ 3 ระดับ (RBAC: Admin, Officer/User 1, Member/User 2)
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import api from './services/api';
import { 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Download, 
  LogOut, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Boxes,
  CircleDollarSign,
  Layers
} from 'lucide-react';

export default function App() {
  // ============================================================================
  // SECTION 1: STATE MANAGEMENT (จัดการข้อมูลและสถานะต่างๆ)
  // ============================================================================
  
  // สถานะ Authentication
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ข้อมูลฟอร์มเข้าสู่ระบบ
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // ข้อมูลอุปกรณ์และหมวดหมู่
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ค้นหา, กรอง และแบ่งหน้า (Filters & Pagination)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ควบคุม Modal เพิ่ม/แก้ไขข้อมูล
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null = โหมดสร้างใหม่, มีข้อมูล = โหมดแก้ไข
  const [formData, setFormData] = useState({
    item_code: '',
    category_id: '',
    title: '',
    value_amount: '',
    file: null
  });

  // ควบคุม Modal ยืนยันการลบข้อมูล (Delete Confirmation)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // กล่องแจ้งเตือน Toast Message
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // ฟังก์ชันแสดง Toast อัตโนมัติ 3 วินาที
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // ตรวจสอบสิทธิ์การใช้งาน (Role Permissions ตามโจทย์)
  const userRole = user?.role || '';
  const isAdmin = userRole === 'admin';
  const isOfficer = userRole === 'user1' || userRole === 'officer' || user?.username === 'officer1';
  const canModify = isAdmin || isOfficer; // เพิ่ม/แก้ไข ได้เฉพาะ Admin และ Officer
  const canDelete = isAdmin;             // ลบข้อมูลได้เฉพาะ Admin เท่านั้น

  // ============================================================================
  // SECTION 2: AUTHENTICATION HANDLERS (เข้าสู่ระบบ & ออกจากระบบ)
  // ============================================================================

  // ฟังก์ชันส่งคำขอเข้าสู่ระบบ (POST /api/auth/login)
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoginError('');
    setIsSubmittingAuth(true);

    try {
      const res = await api.post('/auth/login', {
        username: loginForm.username.trim(),
        password: loginForm.password
      });

      const receivedToken = res.data?.token || res.data?.data?.token;
      const receivedUser = res.data?.user || res.data?.data?.user;

      if (!receivedToken) {
        throw new Error('ไม่พบ Token ตอบกลับจากเซิร์ฟเวอร์');
      }

      // บันทึกลง LocalStorage
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      showToast('เข้าสู่ระบบสำเร็จ ยินดีต้อนรับคุณ ' + (receivedUser.username || ''));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      setLoginError(msg);
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setItems([]);
    showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
  };

  // ฟังก์ชันกดล็อกอินแบบด่วน (สำหรับสาธิตกรรมการหรือทดสอบ)
  const fillQuickLogin = (uname, pwd) => {
    setLoginForm({ username: uname, password: pwd });
  };

  // ============================================================================
  // SECTION 3: API DATA FETCHING (ดึงข้อมูลอุปกรณ์และหมวดหมู่)
  // ============================================================================

  const loadData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [itemsRes, catRes] = await Promise.all([
        api.get('/items'),
        api.get('/categories')
      ]);

      const itemsList = itemsRes.data?.data || itemsRes.data || [];
      const catList = catRes.data?.data || catRes.data || [];

      setItems(Array.isArray(itemsList) ? itemsList : []);
      setCategories(Array.isArray(catList) ? catList : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  // ============================================================================
  // SECTION 4: CRUD ACTIONS (เพิ่ม, แก้ไข, ลบ ข้อมูลพร้อมไฟล์แนบ)
  // ============================================================================

  // เปิด Modal เพื่อเพิ่มข้อมูลใหม่
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      item_code: '',
      category_id: categories[0]?.id || '',
      title: '',
      value_amount: '',
      file: null
    });
    setShowFormModal(true);
  };

  // เปิด Modal เพื่อแก้ไขข้อมูลเดิม
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      item_code: item.item_code,
      category_id: item.category_id || '',
      title: item.title,
      value_amount: item.value_amount || '',
      file: null // ถ้าไม่เลือกใหม่จะคงไฟล์เดิม
    });
    setShowFormModal(true);
  };

  // จัดการการส่งฟอร์ม (Submit Create / Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const postData = new FormData();
      postData.append('item_code', formData.item_code.trim());
      postData.append('category_id', formData.category_id);
      postData.append('title', formData.title.trim());
      postData.append('value_amount', formData.value_amount);
      if (formData.file) {
        postData.append('file', formData.file);
      }

      if (editingItem) {
        // แก้ไขข้อมูลเดิม (PUT /api/items/:id)
        await api.put(`/items/${editingItem.id}`, postData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('อัปเดตข้อมูลสำเร็จ');
      } else {
        // เพิ่มข้อมูลใหม่ (POST /api/items)
        await api.post('/items', postData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('บันทึกข้อมูลสำเร็จ');
      }

      setShowFormModal(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      alert(msg);
    }
  };

  // เปิด Modal ยืนยันการลบ
  const handleOpenDeleteModal = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  // ดำเนินการลบจริง (DELETE /api/items/:id)
  const handleExecuteDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/items/${itemToDelete.id}`);
      showToast('ลบข้อมูลเรียบร้อยแล้ว');
      setShowDeleteModal(false);
      setItemToDelete(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'ไม่สามารถลบข้อมูลได้');
    }
  };

  // ============================================================================
  // SECTION 5: FILTER, SEARCH & PAGINATION LOGIC
  // ============================================================================

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.item_code && item.item_code.toLowerCase().includes(q));

      const matchCat = !selectedCategory || String(item.category_id) === String(selectedCategory);
      return matchQuery && matchCat;
    });
  }, [items, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  // สรุปสถิติสำหรับ Dashboard Cards
  const stats = useMemo(() => {
    const totalCount = items.length;
    const totalVal = items.reduce((sum, item) => sum + (Number(item.value_amount) || 0), 0);
    const catCount = categories.length;
    return { totalCount, totalVal, catCount };
  }, [items, categories]);


  // ============================================================================
  // SECTION 6: RENDER - LOGIN VIEW (หน้าต่างล็อกอินพร้อมปุ่มทดสอบสิทธิ์)
  // ============================================================================
  if (!token) {
    return (
      <div id="view-login" className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
        {/* Toast Container */}
        {toast.show && (
          <div id="toast-container" className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-indigo-200">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">ระบบบริหารจัดการอุปกรณ์ (DevOps)</h1>
            <p className="text-xs text-slate-500 mt-1">กรุณาลงชื่อเข้าใช้ด้วยบัญชีผู้ใช้ตามสิทธิ์ที่ได้รับ</p>
          </div>

          {/* แจ้งเตือนข้อผิดพลาดถ้ามี */}
          {loginError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* แบบฟอร์ม Login */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อผู้ใช้งาน (Username)</label>
              <input 
                id="input-username"
                type="text" 
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="เช่น admin, officer1 หรือ user2"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">รหัสผ่าน (Password)</label>
              <input 
                id="input-password"
                type="password" 
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Password123!"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            <button 
              id="btn-login"
              type="submit" 
              disabled={isSubmittingAuth}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition shadow-md shadow-indigo-100 disabled:opacity-50"
            >
              {isSubmittingAuth ? 'กำลังตรวจสอบสิทธิ์...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {/* Quick Demo Login (อำนวยความสะดวกให้ผู้เข้าแข่งและกรรมการ) */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider text-center">
              คลิกเพื่อเติมข้อมูลทดสอบสิทธิ์ (RBAC 3 ระดับ):
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button 
                type="button"
                onClick={() => fillQuickLogin('admin', 'Password123!')}
                className="text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 py-1.5 px-1 rounded-md text-center transition font-medium"
              >
                1. Admin
              </button>
              <button 
                type="button"
                onClick={() => fillQuickLogin('officer1', 'Password123!')}
                className="text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 py-1.5 px-1 rounded-md text-center transition font-medium"
              >
                2. Officer
              </button>
              <button 
                type="button"
                onClick={() => fillQuickLogin('user2', 'Password123!')}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 py-1.5 px-1 rounded-md text-center transition font-medium"
              >
                3. Member
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // SECTION 7: RENDER - MAIN APPLICATION VIEW (เมื่อล็อกอินสำเร็จ)
  // ============================================================================
  return (
    <div id="view-app" className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Toast Notification Container */}
      {toast.show && (
        <div id="toast-container" className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-emerald-500">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h1 id="tab-inventory" className="text-base font-bold text-slate-900 leading-tight">
                ศูนย์จัดการอุปกรณ์สารสนเทศ (Asset Center)
              </h1>
              <p className="text-[11px] text-slate-500">ระบบสาธิตสำหรับการแข่งขันทักษะด้านเทคโนโลยีสารสนเทศ</p>
            </div>
          </div>

          {/* User Profile & Role Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div id="badge-user-name" className="text-xs font-bold text-slate-800">
                {user?.username === 'officer1' ? 'IT Officer (officer1)' : user?.username || 'ผู้ใช้งาน'}
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                isAdmin 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                  : isOfficer 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}>
                {isAdmin ? '🛡️ ผู้ดูแลระบบ (Admin)' : isOfficer ? '👤 เจ้าหน้าที่ (Officer 1)' : '👀 สมาชิก (Member 2)'}
              </span>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="ออกจากระบบ"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* SECTION 7.1: KPI SUMMARY STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">จำนวนอุปกรณ์ทั้งหมด</p>
              <h3 className="text-xl font-bold text-slate-800">{stats.totalCount} <span className="text-xs font-normal text-slate-400">รายการ</span></h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <CircleDollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">มูลค่าทรัพย์สินรวม</p>
              <h3 className="text-xl font-bold text-slate-800">฿{stats.totalVal.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">หมวดหมู่อุปกรณ์</p>
              <h3 className="text-xl font-bold text-slate-800">{stats.catCount} <span className="text-xs font-normal text-slate-400">หมวดหมู่</span></h3>
            </div>
          </div>
        </div>

        {/* SECTION 7.2: TOOLBAR (ค้นหา, กรอง และปุ่มเพิ่มรายการ) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* ช่องค้นหา */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="ค้นหารหัส หรือชื่ออุปกรณ์..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* ดรอปดาวน์หมวดหมู่ */}
            <select 
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="">ทุกหมวดหมู่ ({items.length})</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* ปุ่มเพิ่มรายการ (เฉพาะ Admin & Officer เท่านั้น ตามข้อกำหนดข้อ 4.6) */}
          {canModify && (
            <button 
              id="btn-open-create-modal"
              onClick={handleOpenCreateModal}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow shadow-indigo-100"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มรายการใหม่</span>
            </button>
          )}
        </div>

        {/* SECTION 7.3: DATA TABLE (ตารางรายการข้อมูลและไฟล์แนบ) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">รหัสอุปกรณ์</th>
                  <th className="py-3 px-4">ชื่ออุปกรณ์</th>
                  <th className="py-3 px-4">หมวดหมู่</th>
                  <th className="py-3 px-4 text-right">มูลค่า (บาท)</th>
                  <th className="py-3 px-4 text-center">เอกสาร/ไฟล์แนบ</th>
                  {canModify && <th className="py-3 px-4 text-center">การจัดการ</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">กำลังโหลดข้อมูล...</td>
                  </tr>
                ) : paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                        {item.item_code}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {item.title}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                          {item.category_name || item.category_id}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        ฿{Number(item.value_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.file_path || item.attachment_path ? (
                          <a 
                            href={item.file_path || item.attachment_path} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 underline font-medium"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>ดาวน์โหลด</span>
                          </a>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      {canModify && (
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* ปุ่มแก้ไข (Officer & Admin) */}
                            <button 
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                              title="แก้ไขข้อมูล"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* ปุ่มลบ (เฉพาะ Admin เท่านั้น พร้อม Modal ยืนยัน) */}
                            {canDelete && (
                              <button 
                                onClick={() => handleOpenDeleteModal(item)}
                                className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                                title="ลบข้อมูล (ต้องยืนยัน)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* SECTION 7.4: PAGINATION CONTROLS */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              แสดง <b>{paginatedItems.length}</b> รายการ (จากทั้งหมด {filteredItems.length} รายการ)
            </div>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-2.5 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 transition"
              >
                ย้อนกลับ
              </button>
              <span>หน้า <b>{currentPage}</b> / {totalPages}</span>
              <button 
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-2.5 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 transition"
              >
                ถัดไป
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* ========================================================================
          SECTION 8: MODAL (ADD / EDIT ITEM พร้อมไฟล์แนบ)
      ======================================================================== */}
      {showFormModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {editingItem ? '✏️ แก้ไขข้อมูลอุปกรณ์' : '➕ เพิ่มข้อมูลอุปกรณ์ใหม่'}
            </h3>

            <form onSubmit={handleSubmitForm} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">รหัสอุปกรณ์ (Item Code)</label>
                <input 
                  id="input-item-code"
                  type="text" 
                  required
                  placeholder="เช่น NET-001 หรือ AUTO-99"
                  value={formData.item_code}
                  onChange={(e) => setFormData({ ...formData, item_code: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">หมวดหมู่อุปกรณ์ (Category)</label>
                <select 
                  id="select-item-category"
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="" disabled>-- เลือกหมวดหมู่ --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ชื่อรายการอุปกรณ์ (Title)</label>
                <input 
                  id="input-item-title"
                  type="text" 
                  required
                  placeholder="เช่น Cisco Catalyst Switch 3560"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">มูลค่าทรัพย์สิน (บาท)</label>
                <input 
                  id="input-item-value"
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formData.value_amount}
                  onChange={(e) => setFormData({ ...formData, value_amount: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ไฟล์แนบ (รูปภาพหรือเอกสาร PDF)</label>
                <input 
                  type="file" 
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] || null })}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-slate-200 rounded-lg"
                />
                {editingItem?.file_path && !formData.file && (
                  <p className="text-[11px] text-slate-400 mt-1">ไฟล์แนบเดิม: {editingItem.file_path}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowFormModal(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  ยกเลิก
                </button>
                <button 
                  id="btn-submit-item"
                  type="submit" 
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================
          SECTION 9: MODAL (CONFIRM DELETE - มาตรฐาน ANSI ตาม Flowchart c13_2)
      ======================================================================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-100 max-w-sm w-full p-6 animate-in fade-in zoom-in duration-150">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">ยืนยันการลบข้อมูลอุปกรณ์</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              คุณต้องการลบรายการ <b>"{itemToDelete?.title}"</b> (รหัส: {itemToDelete?.item_code}) ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => { setShowDeleteModal(false); setItemToDelete(null); }}
                className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleExecuteDelete}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-rose-200"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
