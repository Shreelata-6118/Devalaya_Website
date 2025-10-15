// import React, { useState } from "react";
// import { FaStar, FaUserCircle } from "react-icons/fa";
// import "../styles/ReviewsPopup.css";

// const ReviewsPopup = ({ puja, closePopup }) => {
//   const allReviews = [
//     {
//       user: "Shalini Verma",
//       date: "23 July, 2025",
//       rating: 5,
//       comment:
//         "I’m grateful to Devalaya for arranging this puja online. The entire process was smooth, and I could feel a divine connection even from home. The priests chanted with full devotion. Jai Kedareswar Mahadev!",
//     },
//     {
//       user: "karan joshi",
//       date: "15 June, 2025",
//       rating: 5,
//       comment:
//         "A divine experience! The video clarity was excellent, and the chanting felt so pure. Devalaya truly brings spirituality closer to everyone. Feeling blessed and thankful.",
//     },
//     {
//       user: "Anita Sharma",
//       date: "02 May, 2025",
//       rating: 5,
//       comment:
//         "I never thought online pujas could be this powerful. The priests were sincere, and I could hear my name during sankalp. Thanks to Devalaya for this divine arrangement!",
//     },
//     {
//       user: "Rahul Mehta",
//       date: "28 March, 2025",
//       rating: 4,
//       comment:
//         "Beautifully conducted puja! The instructions were clear and the video coverage was perfect. I recommend Devalaya to everyone seeking peace and blessings at home.",
//     },
//     {
//       user: "Pooja Iyer",
//       date: "12 February, 2025",
//       rating: 5,
//       comment:
//         "An amazing initiative by Devalaya. The online Rudrabhishek felt so real and divine. It brought a sense of calm and connection with Lord Shiva in my home.",
//     },
//     {
//       user: "Vikram Singh",
//       date: "10 January, 2025",
//       rating: 5,
//       comment:
//         "This was my first online puja experience and I was amazed. The Devalaya team managed everything perfectly. I felt very peaceful watching the live rituals.",
//     },
//     {
//       user: "Nidhi Agarwal",
//       date: "25 December, 2024",
//       rating: 5,
//       comment:
//         "The puja was so beautifully conducted. I could clearly hear my name in the sankalp. Thank you Devalaya for allowing devotees like us to be part of such divine events.",
//     },
//     {
//       user: "Ramesh Kumar",
//       date: "14 November, 2024",
//       rating: 5,
//       comment:
//         "Highly satisfied with Devalaya’s service. The communication was prompt and the puja process was transparent. I feel spiritually uplifted after participating.",
//     },
//     {
//       user: "murali navi",
//       date: "20 October, 2024",
//       rating: 5,
//       comment:
//         "Devalaya’s puja brought a sense of peace and positivity into my life. The priests performed everything sincerely and the chanting filled my home with divine energy.",
//     },
//     {
//       user: "Arun Joshi",
//       date: "11 September, 2024",
//       rating: 5,
//       comment:
//         "I booked the Mahamangalarti puja and it was an extraordinary experience. The entire process was seamless, and I received the prasadam promptly. Jai Bholenath!",
//     },
//     {
//       user: "Kavita Nair",
//       date: "19 August, 2024",
//       rating: 4,
//       comment:
//         "The Rudrabhishek puja was very well organized. I’m impressed by the dedication of the Devalaya team. A great way to stay connected to our traditions.",
//     },
//     {
//       user: "Amit Patel",
//       date: "30 July, 2024",
//       rating: 5,
//       comment:
//         "Excellent puja arrangements by Devalaya. The priests performed each mantra carefully. Felt peaceful and blessed after watching the live stream.",
//     },
//     {
//       user: "Deepika Rao",
//       date: "10 June, 2024",
//       rating: 5,
//       comment:
//         "Very professional and divine service. The puja was done exactly as described and I received blessings beyond words. Thanks, Devalaya team!",
//     },
//     {
//       user: "Mohit Sinha",
//       date: "25 April, 2024",
//       rating: 4,
//       comment:
//         "Participating through Devalaya was easy and devotional. The video and sound were clear, and I loved how organized everything was. Highly recommended.",
//     },
//     {
//       user: "Sneha Kapoor",
//       date: "12 March, 2024",
//       rating: 5,
//       comment:
//         "My entire family watched the live puja together. The atmosphere felt divine. Thank you, Devalaya, for connecting us spiritually from afar.",
//     },
//     {
//       user: "Rajesh Pillai",
//       date: "01 February, 2024",
//       rating: 5,
//       comment:
//         "Truly satisfying experience. The priests were devoted and the rituals felt authentic. It’s a blessing to have Devalaya make pujas accessible to everyone.",
//     },
//     {
//       user: "Kiran Deshmukh",
//       date: "18 December, 2023",
//       rating: 5,
//       comment:
//         "Excellent service by Devalaya! The puja was conducted with utmost sincerity, and I could feel the divine presence. Will surely participate again.",
//     },
//     {
//       user: "Manisha Gupta",
//       date: "30 November, 2023",
//       rating: 5,
//       comment:
//         "Beautifully performed rituals. I loved how Devalaya coordinated everything so well. The priests pronounced every mantra perfectly. Jai Mahadev!",
//     },
//     {
//       user: "Sandeep Yadav",
//       date: "09 October, 2023",
//       rating: 4,
//       comment:
//         "A calm and spiritual experience. Watching the puja live brought peace to my heart. Thank you, Devalaya, for such devotion-filled services.",
//     },
//     {
//       user: "Priya Menon",
//       date: "15 September, 2023",
//       rating: 5,
//       comment:
//         "The overall experience was excellent. The communication from the team was clear, and the priests conducted every step as described. Feeling blessed.",
//     },
//     {
//       user: "Harish Reddy",
//       date: "12 August, 2023",
//       rating: 5,
//       comment:
//         "The Devalaya puja experience exceeded my expectations. The process was seamless, and the live chanting gave a divine atmosphere at home.",
//     },
//     {
//       user: "Shreya Ghosh",
//       date: "24 July, 2023",
//       rating: 5,
//       comment:
//         "Truly divine! The Rudrabhishek performed through Devalaya brought immense peace. I could feel positive energy throughout my home. Jai Mahadev!",
//     },
//     {
//       user: "Aakash Jain",
//       date: "30 June, 2023",
//       rating: 5,
//       comment:
//         "Devalaya’s puja service is outstanding. The rituals were performed exactly on the promised time. My faith in online pujas has grown even stronger.",
//     },
//     {
//       user: "Rekha Patil",
//       date: "05 May, 2023",
//       rating: 4,
//       comment:
//         "The puja arrangements were well coordinated. The chanting was beautiful and the entire process felt authentic. Grateful to Devalaya.",
//     },
//     {
//       user: "Anil Bhattacharya",
//       date: "18 March, 2023",
//       rating: 5,
//       comment:
//         "Devalaya brought temple blessings directly to our home. The puja was peaceful and very powerful. I’ll definitely recommend it to family and friends.",
//     },
//     {
//       user: "Lakshmi Nair",
//       date: "11 February, 2023",
//       rating: 5,
//       comment:
//         "Very satisfying experience. The Devalaya team ensured proper communication and the priests performed the rituals with full devotion. Jai Shiva!",
//     },
//     {
//       user: "Neeraj Tiwari",
//       date: "22 January, 2023",
//       rating: 4,
//       comment:
//         "This was a deeply spiritual experience. Everything from booking to live viewing was smooth. Devalaya made it effortless to stay connected to faith.",
//     },
//     {
//       user: "Rashmi Kapoor",
//       date: "20 December, 2022",
//       rating: 5,
//       comment:
//         "The priests performed the puja beautifully, and I was able to watch it live without issues. I truly appreciate Devalaya’s devotion-driven service.",
//     },
//     {
//       user: "Rohan Shetty",
//       date: "05 November, 2022",
//       rating: 5,
//       comment:
//         "The Devalaya puja brought calmness to my entire family. The mantras were chanted perfectly. I could feel positivity all day.",
//     },
//     {
//       user: "Tanvi Khanna",
//       date: "25 September, 2022",
//       rating: 5,
//       comment:
//         "Wonderful initiative by Devalaya! The online experience was smooth, and the entire ritual felt pure and divine. Thank you for this spiritual service.",
//     },
//     {
//       user: "Karan Malhotra",
//       date: "12 August, 2022",
//       rating: 5,
//       comment:
//         "A very well-organized puja. I was able to feel connected even from miles away. Thanks to Devalaya for this thoughtful platform.",
//     },
//     {
//       user: "Snehal Joshi",
//       date: "03 July, 2022",
//       rating: 4,
//       comment:
//         "Participating through Devalaya was truly wonderful. The priests performed with devotion, and the entire event brought inner peace.",
//     },
//   ];

