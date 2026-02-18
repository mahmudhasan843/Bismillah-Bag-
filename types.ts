
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  ordersCount: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  paymentMethod: string;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
