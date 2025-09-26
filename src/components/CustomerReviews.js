// // src/components/CustomerReviews.js
// import React, { useState, useEffect } from "react";
// import "../styles/CustomerReviews.css";

// // 👉 20 Dummy customer reviews with local image paths
// const reviews = [
//   {
//     name: "Rohit john",
//     place: "Bangalore",
//     review:
//       "Booking a puja through Devalaya was so simple. The live streaming gave me the feeling of being inside the temple. Receiving prasadam at home made the whole experience complete.",
//     image: "/images/1.jpg",
//   },
//   {
//     name: "Priya Nair",
//     place: "Kochi",
//     review:
//       "My father couldn’t travel due to health issues, but Devalaya made it possible to offer puja from home. The chadhava process was smooth, and we felt truly connected to the divine.",
//     image: "/images/11.jpg",
//   },
//   {
//     name: "Ankit Verma",
//     place: "Lucknow",
//     review:
//       "I ordered a special Rudrabhishek puja. The priest performed everything with so much devotion. When the prasadam arrived, it felt blessed and full of positive energy.",
//     image: "/images/2.jpg",
//   },
//   {
//     name: "Shalini Deshpande",
//     place: "Pune",
//     review:
//       "Devalaya is a blessing for families staying away from their hometown temples. We offered chadhava online and still felt the same devotion as being there in person.",
//     image: "/images/12.jpg",
//   },
//   {
//     name: "Amit Tiwari",
//     place: "Varanasi",
//     review:
//       "The puja arrangements were authentic, and we received the video recording within hours. My mother was so happy to see everything happening so beautifully.",
//     image: "/images/3.jpg",
//   },
//   {
//     name: "Kavita Rao",
//     place: "Hyderabad",
//     review:
//       "I booked a Satyanarayan Katha for my home. The whole process was professional and divine. The prasadam was neatly packed and delivered on time.",
//     image: "/images/13.jpg",
//   },
//   {
//     name: "Vikram Joshi",
//     place: "Delhi",
//     review:
//       "The booking system was seamless, and the puja was conducted with so much dedication. It felt truly divine.",
//     image: "/images/4.jpg",
//   },
//   {
//     name: "Sneha Reddy",
//     place: "Chennai",
//     review:
//       "I loved the way everything was organized. The chadhava felt very authentic and holy.",
//     image: "/images/14.jpg",
//   },
//   {
//     name: "Suresh Patil",
//     place: "Nagpur",
//     review:
//       "I was amazed by how quickly the prasadam reached us. Truly grateful to Devalaya.",
//     image: "/images/5.jpg",
//   },
//   {
//     name: "Meena Gupta",
//     place: "Jaipur",
//     review:
//       "This platform makes connecting with God so simple, even from far away. Wonderful initiative!",
//     image: "/images/15.jpg",
//   },
//   {
//     name: "Rajesh Singh",
//     place: "Patna",
//     review:
//       "I booked a puja for my parents. They were very happy with the rituals and prasadam delivery.",
//     image: "/images/6.jpg",
//   },
//   {
//     name: "Nisha Kumari",
//     place: "Ranchi",
//     review:
//       "The priests performed the rituals so beautifully. We felt divine blessings at home.",
//     image: "/images/16.jpg",
//   },
//   {
//     name: "Arjun Mehta",
//     place: "Indore",
//     review:
//       "A very smooth experience. The puja videos made us feel like we were at the temple itself.",
//     image: "/images/7.jpg",
//   },
//   {
//     name: "Divya Kapoor",
//     place: "Amritsar",
//     review:
//       "Devalaya gave us the perfect way to connect spiritually while staying home. Highly recommend!",
//     image: "/images/17.jpg",
//   },
//   {
//     name: "Harish Kumar",
//     place: "Mysore",
//     review:
//       "The puja was performed with proper mantras and devotion. Truly blessed service.",
//     image: "/images/8.jpg",
//   },
//   {
//     name: "Anjali Mishra",
//     place: "Bhopal",
//     review:
//       "The prasadam was so fresh and neatly packed. Felt so connected to God!",
//     image: "/images/18.jpg",
//   },
//   {
//     name: "Ramesh Iyer",
//     place: "Coimbatore",
//     review:
//       "For people like us staying far from temples, Devalaya is a true blessing. Beautifully managed!",
//     image: "/images/9.jpg",
//   },
//   {
//     name: "Sonia D’Souza",
//     place: "Mangalore",
//     review:
//       "I booked online puja for my family. Everything was done so perfectly, and we felt blessed.",
//     image: "/images/19.jpg",
//   },
//   {
//     name: "Manoj Kulkarni",
//     place: "Aurangabad",
//     review:
//       "Amazing initiative! The whole process from booking to prasadam delivery was smooth.",
//     image: "/images/10.jpg",
//   },
//   {
//     name: "Pooja Sharma",
//     place: "Delhi",
//     review:
//       "It’s such a divine experience to be part of the rituals virtually. Thank you Devalaya!",
//     image: "/images/20.jpg",
//   },
// ];