//   const [visibleCount, setVisibleCount] = useState(8);

//   return (
//     <div className="reviews-overlay">
//       <div className="reviews-popup">
//         <button className="close-btn" onClick={closePopup}>
//           ×
//         </button>
//         <h2>User Reviews</h2>

//         <div className="reviews-summary">
//           <div>
//             <h3>⭐ {puja.rating || 4.9}</h3>
//             <p>Puja Rating</p>
//           </div>
//           <div>
//             <h3>3 Lakh+</h3>
//             <p>Users Booked</p>
//           </div>
//           <div>
//             <h3>10000+</h3>
//             <p>User Reviews</p>
//           </div>
//         </div>

//         <div className="reviews-list">
//           {allReviews.slice(0, visibleCount).map((rev, index) => (
//             <div key={index} className="review-card">
//               <div className="review-header-inline">
//                 <FaUserCircle size={28} color="#FF9800" />
//                 <div className="review-user">
//                   <span className="user-name">{rev.user}</span>
//                   <span className="review-date">{rev.date}</span>
//                 </div>
//               </div>

//               <div className="stars">
//                 {Array.from({ length: rev.rating }).map((_, i) => (
//                   <FaStar key={i} color="#FFC107" />
//                 ))}
//               </div>

//               <p className="review-text">{rev.comment}</p>
//             </div>
//           ))}

