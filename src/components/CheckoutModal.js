import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import api, { updateDevoteeProfile, getDevoteeProfile } from '../api/api';
import Select from 'react-select';
import '../styles/CheckoutModal.css';

// Get API base URL from the centralized config
const getApiBaseUrl = () => {
  return api.defaults.baseURL;
};

// List of Indian states and union territories
const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

// Sankalpa is now a text input field
const stateOptions = INDIAN_STATES.map(state => ({ value: state, label: state }));

// Razorpay script loader
function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Fetch pooja/prasadam charges by pooja ID using centralized API
async function getChargesByPoojaId(poojaId) {
  try {
    const response = await api.get(`/api/v1/devotee/pooja/${poojaId}`);
    const data = response.data;
    return {
      id: data.id,
      name: data.name,
      details: data.details,
      included: data.included,
      excluded: data.excluded,
      cost: Number(data.cost),
      original_cost: Number(data.original_cost),
      convenience_fee: Number(data.convenience_fee || 0),
      booking_charges: Number(data.booking_charges || 0),
      fee_amount: Number(data.fee_amount || 0),
      tax_amount: Number(data.tax_amount || 0),
      final_total: Number(data.final_total),
      prasad_delivery: data.prasad_delivery,
      tax: data.tax,
      payment_data: {
        original_cost: Number(data.original_cost),
        convenience_fee: Number(data.convenience_fee || 0),
        booking_charges: Number(data.booking_charges || 0),
        tax_amount: Number(data.tax_amount || 0),
        final_total: Number(data.final_total),
      },
    };
  } catch (err) {
    console.error('Error fetching charges:', err);
    return null;
  }
}

// Custom date picker with close on select
function DatePickerWithClose({ selectedDate, onDateChange, error }) {
  const [open, setOpen] = React.useState(false);
  const selected = selectedDate ? new Date(selectedDate + 'T00:00:00') : undefined;

  return (
    <div style={{ position: 'relative', marginBottom: 8 }}>
      <input
        type="text"
        readOnly
        value={selected ? selected.toLocaleDateString() : ''}
        placeholder="Booking Date *"
        style={{
          width: '100%',
          padding: 8,
          borderRadius: 6,
          marginBottom: 0,
          cursor: 'pointer',
          background: '#fff'
        }}
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            top: 44,
            left: 0,
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            padding: 8
          }}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                onDateChange(`${year}-${month}-${day}`);
                setOpen(false);
              }
            }}
            disabled={[
              {
                before: (() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return today;
                })(),
              },
              new Date() // explicitly disable today
            ]}
            required
          />
        </div>
      )}
      {error && <span className="checkout-error">{error}</span>}
    </div>
  );
}