// const CustomerReviews = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Autoplay: move 1 review at a time
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % reviews.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const handlePrev = () => {
//     setCurrentIndex((prev) =>
//       prev - 1 < 0 ? reviews.length - 1 : prev - 1
//     );
//   };

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev + 1) % reviews.length);
//   };

//   return (
//     <section className="customer-reviews-section">
//       <div className="text-center">
//         <h5 className="section-title">Customers Reviews</h5>
//       </div>

//       {/* ✅ Sliding container */}
//       <div className="slider-container">
//         <div
//           className="slider-track"
//           style={{
//             transform: `translateX(-${currentIndex * (100 / 3)}%)`,
//           }}
//         >
//           {reviews.concat(reviews).map((review, idx) => (
//             <div key={idx} className="review-card">
//               <img
//                 src={review.image}
//                 alt={review.name}
//                 className="review-image"
//                 onError={(e) => {
//                   e.target.src = "/images/fallback.jpg"; // Fallback image
//                   e.target.alt = "Fallback Image";
//                 }}
//               />
//               <p className="review-text">“{review.review}”</p>
//               <h6 className="review-author">{review.name}</h6>
//               <p className="review-place">{review.place}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="review-navigation">
//         <button className="nav-btn" onClick={handlePrev}>
//           &lt;
//         </button>
//         <button className="nav-btn" onClick={handleNext}>
//           &gt;
//         </button>
//       </div>
//     </section>
//   );
// };

// export default CustomerReviews;














import React, { useState, useEffect } from "react";
import "../styles/CustomerReviews.css";

