export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  variant: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  notes?: {
    top: string;
    heart: string;
    base: string;
  };
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  transactionId: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  status: 'success' | 'pending' | 'failed';
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
