// // src/pages/PujaDetails.js
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import api from '../api/api';
// import '../styles/PujaDetails.css';

// const PujaDetails = () => {
//   const { id } = useParams();
//   const [puja, setPuja] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState('about');
//   const [imageError, setImageError] = useState(false);
//   const [addingToCart, setAddingToCart] = useState(false);

//   useEffect(() => {
//     const fetchPujaDetails = async () => {
//       try {
//         const response = await api.get(`/api/v1/devotee/pooja/${id}`);
//         setPuja(response.data);
//       } catch (err) {
//         setError('❌ Failed to load puja details. Please try again later.');
//         console.error('Error fetching puja:', err.response?.data || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPujaDetails();
//   }, [id]);

//   // ✅ Robust fallback image logic
//   const rawImage =
//     puja?.image ||
//     (puja?.images?.length > 0 && puja.images[0]?.image) ||
//     puja?.god?.image ||
//     puja?.temple?.images?.[0]?.image;

//   const imageUrl = !imageError && rawImage
//     ? rawImage
//     : 'https://via.placeholder.com/600x400?text=Image+Not+Available';

//   // ✅ Fallback values for benefits & cost
//   const benefitsText =
//     puja?.benefits && puja.benefits.trim() !== ''
//       ? puja.benefits
//       : 'This puja is beneficial for spiritual harmony and inner peace.';

//   const pujaCost =
//     puja?.final_total ||
//     puja?.original_cost ||
//     puja?.cost ||
//     0;

//   const formattedCost = `₹${Number(pujaCost).toLocaleString('en-IN', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;

//   const handleParticipate = () => {
//     if (!puja || addingToCart) return;

//     setAddingToCart(true);
//     try {
//       const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

//       const convenienceFee = Number(puja.convenience_fee || 0);
//       const bookingCharges = Number(puja.booking_charges || 0);
//       const taxAmount = Number(puja.tax_amount || 0);
//       const finalTotal = Number(
//         puja.final_total || pujaCost + convenienceFee + bookingCharges + taxAmount
//       );

//       const cartItem = {
//         id: puja.id,
//         name: puja.name,
//         details: puja.details || 'Puja participation',
//         cost: pujaCost,
//         final_total: finalTotal,
//         original_cost: pujaCost,
//         convenience_fee: convenienceFee,
//         booking_charges: bookingCharges,
//         tax_amount: taxAmount,
//         quantity: 1,
//         images: puja.images || [],
//         prasad_delivery: puja.prasad_delivery || false,
//         payment_data: {
//           original_cost: pujaCost,
//           final_total: finalTotal,
//           convenience_fee: convenienceFee,
//           booking_charges: bookingCharges,
//           tax_amount: taxAmount,
//           delivery_charge: Number(puja.delivery_charge || 0),
//           fee_amount: Number(puja.fee_amount || 0),
//         },
//       };

//       const existingItemIndex = existingCart.findIndex(
//         (item) => item.id === puja.id
//       );

//       if (existingItemIndex >= 0) {
//         existingCart[existingItemIndex].quantity += 1;
//       } else {
//         existingCart.push(cartItem);
//       }

//       localStorage.setItem('cart', JSON.stringify(existingCart));
//       window.dispatchEvent(new Event('storage'));
//       window.dispatchEvent(new Event('open-cart-drawer'));
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       alert('Failed to add item to cart. Please try again.');
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   if (loading) return <div className="loading">Loading Puja Details...</div>;
//   if (error) return <div className="error">{error}</div>;
//   if (!puja) return <div>No puja found</div>;

