import React from 'react';

function OrderConfirmationTemplate({
  brandName = "[Brand Name]",
  customerName = "[Customer Name]",
  orderNumber = "[Order Number]",
  orderDate = "[Date & Time]",
  paymentMethod = "[COD / UPI / Card / Net Banking]",
  paymentStatus = "[Paid / Cash on Delivery]",
  productName = "[Product Name]",
  quantity = "[Qty]",
  amount = "[Amount]",
  shippingAddress = "[Full Address]",
  deliveryDate = "[Delivery Date Range]",
  supportEmail = "support@[yourdomain].com",
  supportPhone = "+91-XXXXXXXXXX",
  supportHours = "[Timing]",
  websiteUrl = "[Website URL]"
}) {
  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#f7f7f7', padding: 32, maxWidth: 600, margin: '0 auto', borderRadius: 8, boxShadow: '0 2px 8px #e0e0e0' }}>
      <h2 style={{ color: '#1a202c', fontWeight: 700, fontSize: 24, marginBottom: 8 }}>Order Confirmed – Thank You for Shopping with {brandName}</h2>
      <hr style={{ margin: '16px 0' }} />
      <p style={{ fontSize: 16, color: '#222', marginBottom: 16 }}>Hello {customerName},</p>
      <p style={{ fontSize: 16, color: '#222', marginBottom: 24 }}>
        Thank you for placing your order with {brandName}.<br />
        We’re pleased to confirm that your order has been successfully received.
      </p>

      <h3 style={{ color: '#2d3748', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Order Summary</h3>
      <ul style={{ marginBottom: 24, paddingLeft: 20 }}>
        <li><strong>Order ID:</strong> #{orderNumber}</li>
        <li><strong>Order Date:</strong> {orderDate}</li>
        <li><strong>Payment Method:</strong> {paymentMethod}</li>
        <li><strong>Payment Status:</strong> {paymentStatus}</li>
      </ul>

      <h3 style={{ color: '#2d3748', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Product Details</h3>
      <ul style={{ marginBottom: 24, paddingLeft: 20 }}>
        <li><strong>Product Name:</strong> {productName}</li>
        <li><strong>Quantity:</strong> {quantity}</li>
        <li><strong>Price:</strong> ₹{amount}</li>
      </ul>

      <h3 style={{ color: '#2d3748', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Delivery Information</h3>
      <ul style={{ marginBottom: 24, paddingLeft: 20 }}>
        <li><strong>Shipping Address:</strong><br />{shippingAddress}</li>
        <li><strong>Estimated Delivery:</strong> {deliveryDate}</li>
      </ul>
      <p style={{ color: '#444', marginBottom: 24 }}>You will receive a notification once your order is shipped.</p>

      <h3 style={{ color: '#2d3748', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>What Happens Next?</h3>
      <ul style={{ marginBottom: 24, paddingLeft: 20 }}>
        <li>Order verification and processing</li>
        <li>Dispatch from our warehouse</li>
        <li>Delivery to your doorstep</li>
      </ul>

      <h3 style={{ color: '#2d3748', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Need Help?</h3>
      <ul style={{ marginBottom: 24, paddingLeft: 20 }}>
        <li><strong>Email:</strong> {supportEmail}</li>
        <li><strong>WhatsApp/Phone:</strong> {supportPhone}</li>
        <li><strong>Support Hours:</strong> {supportHours}</li>
      </ul>

      <h3 style={{ color: '#2d3748', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Thank You</h3>
      <p style={{ color: '#222', marginBottom: 8 }}>We appreciate your trust in {brandName} and look forward to serving you again.</p>
      <p style={{ color: '#222', marginBottom: 0 }}>Warm regards,<br />Team {brandName}</p>
      <div style={{ marginTop: 24, color: '#3182ce', fontWeight: 600 }}>
        <a href={websiteUrl} style={{ color: '#3182ce', textDecoration: 'none' }}>{websiteUrl}</a>
      </div>
    </div>
  );
}

export default OrderConfirmationTemplate;