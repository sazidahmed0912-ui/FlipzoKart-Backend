import React from 'react';

export default function ModernOrderConfirmation({
  order = {},
  customer = {},
  products = [],
  priceDetails = {},
  onContinueShopping,
  onTrackOrder,
  onDownloadInvoice,
  supportEmail = 'support@yourdomain.com',
  supportWhatsapp = '+91-XXXXXXXXXX',
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center py-8 px-2 md:px-0">
      {/* Success Message */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-10 flex flex-col items-center mb-6">
        <div className="bg-green-100 rounded-full p-4 mb-4 flex items-center justify-center">
          <span className="text-green-600 text-5xl">✔️</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2 text-center">
          🎉 Your Order Has Been Successfully Placed!
        </h1>
        <p className="text-gray-700 text-center mb-2">
          Thank you for shopping with us. Your order details are below.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-5 mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="mb-2 md:mb-0">
          <div className="text-sm text-gray-500">Order ID</div>
          <div className="font-bold text-lg">{order.id || '—'}</div>
        </div>
        <div className="mb-2 md:mb-0">
          <div className="text-sm text-gray-500">Order Date</div>
          <div className="font-semibold">{order.date || '—'}</div>
        </div>
        <div className="mb-2 md:mb-0">
          <div className="text-sm text-gray-500">Payment Method</div>
          <div className="font-semibold">{order.paymentMethod || '—'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Order Status</div>
          <div className="font-semibold text-green-600">Confirmed</div>
        </div>
      </div>

      {/* Customer & Shipping Details */}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-xl shadow-md p-5">
          <h2 className="font-bold text-blue-700 mb-2 text-lg">Customer Details</h2>
          <div className="text-gray-700 text-sm mb-1">Full Name: <span className="font-semibold">{customer.name || '—'}</span></div>
          <div className="text-gray-700 text-sm mb-1">Phone: <span className="font-semibold">{customer.phone || '—'}</span></div>
          <div className="text-gray-700 text-sm mb-1">Email: <span className="font-semibold">{customer.email || '—'}</span></div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5">
          <h2 className="font-bold text-blue-700 mb-2 text-lg">Shipping Address</h2>
          <div className="text-gray-700 text-sm mb-1">{customer.address || '—'}</div>
          <div className="text-gray-700 text-sm mb-1">City: <span className="font-semibold">{customer.city || '—'}</span></div>
          <div className="text-gray-700 text-sm mb-1">State: <span className="font-semibold">{customer.state || '—'}</span></div>
          <div className="text-gray-700 text-sm mb-1">Pincode: <span className="font-semibold">{customer.pincode || '—'}</span></div>
          <div className="text-gray-700 text-sm mb-1">Landmark: <span className="font-semibold">{customer.landmark || '—'}</span></div>
        </div>
      </div>

      {/* Product Summary */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-5 mb-4">
        <h2 className="font-bold text-blue-700 mb-4 text-lg">Product Summary</h2>
        <div className="divide-y">
          {products.map((item, idx) => (
            <div key={idx} className="flex items-center py-3">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border mr-4" />
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{item.name}</div>
                <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-800">₹{item.price}</div>
                <div className="text-sm text-gray-500">Subtotal: ₹{item.price * item.quantity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-5 mb-4">
        <h2 className="font-bold text-blue-700 mb-4 text-lg">Price Breakdown</h2>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>₹{priceDetails.subtotal || '—'}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Shipping Charges</span>
            <span>₹{priceDetails.shipping || 0}</span>
          </div>
          {priceDetails.discount ? (
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Discount</span>
              <span>-₹{priceDetails.discount}</span>
            </div>
          ) : null}
          {priceDetails.tax ? (
            <div className="flex justify-between text-gray-700">
              <span>Tax</span>
              <span>₹{priceDetails.tax}</span>
            </div>
          ) : null}
          <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2">
            <span>Total Amount Payable</span>
            <span className="text-blue-700">₹{priceDetails.total || '—'}</span>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-5 mb-4 flex items-center">
        <span className="text-blue-600 text-2xl mr-3">🚚</span>
        <span className="text-gray-800 font-semibold">Your order is expected to be delivered within 3–5 business days.</span>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row gap-3 mb-6">
        <button onClick={onContinueShopping} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition">Continue Shopping</button>
        <button onClick={onTrackOrder} className="flex-1 bg-white border border-blue-600 text-blue-700 py-3 rounded-lg font-bold shadow hover:bg-blue-50 transition">Track Order</button>
        <button onClick={onDownloadInvoice} className="flex-1 bg-white border border-blue-600 text-blue-700 py-3 rounded-lg font-bold shadow hover:bg-blue-50 transition">Download Invoice (PDF)</button>
      </div>

      {/* Support & Trust Section */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-5 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="font-semibold text-gray-800 mb-1">Need help? Contact our support team.</div>
          <div className="text-sm text-gray-600">Email: <a href={`mailto:${supportEmail}`} className="text-blue-600 underline">{supportEmail}</a></div>
          <a href={`https://wa.me/${supportWhatsapp.replace('+','')}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 bg-green-500 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-600 transition">WhatsApp Support</a>
        </div>
        <div className="flex gap-4 items-center mt-4 md:mt-0">
          <div className="flex flex-col items-center">
            <span className="text-blue-600 text-2xl">🔒</span>
            <span className="text-xs text-gray-600 mt-1">Secure Payment</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-blue-600 text-2xl">🚚</span>
            <span className="text-xs text-gray-600 mt-1">Fast Delivery</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-blue-600 text-2xl">🔄</span>
            <span className="text-xs text-gray-600 mt-1">Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