//   // Static Packages (example from VAMA)
//   const packages = [
//     {
//       type: 'Single',
//       price: 951,
//       description: [
//         'The Puja will be performed with your Name and Gotra.',
//         'The Puja video will be sent on your phone number.',
//         'The Puja will be done at an auspicious time for best results.',
//       ],
//       maxPeople: 1,
//     },
//     {
//       type: 'Couple',
//       price: 1401,
//       description: [
//         'The Puja will be performed with Name and Gotra of both you and your partner.',
//         'The Puja video will be sent on your phone number.',
//         'The Puja will be done at an auspicious time for best results.',
//       ],
//       maxPeople: 2,
//       recommended: true,
//     },
//     {
//       type: 'Family',
//       price: 2251,
//       description: [
//         'In this Group Puja, Pujari ji will recite your family members’ names and gotra.',
//         'The Puja will be performed properly for the entire family.',
//         'The Puja video will be sent on your phone number.',
//       ],
//       maxPeople: 6,
//     },
//   ];

//   const handleConfirmPackage = (packagePrice, packageType) => {
//     if (addingToCart) return;

//     setAddingToCart(true);
//     try {
//       const cartItem = {
//         id: puja.id,
//         name: puja.name,
//         details: `Puja participation - ${packageType} Package`,
//         cost: packagePrice,
//         final_total: packagePrice,
//         original_cost: packagePrice,
//         quantity: 1,
//         images: puja.images || [],
//         prasad_delivery: puja.prasad_delivery || false,
//       };

//       const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
//       const existingItemIndex = existingCart.findIndex(
//         (item) => item.id === puja.id && item.cost === packagePrice
//       );

//       if (existingItemIndex >= 0) {
//         existingCart[existingItemIndex].quantity += 1;
//       } else {
//         existingCart.push(cartItem);
//       }

