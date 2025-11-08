// import React, { useEffect, useState, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../api/api';
// import '../styles/EventDetails.css';
// import OtpLoginModal from '../components/OtpLoginModal';
// import CheckoutModal from '../components/CheckoutModal';
// import { useUserAuth } from "../context/UserAuthContext";
// import { FaShareAlt, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter, FaLink } from "react-icons/fa";

// // Helper function to format dates
// const formatDate = (dateString) => {
//   if (!dateString) return 'Not specified';
//   const options = { year: 'numeric', month: 'long', day: 'numeric' };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// };

// const EventDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useUserAuth();
//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showOtpLogin, setShowOtpLogin] = useState(false);
//   const [showCheckout, setShowCheckout] = useState(false);
//   const [showShare, setShowShare] = useState(false);
//   const mediaRef = useRef(null);
//   const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://beta.devalayas.com';

//   useEffect(() => {
//     const fetchEventDetails = async () => {
//       setLoading(true);
//       try {
//         const response = await api.get(`/api/v1/devotee/event/?search=${id}`);
//         const eventData = response.data?.results?.[0];
//         if (eventData) {
//           setEvent(eventData);
//         } else {
//           setError('Event not found.');
//         }
//       } catch (err) {
//         console.error('API Error:', err);
//         setError('Failed to load event details. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchEventDetails();
//   }, [id]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showShare && !event.target.closest('.event-share-wrapper')) {
//         setShowShare(false);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [showShare]);

//   // const handleParticipate = () => {
//   //   if (!user) {
//   //     setShowOtpLogin(true);
//   //   } else {
//   //     if (event && event.pooja) {
//   //       const cartItem = { ...event.pooja, quantity: 1 };
//   //       localStorage.setItem('cart', JSON.stringify([cartItem]));
//   //       setShowCheckout(true);
//   //     }
//   //   }
//   // };

//   const handleParticipate = () => {
//   if (!user) {
//     setShowOtpLogin(true);
//   } else if (event && event.pooja) {
//     // ✅ detect if Prasadam is actually mentioned in details or included section
//     const hasPrasadam =
//       event.pooja.name?.toLowerCase().includes("prasadam") ||
//       event.pooja.included?.toLowerCase().includes("prasadam") ||
//       event.details?.toLowerCase().includes("prasadam");

//     const cartItem = {
//       ...event.pooja,
//       quantity: 1,
//       prasadam: hasPrasadam, // only mark true if explicitly found
//     };

//     console.log("🛒 Added to cart:", cartItem); // for debugging
//     localStorage.setItem("cart", JSON.stringify([cartItem]));
//     setShowCheckout(true);
//   }
// };


//   const handleLoginSuccess = () => {
//     setShowOtpLogin(false);
//     handleParticipate();
//   };


//   const getMediaUrl = (event) => {
//     if (event.video) return event.video;
//     if (event.image) return event.image;
//     if (event.temple?.images?.[0]?.image) {
//       const imagePath = event.temple.images[0].image;
//       return imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
//     }
//     return 'https://via.placeholder.com/1200x400?text=Event';
//   };

//   const parseCost = (details) => {
//     const costSection = details.split('Cost:\n')[1];
//     if (costSection) return costSection.split('\n\n')[0];
//     return "Cost not specified";
//   };

//   if (loading) return <div className="event-details-loading-container">Loading Event Details...</div>;
//   if (error) return <div className="event-details-error-container">{error}</div>;
//   if (!event) return null;

//   const shareUrl = encodeURIComponent(window.location.href);
//   const shareText = encodeURIComponent(`Check out this event: ${event.name} at Devalaya!`);

//   return (
//     <>
//       <div className="event-details-container">
//         <div className="event-details-card">
//           <div className="event-details-media">
//             <header className="event-details-header">
//               <h1 className="event-details-title">{event.name}</h1>
//               {event.temple && <p className="event-details-temple-name">{event.temple.name}</p>}
//               <p className="event-details-date">{formatDate(event.start)}</p>
//             </header>
//             {event.video ? (
//               <video ref={mediaRef} src={getMediaUrl(event)} autoPlay loop muted playsInline />
//             ) : (
//               <img ref={mediaRef} src={getMediaUrl(event)} alt={event.name} />
//             )}
//           </div>

//           <div className="event-details-content">
//             <div className="event-details-section about-section">
//               <div className="event-title-share">
//                 <h3>About this event</h3>
//                 <div className="event-share-wrapper">
//                   <FaShareAlt className="share-icon" onClick={() => setShowShare(!showShare)} />
//                   {showShare && (
//                     <div className="event-share-options">
//                       <a
//                         href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <FaWhatsapp /> WhatsApp
//                       </a>
//                       <a
//                         href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <FaFacebook /> Facebook
//                       </a>
//                       <a
//                         href={`https://www.instagram.com/?url=${shareUrl}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <FaInstagram /> Instagram
//                       </a>
//                       <a
//                         href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <FaTwitter /> Twitter
//                       </a>
//                       <button
//                         className="copy-link-btn"
//                         onClick={() => {
//                           navigator.clipboard.writeText(shareUrl);
//                           alert('Link copied to clipboard!');
//                         }}
//                       >
//                         <FaLink /> Copy Link
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <p>{event.details}</p>
//             </div>

//             {event.pooja && event.pooja.included && (
//               <div className="event-details-section">
//                 <h4>Included:</h4>
//                 <p>{event.pooja.included}</p>
//               </div>
//             )}

