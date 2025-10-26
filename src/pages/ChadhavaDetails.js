// src/pages/ChadhavaDetails.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import "../styles/ChadhavaDetails.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useUserAuth } from "../context/UserAuthContext";
import OtpLoginModal from '../components/OtpLoginModal';

// Load Razorpay
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const ChadhavaDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { user } = useUserAuth();
  const [profile, setProfile] = useState(null);

  const [assignedItems, setAssignedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [title, setTitle] = useState("Bhairav Chadhava");
  const [subtitle, setSubtitle] = useState("A Sacred Opportunity to Break Free from Fear, Obstacles & Negativity");
  const [includedItems, setIncludedItems] = useState("");
  const [excludedItems, setExcludedItems] = useState("");
  const [isPrasadamDelivery, setIsPrasadamDelivery] = useState(false);

  // Checkout form state
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

  // Moved these functions up to resolve ESLint no-undef errors
  const handleSelectItem = (item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, { ...item, quantity: 1 }]
    );
  };

  const updateQuantity = (itemId, qty) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

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

  const [errors, setErrors] = useState({});
  const [charges, setCharges] = useState({
    subtotal: 0,
    convenienceFee: 5.0,
    shipping: 0,
    gst: 0,
    total: 0,
  });

  const [carouselImages, setCarouselImages] = useState([]);

  // Fetch chadhava items
  useEffect(() => {
    const fetchChadhavas = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/devotee/chadhava/?temple=${parseInt(id)}`);
        const data = res.data;

        if (!data) {
          setError("No data received from server.");
          console.error("No data received from server.", res);
          return;
        }

        if (data?.results?.length > 0) {
          const firstResult = data.results[0];
          if(firstResult.name){
            setTitle(firstResult.name);
          }
          if(firstResult.details){
            setSubtitle(firstResult.details);
          }

          if(firstResult.pooja_chadhava?.included){
            setIncludedItems(firstResult.pooja_chadhava.included);
          }
          if(firstResult.pooja_chadhava?.excluded){
            setExcludedItems(firstResult.pooja_chadhava.excluded);
          }
          if(firstResult.pooja_chadhava?.prasad_delivery !== undefined){
            setIsPrasadamDelivery(firstResult.pooja_chadhava.prasad_delivery);
          }

          if (firstResult.pooja_chadhava?.images?.length > 0) {
            const { pooja_chadhava } = firstResult;
            const newCarouselImages = pooja_chadhava.images.map((img, index) => ({
              id: img.id || index,
              src: img.image,
              title: img.title || pooja_chadhava.name || "Bhairav Chadhava",
              subtitle: pooja_chadhava.temple?.name || "Vikrant Bhairav Temple, Ujjain"
            }));
            setCarouselImages(newCarouselImages);
          }
        }

        const allItems = data?.results?.length
          ? data.results.flatMap((chadhava) =>
            chadhava.assigned_items.map((item) => ({
              id: item.id,
              name: item.name,
              description: item.description,
              cost: parseFloat(item.cost) || 0,
              image: item.image,
              pooja: chadhava.pooja_chadhava?.name || "Chadhava",
              temple: chadhava.pooja_chadhava?.temple?.name || "Unknown Temple",
              templeId: chadhava.pooja_chadhava?.temple?.id,
              poojaId: chadhava.pooja_chadhava?.id,
              quantity: 1,
            }))
          )
          : [];

        if (allItems.length > 0) {
          setAssignedItems(allItems);
        } else {
          setError("No items assigned for offering.");
          console.error("No items assigned for offering.", data);
        }
      } catch (err) {
        setError("Failed to load items. Please try again. " + (err?.message || ""));
        console.error("Error fetching chadhava items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChadhavas();
  }, [id]);


  const handleAddToCart = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item.");
      return;
    }

    // Calculate total
    const subtotal = selectedItems.reduce(
      (sum, item) => sum + item.cost * (item.quantity || 1),
      0
    );
    const gst = (subtotal + 5.0) * 0.05;
    const total = subtotal + 5.0 + gst;

    setCharges({ subtotal, convenienceFee: 5.0, shipping: 0, gst, total });

    setShowCheckout(true);
  };

  const handleOfferChadhava = () => {
    if (!user) {
      setShowOtpLogin(true);
    } else {
      handleAddToCart();
    }
  };

  const handleLoginSuccess = () => {
    setShowOtpLogin(false);
    handleAddToCart();
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
    // if (!address.sankalpa) newErrors.sankalpa = "Required";
    // if (!address.nakshatra) newErrors.nakshatra = "Required";
    if (!address.street1) newErrors.street1 = "Required";
    if (!address.area) newErrors.area = "Required";
    if (!address.city) newErrors.city = "Required";
    if (!address.state) newErrors.state = "Required";
    if (!address.district) newErrors.district = "Required";
    if (!address.pincode || !/^\d{6}$/.test(address.pincode))
      newErrors.pincode = "6-digit pincode";

    setErrors(newErrors);
    console.log("Validation errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const comment = `( Nakshatra :${address.nakshatra || ''})( Gotra, Kula & Rashi :${address.gotraKulaRashi || ''} )`; // Moved up

      const payload = {
        requests: [
          {
            is_chadhava: true,
            is_prasadam_delivery: isPrasadamDelivery,
            pooja: selectedItems[0]?.poojaId, // Assuming all selected items belong to the same pooja
            temple: selectedItems[0]?.templeId, // Assuming all selected items belong to the same temple
            requested_chadhava_items: selectedItems.map((item) => ({
              id: item.id,
              quantity: item.quantity || 1,
              cost: item.cost,
            })),
            pooja_date: address.bookingDate,
            name: address.devoteeName || profile?.name || profile?.firstName || 'Devotee',
            devotee_number: `+91${address.devoteeMobile || profile?.phone || ''}`,
            sankalpa: address.sankalpa || '',
            comment: comment,
            // ✅ Upgraded family_member (from Version 2)
            family_member: [
              {
                id: (profile && profile.id) ? profile.id : 1, // fallback to 1 if no profile
                name: address.devoteeName || profile?.name || profile?.firstName || 'Devotee',
                nakshatra: address.nakshatra || '', // explicitly include nakshatra
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
      description: `${selectedItems.length} Item(s) - Chadhava Offering`,
      image: "https://devalaya-bucket.s3.amazonaws.com/logo_512x512.png",
      order_id: orderId,
      handler: async (rz_response) => {
  try {
    const payload = {
      request_id: order.order_id,  // ✅ correct field name
      razorpay_response: {         // ✅ wrap Razorpay response inside object
        razorpay_order_id: rz_response.razorpay_order_id,
        razorpay_payment_id: rz_response.razorpay_payment_id,
        razorpay_signature: rz_response.razorpay_signature,
      },
    };
             console.log("Payment verification payload:", payload);

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  if (loading) {
    return (
      <div className="chadhava-wrapper">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading special offerings...</p>
        </div>
      </div>
    );
  }

  if (error || assignedItems.length === 0) {
    return (
      <div className="chadhava-wrapper">
        <div className="error-container">
          <p className="error-text">{error || "No offerings available."}</p>
          <button className="chadhava-btn" onClick={() => navigate("/chadhava")}>
            Back to Offerings
          </button>
        </div>
      </div>
    );
  }

  const currentDate = new Date();
  const nextSaturday = new Date(currentDate);
  nextSaturday.setDate(currentDate.getDate() + (6 - currentDate.getDay() + 7) % 7);

  return (
    <div className="chadhava-wrapper">
      <div className="main-content">
        {/* Left Panel - Image Carousel */}
        <div className="left-panel">
          <div className="image-carousel-section">
            {/* Main Large Image */}
            <div className="main-image-container">
              <img
                src={carouselImages[currentImageIndex].src}
                alt={carouselImages[currentImageIndex].title}
                className="main-image"
              />
              <div className="image-overlay">
                {/* <h2 className="image-title">{carouselImages[currentImageIndex].title}</h2> */}
                {/* <div className="decorative-line">
                  <span className="star-motif">★</span>
                </div> */}
                {/* <p className="image-subtitle">{carouselImages[currentImageIndex].subtitle}</p> */}
              </div>
              
              {/* Navigation Arrows */}
              <button className="carousel-arrow left" onClick={prevImage}>
                <FaArrowLeft />
              </button>
              <button className="carousel-arrow right" onClick={nextImage}>
                <FaArrowRight />
              </button>
            </div>

            {/* Thumbnail Images */}
            {/* <div className="thumbnail-images">
              {carouselImages.map((image, index) => (
                <div 
                  key={image.id} 
                  className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="thumbnail-img"
                  />
                  
                </div>
              ))}
            </div> */}
          </div>
        </div>

        {/* Right Panel - Booking Details */}
        <div className="right-panel">
          <div className="offerings-details">
            {/* Top Banner */}
            {/* <div className="top-banner">
              <span>Last day today!</span>
            </div> */}

            {/* Main Title */}
            <h1 className="main-title">{title}</h1>
            
              <div className="excluded-section text-start">
              <span> <h4>
                <p className="subtitle"><strong>About: </strong>
              {subtitle}
            </p> </h4></span>
              </div>
            <div className="included-section text-start">
              <span> <h4>
                <strong>Temple: </strong>{assignedItems[0]?.temple}</h4></span>
              </div>
            
            {includedItems && (
              <div className="excluded-section text-start">
                <h4><strong>Chadhava items: </strong>{includedItems}</h4>
              </div>
            )}
            {excludedItems && (
              <div className="included-section text-start">
                <h4><strong>Benefits: </strong>{excludedItems}</h4>
                
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Selection Cards */}
      <div className="full-width-container">
        <div className="product-selection">
          <h3>Select Your Offerings</h3>
          <div className="product-cards">
            {assignedItems.slice(0, 5).map((item) => (
              <div key={item.id} className="product-card">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h4 className="product-name">{item.name}</h4>
                  <p className="product-price">₹{item.cost.toFixed(2)}</p>
                  
                  {selectedItems.some((si) => si.id === item.id) ? (
                    <div className="quantity-section">
                      <label>Qty: </label>
                      <button
                        onClick={() => updateQuantity(item.id, (selectedItems.find(si => si.id === item.id)?.quantity || 1) - 1)}
                        disabled={(selectedItems.find(si => si.id === item.id)?.quantity || 1) <= 1}
                        className="qty-btn"
                      >
                        −
                      </button>
                      <span className="qty-display">
                        {selectedItems.find((si) => si.id === item.id)?.quantity || 1}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, (selectedItems.find(si => si.id === item.id)?.quantity || 1) + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => handleSelectItem(item)}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      className="select-btn"
                      onClick={() => handleSelectItem(item)}
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Call to Action Button */}
        <button className="cta-button" onClick={handleOfferChadhava}>
          Offer Chadhava
          <span className="arrow">→</span>
        </button>
      </div>

      {showOtpLogin && (
        <OtpLoginModal 
            onClose={() => setShowOtpLogin(false)} 
            onLoginSuccess={handleLoginSuccess} 
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="chadhava-checkout-overlay" onClick={handleCloseCheckout}>
          <div
            className="chadhava-checkout-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="chadhava-checkout-header">
              <h3>Complete Your Offering</h3>
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
                        min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
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
                  <h4>Selected Items ({selectedItems.length})</h4>
                  {selectedItems.map((item) => (
                    <p key={item.id}>
                      {item.name} × {item.quantity || 1} @ ₹
                      {item.cost.toFixed(2)}
                    </p>
                  ))}
                </div>
                <div className="price-summary">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>₹{charges.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Convenience Fee</span>
                    <p>To be calculated</p>
                  </div>
                  <div className="price-row">
                    <span>Shipping</span>
                    <p>To be calculated</p>

                  </div>
                  <div className="price-row">
                    <span>GST </span>
                    <p>To be calculated</p>

                  </div>
                  <div className="price-row total">
                    <span>Total</span>
                    <p>To be calculated</p>

                  </div>
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
                    <span>Chadhava Cost</span>
                    <span>₹{orderDetails.payment_data.original_chadhava_cost}</span>
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
    </div>
  );
};

export default ChadhavaDetails;