//       localStorage.setItem('cart', JSON.stringify(existingCart));
//       window.dispatchEvent(new Event('storage'));
//       window.dispatchEvent(new Event('open-cart-drawer'));
//     } catch (error) {
//       console.error('Error adding package to cart:', error);
//       alert('Failed to add package to cart. Please try again.');
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   return (
//     <div className="puja-details-container">
//       <div className="puja-flex-wrapper">
//         <div className="puja-image-box">
//           <img
//             src={imageUrl}
//             alt={puja.name}
//             className="puja-main-image"
//             onError={() => setImageError(true)}
//             loading="lazy"
//           />
//         </div>

//         <div className="puja-text-box">
//           <h2 className="puja-title">{puja.name}</h2>
//           <p><strong>Temple:</strong> {puja.temple?.name || 'N/A'}</p>
//           <p><strong>God:</strong> {puja.god?.name || 'N/A'}</p>
//           <p><strong>Included:</strong> {puja.included || 'N/A'}</p>
//           <p><strong>Benefits:</strong> {benefitsText}</p>
//           <p><strong>Price:</strong> {formattedCost}</p>

//           <div className="participate-button-wrapper">
//             <button
//               className="participate-btn"
//               onClick={handleParticipate}
//               disabled={addingToCart}
//             >
//               {addingToCart ? 'ADDING...' : 'PARTICIPATE'}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="tab-nav">
//         <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>About Puja</button>
//         <button className={activeTab === 'benefits' ? 'active' : ''} onClick={() => setActiveTab('benefits')}>Benefits</button>
//         <button className={activeTab === 'temple' ? 'active' : ''} onClick={() => setActiveTab('temple')}>Temple Details</button>
//         <button className={activeTab === 'packages' ? 'active' : ''} onClick={() => setActiveTab('packages')}>Packages</button>
//       </div>

//       <div className="tab-content-pd">
//         {activeTab === 'about' && (
//           <div>
//             <h3>About Puja</h3>
//             <p>{puja.details || 'Information coming soon.'}</p>
//           </div>
//         )}
//         {activeTab === 'benefits' && (
//           <div>
//             <h3>Benefits</h3>
//             <p>{benefitsText}</p>
//           </div>
//         )}
//         {activeTab === 'temple' && (
//           <div>
//             <h3>Temple Details</h3>
//             <p>{puja.temple_details || 'This puja is conducted at a sacred temple location.'}</p>
//           </div>
//         )}
//         {activeTab === 'packages' && (
//           <div>
//             <h3>Puja Packages</h3>
//             <div className="packages-grid">
//               {packages.map((pkg, index) => (
//                 <div key={index} className="package-card">
//                   <h4>{pkg.type}</h4>
//                   {pkg.recommended && <span className="recommended-tag">Recommended</span>}
//                   <p className="package-price">₹{pkg.price}</p>
//                   <p className="package-info">
//                     {pkg.maxPeople === 1 && `For ${pkg.maxPeople} person`}
//                     {pkg.maxPeople > 1 && `Up to ${pkg.maxPeople} people`}
//                   </p>
//                   <hr className="package-divider" />
//                   <ul className="package-points">
//                     {pkg.description.map((point, i) => (
//                       <li key={i}>{point}</li>
//                     ))}
//                   </ul>
//                   <button
//                     className="confirm-package-btn"
//                     onClick={() => handleConfirmPackage(pkg.price, pkg.type)}
//                     disabled={addingToCart}
//                   >
//                     {addingToCart ? 'CONFIRMING...' : 'Confirm Package'}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PujaDetails;














// src/pages/PujaDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import '../styles/PujaDetails.css';

const PujaDetails = () => {
  const { id } = useParams();
  const [puja, setPuja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [imageError, setImageError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

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

  // ✅ Robust fallback image logic
  const rawImage =
    puja?.image ||
    (puja?.images?.length > 0 && puja.images[0]?.image) ||
    puja?.god?.image ||
    puja?.temple?.images?.[0]?.image;

  const imageUrl = !imageError && rawImage
    ? rawImage
    : 'https://via.placeholder.com/600x400?text=Image+Not+Available';

  useEffect(() => {
    console.log('✅ Raw image from API:', rawImage);
  }, [rawImage]);

  const handleParticipate = () => {
    if (!puja || addingToCart) return;

    setAddingToCart(true);
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

      const originalCost = Number(puja.original_cost || puja.cost || 0);
      const convenienceFee = Number(puja.convenience_fee || 0);
      const bookingCharges = Number(puja.booking_charges || 0);
      const taxAmount = Number(puja.tax_amount || 0);
      const finalTotal = Number(puja.final_total || originalCost + convenienceFee + bookingCharges + taxAmount);

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
          fee_amount: Number(puja.fee_amount || 0)
        }
      };

      const existingItemIndex = existingCart.findIndex(item => item.id === puja.id);

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
          <h2 className="puja-title">{puja.name}</h2>
          <p><strong>Temple:</strong> {puja.temple?.name || 'N/A'}</p>
          <p><strong>God:</strong> {puja.god?.name || 'N/A'}</p>
          <p><strong>Included:</strong> {puja.included || 'N/A'}</p>
          <p><strong>Excluded:</strong> {puja.excluded || 'N/A'}</p>
          <p><strong>Price:</strong> ₹{Number(puja.original_cost || puja.cost || 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</p>

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
        <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>About Puja</button>
        <button className={activeTab === 'benefits' ? 'active' : ''} onClick={() => setActiveTab('benefits')}>Benefits</button>
        <button className={activeTab === 'temple' ? 'active' : ''} onClick={() => setActiveTab('temple')}>Temple Details</button>
        <button className={activeTab === 'packages' ? 'active' : ''} onClick={() => setActiveTab('packages')}>Packages</button>
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
            <p>{puja.benefits || 'This puja is beneficial for spiritual harmony and inner peace.'}</p>
          </div>
        )}
        {activeTab === 'temple' && (
          <div>
            <h3>Temple Details</h3>
            <p>{puja.temple_details || 'This puja is conducted at a sacred temple location.'}</p>
          </div>
        )}
        {activeTab === 'packages' && (
          <div className="packages-content">
            {/* <h3>Packages</h3> */}
            
            <p>{puja.packages || 'Coming Soon.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PujaDetails;




