//           {visibleCount < allReviews.length && (
//             <button
//               className="read-more-btn"
//               onClick={() => setVisibleCount((prev) => prev + 8)}
//             >
//               Read More Reviews
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewsPopup;













import React, { useState } from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";
import "../styles/ReviewsPopup.css";

const ReviewsPopup = ({ puja, closePopup }) => {
  const allReviews = [
    { user: "Shalini Verma", date: "23 July, 2025", rating: 5, comment: "I’m grateful to Devalaya for arranging this puja online. The entire process was smooth, and I could feel a divine connection even from home. The priests chanted with full devotion. Jai Kedareswar Mahadev!" },
    { user: "karan joshi", date: "15 June, 2025", rating: 5, comment: "A divine experience! The video clarity was excellent, and the chanting felt so pure. Devalaya truly brings spirituality closer to everyone. Feeling blessed and thankful." },
    { user: "Anita Sharma", date: "02 May, 2025", rating: 5, comment: "I never thought online pujas could be this powerful. The priests were sincere, and I could hear my name during sankalp. Thanks to Devalaya for this divine arrangement!" },
    { user: "Rahul Mehta", date: "28 March, 2025", rating: 4, comment: "Beautifully conducted puja! The instructions were clear and the video coverage was perfect. I recommend Devalaya to everyone seeking peace and blessings at home." },
    { user: "Pooja Iyer", date: "12 February, 2025", rating: 5, comment: "An amazing initiative by Devalaya. The online Rudrabhishek felt so real and divine. It brought a sense of calm and connection with Lord Shiva in my home." },
    { user: "Vikram Singh", date: "10 January, 2025", rating: 5, comment: "This was my first online puja experience and I was amazed. The Devalaya team managed everything perfectly. I felt very peaceful watching the live rituals." },
    { user: "Nidhi Agarwal", date: "25 December, 2024", rating: 5, comment: "The puja was so beautifully conducted. I could clearly hear my name in the sankalp. Thank you Devalaya for allowing devotees like us to be part of such divine events." },
    { user: "Ramesh Kumar", date: "14 November, 2024", rating: 5, comment: "Highly satisfied with Devalaya’s service. The communication was prompt and the puja process was transparent. I feel spiritually uplifted after participating." },
    { user: "murali navi", date: "20 October, 2024", rating: 5, comment: "Devalaya’s puja brought a sense of peace and positivity into my life. The priests performed everything sincerely and the chanting filled my home with divine energy." },
    { user: "Arun Joshi", date: "11 September, 2024", rating: 5, comment: "I booked the Mahamangalarti puja and it was an extraordinary experience. The entire process was seamless, and I received the prasadam promptly. Jai Bholenath!" },
    {
      user: "Kavita Nair",
      date: "19 August, 2024",
      rating: 4,
      comment:
        "The Rudrabhishek puja was very well organized. I’m impressed by the dedication of the Devalaya team. A great way to stay connected to our traditions.",
    },
    {
      user: "Amit Patel",
      date: "30 July, 2024",
      rating: 5,
      comment:
        "Excellent puja arrangements by Devalaya. The priests performed each mantra carefully. Felt peaceful and blessed after watching the live stream.",
    },
    {
      user: "Deepika Rao",
      date: "10 June, 2024",
      rating: 5,
      comment:
        "Very professional and divine service. The puja was done exactly as described and I received blessings beyond words. Thanks, Devalaya team!",
    },
    {
      user: "Mohit Sinha",
      date: "25 April, 2024",
      rating: 4,
      comment:
        "Participating through Devalaya was easy and devotional. The video and sound were clear, and I loved how organized everything was. Highly recommended.",
    },
    {
      user: "Sneha Kapoor",
      date: "12 March, 2024",
      rating: 5,
      comment:
        "My entire family watched the live puja together. The atmosphere felt divine. Thank you, Devalaya, for connecting us spiritually from afar.",
    },
    {
      user: "Rajesh Pillai",
      date: "01 February, 2024",
      rating: 5,
      comment:
        "Truly satisfying experience. The priests were devoted and the rituals felt authentic. It’s a blessing to have Devalaya make pujas accessible to everyone.",
    },
    {
      user: "Kiran Deshmukh",
      date: "18 December, 2023",
      rating: 5,
      comment:
        "Excellent service by Devalaya! The puja was conducted with utmost sincerity, and I could feel the divine presence. Will surely participate again.",
    },
    {
      user: "Manisha Gupta",
      date: "30 November, 2023",
      rating: 5,
      comment:
        "Beautifully performed rituals. I loved how Devalaya coordinated everything so well. The priests pronounced every mantra perfectly. Jai Mahadev!",
    },
    {
      user: "Sandeep Yadav",
      date: "09 October, 2023",
      rating: 4,
      comment:
        "A calm and spiritual experience. Watching the puja live brought peace to my heart. Thank you, Devalaya, for such devotion-filled services.",
    },
    {
      user: "Priya Menon",
      date: "15 September, 2023",
      rating: 5,
      comment:
        "The overall experience was excellent. The communication from the team was clear, and the priests conducted every step as described. Feeling blessed.",
    },
    {
      user: "Harish Reddy",
      date: "12 August, 2023",
      rating: 5,
      comment:
        "The Devalaya puja experience exceeded my expectations. The process was seamless, and the live chanting gave a divine atmosphere at home.",
    },
    {
      user: "Shreya Ghosh",
      date: "24 July, 2023",
      rating: 5,
      comment:
        "Truly divine! The Rudrabhishek performed through Devalaya brought immense peace. I could feel positive energy throughout my home. Jai Mahadev!",
    },
    {
      user: "Aakash Jain",
      date: "30 June, 2023",
      rating: 5,
      comment:
        "Devalaya’s puja service is outstanding. The rituals were performed exactly on the promised time. My faith in online pujas has grown even stronger.",
    },
    {
      user: "Rekha Patil",
      date: "05 May, 2023",
      rating: 4,
      comment:
        "The puja arrangements were well coordinated. The chanting was beautiful and the entire process felt authentic. Grateful to Devalaya.",
    },
    {
      user: "Anil Bhattacharya",
      date: "18 March, 2023",
      rating: 5,
      comment:
        "Devalaya brought temple blessings directly to our home. The puja was peaceful and very powerful. I’ll definitely recommend it to family and friends.",
    },
    {
      user: "Lakshmi Nair",
      date: "11 February, 2023",
      rating: 5,
      comment:
        "Very satisfying experience. The Devalaya team ensured proper communication and the priests performed the rituals with full devotion. Jai Shiva!",
    },
    {
      user: "Neeraj Tiwari",
      date: "22 January, 2023",
      rating: 4,
      comment:
        "This was a deeply spiritual experience. Everything from booking to live viewing was smooth. Devalaya made it effortless to stay connected to faith.",
    },
    {
      user: "Rashmi Kapoor",
      date: "20 December, 2022",
      rating: 5,
      comment:
        "The priests performed the puja beautifully, and I was able to watch it live without issues. I truly appreciate Devalaya’s devotion-driven service.",
    },
    {
      user: "Rohan Shetty",
      date: "05 November, 2022",
      rating: 5,
      comment:
        "The Devalaya puja brought calmness to my entire family. The mantras were chanted perfectly. I could feel positivity all day.",
    },
    {
      user: "Tanvi Khanna",
      date: "25 September, 2022",
      rating: 5,
      comment:
        "Wonderful initiative by Devalaya! The online experience was smooth, and the entire ritual felt pure and divine. Thank you for this spiritual service.",
    },
    {
      user: "Karan Malhotra",
      date: "12 August, 2022",
      rating: 5,
      comment:
        "A very well-organized puja. I was able to feel connected even from miles away. Thanks to Devalaya for this thoughtful platform.",
    },
    {
      user: "Snehal Joshi",
      date: "03 July, 2022",
      rating: 4,
      comment:
        "Participating through Devalaya was truly wonderful. The priests performed with devotion, and the entire event brought inner peace.",
    },
  ];

  const [visibleCount, setVisibleCount] = useState(8);

  return (
    <div className="reviews-overlay">
      <div className="reviews-popup">
        <div className="sticky-header">
          <h2>User Reviews</h2>
          <button className="close-btn" onClick={closePopup}>×</button>
        </div>

        <div className="reviews-summary">
          <div>
            <h3>⭐ {puja.rating || 4.9}</h3>
            <p>Puja Rating</p>
          </div>
          <div>
            <h3>3 Lakh+</h3>
            <p>Users Booked</p>
          </div>
          <div>
            <h3>10000+</h3>
            <p>User Reviews</p>
          </div>
        </div>

        <div className="reviews-list">
          {allReviews.slice(0, visibleCount).map((rev, index) => (
            <div key={index} className="review-card">
              <div className="review-header-inline">
                <FaUserCircle size={28} color="#FF9800" />
                <div className="review-user">
                  <span className="user-name">{rev.user}</span>
                  <span className="review-date">{rev.date}</span>
                </div>
              </div>
              <div className="stars">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <FaStar key={i} color="#FFC107" />
                ))}
              </div>
              <p className="review-text">{rev.comment}</p>
            </div>
          ))}
          {visibleCount < allReviews.length && (
            <button className="read-more-btn" onClick={() => setVisibleCount((prev) => prev + 8)}>
              Read More Reviews
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPopup;