// 👉 20 Dummy customer reviews with local image paths
const reviews = [
  { name: "Rohit john",
     place: "Bangalore", 
     review: "Booking a puja through Devalaya was so simple. The live streaming gave me the feeling of being inside the temple. Receiving prasadam at home made the whole experience complete.", 
     image: "/images/1.webp" },
  { name: "Priya Nair",
     place: "Kochi", 
     review: "My father couldn’t travel due to health issues, but Devalaya made it possible to offer puja from home. The chadhava process was smooth, and we felt truly connected to the divine.", 
     image: "/images/11.jpg" },
  { name: "Ankit Verma", 
    place: "Lucknow", 
    review: "I ordered a special Rudrabhishek puja. The priest performed everything with so much devotion. When the prasadam arrived, it felt blessed and full of positive energy.", 
    image: "/images/2.jpg" },
  { name: "Shalini Deshpande", 
    place: "Pune", 
    review: "Devalaya is a blessing for families staying away from their hometown temples. We offered chadhava online and still felt the same devotion as being there in person.", 
    image: "/images/12.jpg" },
  { name: "Amit Tiwari", 
    place: "Varanasi", 
    review: "The puja arrangements were authentic, and we received the video recording within hours. My mother was so happy to see everything happening so beautifully.", 
    image: "/images/3.jpg" },
  { name: "Kavita Rao", 
    place: "Hyderabad", 
    review: "I booked a Satyanarayan Katha for my home. The whole process was professional and divine. The prasadam was neatly packed and delivered on time.", 
    image: "/images/13.jpg" },
  { name: "Vikram Joshi", 
    place: "Delhi", 
    review: "The booking system was seamless, and the puja was conducted with so much dedication. It felt truly divine.", 
    image: "/images/4.jpg" },
  { name: "Sneha Reddy", 
    place: "Chennai", 
    review: "I loved the way everything was organized. The chadhava felt very authentic and holy.", 
    image: "/images/14.jpg" },
  { name: "Suresh Patil", 
    place: "Nagpur", 
    review: "I was amazed by how quickly the prasadam reached us. Truly grateful to Devalaya.", 
    image: "/images/5.jpg" },
  { name: "Meena Gupta", 
    place: "Jaipur", 
    review: "This platform makes connecting with God so simple, even from far away. Wonderful initiative!", 
    image: "/images/15.jpg" },
  { name: "Rajesh Singh", 
    place: "Patna", 
    review: "I booked a puja for my parents. They were very happy with the rituals and prasadam delivery.", 
    image: "/images/6.jpg" },
  { name: "Nisha Kumari", 
    place: "Ranchi", 
    review: "The priests performed the rituals so beautifully. We felt divine blessings at home.", 
    image: "/images/16.jpg" },
  { name: "Arjun Mehta", 
    place: "Indore", 
    review: "A very smooth experience. The puja videos made us feel like we were at the temple itself.", 
    image: "/images/7.jpg" },
  { name: "Divya Kapoor", 
    place: "Amritsar", 
    review: "Devalaya gave us the perfect way to connect spiritually while staying home. Highly recommend!", 
    image: "/images/17.jpg" },
  { name: "Harish Kumar", 
    place: "Mysore", 
    review: "The puja was performed with proper mantras and devotion. Truly blessed service.", 
    image: "/images/8.jpg" },
  { name: "Anjali Mishra", 
    place: "Bhopal", 
    review: "The prasadam was so fresh and neatly packed. Felt so connected to God!", 
    image: "/images/18.jpg" },
  { name: "Ramesh Iyer", 
    place: "Coimbatore", 
    review: "For people like us staying far from temples, Devalaya is a true blessing. Beautifully managed!", 
    image: "/images/9.jpg" },
  { name: "Sonia D’Souza", 
    place: "Mangalore", 
    review: "I booked online puja for my family. Everything was done so perfectly, and we felt blessed.", 
    image: "/images/19.jpg" },
  { name: "Manoj Kulkarni", 
    place: "Aurangabad", 
    review: "Amazing initiative! The whole process from booking to prasadam delivery was smooth.", 
    image: "/images/10.jpg" },
  { name: "Pooja Sharma", 
    place: "Delhi", 
    review: "It’s such a divine experience to be part of the rituals virtually. Thank you Devalaya!", 
    image: "/images/20.jpg" },
];

const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  // 🔹 Adjust number of visible cards based on screen width
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth <= 768) {
        setCardsPerView(1);
      } else if (window.innerWidth <= 992) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  // 🔹 Autoplay: move 1 card at a time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev - 1 < 0 ? reviews.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section className="customer-reviews-section">
      <div className="text-center">
        <h5 className="section-title">Customers Reviews</h5>
      </div>

      {/* ✅ Sliding container */}
      <div className="slider-container">
        <div
          className="slider-track"
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
          }}
        >
          {reviews.concat(reviews).map((review, idx) => (
            <div key={idx} className="review-card">
              <img
                src={review.image}
                alt={review.name}
                className="review-image"
                onError={(e) => {
                  e.target.src = "/images/fallback.jpg"; // Fallback image
                  e.target.alt = "Fallback Image";
                }}
              />
              <p className="review-text">“{review.review}”</p>
              <h6 className="review-author">{review.name}</h6>
              <p className="review-place">{review.place}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="review-navigation">
        <button className="nav-btn" onClick={handlePrev}>
          &lt;
        </button>
        <button className="nav-btn" onClick={handleNext}>
          &gt;
        </button>
      </div>
    </section>
  );
};

export default CustomerReviews;
