import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { 
  FaStar, 
  FaShareAlt, 
  FaWhatsapp, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLink 
} from "react-icons/fa";
import ReviewsPopup from './ReviewsPopup';
import '../styles/PujaDetails.css';

const PujaDetails = () => {
  const { id } = useParams();
  const [puja, setPuja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [imageError, setImageError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const shareRef = useRef(null);

  useEffect(() => {
    const fetchPujaDetails = async () => {
      try {
        const response = await api.get(`/api/v1/devotee/pooja/${id}`);
        setPuja(response.data);
      } catch (err) {
        setError('❌ Failed to load puja details. Please try again later.');
        console.error('Error fetching puja:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPujaDetails();
  }, [id]);

  // Close share popup on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setShowShare(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rawImage =
    puja?.image ||
    (puja?.images?.length > 0 && puja.images[0]?.image) ||
    puja?.god?.image ||
    puja?.temple?.images?.[0]?.image;

  const imageUrl =
    !imageError && rawImage
      ? rawImage
      : 'https://via.placeholder.com/600x400?text=Image+Not+Available';

  const handleParticipate = () => {
    if (!puja || addingToCart) return;

    setAddingToCart(true);
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

      const originalCost = Number(puja.original_cost || puja.cost || 0);
      const convenienceFee = Number(puja.convenience_fee || 0);
      const bookingCharges = Number(puja.booking_charges || 0);
      const taxAmount = Number(puja.tax_amount || 0);
      const finalTotal =
        puja.final_total ||
        originalCost + convenienceFee + bookingCharges + taxAmount;

      const cartItem = {
        id: puja.id,
        name: puja.name,
        details: puja.details || 'Puja participation',
        cost: originalCost,
        final_total: finalTotal,
        original_cost: originalCost,
        convenience_fee: convenienceFee,
        booking_charges: bookingCharges,
        tax_amount: taxAmount,
        quantity: 1,
        images: puja.images || [],
        prasad_delivery: puja.prasad_delivery || false,
        payment_data: {
          original_cost: originalCost,
          final_total: finalTotal,
          convenience_fee: convenienceFee,
          booking_charges: bookingCharges,
          tax_amount: taxAmount,
          delivery_charge: Number(puja.delivery_charge || 0),
          fee_amount: Number(puja.fee_amount || 0),
        },
      };

      const existingItemIndex = existingCart.findIndex(
        (item) => item.id === puja.id
      );

      if (existingItemIndex >= 0) {
        existingCart[existingItemIndex].quantity += 1;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('open-cart-drawer'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const shareText = `Check out this puja: ${puja?.name || ''}`;
  const shareUrl = window.location.href;

  if (loading) return <div className="loading">Loading Puja Details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!puja) return <div>No puja found</div>;

  return (
    <div className="puja-details-container">
      <div className="puja-flex-wrapper">
        <div className="puja-image-box">
          <img
            src={imageUrl}
            alt={puja.name}
            className="puja-main-image"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>

        <div className="puja-text-box">
          <div className="puja-title-share">
            <h2 className="puja-title">{puja.name}</h2>

            <div className="puja-share-wrapper" ref={shareRef}>
              <FaShareAlt
                className="share-icon"
                onClick={() => setShowShare(!showShare)}
                style={{ cursor: 'pointer' }}
              />

              {showShare && (
                <div className="puja-share-options">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp /> WhatsApp
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook /> Facebook
                  </a>
                  <a
                    href={`https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram /> Instagram
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter /> Twitter
                  </a>
                  <button
                    className="copy-link-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      alert('Link copied to clipboard!');
                    }}
                  >
                    <FaLink /> Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>

          <p><strong>Temple:</strong> {puja.temple?.name || 'N/A'}</p>
          <p><strong>God:</strong> {puja.god?.name || 'N/A'}</p>
          <p><strong>Included:</strong> {puja.included || 'N/A'}</p>
          <p><strong>Benefits:</strong> {puja.excluded || 'N/A'}</p>

          <div className="price-rating-row">
            <p className="puja-price">
              <strong>Price:</strong>{' '}
              ₹
              {Number(puja.original_cost || puja.cost || 0).toLocaleString(
                'en-IN',
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </p>

            <div className="rating" onClick={() => setShowReviews(true)} style={{ cursor: 'pointer' }}>
              <FaStar className="star" /> 4.7 (100+ ratings)
            </div>
          </div>

          <div className="participate-button-wrapper">
            <button
              className="participate-btn"
              onClick={handleParticipate}
              disabled={addingToCart}
            >
              {addingToCart ? 'ADDING...' : 'PARTICIPATE'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-nav">
        <button
          className={activeTab === 'about' ? 'active' : ''}
          onClick={() => setActiveTab('about')}
        >
          About Puja
        </button>
        <button
          className={activeTab === 'benefits' ? 'active' : ''}
          onClick={() => setActiveTab('benefits')}
        >
          Benefits
        </button>
        <button
          className={activeTab === 'temple' ? 'active' : ''}
          onClick={() => setActiveTab('temple')}
        >
          Temple Details
        </button>
        <button
          className={activeTab === 'packages' ? 'active' : ''}
          onClick={() => setActiveTab('packages')}
        >
          Packages
        </button>
      </div>

      <div className="tab-content-pd">
        {activeTab === 'about' && (
          <div>
            <h3>About Puja</h3>
            <p>{puja.details || 'Information coming soon.'}</p>
          </div>
        )}
        {activeTab === 'benefits' && (
          <div>
            <h3>Benefits</h3>
            <p>
              {puja.benefits ||
                'This puja is beneficial for spiritual harmony and inner peace.'}
            </p>
          </div>
        )}
        {activeTab === 'temple' && (
          <div>
            <h3>Temple Details</h3>
            <p>
              {puja.temple_details ||
                'This puja is conducted at a sacred temple location.'}
            </p>
          </div>
        )}
        {activeTab === 'packages' && (
          <div className="packages-content">
            <p>{puja.packages || 'Coming Soon.'}</p>
          </div>
        )}
      </div>

      {/* Reviews Popup */}
      {showReviews && (
        <ReviewsPopup puja={puja} closePopup={() => setShowReviews(false)} />
      )}
    </div>
  );
};

export default PujaDetails;
