import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../styles/EventDetails.css';
import CartDrawer from '../components/CartDrawer';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://beta.devalayas.com';

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/api/v1/devotee/event/?search=${id}`);
        const eventData = response.data?.results?.[0];
        if (eventData) {
          setEvent(eventData);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const handleParticipate = () => {
    if (!event || !event.pooja) {
      alert('No pooja found to participate in!');
      return;
    }

    const {
      id: poojaId,
      name,
      original_cost,
      included,
      convenience_fee,
      tax_amount,
    } = event.pooja;

    const cost = parseFloat(original_cost);
    const convenience = parseFloat(convenience_fee);
    const tax = parseFloat(tax_amount);

    const safeCost = isNaN(cost) ? 0 : cost;
    const safeConvenience = isNaN(convenience) ? 0 : convenience;
    const safeTax = isNaN(tax) ? 0 : tax;

    const total = safeCost + safeConvenience + safeTax;

    const poojaItem = {
      id: poojaId,
      name,
      original_cost: safeCost,
      cost: safeCost,
      final_total: total,
      included,
      temple: event.temple.id,
      quantity: 1,
      payment_data: {
        original_cost: safeCost,
        convenience_fee: safeConvenience,
        tax_amount: safeTax,
        total,
      },
    };

    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      cart = [];
    }

    const alreadyInCart = cart.some((c) => c.id === poojaId);
    if (!alreadyInCart) {
      cart.push(poojaItem);
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
    }

    setCartDrawerOpen(true);
  };

  const getImageUrl = (event) => {
    if (event.image) {
      return event.image;
    }
    if (event.temple?.images && event.temple.images.length > 0) {
      const imagePath = event.temple.images[0].image;
      return imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
    }
    return 'https://via.placeholder.com/1200x400?text=Event+Image';
  };

  const handleGoBack = () => {
    navigate('/events');
  };

  if (loading) {
    return (
      <div className="event-details-container">
        <div className="loading-skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-details-container">
        <div className="error-message">
          <h2>Event Not Found</h2>
          <p>{error || 'The requested event could not be found.'}</p>
          <button onClick={handleGoBack} className="back-button">Back to Events</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="event-details-container">
        <div className="event-banner" style={{ backgroundImage: `url(${getImageUrl(event)})` }}>
          <video src={`${getImageUrl(event)}`} autoPlay loop muted playsInline style={{
            width: '100%',
            maxHeight: '350px',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          }}></video>
        </div>

        <div className="event-details-card">
          <div className="event-content-section">
            <div className="event-header">
              <h1 className="event-title">{event.name}</h1>
              <div className="temple-info-header"><span className="info-label"><strong>Temple: </strong></span><span className="temple-info-header">{event.temple.name}</span></div>
            </div>

            <div className="event-details-body">
              <div className="event-info-main">
                <div className="info-section">
                 
                  <span className="info-value"><strong>About: </strong>{event.details}</span>
                </div>

                

                {event.pooja?.included && (
                  <div className="info-section">
                    <span className="info-value"><strong>Include: </strong>{event.pooja.included}</span>
                  </div>
                )}

                {event.pooja?.excluded && (
                  <div className="info-section">
                    <span className="info-value"><strong>Benefits: </strong>{event.pooja.excluded}</span>
                  </div>
                )}
              </div>

              {event.pooja && (
                <div className="event-actions-section">
                  <div className="cost-info">
                    <span className="info-label">Cost:</span>
                    {event.pooja.original_cost ? ( // Use original_cost for display
                      <span className="cost-value">₹{event.pooja.original_cost}</span>
                    ) : (
                      null
                    )}
                  </div>
                  {!event.is_expired ? (
                    <button onClick={handleParticipate} className="participate-button">
                      Participate in Event
                    </button>
                  ) : <div className="expired-message">Event Expired</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
};

export default EventDetails;