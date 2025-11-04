import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CheckoutModal from './CheckoutModal';
import '../styles/CartDrawer.css';
import { useNavigate } from 'react-router-dom';

const posterImages = [
  require('../assets/posters/1/1-ezgif.com-video-to-webp-converter.webp'),
  require('../assets/posters/1/2-ezgif.com-video-to-webp-converter.webp'),
  require('../assets/posters/1/3-ezgif.com-video-to-webp-converter.webp'),
  require('../assets/posters/1/4-ezgif.com-video-to-webp-converter.webp'),
];

const ImageCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === posterImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <img
      src={posterImages[currentImageIndex]}
      alt="Poster"
      style={{ width: '100%', marginTop: '20px', borderRadius: '8px', objectFit: 'cover' }}
    />
  );
};

const CartDrawer = ({ open, onClose }) => {
  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const navigate = useNavigate();


  const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

  useEffect(() => {
    const updateCart = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(stored.map(item => ({ ...item, quantity: item.quantity || 1 })));
      } catch {
        setCart([]);
      }
    };
    updateCart();
    window.addEventListener('storage', updateCart);
    return () => window.removeEventListener('storage', updateCart);
  }, [open]);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const increment = (id) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(newCart);
  };

  const decrement = (id) => {
    const newCart = cart
      .map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
      .filter(item => item.quantity > 0);
    updateCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    updateCart(newCart);
  };

  const getImageUrl = (item) => {
    const img = item?.images?.[0]?.image;
    if (!img || img === 'null') return require('../assets/Default.png');
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return `${BASE_URL}${img}`;
    return `${BASE_URL}/${img}`;
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.payment_data?.original_cost || item.final_total || item.cost || 0;
    return sum + Number(price) * (item.quantity || 1);
  }, 0);

  return (
    <div className={`cart-drawer-overlay${open ? ' open' : ''}`} onClick={onClose}>
      <div className={`cart-drawer${open ? ' open' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="cart-drawer-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="mb-0">Pooja/Prasadam Selections</h5>
          <button
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              fontSize: 28,
              lineHeight: 1,
              cursor: 'pointer',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cart-drawer-body p-3" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {cart.length === 0 ? (
            <div className="text-center text-muted">You have not added any Pooja/Prasadam items.</div>
          ) : (
            cart.map(item => (
              <div className="d-flex align-items-center mb-3 border-bottom pb-2" key={item.id}>
                <img
                  src={getImageUrl(item)}
                  alt={item.name}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 8,
                    marginRight: 12
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = require('../assets/Default.png');
                  }}
                />
                <div className="flex-grow-1">
                  <div className="fw-bold mb-1">{item.name}</div>
                  <div className="small text-muted">{item.details}</div>
                  <div className="small">
                    {item.quantity} x ₹
                    {Number(item.original_cost || item.cost).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} = ₹
                    {(item.quantity * Number(item.original_cost || item.cost)).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                  <div className="d-flex align-items-center mt-1">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => decrement(item.id)}>-</button>
                    <span className="mx-2">{item.quantity}</span>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => increment(item.id)}>+</button>
                    <button className="btn btn-danger btn-sm ms-3" onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-drawer-footer p-3 border-top">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Link to="/cart" className="btn btn-outline-danger flex-fill" style={{ minWidth: 0 }} onClick={onClose}>
              Your Cart
            </Link>
            <button
              className="btn btn-danger flex-fill"
              style={{ minWidth: 0 }}
              disabled={cart.length === 0}
              onClick={() => {
                const token = localStorage.getItem('token');
                if (!token) {
                  navigate('/login?redirect=/cart&reopenCart=true');
                } else {
                  setCheckoutOpen(true);
                }
              }}
            >
              Checkout
            </button>
          </div>
          <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
          <ImageCarousel />
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
