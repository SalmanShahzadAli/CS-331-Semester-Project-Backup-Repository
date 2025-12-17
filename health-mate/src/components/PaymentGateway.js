import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { subscriptionApi } from '../utils/adminApi';

export default function PaymentGateway({ plan, onClose, onSuccess }) {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse amount - remove $ and convert to number
      const amount = parseFloat(String(plan.price).replace('$', ''));
      
      // Call subscription API to create subscription
      const response = await subscriptionApi.createSubscription(
        plan.name,
        amount,
        cardName,
        cardNumber,
        expiryDate,
        cvv
      );

      if (response.success) {
        setSuccess(true);
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
          onClose();
        }, 2000);
      } else {
        alert('Payment failed: ' + response.message);
      }
    } catch (error) {
      alert('Error processing payment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '1rem',
  };

  const contentStyle = {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
    borderRadius: '1.5rem',
    width: '100%',
    maxWidth: '500px',
    padding: '2rem',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    color: '#fff',
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        {success ? (
          // Success Screen
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <Check size={48} color="#fff" />
            </div>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>Payment Successful!</h2>
            <p style={{ margin: '0 0 1.5rem 0', opacity: 0.8 }}>
              Your {plan.name} subscription is now active
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>
              Redirecting to dashboard...
            </p>
          </div>
        ) : (
          // Payment Form
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Complete Payment</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(102, 126, 234, 0.2)', borderRadius: '0.75rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', opacity: 0.7 }}>Plan Selected:</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{plan.name}</h3>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.25rem' }}>
                ${plan.price} <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>/month</span>
              </p>
            </div>

            <form onSubmit={handlePayment}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      color: '#fff',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0.5rem',
                      color: '#fff',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.3s'
                }}>
                {loading ? 'Processing...' : 'Complete Payment'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}