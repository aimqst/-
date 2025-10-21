import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit, Trash2, User, Mail, CheckCircle, XCircle, Filter, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  // حالة المستخدمين
  const [users, setUsers] = useState([]);
  // حالة نص البحث
  const [searchTerm, setSearchTerm] = useState('');
  // حالة فتح أو إغلاق المودال (النافذة المنبثقة)
  const [isModalOpen, setIsModalOpen] = useState(false);
  // حالة المستخدم الذي يتم تعديله (null إذا كان إضافة جديد)
  const [editingUser, setEditingUser] = useState(null);
  // حالة بيانات النموذج للإضافة والتعديل
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'active'
  });
  // حالة فلتر الحالة للمستخدمين (الكل، نشط، غير نشط)
  const [filterStatus, setFilterStatus] = useState('all');
  // حالة التحميل (لعرض مؤشر تحميل)
  const [isLoading, setIsLoading] = useState(true);
  // حالة الإشعارات (رسالة ونوعها)
  const [notification, setNotification] = useState(null);

  // دالة لعرض الإشعارات
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    // إخفاء الإشعار بعد 3 ثوانٍ
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // تحميل المستخدمين عند تحميل المكون
  useEffect(() => {
    const loadUsers = () => {
      setIsLoading(true); // بدء التحميل
      // محاكاة تأخير الشبكة لتحميل البيانات
      setTimeout(() => {
        const sampleUsers = [
          { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', status: 'active', createdAt: '2024-01-15' },
          { id: 2, name: 'سارة علي', email: 'sara@example.com', status: 'inactive', createdAt: '2024-01-20' },
          { id: 3, name: 'محمد خالد', email: 'mohammed@example.com', status: 'active', createdAt: '2024-01-25' },
          { id: 4, name: 'فاطمة حسن', email: 'fatima@example.com', status: 'active', createdAt: '2024-02-01' },
          { id: 5, name: 'علي رضا', email: 'ali@example.com', status: 'inactive', createdAt: '2024-02-05' }
        ];
        setUsers(sampleUsers); // تعيين المستخدمين المحملين
        setIsLoading(false); // انتهاء التحميل
      }, 800);
    };

    loadUsers();
  }, []); // تشغيل مرة واحدة فقط عند التحميل

  // معالجة تغيير المدخلات في النموذج
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // معالجة إرسال النموذج (إضافة أو تعديل مستخدم)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      // تعديل مستخدم موجود
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
      showNotification('تم تحديث المستخدم بنجاح!', 'success');
    } else {
      // إضافة مستخدم جديد
      const newUser = {
        id: Date.now(), // توليد معرف فريد
        ...formData,
        createdAt: new Date().toISOString().split('T')[0] // تاريخ الإنشاء الحالي
      };
      setUsers([...users, newUser]);
      showNotification('تم إضافة المستخدم بنجاح!', 'success');
    }
    resetForm(); // إعادة تعيين النموذج وإغلاق المودال
  };

  // معالجة النقر على زر التعديل
  const handleEdit = (user) => {
    setEditingUser(user); // تحديد المستخدم المراد تعديله
    setFormData({
      name: user.name,
      email: user.email,
      status: user.status
    });
    setIsModalOpen(true); // فتح المودال
  };

  // معالجة النقر على زر الحذف
  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId)); // حذف المستخدم من القائمة
    showNotification('تم حذف المستخدم بنجاح!', 'success');
  };

  // إعادة تعيين حالة النموذج والمودال
  const resetForm = () => {
    setFormData({ name: '', email: '', status: 'active' });
    setEditingUser(null);
    setIsModalOpen(false);
  };

  // تصفية المستخدمين بناءً على البحث والحالة
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // دالة لتنسيق التاريخ
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans text-right relative">
      {/* قسم الإشعارات */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium ${
              notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* رأس الصفحة */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* أيقونة اللوحة */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg"
              >
                <User className="text-white" size={28} />
              </motion.div>
              {/* عنوان لوحة التحكم */}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent">
                  لوحة تحكم إدارة المستخدمين
                </h1>
                <p className="text-slate-600 mt-1 flex items-center gap-2">
                  <Settings size={16} />
                  إدارة حسابات المستخدمين بسهولة وفعالية
                </p>
              </div>
            </div>
            {/* زر إضافة مستخدم جديد */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <Plus size={24} />
              <span className="hidden sm:inline">إضافة مستخدم جديد</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* قسم التحكم (البحث والتصفية) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* حقل البحث */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="البحث عن مستخدم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-3 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
            </div>
            
            {/* فلاتر الحالة */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2">
                <Filter size={18} className="text-slate-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent border-none outline-none text-slate-700 font-medium"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ملخص الإحصائيات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { title: 'إجمالي المستخدمين', value: users.length, icon: User, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-100' },
            { title: 'المستخدمين النشطين', value: users.filter(user => user.status === 'active').length, icon: CheckCircle, color: 'from-green-500 to-green-600', bg: 'bg-green-100' },
            { title: 'المستخدمين غير النشطين', value: users.filter(user => user.status === 'inactive').length, icon: XCircle, color: 'from-red-500 to-red-600', bg: 'bg-red-100' },
            { title: 'نسبة النشاط', value: users.length > 0 ? Math.round((users.filter(user => user.status === 'active').length / users.length) * 100) + '%' : '0%', icon: Settings, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-100' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 rounded-full"></div> {/* تأثير بصري */}
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="text-white" size={28} />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* جدول المستخدمين */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden"
        >
          {isLoading ? (
            // مؤشر التحميل
            <div className="p-12 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <User className="text-blue-600" size={48} />
              </motion.div>
              <p className="text-slate-600 mt-4 text-lg">جارٍ تحميل البيانات...</p>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/20">
                <thead className="bg-gradient-to-r from-slate-100/80 to-blue-100/80 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-5 text-right text-sm font-bold text-slate-800 uppercase tracking-wider">
                      الاسم
                    </th>
                    <th className="px-6 py-5 text-right text-sm font-bold text-slate-800 uppercase tracking-wider">
                      البريد الإلكتروني
                    </th>
                    <th className="px-6 py-5 text-right text-sm font-bold text-slate-800 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-5 text-right text-sm font-bold text-slate-800 uppercase tracking-wider">
                      تاريخ الإنشاء
                    </th>
                    <th className="px-6 py-5 text-right text-sm font-bold text-slate-800 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-white/20">
                  {filteredUsers.length === 0 ? (
                    // رسالة في حالة عدم وجود مستخدمين
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="flex flex-col items-center justify-center"
                        >
                          <div className="p-6 bg-gradient-to-r from-slate-100 to-blue-100 rounded-full mb-6">
                            <User className="text-slate-400" size={64} />
                          </div>
                          <p className="text-2xl font-bold text-slate-600 mb-2">لا توجد مستخدمين لعرضهم</p>
                          <p className="text-slate-500 max-w-md">ابدأ بإضافة مستخدم جديد أو قم بتعديل معايير البحث والتصفية</p>
                        </motion.div>
                      </td>
                    </tr>
                  ) : (
                    // عرض بيانات المستخدمين
                    filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-white/80 transition-all duration-300 group"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                            >
                              <User className="text-white" size={24} />
                            </motion.div>
                            <div className="mr-4">
                              <div className="text-sm font-bold text-slate-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center text-sm text-slate-600">
                            <Mail className="ml-2 text-slate-400" size={18} />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <motion.span 
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                          >
                            {user.status === 'active' ? (
                              <>
                                <CheckCircle className="ml-2" size={16} />
                                نشط
                              </>
                            ) : (
                              <>
                                <XCircle className="ml-2" size={16} />
                                غير نشط
                              </>
                            )}
                          </motion.span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-3 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {/* زر التعديل */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(user)}
                              className="text-blue-600 hover:text-blue-800 p-3 hover:bg-blue-50 rounded-xl transition-all duration-200 shadow-sm"
                              title="تعديل"
                            >
                              <Edit size={20} />
                            </motion.button>
                            {/* زر الحذف */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-800 p-3 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-sm"
                              title="حذف"
                            >
                              <Trash2 size={20} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      {/* المودال (النافذة المنبثقة) للإضافة والتعديل */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={resetForm} {/* إغلاق المودال عند النقر خارجها */}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              onClick={(e) => e.stopPropagation()} // منع إغلاق المودال عند النقر داخلها
            >
              <div className="text-center mb-6">
                <div className="mx-auto p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <User className="text-white" size={28} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
                </h2>
                <p className="text-slate-600 mt-2">
                  {editingUser ? 'قم بتحديث معلومات المستخدم' : 'أدخل معلومات المستخدم الجديد'}
                </p>
              </div>
              
              {/* نموذج الإضافة/التعديل */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    الاسم الكامل
                  </label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-4 pr-12 py-4 border border-slate-300 rounded-xl focus:ring-3 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all duration-300 bg-white/80"
                      placeholder="أدخل الاسم الكامل"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-4 pr-12 py-4 border border-slate-300 rounded-xl focus:ring-3 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all duration-300 bg-white/80"
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    الحالة
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-3 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all duration-300 bg-white/80 appearance-none"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>
                
                <div className="flex space-x-4 space-x-reverse pt-4">
                  {/* زر الإلغاء */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-4 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-300 font-semibold shadow-sm"
                  >
                    إلغاء
                  </motion.button>
                  {/* زر الإضافة/التحديث */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    {editingUser ? 'تحديث' : 'إضافة'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;