
import React from 'react';
import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'হ্যান্ডব্যাগ', icon: '👜' },
  { id: '2', name: 'কাঁধের ব্যাগ', icon: '🛍️' },
  { id: '3', name: 'পার্টি ব্যাগ', icon: '✨' },
  { id: '4', name: 'ক্লাচ ও ওয়ালেট', icon: '👛' },
  { id: '5', name: 'স্টাইলিশ ব্যাকপ্যাক', icon: '🎒' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'l1',
    name: 'প্রিমিয়াম চাইনা লেদার হ্যান্ডব্যাগ',
    price: 2850,
    originalPrice: 3500,
    image: 'https://images.unsplash.com/photo-1584917033904-491a84b2efbd?auto=format&fit=crop&q=80&w=600',
    category: 'হ্যান্ডব্যাগ',
    description: 'উচ্চমানের চাইনা সিন্থেটিক লেদার এবং গোল্ডেন মেটাল এক্সেসরিজ। অফিস বা বিশেষ অনুষ্ঠানের জন্য উপযুক্ত।',
    rating: 4.9,
    reviews: 185
  },
  {
    id: 'l2',
    name: 'লাক্সারি এমব্রয়ডারি পার্টি ব্যাগ',
    price: 1950,
    originalPrice: 2400,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=600',
    category: 'পার্টি ব্যাগ',
    description: 'চমৎকার এমব্রয়ডারি কারুকাজ করা মডার্ন চাইনা ডিজাইন। বিয়ের অনুষ্ঠানের জন্য সেরা পছন্দ।',
    rating: 4.8,
    reviews: 120
  },
  {
    id: 'l3',
    name: 'স্টাইলিশ চাইনা চেইন সোল্ডার ব্যাগ',
    price: 1450,
    originalPrice: 1800,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600',
    category: 'কাঁধের ব্যাগ',
    description: 'হালকা ওজনের টেকসই চাইনা ফেব্রিক। দৈনন্দিন ব্যবহারের জন্য খুবই আরামদায়ক।',
    rating: 4.7,
    reviews: 95
  },
  {
    id: 'l4',
    name: 'মডার্ন ডায়মন্ড কাট ক্লাচ',
    price: 1250,
    originalPrice: 1500,
    image: 'https://images.unsplash.com/photo-1544816153-12ad5d714481?auto=format&fit=crop&q=80&w=600',
    category: 'ক্লাচ ও ওয়ালেট',
    description: 'আকর্ষণীয় ডিজাইনের চাইনা ক্লাচ ব্যাগ। সাথে থাকছে রিমুভেবল চেইন স্ট্র্যাপ।',
    rating: 4.6,
    reviews: 64
  },
  {
    id: 'l5',
    name: 'ফ্যাশনেবল চাইনা মিনি ব্যাকপ্যাক',
    price: 1750,
    originalPrice: 2200,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600',
    category: 'স্টাইলিশ ব্যাকপ্যাক',
    description: 'তরুণীদের জন্য ট্রেন্ডি চাইনা ডিজাইন। কলেজে বা আউটিং-এর জন্য পারফেক্ট।',
    rating: 4.8,
    reviews: 142
  },
  {
    id: 'l6',
    name: 'প্রিমিয়াম সিল্ক ফিনিশ হ্যান্ডব্যাগ',
    price: 3200,
    originalPrice: 4000,
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=600',
    category: 'হ্যান্ডব্যাগ',
    description: 'রাজকীয় অনুভূতির সিল্ক ফিনিশ চাইনা ব্যাগ। আভিজাত্যের প্রতীক।',
    rating: 4.9,
    reviews: 210
  }
];
