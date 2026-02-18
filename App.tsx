
import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, UserProfile, Order } from './types';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES } from './constants';
import Layout from './components/Layout';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import ChatWidget from './components/ChatWidget';
import AdminPanel from './components/AdminPanel';
import { ChevronRight, ArrowLeft, Truck, ShieldCheck, RefreshCw, CreditCard, ShoppingBag, User, Mail, Phone, MapPin, Camera, Calendar, LogOut, Settings, Wallet, CheckCircle2, MessageSquare, Search, ExternalLink, CreditCard as CardIcon, Lock, X } from 'lucide-react';

type ViewState = 'home' | 'product-details' | 'checkout' | 'profile' | 'admin' | 'order-success' | 'tracking';
type PaymentMethod = 'ক্যাশ অন ডেলিভারি' | 'বিকাশ (bKash)' | 'নগদ (Nagad)' | 'ব্যাংক কার্ড (Card)';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('সব');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('ক্যাশ অন ডেলিভারি');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const savedProducts = localStorage.getItem('bismillah_bag_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('bismillah_bag_products', JSON.stringify(INITIAL_PRODUCTS));
    }
    const savedOrders = localStorage.getItem('bismillah_bag_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    const savedUser = localStorage.getItem('bismillah_bag_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const adminAuth = localStorage.getItem('bismillah_admin_auth');
    if (adminAuth === 'true') setIsAdmin(true);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'সব' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, products]);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleCheckoutSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orderTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0) + 70;
    
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerName: formData.get('customerName') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      items: [...cart],
      total: orderTotal,
      status: 'pending',
      paymentMethod: selectedPaymentMethod,
      date: new Date().toLocaleString('bn-BD')
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('bismillah_bag_orders', JSON.stringify(updatedOrders));

    setLastOrder(newOrder);
    setCart([]);
    setView('order-success');
    window.scrollTo(0, 0);
  };

  const getWhatsAppOrderLink = (order: Order) => {
    const ownerPhone = "8801827872334";
    const itemsList = order.items.map(i => `- ${i.name} (x${i.quantity}) - ৳${(i.price * i.quantity).toLocaleString()}`).join('%0A');
    const message = `*নতুন অর্ডার এসেছে!*%0A%0A*অর্ডার আইডি:* ${order.id}%0A*নাম:* ${order.customerName}%0A*ফোন:* ${order.phone}%0A*ঠিকানা:* ${order.address}%0A%0A*পেমেন্ট মেথড:* ${order.paymentMethod}%0A%0A*প্রোডাক্ট লিস্ট:*%0A${itemsList}%0A%0A*ডেলিভারি চার্জ:* ৳৭০%0A*সর্বমোট:* ৳${order.total.toLocaleString()}`;
    return `https://wa.me/${ownerPhone}?text=${message}`;
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === 'mahamud394@' && loginPassword === '177493') {
      setIsAdmin(true);
      localStorage.setItem('bismillah_admin_auth', 'true');
      setView('admin');
      setShowLoginModal(false);
      setLoginError('');
      setLoginUsername('');
      setLoginPassword('');
      window.scrollTo(0, 0);
    } else {
      setLoginError('ভুল ইউজারনেম বা পাসওয়ার্ড! আবার চেষ্টা করুন।');
    }
  };

  const handleAdminAccess = () => {
    if (isAdmin) {
      setView('admin');
      window.scrollTo(0, 0);
    } else {
      setLoginError('');
      setShowLoginModal(true);
    }
  };

  const renderHome = () => (
    <div className="space-y-16 animate-fade-in">
      {/* 5D Banner - Now even more glass-like */}
      <section className="relative h-64 sm:h-80 md:h-[480px] rounded-[3.5rem] overflow-hidden shadow-2xl glass-card border border-rose-100/50 group">
        <div className="absolute inset-0 flex items-center justify-between px-8 md:px-20 relative z-10">
          <div className="max-w-xl space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-rose-600/10 text-rose-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-rose-200">
              <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping"></span> 5D High-Tech Collection
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-rose-950 leading-[1] tracking-tighter">লাক্সারি <br/><span className="text-rose-600">চাইনা কালেকশন</span></h2>
            <p className="text-gray-600 md:text-xl font-bold max-w-sm leading-relaxed opacity-80">সেরা ডিজাইনের প্রিমিয়াম চাইনা লেডিস ব্যাগ সংগ্রহ করুন সরাসরি ইমপোর্টারের কাছ থেকে।</p>
            <button onClick={() => {
              const el = document.getElementById('products-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }} className="bg-rose-600 text-white font-black py-5 px-12 rounded-[2rem] hover:bg-rose-700 transition-all shadow-2xl shadow-rose-300 flex items-center gap-4 text-xl group/btn active:scale-95">
              এখনই দেখুন <ChevronRight className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>
          <div className="hidden lg:block relative w-1/2 h-full">
             <img src="https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=1000" className="absolute top-10 right-0 h-[90%] w-full object-contain transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-2 drop-shadow-2xl" alt="Collection" />
          </div>
        </div>
        {/* Background Overlay for Banner */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
      </section>

      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-black text-slate-800 tracking-tighter">ক্যাটাগরি <span className="text-rose-600">বাছাই করুন</span></h3>
        </div>
        <div className="overflow-x-auto pb-4 scrollbar-hide flex gap-5 min-w-max p-1">
            <button onClick={() => setActiveCategory('সব')} className={`px-10 py-4.5 rounded-[2rem] font-black transition-all border-2 ${activeCategory === 'সব' ? 'bg-rose-600 text-white border-rose-600 shadow-2xl shadow-rose-200' : 'glass-card text-rose-400 border-rose-100/50 hover:border-rose-400'}`}>সবগুলো</button>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className={`px-10 py-4.5 rounded-[2rem] font-black transition-all border-2 flex items-center gap-3 ${activeCategory === cat.name ? 'bg-rose-600 text-white border-rose-600 shadow-2xl shadow-rose-200' : 'glass-card text-rose-400 border-rose-100/50 hover:border-rose-400'}`}>
                <span className="text-xl">{cat.icon}</span> {cat.name}
              </button>
            ))}
        </div>
      </section>

      <section id="products-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-12 pb-20">
        {filteredProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onClick={handleProductClick} />)}
      </section>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-32 glass-card rounded-[4rem] border-2 border-dashed border-rose-200/50">
          <Search size={64} className="mx-auto text-rose-200 mb-6 animate-pulse" />
          <p className="text-rose-400 font-black text-xl">এই ক্যাটাগরিতে কোনো ব্যাগ পাওয়া যায়নি!</p>
        </div>
      )}
    </div>
  );

  const renderProductDetails = () => {
    if (!selectedProduct) return null;
    return (
      <div className="glass-card rounded-[4rem] p-10 md:p-20 shadow-2xl animate-fade-in space-y-14 relative overflow-hidden">
        <button onClick={() => setView('home')} className="flex items-center gap-3 font-black text-rose-500 uppercase tracking-widest text-xs hover:text-rose-700 transition-colors z-10 relative"><ArrowLeft size={20}/> ফিরে যান</button>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 relative z-10">
          <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl border-4 border-white">
            <img src={selectedProduct.image} className="w-full aspect-square object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute top-8 left-8 bg-rose-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-lg">Premium Item</div>
          </div>
          <div className="space-y-10 py-4">
            <div className="space-y-4">
              <span className="px-5 py-2 bg-rose-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200">{selectedProduct.category}</span>
              <h2 className="text-4xl lg:text-6xl font-black text-slate-800 leading-[1.1] tracking-tighter">{selectedProduct.name}</h2>
            </div>
            <div className="flex items-center gap-8">
              <p className="text-6xl font-black text-rose-600">৳{selectedProduct.price.toLocaleString()}</p>
              {selectedProduct.originalPrice && <span className="text-3xl text-slate-300 line-through font-bold">৳{selectedProduct.originalPrice.toLocaleString()}</span>}
            </div>
            <p className="text-gray-500 leading-relaxed font-bold text-xl opacity-90">{selectedProduct.description}</p>
            <div className="space-y-5 pt-10 border-t border-rose-100/50">
               <button onClick={() => { handleAddToCart(selectedProduct); setIsCartOpen(true); }} className="w-full py-6 bg-rose-600 text-white font-black rounded-3xl shadow-2xl shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all text-2xl">কার্টে যোগ করুন</button>
               <button onClick={() => { handleAddToCart(selectedProduct); setView('checkout'); window.scrollTo(0,0); }} className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl shadow-2xl shadow-slate-200 active:scale-95 transition-all text-2xl hover:bg-slate-800">অর্ডার করুন</button>
            </div>
          </div>
        </div>
        {/* Detail Page Background Accent */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-rose-600/5 rounded-full blur-3xl"></div>
      </div>
    );
  };

  const handleProductClick = (p: Product) => { setSelectedProduct(p); setView('product-details'); window.scrollTo(0, 0); };

  return (
    <Layout 
      cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
      onCartClick={() => setIsCartOpen(true)} 
      onHomeClick={() => setView('home')} 
      onProfileClick={() => setView('profile')} 
      onAdminClick={handleAdminAccess} 
      onTrackingClick={() => setView('tracking')} 
      searchQuery={searchQuery} 
      setSearchQuery={setSearchQuery} 
      userName={user?.name} 
      isAdmin={isAdmin}
    >
      <div className="relative z-10">
        {view === 'home' && renderHome()}
        {view === 'product-details' && renderProductDetails()}
        {view === 'checkout' && (
          <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-24">
             <h2 className="text-5xl font-black text-slate-950 tracking-tighter">চেকআউট <span className="text-rose-600">প্রসেস</span></h2>
             <form onSubmit={handleCheckoutSubmit} className="grid lg:grid-cols-12 gap-10">
               <div className="lg:col-span-8 space-y-10">
                 <div className="glass-card p-12 rounded-[3.5rem] shadow-sm space-y-12">
                   <h3 className="font-black text-3xl flex items-center gap-5 text-rose-700 border-b border-rose-100/50 pb-8"><Truck size={36} /> ডেলিভারি তথ্য</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-2">
                       <label className="text-[11px] font-black text-rose-400 uppercase tracking-[0.2em] ml-2">কাস্টমার নাম</label>
                       <input required name="customerName" defaultValue={user?.name} placeholder="আপনার নাম" className="w-full p-5.5 bg-white/50 border border-rose-100 rounded-[1.5rem] font-black outline-none focus:ring-2 focus:ring-rose-500 transition-all" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[11px] font-black text-rose-400 uppercase tracking-[0.2em] ml-2">ফোন নাম্বার</label>
                       <input required name="phone" defaultValue={user?.phone} placeholder="০১৮XXXXXXXX" className="w-full p-5.5 bg-white/50 border border-rose-100 rounded-[1.5rem] font-black outline-none focus:ring-2 focus:ring-rose-500 transition-all" />
                     </div>
                     <div className="space-y-2 col-span-2">
                       <label className="text-[11px] font-black text-rose-400 uppercase tracking-[0.2em] ml-2">বিস্তারিত ঠিকানা</label>
                       <textarea required name="address" defaultValue={user?.address} placeholder="পুরো ঠিকানা এখানে লিখুন..." className="w-full p-6 bg-white/50 border border-rose-100 rounded-[2rem] font-black h-44 resize-none outline-none focus:ring-2 focus:ring-rose-500 transition-all"></textarea>
                     </div>
                   </div>
                 </div>
               </div>
               
               <div className="lg:col-span-4 h-fit sticky top-24">
                 <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl space-y-10 relative overflow-hidden">
                   <h3 className="font-black text-3xl relative z-10 tracking-tighter uppercase">অর্ডার সামারি</h3>
                   <div className="space-y-6 relative z-10 border-t border-white/10 pt-8 text-lg">
                      <div className="flex justify-between text-slate-400 font-bold"><span>আইটেম ({cart.length})</span><span>৳{cart.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString()}</span></div>
                      <div className="flex justify-between text-slate-400 font-bold"><span>ডেলিভারি চার্জ</span><span>৳৭০</span></div>
                      <hr className="border-white/10" />
                      <div className="flex justify-between font-black text-white text-4xl pt-4"><span>সর্বমোট</span><span>৳{(cart.reduce((s, i) => s + i.price * i.quantity, 0) + 70).toLocaleString()}</span></div>
                   </div>
                   <button type="submit" className="w-full py-7 bg-rose-600 text-white font-black rounded-3xl shadow-2xl shadow-rose-900/40 active:scale-95 transition-all text-2xl hover:bg-rose-500 relative z-10">অর্ডার কনফার্ম</button>
                   <ShoppingBag size={250} className="absolute -right-20 -bottom-20 text-white/5 rotate-12" />
                 </div>
               </div>
             </form>
          </div>
        )}
        {view === 'order-success' && lastOrder && (
          <div className="max-w-3xl mx-auto py-24 text-center animate-fade-in">
            <div className="glass-card rounded-[4rem] shadow-2xl p-20 space-y-12 border border-rose-100/50 relative overflow-hidden">
              <div className="relative z-10 space-y-10">
                <div className="w-28 h-28 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                  <CheckCircle2 size={64} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-6xl font-black text-slate-800 tracking-tighter leading-tight">অর্ডার সফল!</h2>
                  <p className="text-gray-500 font-black text-xl">আপনার পছন্দের চাইনা ব্যাগটি শীঘ্রই পৌঁছে যাবে।</p>
                </div>
                <div className="bg-rose-600/10 p-8 rounded-[2.5rem] border border-rose-200/50 inline-block">
                  <p className="text-[11px] font-black text-rose-500 uppercase tracking-[0.3em] mb-2">অর্ডার আইডি</p>
                  <p className="text-3xl font-black text-rose-600">{lastOrder.id}</p>
                </div>
                <div className="space-y-5 pt-8">
                  <a href={getWhatsAppOrderLink(lastOrder)} target="_blank" className="w-full py-6 bg-[#25D366] text-white font-black rounded-3xl flex items-center justify-center gap-4 text-2xl shadow-2xl shadow-green-100 hover:bg-green-600 transition-all active:scale-95"><MessageSquare size={28} /> হোয়াটসঅ্যাপে পাঠান</a>
                  <button onClick={() => setView('home')} className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl text-2xl shadow-2xl shadow-slate-200 active:scale-95 transition-all">ফিরে যান</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {view === 'tracking' && (
          <div className="max-w-4xl mx-auto py-20 px-4 animate-fade-in space-y-16">
            <div className="text-center space-y-6">
              <h2 className="text-6xl font-black text-slate-800 tracking-tighter">পার্সেল <span className="text-rose-600">ট্র্যাকিং</span></h2>
              <p className="text-gray-500 font-bold text-xl">ট্র্যাকিং আইডি দিয়ে পার্সেলের লোকেশন চেক করুন</p>
            </div>
            <div className="glass-card rounded-[4rem] p-16 space-y-12 text-center border border-rose-100/30">
              <div className="max-w-xl mx-auto space-y-10">
                <div className="relative group">
                  <input 
                    placeholder="ট্র্যাকিং আইডি (e.g. ST12345)" 
                    className="w-full p-8 bg-white/40 border-2 border-rose-100 rounded-[2.5rem] font-black text-3xl text-center focus:border-rose-500 outline-none transition-all placeholder:text-rose-200" 
                    value={trackingId} 
                    onChange={(e) => setTrackingId(e.target.value)} 
                  />
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-8 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Courier Code</div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <a href={`https://pathao.com/courier/tracking/?consignment_id=${trackingId}`} target="_blank" className="p-8 border-2 border-rose-100 rounded-[2.5rem] font-black bg-rose-600 text-white shadow-2xl shadow-rose-200 hover:bg-rose-700 transition-all flex flex-col items-center gap-3">
                    <span className="text-[10px] opacity-90 font-black uppercase tracking-widest">Courier Partner</span>
                    পাঠাও ট্র্যাকিং
                  </a>
                  <a href="https://steadfast.com.bd/tracking" target="_blank" className="p-8 border-2 border-slate-100 rounded-[2.5rem] font-black bg-slate-900 text-white shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all flex flex-col items-center gap-3">
                    <span className="text-[10px] opacity-90 font-black uppercase tracking-widest">Direct Delivery</span>
                    স্টেডফাস্ট ট্র্যাকিং
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {view === 'profile' && (
          <div className="max-w-5xl mx-auto py-12 space-y-12 animate-fade-in">
             {user ? (
                <div className="glass-card rounded-[4rem] shadow-2xl overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-rose-500 to-rose-700"></div>
                  <div className="px-14 pb-14 flex flex-col md:flex-row items-center gap-10 -mt-24">
                    <div className="w-48 h-48 rounded-[3rem] bg-white flex items-center justify-center text-rose-600 shadow-2xl border-4 border-white"><User size={100} /></div>
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <h2 className="text-5xl font-black text-slate-800 tracking-tighter">{user.name}</h2>
                      <div className="flex flex-wrap gap-5 justify-center md:justify-start">
                        <span className="px-6 py-2 bg-rose-600 text-white rounded-full text-xs font-black uppercase shadow-lg shadow-rose-200">Premium Customer</span>
                        <span className="px-6 py-2 glass-card text-slate-500 rounded-full text-xs font-black uppercase tracking-widest">Joined: {user.joinDate}</span>
                      </div>
                    </div>
                    <button onClick={() => { setUser(null); localStorage.removeItem('bismillah_bag_user'); setView('home'); }} className="px-10 py-5 bg-white border-2 border-rose-100 text-rose-600 rounded-[2rem] font-black hover:bg-rose-50 transition-all flex items-center gap-3 shadow-lg">
                      <LogOut size={20}/> লগ আউট
                    </button>
                  </div>
                </div>
             ) : (
                <div className="max-w-2xl mx-auto glass-card rounded-[4rem] p-12 space-y-10">
                   <div className="text-center space-y-4">
                      <h2 className="text-4xl font-black tracking-tighter text-slate-800">প্রোফাইল তৈরি করুন</h2>
                      <p className="text-rose-400 font-bold">বিসমিল্লাহ ব্যাগ পোর্টালে মেম্বার হতে ফরমটি পূরণ করুন</p>
                   </div>
                   <form onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      const u = { name: fd.get('name') as string, email: '', phone: fd.get('phone') as string, address: fd.get('address') as string, joinDate: new Date().toLocaleDateString('bn-BD'), ordersCount: 0 };
                      setUser(u); localStorage.setItem('bismillah_bag_user', JSON.stringify(u));
                   }} className="space-y-6">
                      <input required name="name" placeholder="নাম লিখুন" className="w-full p-5 bg-white border border-rose-100 rounded-2xl font-bold" />
                      <input required name="phone" placeholder="মোবাইল নাম্বার" className="w-full p-5 bg-white border border-rose-100 rounded-2xl font-bold" />
                      <textarea required name="address" placeholder="বিস্তারিত ঠিকানা" className="w-full p-5 bg-white border border-rose-100 rounded-2xl font-bold h-32 resize-none"></textarea>
                      <button type="submit" className="w-full py-5 bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-100">সেভ করুন</button>
                   </form>
                </div>
             )}
          </div>
        )}
        {view === 'admin' && (
          <AdminPanel 
            orders={orders} 
            products={products} 
            setProducts={(p) => { setProducts(p); localStorage.setItem('bismillah_bag_products', JSON.stringify(p)); }} 
            onLogout={() => { setIsAdmin(false); localStorage.removeItem('bismillah_admin_auth'); setView('home'); }} 
          />
        )}
      </div>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} onCheckout={() => { setIsCartOpen(false); setView('checkout'); }} />
      <ChatWidget />

      {/* Unique 5D Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-3xl animate-fade-in">
          <div className="glass-card rounded-[4rem] w-full max-w-md p-14 shadow-2xl animate-scale-in relative border-2 border-white/40 overflow-hidden">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-10 right-10 p-4 hover:bg-rose-50 rounded-[1.5rem] transition-all text-gray-400 hover:text-rose-600">
              <X size={28} />
            </button>
            <div className="text-center space-y-8 mb-14">
              <div className="w-24 h-24 bg-rose-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-rose-200 rotate-12 hover:rotate-0 transition-transform duration-500">
                <Lock size={48} />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tighter">এডমিন এক্সেস</h2>
                <p className="text-rose-400 text-[11px] font-black uppercase tracking-[0.3em] mt-3">Authorized Only</p>
              </div>
            </div>
            <form onSubmit={handleAdminLoginSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-rose-300 uppercase tracking-widest ml-2">আইডি</label>
                <input required className="w-full p-6 bg-white border-2 border-rose-100 rounded-[1.5rem] font-black text-slate-800 outline-none focus:border-rose-500 transition-all text-xl" placeholder="Username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-rose-300 uppercase tracking-widest ml-2">সিক্রেট পাসওয়ার্ড</label>
                <input required type="password" className="w-full p-6 bg-white border-2 border-rose-100 rounded-[1.5rem] font-black text-slate-800 outline-none focus:border-rose-500 transition-all text-xl" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              </div>
              {loginError && <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-red-600 text-sm font-black text-center animate-shake">{loginError}</div>}
              <button type="submit" className="w-full py-7 bg-rose-600 text-white font-black rounded-3xl shadow-2xl shadow-rose-300 active:scale-95 transition-all text-2xl mt-6">লগইন করুন</button>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } } 
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1); } 
        @keyframes scale-in { from { opacity: 0; transform: scale(0.8) translateY(60px); } to { opacity: 1; transform: scale(1) translateY(0); } } 
        .animate-scale-in { animation: scale-in 0.7s cubic-bezier(0.16, 1, 0.3, 1); } 
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}} />
    </Layout>
  );
};
export default App;
