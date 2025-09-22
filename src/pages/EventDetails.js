import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../styles/EventDetails.css';
import OtpLoginModal from '../components/OtpLoginModal';
import { useUserAuth } from "../context/UserAuthContext";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const [profile, setProfile] = useState(null);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [poojas, setPoojas] = useState([]);
  const [selectedPooja, setSelectedPooja] = useState(null);

  const [showCheckout, setShowCheckout] = useState(false);
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [address, setAddress] = useState({
    bookingDate: "",
    devoteeName: "",
    devoteeMobile: "",
    sankalpa: "",
    nakshatra: "",
    gotraKulaRashi: "",
    street1: "",
    street2: "",
    area: "",
    city: "",
    state: "",
    district: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [charges, setCharges] = useState({
    subtotal: 0,
    convenienceFee: 5.0,
    shipping: 0,
    gst: 0,
    total: 0,
  });

  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://beta.devalayas.com';

  useEffect(() => {
    const storedProfile = localStorage.getItem("devoteeProfile");
    if (storedProfile && storedProfile !== 'undefined') {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch (e) {
        console.error("Failed to parse devoteeProfile", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/api/v1/devotee/event/?search=${id}`);
        const eventData = response.data?.results?.[0];
        if (eventData) {
          setEvent(eventData);
          fetchPoojas(eventData.temple.id);
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

    const fetchPoojas = async (templeId) => {
      try {
        const response = await api.get(`/api/v1/devotee/pooja/?temple=${templeId}`);
        setPoojas(response.data?.results || []);
      } catch (err) {
        console.error('API Error fetching poojas:', err);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const handleParticipate = (pooja) => {
    if (!user) {
        setSelectedPooja(pooja);
        setShowOtpLogin(true);
    } else {
      setSelectedPooja(pooja);
      setShowCheckout(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowOtpLogin(false);
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!address.bookingDate) newErrors.bookingDate = "Required";
    if (!address.devoteeName) newErrors.devoteeName = "Required";
    if (!address.devoteeMobile || !/^\d{10}$/.test(address.devoteeMobile))
      newErrors.devoteeMobile = "Valid 10-digit mobile";
    if (!address.street1) newErrors.street1 = "Required";
    if (!address.area) newErrors.area = "Required";
    if (!address.city) newErrors.city = "Required";
    if (!address.state) newErrors.state = "Required";
    if (!address.district) newErrors.district = "Required";
    if (!address.pincode || !/^\d{6}$/.test(address.pincode))
      newErrors.pincode = "6-digit pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const comment = `( event day :${event.name || ''} )( Nakshatra :${address.nakshatra || ''})( Gotra, Kula & Rashi :${address.gotraKulaRashi || ''} )`;

      const payload = {
        requests: [
          {
            
            is_prasadam_delivery: true,
            pooja: selectedPooja.id,
            temple: event.temple.id,
            pooja_date: address.bookingDate,
            name: address.devoteeName || profile?.name || profile?.firstName || 'Devotee',
            devotee_number: `+91${address.devoteeMobile || profile?.phone || ''}`,
            sankalpa: address.sankalpa || '',
            comment: comment,
            family_member: [
              {
                id: (profile && profile.id) ? profile.id : 1,
                name: address.devoteeName || profile?.name || profile?.firstName || 'Devotee',
                nakshatra: address.nakshatra || '',
              },
            ],
            booked_by: 'CSC',
            prasadam_address: {
              name: address.devoteeName || profile?.name || 'Devotee',
              street_address_1: address.street1 || '',
              street_address_2: address.street2 || '',
              area: address.area || '',
              city: address.city || '',
              state: address.state || '',
              district: address.district || '',
              pincode: parseInt(address.pincode, 10) || 0,
              phone_number: address.devoteeMobile || profile?.phone || '',
            },
            billing_address: {
              name: address.devoteeName || profile?.name || 'Devotee',
              street_address_1: address.street1 || '',
              street_address_2: address.street2 || '',
              area: address.area || '',
              city: address.city || '',
              state: address.state || '',
              district: address.district || '',
              pincode: parseInt(address.pincode, 10) || 0,
              phone_number: address.devoteeMobile || profile?.phone || '',
            },
          },
        ],
      };

      console.log("Payload sent to backend:", payload);

      const response = await api.post("/api/v1/devotee/bulk_pooja_request/", payload);
      const order = Array.isArray(response.data) ? response.data[0] : response.data;

      setOrderDetails(order);
      setShowConfirmation(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Order creation failed:", err);
      const message = err.response?.data?.detail || "Something went wrong";
      alert(`Failed: ${message}`);
    }
  };

  const initiatePayment = async (order) => {
    setLoading(true);
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Payment gateway failed to load.");
      setLoading(false);
      return;
    }

    let rzpKey;
    try {
      const response = await api.get("/api/v1/devotee/payment_key/");
      rzpKey = response.data.key;
    } catch (err) {
      console.error("Failed to load Razorpay key:", err);
      alert("Payment gateway not available.");
      setLoading(false);
      return;
    }

    if (!rzpKey) {
      setLoading(false);
      return;
    };

    const { payment_order_id: orderId, payment_data } = order;
    const amount = Math.round((payment_data?.final_total || charges.total) * 100);

    const options = {
      key: rzpKey,
      amount,
      currency: "INR",
      name: "Devalaya",
      description: `${selectedPooja.name} - Pooja Booking`,
      image: "https://devalaya-bucket.s3.amazonaws.com/logo_512x512.png",
      order_id: orderId,
      handler: async (rz_response) => {
        try {
          const payload = {
            request_id: order.order_id,
            razorpay_response: {
              razorpay_order_id: rz_response.razorpay_order_id,
              razorpay_payment_id: rz_response.razorpay_payment_id,
              razorpay_signature: rz_response.razorpay_signature,
            },
          };

          const verificationResponse = await api.post(
            "/api/v1/devotee/pooja_request/payment/",
            payload
          );

          if (verificationResponse.data.success) {
            const orderDetailsResponse = await api.get(
              `/api/v1/devotee/pooja_request/list/?search=${order.order_id}`
            );

            handleCloseCheckout();
            navigate(
              `/payment-success?payment_id=${rz_response.razorpay_payment_id}&order_id=${order.order_id}&status=success`,
              { state: { orderDetails: orderDetailsResponse.data } }
            );
          } else {
            const message =
              verificationResponse.data.message || "Payment verification failed";
            navigate(
              `/payment-success?payment_id=${rz_response.razorpay_payment_id}&order_id=${order.order_id}&status=failed&error=${encodeURIComponent(message)}`
            );
          }
        } catch (err) {
          console.error("placeOrder error:", err);
          handleCloseCheckout();
          const errorMessage =
            err.response?.data?.detail || err.message || "Unknown error";
          navigate(
            `/payment-success?payment_id=${rz_response.razorpay_payment_id || ""}&order_id=${order.order_id}&status=failed&error=${encodeURIComponent(errorMessage)}`
          );
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: address.devoteeName,
        email: "",
        contact: `+91${address.devoteeMobile}`,
      },
      theme: { color: "#e57373" },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      alert(`Payment failed: ${response.error.description}`);
      setLoading(false);
    });
    rzp.open();
  };

  const getMediaUrl = (event) => {
    if (event.video) {
      return event.video;
    }
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
        {event.video ? (
          <div className="event-banner">
            <video src={getMediaUrl(event)} autoPlay loop muted playsInline style={{
              width: '100%',
              maxHeight: '350px',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: 16,
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            }}></video>
          </div>
        ) : (
          <div className="event-banner" style={{ backgroundImage: `url(${getMediaUrl(event)})` }}>
            {/* No video, so just the background image */}
          </div>
        )}

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

              {/* {event.pooja && (
                <div className="event-actions-section">
                  <div className="cost-info">
                    <span className="info-label">Cost:</span>
                    {event.pooja.original_cost ? (
                      <span className="cost-value">₹{event.pooja.original_cost}</span>
                    ) : (
                      null
                    )}
                  </div>
                  {!event.is_expired ? (
                    <button onClick={() => handleParticipate(event.pooja)} className="participate-button">
                      Participate in Event
                    </button>
                  ) : <div className="expired-message">Event Expired</div>}
                </div>
              )} */}
            </div>

            <h2 className="packages-title">Select Packages</h2>
            <div className="packages-container">
              {poojas.slice(0, 3).map((pooja) => (
                <div className="package-card" key={pooja.id}>
                  <h3>{pooja.name}</h3>
                  <p className="price">₹{pooja.original_cost}</p>
                  <button onClick={() => handleParticipate(pooja)} className="select-button">Book Now</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showOtpLogin && (
        <OtpLoginModal 
            onClose={() => setShowOtpLogin(false)} 
            onLoginSuccess={handleLoginSuccess} 
        />
      )}

      {showCheckout && (
        <div className="chadhava-checkout-overlay" onClick={handleCloseCheckout}>
          <div
            className="chadhava-checkout-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="chadhava-checkout-header">
              <h3>Complete Your Booking</h3>
              <button className="close-btn" onClick={handleCloseCheckout}>
                ✕
              </button>
            </div>

            <div className="chadhava-checkout-body">
              <div className="checkout-form">
                <form onSubmit={handleSubmit}>
                  <div className="form-scrollable-area">
                    <div className="form-group">
                      <label>Booking Date <span className="required-star">*</span></label>
                      <input
                        type="date"
                        name="bookingDate"
                        value={address.bookingDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                      {errors.bookingDate && (
                        <span className="error">{errors.bookingDate}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Devotee Name <span className="required-star">*</span></label>
                      <input
                        type="text"
                        name="devoteeName"
                        value={address.devoteeName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                      />
                      {errors.devoteeName && (
                        <span className="error">{errors.devoteeName}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Mobile Number <span className="required-star">*</span></label>
                      <input
                        type="tel"
                        name="devoteeMobile"
                        value={address.devoteeMobile}
                        onChange={handleInputChange}
                        placeholder="10-digit number"
                        maxLength={10}
                      />
                      {errors.devoteeMobile && (
                        <span className="error">{errors.devoteeMobile}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Sankalpa </label>
                      <input
                        type="text"
                        name="sankalpa"
                        value={address.sankalpa}
                        onChange={handleInputChange}
                        placeholder="e.g., For health and prosperity"
                      />
                      {errors.sankalpa && (
                        <span className="error">{errors.sankalpa}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Nakshatra </label>
                      <input
                        type="text"
                        name="nakshatra"
                        value={address.nakshatra}
                        onChange={handleInputChange}
                        placeholder="e.g., Rohini, Mrigashira"
                      />
                      {errors.nakshatra && (
                        <span className="error">{errors.nakshatra}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Gotra, Kula & Rashi </label>
                      <input
                        type="text"
                        name="gotraKulaRashi"
                        value={address.gotraKulaRashi}
                        onChange={handleInputChange}
                        placeholder="e.g., Kashyapa, Bhargava, Vrishabha"
                      />
                      {errors.gotraKulaRashi && (
                        <span className="error">{errors.gotraKulaRashi}</span>
                      )}
                    </div>

                    <h5 style={{ marginTop: "16px" }}>
                      Prasadam Delivery Address
                    </h5>

                    <div className="form-group">
                      <label>Street Address 1 <span className="required-star">*</span></label>
                      <input
                        type="text"
                        name="street1"
                        value={address.street1}
                        onChange={handleInputChange}
                        placeholder="House, Street"
                      />
                      {errors.street1 && (
                        <span className="error">{errors.street1}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Street Address 2 (Optional)</label>
                      <input
                        type="text"
                        name="street2"
                        onChange={handleInputChange}
                        placeholder="Apartment, floor"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group half">
                        <label>Area <span className="required-star">*</span></label>
                        <input
                          type="text"
                          name="area"
                          value={address.area}
                          onChange={handleInputChange}
                        />
                        {errors.area && (
                          <span className="error">{errors.area}</span>
                        )}
                      </div>
                      <div className="form-group half">
                        <label>Pincode <span className="required-star">*</span></label>
                        <input
                          type="text"
                          name="pincode"
                          value={address.pincode}
                          onChange={handleInputChange}
                          maxLength={6}
                        />
                        {errors.pincode && (
                          <span className="error">{errors.pincode}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group half">
                        <label>City <span className="required-star">*</span></label>
                        <input
                          type="text"
                          name="city"
                          value={address.city}
                          onChange={handleInputChange}
                        />
                        {errors.city && (
                          <span className="error">{errors.city}</span>
                        )}
                      </div>
                      <div className="form-group half">
                        <label>District <span className="required-star">*</span></label>
                        <input
                          type="text"
                          name="district"
                          value={address.district}
                          onChange={handleInputChange}
                        />
                        {errors.district && (
                          <span className="error">{errors.district}</span>
                        )}
                      </div>
                      <div className="form-group half">
                        <label>State <span className="required-star">*</span></label>
                        <input
                          type="text"
                          name="state"
                          value={address.state}
                          onChange={handleInputChange}
                        />
                        {errors.state && (
                          <span className="error">{errors.state}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="pay-btn" disabled={loading}>
                    {loading
                      ? "Processing..."
                      : `Save address and Proceed to payment`}
                  </button>
                </form>
              </div>
              <div className="checkout-summary">
                <div className="chadhava-item-summary">
                  <h4>Selected Pooja</h4>
                  {selectedPooja && (
                    <p>
                      {selectedPooja.name} @ ₹{selectedPooja.original_cost}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && orderDetails && (
        <div className="chadhava-checkout-overlay">
          <div className="chadhava-checkout-modal">
            <div className="chadhava-checkout-header">
              <h3>Confirm Your Order</h3>
              <button className="close-btn" onClick={() => setShowConfirmation(false)}>
                ✕
              </button>
            </div>
            <div className="chadhava-checkout-body confirmation-body">
              <div className="confirmation-address">
                <h4>Delivery Address</h4>
                <p>{address.devoteeName}</p>
                <p>{address.street1}</p>
                {address.street2 && <p>{address.street2}</p>}
                <p>{address.area}, {address.city}, {address.state} - {address.pincode}</p>
                <p>Mobile: {address.devoteeMobile}</p>
              </div>
              <div className="price-summary-container">
                <div className="price-summary">
                  <h4>Price Details</h4>
                  <div className="price-row">
                    <span>Pooja Cost</span>
                    <span>₹{orderDetails.payment_data.original_cost}</span>
                  </div>
                  <div className="price-row">
                    <span>Convenience Fee</span>
                    <span>₹{orderDetails.payment_data.convenience_fee}</span>
                  </div>
                  <div className="price-row">
                    <span>Delivery Charge</span>
                    <span>₹{orderDetails.payment_data.delivery_charge}</span>
                  </div>
                  <div className="price-row">
                    <span>Tax</span>
                    <span>₹{orderDetails.payment_data.total_tax}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total</span>
                    <span>₹{orderDetails.payment_data.final_total}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="chadhava-checkout-footer">
              <button className="pay-btn" onClick={() => initiatePayment(orderDetails)}>
                Confirm and Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetails;