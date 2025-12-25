import React from 'react';

/**
 * OrderSuccessPage Component
 * Props:
 * - customerDetails: { name, phone, email }
 * - shippingAddress: { address, city, state, pincode, locality, landmark }
 * - orderInfo: { id, date, paymentStatus, orderStatus }
 */
export default function OrderSuccessPage({ customerDetails, shippingAddress, orderInfo }) {
  const isLoading = !customerDetails || !shippingAddress || !orderInfo;
  const fullAddress = shippingAddress
    ? `${shippingAddress.address}, ${shippingAddress.locality}, ${shippingAddress.landmark}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`
    : '';

  return (
    <div className="min-h-screen bg-mint-50 flex flex-col items-center justify-center font-inter p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-100 rounded-full p-4 mb-3">
            <svg className="h-14 w-14 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="12" fill="#d1fae5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l3 3 5-5" stroke="#22c55e" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-1">Order Successful</h1>
          <p className="text-gray-600 text-lg">Thank you for your purchase!</p>
        </div>

        {/* Order Info Bar */}
        <div className="flex flex-wrap justify-between items-center bg-gray-100 rounded-xl px-6 py-4 mb-8 text-sm font-medium text-gray-700 shadow-sm">
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              <div className="mb-2 sm:mb-0"><span className="font-semibold">Order ID:</span> {orderInfo.id}</div>
              <div className="mb-2 sm:mb-0"><span className="font-semibold">Date:</span> {orderInfo.date}</div>
              <div className="mb-2 sm:mb-0"><span className="font-semibold">Payment:</span> <span className="text-green-600">{orderInfo.paymentStatus}</span></div>
              <div><span className="font-semibold">Status:</span> <span className="text-blue-600">{orderInfo.orderStatus}</span></div>
            </>
          )}
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Customer Info Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-700">Customer Information</h2>
            {isLoading ? (
              <div className="text-gray-400">Loading...</div>
            ) : (
              <ul className="space-y-2">
                <li><span className="font-semibold">Name:</span> {customerDetails.name}</li>
                <li><span className="font-semibold">Phone:</span> {customerDetails.phone}</li>
                <li><span className="font-semibold">Email:</span> {customerDetails.email}</li>
              </ul>
            )}
          </div>
          {/* Shipping Address Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-700">Shipping Address</h2>
            {isLoading ? (
              <div className="text-gray-400">Loading...</div>
            ) : (
              <div className="text-gray-700 whitespace-pre-line">{fullAddress}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Example usage (for development/demo):
// <OrderSuccessPage
//   customerDetails={{ name: 'Amit Sharma', phone: '9876543210', email: 'amit.sharma@email.com' }}
//   shippingAddress={{ address: '123, Main Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', locality: 'Andheri', landmark: 'Near Metro Station' }}
//   orderInfo={{ id: 'ORD123456', date: '25 Dec 2025, 10:30 AM', paymentStatus: 'Paid', orderStatus: 'Confirmed' }}
// />