const CheckoutModal = ({ open, onClose }) => {
  const { profile } = useUserAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddressConfirmation, setShowAddressConfirmation] = useState(false);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({
    bookingDate: '',
    devoteeName: '',
    devoteeMobile: '',
    sankalpa: '',
    zodiacSign: '',
    nakshatra: '',
    street1: '',
    street2: '',
    area: '',
    city: '',
    district: '',
    state: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});
  const [orderData, setOrderData] = useState(null);
  const [apiProfile, setApiProfile] = useState(null);

  // Fetch API profile and prefill address data
  useEffect(() => {
    if (open) {
      const fetchApiProfile = async () => {
        try {
          const data = await getDevoteeProfile();
          setApiProfile(data);
          
          // Prefill address from API profile or local profile
          setAddress({
            bookingDate: '',
            devoteeName: data.name ||
              (profile?.firstName && profile?.lastName
                ? `${profile.firstName} ${profile.lastName}`
                : profile?.firstName || ''),
            devoteeMobile: data.mobile_number?.replace('+91', '') || profile?.phone || '',
            sankalpa: '',
            nakshatra: '',
            street1: data.street_address || profile?.street1 || '',
            street2: profile?.street2 || '',
            area: data.area || profile?.area || '',
            city: data.city || profile?.city || '',
            district: data.district || profile?.district || '',
            state: data.state || profile?.state || '',
            pincode: data.pincode || profile?.pincode || ''
          });
        } catch (err) {
          console.error('Error fetching API profile:', err);
          // Fallback to local profile data
          if (profile) {
            setAddress({
              bookingDate: '',
              devoteeName:
                profile.firstName && profile.lastName
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile.firstName || '',
              devoteeMobile: profile.phone || '',
              sankalpa: '',
              nakshatra: '',
              street1: profile.street1 || '',
              street2: profile.street2 || '',
              area: profile.area || '',
              city: profile.city || '',
              district: profile.district || '',
              state: profile.state || '',
              pincode: profile.pincode || ''
            });
          }
        }
      };
      
      fetchApiProfile();
    }
  }, [profile, open]);

  // Load cart and fetch charges for each item
  useEffect(() => {
    if (open) {
      const fetchCartCharges = async () => {
        try {
          let stored = JSON.parse(localStorage.getItem('cart')) || [];
          stored = stored.map((item) => ({ ...item, quantity: item.quantity || 1 }));
          const updatedCart = await Promise.all(
            stored.map(async (item) => {
              const charges = await getChargesByPoojaId(item.id || item.pooja_id);
              if (charges) {
                return { ...item, ...charges };
              }
              return item;
            })
          );
          setCart(updatedCart);
        } catch (err) {
          console.error('Error loading cart:', err);
          setCart([]);
        }
      };
      fetchCartCharges();
    }
  }, [open]);

  const [charges, setCharges] = useState({
    prasadCost: 0,
    convinceCharge: 0,
    shippingCharge: 0,
    subtotal: 0,
    gst: 0,
    total: 0
  });

  const [showCalculatedCost, setShowCalculatedCost] = useState(false);

  useEffect(() => {
    let subtotal = cart.reduce(
      (sum, item) => sum + (Number(item.payment_data?.original_cost) || Number(item.original_cost) || 0) * (item.quantity || 1),
      0
    );
    let convinceCharge = cart.reduce(
      (sum, item) => sum + (Number(item.payment_data?.convenience_fee) || Number(item.convenience_fee) || 0) * (item.quantity || 1),
      0
    );
    let shippingCharge = cart.reduce(
      (sum, item) => sum + (Number(item.payment_data?.booking_charges) || Number(item.booking_charges) || 0) * (item.quantity || 1),
      0
    );
    let gst = cart.reduce(
      (sum, item) => sum + (Number(item.payment_data?.tax_amount) || Number(item.tax_amount) || 0) * (item.quantity || 1),
      0
    );

    // Override with orderData values if available (after address submission)
    // Calculate total from all items in the response array for bulk requests
    if (orderData && showCalculatedCost) {
      // If orderData is an array (bulk response), sum all payment_data
      if (Array.isArray(orderData)) {
        convinceCharge = orderData.reduce((sum, order) => sum + Number(order.payment_data?.convenience_fee || 0), 0);
        shippingCharge = orderData.reduce((sum, order) => sum + Number(order.payment_data?.delivery_charge || order.payment_data?.booking_charges || 0), 0);
        gst = orderData.reduce((sum, order) => sum + Number(order.payment_data?.total_tax || order.payment_data?.tax_amount || 0), 0);
        subtotal = orderData.reduce((sum, order) => sum + Number(order.payment_data?.original_cost || 0), 0);
      } else {
        // Single order response
        convinceCharge = Number(orderData.payment_data?.convenience_fee || 0);
        shippingCharge = Number(orderData.payment_data?.delivery_charge || orderData.payment_data?.booking_charges || 0);
        gst = Number(orderData.payment_data?.total_tax || orderData.payment_data?.tax_amount || 0);
        subtotal = Number(orderData.payment_data?.original_cost || 0);
      }
    }

    let total = subtotal + convinceCharge + shippingCharge + gst;

    setCharges({ prasadCost: 0, convinceCharge, shippingCharge, subtotal, gst, total });
  }, [cart, orderData, showCalculatedCost]);

  async function fetchRazorpayKey() {
    try {
      const response = await api.get('/api/v1/devotee/payment_key/');
      return response.data.key;
    } catch (err) {
      alert('Unable to fetch payment key.');
      return null;
    }
  }

  const placeOrder = async (rz_response, paymentId, orderId) => {
    try {
      const requestData = {
        razorpay_response: {
          razorpay_payment_id: rz_response?.razorpay_payment_id,
          razorpay_order_id: rz_response?.razorpay_order_id,
          razorpay_signature: rz_response?.razorpay_signature
        },
        request_id: paymentId,
        billing_address: {
          name: address.devoteeName || profile?.name || profile?.firstName || 'Devotee',
          street_address_1: address.street1 || profile?.street_address_1 || profile?.address?.street_address_1 || '',
          street_address_2: address.street2 || profile?.street_address_2 || profile?.address?.street_address_2 || '',
          area: address.area || profile?.area || profile?.address?.area || '',
          city: address.city || profile?.city || profile?.address?.city || '',
          district: address.district || profile?.district || profile?.address?.district || '',
          state: address.state || profile?.state || profile?.address?.state || '',
          pincode: address.pincode || profile?.pincode || profile?.address?.pincode || '',
          phone_number: address.devoteeMobile || profile?.phone || profile?.mobile || ''
        }
      };

      const response = await api.post('/api/v1/devotee/pooja_request/payment/', requestData);

      // Close the checkout modal first
      onClose();

      if (response.data?.success === true) {
        navigate(`/payment-success?payment_id=${rz_response?.razorpay_payment_id}&order_id=${orderId}&status=success`, { replace: true });
      } else {
        navigate(`/payment-success?payment_id=${rz_response?.razorpay_payment_id}&order_id=${orderId}&status=failed&error=${encodeURIComponent('Payment verification failed')}`, { replace: true });
      }
    } catch (err) {
      console.error("placeOrder error:", err);
      onClose();
      const errorMessage = err.response?.data?.detail || err.message || "Unknown error";
      navigate(`/payment-success?payment_id=${rz_response?.razorpay_payment_id || ''}&order_id=${orderId}&status=failed&error=${encodeURIComponent(errorMessage)}`, { replace: true });
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!address.bookingDate) newErrors.bookingDate = 'Required';
    if (!address.devoteeName) newErrors.devoteeName = 'Required';
    if (!address.devoteeMobile || !/^\d{10}$/.test(address.devoteeMobile))
      newErrors.devoteeMobile = 'Valid 10-digit mobile required';
    if (!address.street1) newErrors.street1 = 'Required';
    if (!address.area) newErrors.area = 'Required';
    if (!address.city) newErrors.city = 'Required';
    if (!address.district) newErrors.district = 'Required';
    if (!address.state) newErrors.state = 'Required';
    if (!address.pincode || !/^\d{6}$/.test(address.pincode))
      newErrors.pincode = 'Valid 6-digit pincode required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Store checkout data in localStorage for ProfilePage to access
      const checkoutData = {
        devoteeName: address.devoteeName,
        devoteeMobile: address.devoteeMobile,
        bookingDate: address.bookingDate,
        sankalpa: address.sankalpa,
        nakshatra: address.nakshatra,
        street1: address.street1,
        street2: address.street2,
        area: address.area,
        city: address.city,
        district: address.district,
        state: address.state,
        pincode: address.pincode
      };
      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

      // Save address to profile via API only if it's the first time (profile doesn't have address info)
      const hasAddressInfo = apiProfile?.street_address || apiProfile?.area || apiProfile?.city || apiProfile?.state || apiProfile?.pincode;
      
      if (!hasAddressInfo && apiProfile) {
        try {
          const profileUpdateData = {
            name: address.devoteeName,
            area: address.area,
            city: address.city,
            district: address.district,
            state: address.state,
            pincode: address.pincode,
            street_address: address.street1,
            address: `${address.street1}, ${address.street2 ? `${address.street2}, ` : ''}${address.area}, ${address.city}, ${address.state} - ${address.pincode}`
          };
          
          await updateDevoteeProfile(profileUpdateData);
          console.log('Profile updated successfully with address information');
        } catch (err) {
          console.error('Error updating profile:', err);
          // Continue with checkout even if profile update fails
        }
      }

      // Also save to localStorage for backward compatibility
      const existingProfile = JSON.parse(localStorage.getItem('profile') || '{}');
      const localHasAddressInfo = existingProfile.street1 || existingProfile.area || existingProfile.city || existingProfile.state || existingProfile.pincode;
      
      if (!localHasAddressInfo) {
        const updatedProfile = {
          ...existingProfile,
          firstName: existingProfile.firstName || address.devoteeName.split(' ')[0] || address.devoteeName,
          lastName: existingProfile.lastName || (address.devoteeName.split(' ').length > 1 ? address.devoteeName.split(' ').slice(1).join(' ') : ''),
          phone: existingProfile.phone || address.devoteeMobile,
          street1: address.street1,
          street2: address.street2,
          area: address.area,
          city: address.city,
          district: address.district,
          state: address.state,
          pincode: address.pincode,
          sankalpa: existingProfile.sankalpa || address.sankalpa,
          nakshatra: existingProfile.nakshatra || address.nakshatra
        };
        localStorage.setItem('profile', JSON.stringify(updatedProfile));
      }
      // Create individual requests for each quantity of each item
      const requests = [];
      cart.forEach((item) => {
        const quantity = item.quantity || 1;
        for (let i = 0; i < quantity; i++) {
          requests.push({
            comment: `( Sankalpa: ${address.sankalpa || ''} )( Nakshatra: ${address.nakshatra || ''} )( Gotra: ${address.gotra || ''} )( Rashi: ${address.rashi || ''} )`,
            is_prasadam_delivery: item.prasad_delivery,
            pooja_date: address.bookingDate,
            pooja: item.id || item.pooja_id,
            name: address.devoteeName || profile?.name || profile?.firstName || 'Devotee',
            devotee_name: address.devoteeName || profile?.name || profile?.firstName || 'Devotee',
            devotee_number: `+91${address.devoteeMobile || profile?.phone || ''}`,
            booked_by: (profile && profile.id) ? profile.id : 'CSC',
            family_member: [
              {
                id: (profile && profile.id) ? profile.id : 1,
                name: address.devoteeName || profile?.name || profile?.firstName || 'Devotee',
                nakshatra: address.nakshatra || ''
              }
            ],
            sankalpa: address.sankalpa,
            nakshatra: address.nakshatra || '',
            gotra: address.gotra || '',
            rashi: address.rashi || '',
            street1: address.street1,
            street2: address.street2,
            area: address.area,
            city: address.city,
            district: address.district,
            state: address.state,
            pincode: address.pincode,
            booking_date: address.bookingDate,
            status: `${address.street1}, ${address.street2 ? `${address.street2}, ` : ''}${address.area}, ${address.city}, ${address.state} - ${address.pincode}`,
            billing_address: {
              name: address.devoteeName || profile?.name || profile?.firstName || 'Devotee',
              street_address_1: address.street1 || profile?.street_address_1 || profile?.address?.street_address_1 || '',
              street_address_2: address.street2 || profile?.street_address_2 || profile?.address?.street_address_2 || '',
              area: address.area || profile?.area || profile?.address?.area || '',
              city: address.city || profile?.city || profile?.address?.city || '',
              district: address.district || profile?.district || profile?.address?.district || '',
              state: address.state || profile?.state || profile?.address?.state || '',
              pincode: address.pincode || profile?.pincode || profile?.address?.pincode || '',
              phone_number: address.devoteeMobile || profile?.phone || profile?.mobile || ''
            },
            prasadam_address: {
              name: address.devoteeName || profile?.name || profile?.firstName || 'Devotee',
              street_address_1: address.street1,
              street_address_2: address.street2 || '',
              area: address.area,
              city: address.city,
              district: address.district,
              state: address.state,
              pincode: address.pincode,
              phone_number: address.devoteeMobile || profile?.phone || ''
            }
          });
        }
      });

      const payload = { requests };

      try {
        const response = await api.post('/api/v1/devotee/bulk_pooja_request/', payload);
        const data = response.data;

        // Store the entire response array for bulk calculations
        setOrderData(data);
        setShowCalculatedCost(true);
        setShowAddressConfirmation(true);
      } catch (err) {
        console.error('Error submitting order:', err);
        const errorData = err.response?.data;
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          const fieldErrors = {};
          errorData.errors.forEach(error => {
            const field = error.field;
            const message = error.message?.[0] || error.message || 'Invalid input';
            // Map API field names to form field names
            if (field === 'prasadam_address__area') {
              fieldErrors.area = message;
            } else if (field === 'prasadam_address__street_address_1') {
              fieldErrors.street1 = message;
            } else if (field === 'prasadam_address__city') {
              fieldErrors.city = message;
            } else if (field === 'prasadam_address__district') {
              fieldErrors.district = message;
            } else if (field === 'prasadam_address__state') {
              fieldErrors.state = message;
            } else if (field === 'prasadam_address__pincode') {
              fieldErrors.pincode = message;
            } else if (field === 'prasadam_address__phone_number') {
              fieldErrors.devoteeMobile = message;
            } else if (field === 'name') {
              fieldErrors.devoteeName = message;
            } else if (field === 'pooja_date') {
              fieldErrors.bookingDate = message;
            } else {
              // For unmapped fields, show as general error
              fieldErrors.general = message;
            }
          });
          setErrors(fieldErrors);
        } else {
          const errorMessage = errorData?.detail || err.message || 'Unknown error';
          setErrors({ general: errorMessage });
        }
      }
    }
  };

  const handleConfirmPayment = async () => {
    if (!orderData) return;

    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Razorpay SDK failed to load.');
      return;
    }

    const rzKey = await fetchRazorpayKey();
    if (!rzKey) return;

    let paymentAmount = charges.total;
    if (!paymentAmount || isNaN(paymentAmount) || paymentAmount <= 0) {
      // Calculate total from all orders if orderData is an array
      if (Array.isArray(orderData)) {
        paymentAmount = orderData.reduce((sum, order) => sum + Number(order.payment_data?.final_total || 0), 0);
      } else {
        paymentAmount = Number(orderData.payment_data?.final_total || 1);
      }
    }
    const amount = Math.round(Number(paymentAmount) * 100);

    // Use the first order's payment details for Razorpay (all orders should have same payment_order_id for bulk)
    const firstOrder = Array.isArray(orderData) ? orderData[0] : orderData;
    const razorpayOrderId = firstOrder.payment_order_id;
    const internalOrderId = firstOrder.order_id;

    const options = {
      key: rzKey,
      amount,
      currency: 'INR',
      name: 'Devalaya',
      description: 'Payment towards Event Pooja',
      image: 'https://cdn.shopify.com/s/files/1/0735/5895/0166/files/unnamed_copy_ac3ece77-8a3a-44b7-b0f2-820c39455044.jpg?v=1679241399&width=500',
      order_id: razorpayOrderId,
      handler: function (rz_response) {
        placeOrder(rz_response, rz_response.razorpay_payment_id, internalOrderId);
      },
      prefill: {
        name: firstOrder.name,
        email: profile?.email || '',
        contact: firstOrder.devotee_number,
      },
      notes: {
        address: 'Devalaya',
      },
      theme: {
        color: '#df3002',
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response) {
      alert(JSON.stringify(response.error));
    });
    rzp1.open();
  };

  if (!open) return null;

  return (
    <div className="checkout-modal-overlay" onClick={() => setShowConfirm(true)}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-modal-header-bar">
          <img src={require('../assets/logo.png')} alt="Logo" className="checkout-modal-logo" />
          <h4 className="checkout-modal-title">Checkout Details</h4>
          <button
            className="checkout-modal-top-close-btn"
            onClick={() => setShowConfirm(true)}
            aria-label="Close"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="checkout-modal-content">
          <div className="checkout-modal-left" style={{ position: 'relative' }}>
            {showConfirm && (
              <div className="checkout-confirm-overlay" onClick={(e) => e.stopPropagation()}>
                <div className="checkout-confirm-dialog">
                  <div className="checkout-confirm-title">Are you sure?</div>
                  <div className="checkout-confirm-message">Do you want to close the payment.</div>
                  <div className="checkout-confirm-actions">
                    <button
                      className="btn btn-danger me-2"
                      onClick={() => {
                        setShowConfirm(false);
                        onClose();
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showAddressConfirmation ? (
              <div className="address-confirmation">
                <h5>Confirm Your Address</h5>
                <div style={{ marginBottom: 16 }}>
                  <strong>Devotee Name:</strong> {address.devoteeName}<br />
                  <strong>Mobile:</strong> +91{address.devoteeMobile}<br />
                  <strong>Address:</strong> {address.street1}, {address.street2 ? `${address.street2}, ` : ''}{address.area}, {address.city}, {address.state} - {address.pincode}<br />
                  <strong>Sankalpa:</strong> {address.sankalpa || 'N/A'}<br />
                  <strong>Rashi,Nakshatra,Gotra:</strong> {address.nakshatra || 'N/A'}<br />
                  <strong>Booking Date:</strong> {address.bookingDate}
                </div>
                                <img
                  src={require('../assets/posters/4.webp')}
                  alt="Poster"
                  style={{ width: '100%', marginTop: '20px',borderRadius: '8px', objectFit: 'cover'}}
                />

              </div>
            ) : (
              <>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontWeight: 600, fontSize: '1.08rem', display: 'block', marginBottom: 4 }}>
                    Select Your Puja Date
                  </label>
                  <DatePickerWithClose
                    selectedDate={address.bookingDate}
                    onDateChange={(date) => setAddress({ ...address, bookingDate: date })}
                    error={errors?.bookingDate}
                  />
                </div>

                <div className="checkout-modal-address-label">
                  <span>Address</span>
                </div>

                <div className="checkout-modal-left-scroll">
                  <form onSubmit={handleAddressSubmit}>
                    <div className="mb-2">
                      <label>Devotee Name <span className="required-asterisk">*</span></label>
                      <input
                        type="text"
                        value={address.devoteeName}
                        onChange={(e) => setAddress({ ...address, devoteeName: e.target.value })}
                        className="form-control"
                        placeholder="Devotee Name"
                      />
                      {errors.devoteeName && <span className="checkout-error">{errors.devoteeName}</span>}
                    </div>

                    <div className="mb-2">
                      <label>Devotee Mobile Number <span className="required-asterisk">*</span></label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={address.devoteeMobile}
                        onChange={(e) =>
                          setAddress({ ...address, devoteeMobile: e.target.value.replace(/[^0-9]/g, '') })
                        }
                        className="form-control"
                        placeholder="10-digit Mobile"
                      />
                      {errors.devoteeMobile && (
                        <span className="checkout-error">{errors.devoteeMobile}</span>
                      )}
                    </div>

                    <div className="mb-2">
                      <label>Sankalpa</label>
                      <input
                        type="text"
                        value={address.sankalpa}
                        onChange={(e) => setAddress({ ...address, sankalpa: e.target.value })}
                        className="form-control"
                        placeholder="Sankalpa"
                      />
                    </div>

                    <div className="mb-2">
                      <label>Rashi,Nakshatra,Gotra</label>
                      <input
                        type="text"
                        value={address.nakshatra}
                        onChange={(e) => setAddress({ ...address, nakshatra: e.target.value })}
                        className="form-control"
                        placeholder="Rashi,Nakshatra,Gotra"
                      />
                    </div>

                    <div className="mb-2">
                      <label>Street Address 1 <span className="required-asterisk">*</span></label>
                      <input
                        type="text"
                        value={address.street1}
                        onChange={(e) => setAddress({ ...address, street1: e.target.value })}
                        className="form-control"
                        placeholder="Street Address"
                      />
                      {errors.street1 && <span className="checkout-error">{errors.street1}</span>}
                    </div>

                    <div className="mb-2">
                      <label>Street Address 2 (optional)</label>
                      <input
                        type="text"
                        value={address.street2}
                        onChange={(e) => setAddress({ ...address, street2: e.target.value })}
                        className="form-control"
                        placeholder="Street Address"
                      />
                    </div>

                    <div className="mb-2">
                      <label>Area <span className="required-asterisk">*</span></label>
                      <input
                        type="text"
                        value={address.area}
                        onChange={(e) => setAddress({ ...address, area: e.target.value })}
                        className="form-control"
                        placeholder="Area"
                      />
                      {errors.area && <span className="checkout-error">{errors.area}</span>}
                    </div>

                    <div className="mb-2">
                      <label>City <span className="required-asterisk">*</span></label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="form-control"
                        placeholder="City"
                      />
                      {errors.city && <span className="checkout-error">{errors.city}</span>}
                    </div>

                    <div className="mb-2">
                      <label>District<span className="required-asterisk">*</span></label>
                      <input
                        type="text"
                        value={address.district}
                        onChange={(e) => setAddress({ ...address, district: e.target.value })}
                        className="form-control"
                        placeholder="District"
                      />
                    </div>

                    <div className="mb-2">
                      <label>State <span className="required-asterisk">*</span></label>
                      <Select
                        options={stateOptions}
                        value={stateOptions.find(o => o.value === address.state) || null}
                        onChange={(selected) => setAddress({ ...address, state: selected ? selected.value : '' })}
                        placeholder="Select State"
                        isClearable
                        className="react-select-container"
                        classNamePrefix="react-select"
                      />
                      {errors.state && <span className="checkout-error">{errors.state}</span>}
                    </div>

                    <div className="mb-2">
                      <label>Pincode <span className="required-asterisk">*</span> (6-digit Pincode)</label>
                      <input
                        type="text"
                        value={address.pincode}
                        maxLength={6}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/[^0-9]/g, '') })}
                        className="form-control"
                        placeholder="Pincode"
                      />
                      {errors.pincode && <span className="checkout-error">{errors.pincode}</span>}
                    </div>

                    <button className="checkout-proceed-btn" type="submit">
                      Save Address & Proceed to Payment
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>

          <div className="checkout-modal-right">
            <h5>Selected Pooja/Prasadam</h5>
            <div className="checkout-cart-list">
              {cart.map((item) => (
                <div className="checkout-cart-item" key={item.id}>
                  {item.images?.[0]?.image && (
                    <img
                      src={
                        item.images[0].image.startsWith('http')
                          ? item.images[0].image
                          : `${getApiBaseUrl()}${item.images[0].image}`
                      }
                      alt={item.name}
                      className="checkout-cart-img"
                    />
                  )}
                  <div className="checkout-cart-info">
                    <div className="checkout-cart-title">{item.name}</div>
                    <div className="checkout-cart-qty">
                      {item.quantity} x ₹{Number(item.original_cost || item.cost).toLocaleString('en-IN')} = ₹{(item.quantity * Number(item.original_cost || item.cost)).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-cart-summary">
              {!showCalculatedCost ? (
                <>
                  <div className="checkout-summary-row">
                    <span>Subtotal</span>
                    <span>₹{charges.subtotal}</span>
                  </div>
                  <div className="checkout-summary-row">
                    <span>Convenience Charge</span>
                    <span className="cost-to-be-calculated">To be calculated</span>
                  </div>
                  <div className="checkout-summary-row">
                    <span>Shipping Charge</span>
                    <span className="cost-to-be-calculated">To be calculated</span>
                  </div>
                  <div className="checkout-summary-row">
                    <span>GST</span>
                    <span className="cost-to-be-calculated">To be calculated</span>
                  </div>
                  <div className="checkout-summary-row checkout-summary-total">
                    <span>Total (inc. all taxes)</span>
                    <span className="cost-to-be-calculated">To be calculated</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="checkout-summary-row">
                    <span>Subtotal</span>
                    <span>₹{charges.subtotal}</span>
                  </div>
                  <div className="checkout-summary-row">
                    <span>Convenience Charge</span>
                    <span>₹{charges.convinceCharge}</span>
                  </div>
                  <div className="checkout-summary-row">
                    <span>Shipping Charge</span>
                    <span>₹{charges.shippingCharge}</span>
                  </div>
                  <div className="checkout-summary-row">
                    <span>GST</span>
                    <span>₹{charges.gst}</span>
                  </div>
                  <div className="checkout-summary-row checkout-summary-total">
                    <span>Total (inc. all taxes)</span>
                    <span>₹{charges.total}</span>
                  </div>
                </>
              )}
            </div>

            {showAddressConfirmation && (
              <div className="checkout-confirm-actions" style={{ marginTop: '20px' }}>
                <button
                  className="btn btn-orange me-2"
                  onClick={handleConfirmPayment}
                >
                  Confirm & Proceed to Payment
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddressConfirmation(false)}
                >
                  Edit Address
                </button>
              </div>
            )}
                 {!showAddressConfirmation && (
              <img
                src={require('../assets/posters/2.webp')}
                alt="Poster"
                style={{ width: '100%', marginTop: '20px', borderRadius: '5px' }}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;

