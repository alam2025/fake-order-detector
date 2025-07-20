import React, { useState } from 'react';
import { Package, User, Phone, MapPin, CreditCard, AlertCircle } from 'lucide-react';

interface OrderFormProps {
  onSubmit: (data: {
    customerName: string;
    phoneNumber: string;
    address: string;
    paymentMethod: 'COD' | 'Prepaid';
  }) => void;
  isLoading?: boolean;
}

export function OrderForm({ onSubmit, isLoading = false }: OrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    address: '',
    paymentMethod: 'COD' as 'COD' | 'Prepaid'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'customerName':
        if (!value.trim()) return 'Customer name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
        return '';
      
      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required';
        if (!/^\d{10}$/.test(value.replace(/\s/g, ''))) return 'Please enter a valid 10-digit phone number';
        return '';
      
      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 10) return 'Please provide a complete address (minimum 10 characters)';
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'paymentMethod') {
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      customerName: true,
      phoneNumber: true,
      address: true,
      paymentMethod: true
    });

    if (Object.values(newErrors).every(error => !error)) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Name */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              onBlur={() => handleBlur('customerName')}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.customerName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter customer name"
            />
          </div>
          {errors.customerName && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.customerName}
            </div>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              onBlur={() => handleBlur('phoneNumber')}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter 10-digit phone number"
            />
          </div>
          {errors.phoneNumber && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.phoneNumber}
            </div>
          )}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="address"
              rows={3}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter complete delivery address"
            />
          </div>
          {errors.address && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.address}
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                formData.paymentMethod === 'COD' 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => handleInputChange('paymentMethod', 'COD')}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={() => handleInputChange('paymentMethod', 'COD')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <CreditCard className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900">Cash on Delivery</span>
              </div>
            </div>
            <div
              className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                formData.paymentMethod === 'Prepaid' 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => handleInputChange('paymentMethod', 'Prepaid')}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={formData.paymentMethod === 'Prepaid'}
                  onChange={() => handleInputChange('paymentMethod', 'Prepaid')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <CreditCard className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900">Prepaid</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg font-medium text-white transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Analyzing...
            </>
          ) : (
            'Analyze Order'
          )}
        </button>
      </form>
    </div>
  );
}