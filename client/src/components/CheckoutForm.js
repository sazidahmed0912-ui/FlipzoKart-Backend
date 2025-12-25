import React, { useState } from 'react';

export default function CheckoutForm({ cart, cartTotal, onPlaceOrder, loading }) {
  const [shipping, setShipping] = useState({
    name: '', phone: '', address: '', city: '', state: '', pincode: '', locality: '', landmark: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shipping.name || !shipping.phone || !shipping.address || !shipping.city || !shipping.state || !shipping.pincode || !shipping.locality || !shipping.landmark) {
      alert('Please fill all shipping details');
      return;
    }
    onPlaceOrder(shipping);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Progress Bar */}
      <div className="w-full max-w-lg flex items-center mb-8 mt-6">
        <div className="flex-1 h-1 bg-blue-200 rounded-full relative">
          <div className="absolute left-0 top-0 h-1 bg-blue-600 rounded-full" style={{ width: '66%' }}></div>
        </div>
        <div className="flex justify-between w-full absolute top-0 left-0 px-1">
          <span className="text-xs text-blue-700 font-bold">Cart</span>
          <span className="text-xs text-blue-700 font-bold">Shipping</span>
          <span className="text-xs text-gray-400 font-bold">Payment</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full font-sans">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-blue-900 tracking-tight text-center">🚚 Shipping Details</h2>
        <div className="space-y-5">
          {/* Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <input id="name" type="text" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} required className="peer w-full border border-gray-300 focus:border-blue-600 rounded-lg px-4 pt-5 pb-2 bg-white outline-none transition" placeholder=" " />
              <label htmlFor="name" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:text-blue-700 peer-focus:top-0 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-base pointer-events-none bg-white px-1">Full Name</label>
            </div>
            <div className="relative">
              <input id="phone" type="tel" value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} required className="peer w-full border border-gray-300 focus:border-blue-600 rounded-lg px-4 pt-5 pb-2 bg-white outline-none transition" placeholder=" " />
              <label htmlFor="phone" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:text-blue-700 peer-focus:top-0 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-base pointer-events-none bg-white px-1">Phone Number</label>
            </div>
          </div>
          {/* Address */}
          <div className="relative">
            <input id="address" type="text" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} required className="peer w-full border border-gray-300 focus:border-blue-600 rounded-lg px-4 pt-5 pb-2 bg-white outline-none transition" placeholder=" " />
            <label htmlFor="address" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:text-blue-700 peer-focus:top-0 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-base pointer-events-none bg-white px-1">Complete Address</label>
          </div>
          {/* City, State, Pincode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <input id="city" type="text" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} required className="peer w-full border border-gray-300 focus:border-blue-600 rounded-lg px-4 pt-5 pb-2 bg-white outline-none transition" placeholder=" " />
              <label htmlFor="city" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:text-blue-700 peer-focus:top-0 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-base pointer-events-none bg-white px-1">City</label>
            </div>
            <div className="relative">
              <input id="pincode" type="text" value={shipping.pincode} onChange={e => setShipping({ ...shipping, pincode: e.target.value })} required className="peer w-full border border-gray-300 focus:border-blue-600 rounded-lg px-4 pt-5 pb-2 bg-white outline-none transition" placeholder=" " />
              <label htmlFor="pincode" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:text-blue-700 peer-focus:top-0 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-base pointer-events-none bg-white px-1">Pincode</label>
            </div>
          </div>
          {/* State, Locality, Landmark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <input id="state" type="text" value={shipping.state} onChange={e => setShipping({ ...shipping, state: e.target.value })} required className="peer w-full border border-gray-300 focus:border-blue-600 rounded-lg px-4 pt-5 pb-2 bg-white outline-none transition" placeholder=" " />
              <label htmlFor="state" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:text-blue-700 peer-focus:top-0 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-base pointer-events-none bg-white px-1">State</label>
            </div>
            <div className="relative">
              <input id="locality" type="text" value={shipping.locality} onChange={e => setShipping({ ...shipping, locality: e.target.value })} required className="peer w-full border border-gray-300 focus:border-blue-600 rounded-lg px-4 pt-5 pb-2 bg-white outline-none transition" placeholder=" " />
              <label htmlFor="locality" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:text-blue-700 peer-focus:top-0 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-base pointer-events-none bg-white px-1">Locality</label>
            </div>
          </div>
          <div className="relative">
            <input id="landmark" type="text" value={shipping.landmark} onChange={e => setShipping({ ...shipping, landmark: e.target.value })} required className="peer w-full border border-gray-300 focus:border-blue-600 rounded-lg px-4 pt-5 pb-2 bg-white outline-none transition" placeholder=" " />
            <label htmlFor="landmark" className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-focus:text-blue-700 peer-focus:top-0 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-base pointer-events-none bg-white px-1">Landmark</label>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-end mt-8">
          <button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg shadow transition disabled:bg-gray-400">
            {loading ? '⏳ Placing Order...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}