//             {event.pooja && event.pooja.excluded && (
//               <div className="event-details-section">
//                 <h4>Benefits:</h4>
//                 <p>{event.pooja.excluded}</p>
//               </div>
//             )}

//             <div className="event-details-cost-section">
//               <p>
//                 {event.pooja && event.pooja.original_cost
//                   ? `Cost: ₹${event.pooja.original_cost}`
//                   : parseCost(event.details)}
//               </p>
//             </div>

//             {!event.is_expired && (
//               <button onClick={handleParticipate} className="event-details-participate-button">
//                 Participate in Event
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="event-details-back-button-container">
//           <button onClick={() => navigate('/events')} className="event-details-back-button">
//             Back to All Events
//           </button>
//         </div>
//       </div>

//       {showOtpLogin && <OtpLoginModal onClose={() => setShowOtpLogin(false)} onLoginSuccess={handleLoginSuccess} />}
//       {showCheckout && <CheckoutModal open={showCheckout} onClose={() => setShowCheckout(false)} />}
//     </>
//   );
// };

// export default EventDetails;















import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../styles/EventDetails.css';
import OtpLoginModal from '../components/OtpLoginModal';
import CheckoutModal from '../components/CheckoutModal';
import { useUserAuth } from "../context/UserAuthContext";
import { FaShareAlt, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter, FaLink } from "react-icons/fa";

const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const shareRef = useRef(null);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://beta.devalayas.com';

  // ✅ Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/api/v1/devotee/event/?search=${id}`);
        const eventData = response.data?.results?.[0];
        if (eventData) {
          setEvent(eventData);
        } else {
          setError('Event not found.');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEventDetails();
  }, [id]);

  // ✅ Close share options when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShare(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleParticipate = () => {
    if (!user) {
      setShowOtpLogin(true);
    } else if (event && event.pooja) {
      const cartItem = { ...event.pooja, quantity: 1 };
      localStorage.setItem("cart", JSON.stringify([cartItem]));
      setShowCheckout(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowOtpLogin(false);
    handleParticipate();
  };

  const getMediaUrl = (event) => {
    if (event.video) return event.video;
    if (event.image) return event.image;
    if (event.temple?.images?.[0]?.image) {
      const imagePath = event.temple.images[0].image;
      return imagePath.startsWith("http") ? imagePath : `${BASE_URL}${imagePath}`;
    }
    return "https://via.placeholder.com/1200x400?text=Event";
  };

  const parseCost = (details) => {
    const costSection = details.split("Cost:\n")[1];
    if (costSection) return costSection.split("\n\n")[0];
    return "Cost not specified";
  };

  if (loading) return <div className="event-details-loading-container">Loading Event Details...</div>;
  if (error) return <div className="event-details-error-container">{error}</div>;
  if (!event) return null;

  // ✅ Share URLs
  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`Check out this event: ${event.name} at Devalaya!`);

  return (
    <>
      <div className="event-details-container">
        <div className="event-details-card">
          <div className="event-details-media">
            <header className="event-details-header">
              <h1 className="event-details-title">{event.name}</h1>
              {event.temple && <p className="event-details-temple-name">{event.temple.name}</p>}
              <p className="event-details-date">{formatDate(event.start)}</p>
            </header>

            {event.video ? (
              <video src={getMediaUrl(event)} autoPlay loop muted playsInline />
            ) : (
              <img src={getMediaUrl(event)} alt={event.name} />
            )}
          </div>

          <div className="event-details-content">
            <div className="event-details-section about-section">
              <div className="event-title-share">
                <h3>About this event</h3>

                {/* ✅ Share Button and Popup */}
                <div className="event-share-wrapper" ref={shareRef}>
                  <FaShareAlt
                    className="share-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowShare((prev) => !prev);
                    }}
                  />
                  {showShare && (
                    <div className="event-share-options">
                      <a
                        href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaWhatsapp /> WhatsApp
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFacebook /> Facebook
                      </a>
                      <a
                        href={`https://www.instagram.com/?url=${shareUrl}`}
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
                          navigator.clipboard.writeText(window.location.href);
                          alert("Link copied to clipboard!");
                        }}
                      >
                        <FaLink /> Copy Link
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p>{event.details}</p>
            </div>

            {event.pooja?.included && (
              <div className="event-details-section">
                <h4>Included:</h4>
                <p>{event.pooja.included}</p>
              </div>
            )}

            {event.pooja?.excluded && (
              <div className="event-details-section">
                <h4>Benefits:</h4>
                <p>{event.pooja.excluded}</p>
              </div>
            )}

            <div className="event-details-cost-section">
              <p>
                {event.pooja?.original_cost
                  ? `Cost: ₹${event.pooja.original_cost}`
                  : parseCost(event.details)}
              </p>
            </div>

            {!event.is_expired && (
              <button
                onClick={handleParticipate}
                className="event-details-participate-button"
              >
                Participate in Event
              </button>
            )}
          </div>
        </div>

        <div className="event-details-back-button-container">
          <button
            onClick={() => navigate('/events')}
            className="event-details-back-button"
          >
            Back to All Events
          </button>
        </div>
      </div>

      {showOtpLogin && (
        <OtpLoginModal
          onClose={() => setShowOtpLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showCheckout && (
        <CheckoutModal
          open={showCheckout}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </>
  );
};

export default EventDetails;
