import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  CreditCard,
  Truck,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Customer } from '../types';
import { formatCurrency } from '../utils/formatters';
import { trackAddShippingInfo, trackAddPaymentInfo } from '../utils/dataLayer';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, shipping, total, placeOrder } = useCart();

  const [formData, setFormData] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [shippingSaved, setShippingSaved] = useState(false);
  const [paymentSaved, setPaymentSaved] = useState(false);

  const getPaymentMethodLabel = (method: 'card' | 'upi' | 'cod') => {
    switch (method) {
      case 'card':
        return 'Credit / Debit Card';
      case 'upi':
        return 'Instant UPI';
      case 'cod':
        return 'Cash on Delivery';
    }
  };

  const handleSaveShippingInfo = () => {
    const shippingTier = shipping === 0 ? 'Complimentary Express Shipping' : 'Standard Delivery';
    trackAddShippingInfo(items, total, shippingTier);
    setShippingSaved(true);
  };

  const handleConfirmPaymentInfo = (method: 'card' | 'upi' | 'cod' = paymentMethod) => {
    trackAddPaymentInfo(items, total, getPaymentMethodLabel(method), shipping);
    setPaymentSaved(true);
  };

  const handleSelectPaymentMethod = (method: 'card' | 'upi' | 'cod') => {
    setPaymentMethod(method);
    handleConfirmPaymentInfo(method);
  };

  // If cart is empty, redirect to cart page
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="font-serif text-3xl text-zinc-900">Your Cart is Empty</h1>
        <p className="text-zinc-600">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full text-xs uppercase tracking-wider font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Explore Fragrances
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Customer]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Quick helper to prefill sample details for testing
  const handlePrefillDemo = () => {
    setFormData({
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phone: '9876543210',
      address: '42 Crescent Avenue, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Customer, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.replace(/[^0-9]/g, ''))) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Core Ecommerce Business Logic execution: placeOrder
   * Form validation -> placeOrder(customer) -> Order object created -> Redirect to /order-success
   *
   * Note: This is where GA4 ecommerce 'purchase' dataLayer.push will be hooked up later!
   */
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate fields
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Ensure shipping and payment info are recorded if user skips directly to Place Order
      if (!shippingSaved) {
        const shippingTier = shipping === 0 ? 'Complimentary Express Shipping' : 'Standard Delivery';
        trackAddShippingInfo(items, total, shippingTier);
        setShippingSaved(true);
      }
      if (!paymentSaved) {
        trackAddPaymentInfo(items, total, getPaymentMethodLabel(paymentMethod), shipping);
        setPaymentSaved(true);
      }

      // 2, 3, 4. Simulate processing & create typed order object
      await new Promise((resolve) => setTimeout(resolve, 800));

      const createdOrder = await placeOrder(formData);

      // 5. Navigate to /order-success passing transaction info
      navigate('/order-success', {
        state: { order: createdOrder },
      });
    } catch (err: any) {
      alert(err?.message || 'Failed to process order. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header and Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 mb-1">
            <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Secure Checkout Simulation</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-zinc-950 font-normal">
            Shipping & Payment
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrefillDemo}
            className="text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Auto-fill Demo Details</span>
          </button>
          <Link
            to="/cart"
            className="text-xs uppercase tracking-wider font-semibold text-zinc-600 hover:text-black flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </Link>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Contact & Address Section */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
            <h2 className="font-serif text-2xl text-zinc-900 border-b border-zinc-100 pb-3">
              1. Delivery Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Aarav Sharma"
                  className={`w-full px-4 py-2.5 text-sm bg-zinc-50 border rounded-xl focus:outline-none transition-colors ${
                    errors.name ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 focus:border-zinc-900 focus:bg-white'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className={`w-full px-4 py-2.5 text-sm bg-zinc-50 border rounded-xl focus:outline-none transition-colors ${
                    errors.email ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 focus:border-zinc-900 focus:bg-white'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  className={`w-full px-4 py-2.5 text-sm bg-zinc-50 border rounded-xl focus:outline-none transition-colors ${
                    errors.phone ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 focus:border-zinc-900 focus:bg-white'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Street Address & Apartment <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Flat/House no., building, street name"
                  className={`w-full px-4 py-2.5 text-sm bg-zinc-50 border rounded-xl focus:outline-none transition-colors ${
                    errors.address ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 focus:border-zinc-900 focus:bg-white'
                  }`}
                />
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Mumbai"
                  className={`w-full px-4 py-2.5 text-sm bg-zinc-50 border rounded-xl focus:outline-none transition-colors ${
                    errors.city ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 focus:border-zinc-900 focus:bg-white'
                  }`}
                />
                {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label htmlFor="state" className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="e.g. Maharashtra"
                  className={`w-full px-4 py-2.5 text-sm bg-zinc-50 border rounded-xl focus:outline-none transition-colors ${
                    errors.state ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 focus:border-zinc-900 focus:bg-white'
                  }`}
                />
                {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
              </div>

              {/* Pincode */}
              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="pincode" className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                  Postal Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="6-digit postal code"
                  className={`w-full px-4 py-2.5 text-sm bg-zinc-50 border rounded-xl focus:outline-none transition-colors ${
                    errors.pincode ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 focus:border-zinc-900 focus:bg-white'
                  }`}
                />
                {errors.pincode && <p className="text-xs text-red-500">{errors.pincode}</p>}
              </div>
            </div>

            {/* Add Shipping Info Button Action */}
            <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                id="add-shipping-info-button"
                onClick={handleSaveShippingInfo}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-black text-[#FAF9F6] text-xs uppercase tracking-wider font-semibold rounded-xl transition-all active:scale-95 shadow-sm"
              >
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span>Add Shipping Info</span>
              </button>
              {shippingSaved && (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle className="w-4 h-4" /> Shipping info recorded (EEDL)
                </span>
              )}
            </div>
          </div>

          {/* Payment Method Selector (Mock) */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl text-zinc-900 border-b border-zinc-100 pb-3">
              2. Payment Method (Simulated)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSelectPaymentMethod('card')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  paymentMethod === 'card'
                    ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-2" />
                <div className="text-xs font-bold uppercase tracking-wider">Credit / Debit Card</div>
                <div className="text-[11px] opacity-70">Visa, Mastercard, RuPay</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPaymentMethod('upi')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                }`}
              >
                <Sparkles className="w-5 h-5 mb-2" />
                <div className="text-xs font-bold uppercase tracking-wider">Instant UPI</div>
                <div className="text-[11px] opacity-70">GPay, PhonePe, Paytm</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPaymentMethod('cod')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                }`}
              >
                <Truck className="w-5 h-5 mb-2" />
                <div className="text-xs font-bold uppercase tracking-wider">Cash on Delivery</div>
                <div className="text-[11px] opacity-70">Pay upon delivery</div>
              </button>
            </div>

            {/* Add Payment Info Button Action */}
            <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                id="add-payment-info-button"
                onClick={() => handleConfirmPaymentInfo(paymentMethod)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-black text-[#FAF9F6] text-xs uppercase tracking-wider font-semibold rounded-xl transition-all active:scale-95 shadow-sm"
              >
                <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                <span>Add Payment Info</span>
              </button>
              {paymentSaved && (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle className="w-4 h-4" /> {getPaymentMethodLabel(paymentMethod)} recorded (EEDL)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6 sticky top-28">
            <h2 className="font-serif text-2xl text-zinc-950 font-normal border-b border-zinc-100 pb-3">
              Order Summary
            </h2>

            {/* Purchased Items List */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1 divide-y divide-zinc-100">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-14 rounded-lg object-cover border border-zinc-200"
                    />
                    <div>
                      <span className="font-medium text-zinc-900 block">{product.name}</span>
                      <span className="text-zinc-500">
                        {product.variant} × {quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-zinc-900">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-zinc-100 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-zinc-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span className="font-medium text-zinc-900">
                  {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="border-t border-zinc-100 pt-3 flex justify-between items-baseline">
                <span className="text-base font-semibold text-zinc-950">Total Payable</span>
                <span className="text-2xl font-bold text-zinc-950">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              id="place-order-button"
              disabled={isProcessing}
              className="w-full py-4 px-6 bg-[#121212] hover:bg-black text-[#FAF9F6] text-xs uppercase tracking-[0.2em] font-semibold rounded-xl shadow-xl transition-all active:scale-[0.98] disabled:bg-zinc-700 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Place Order • {formatCurrency(total)}</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center text-xs text-zinc-400">
              By placing this order, you simulate a successful e-commerce transaction.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
