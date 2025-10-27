// import React, { useEffect, useState } from "react";
// import "../styles/Panchang.css";
// import { FaSun, FaMoon } from "react-icons/fa";

// const Panchang = () => {
//   const [today] = useState(new Date());

//   const formattedDate = today.toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//     weekday: "long",
//   });

//   // Sample Panchang Data (You can replace this with API later)
//   const panchangData = {
//     tithi: { name: "Dwadashi", paksha: "Shukla Paksha", month: "Phalguna" },
//     auspicious: [
//       { title: "Abhijit Muhurat", time: "10:46 AM to 11:32 AM" },
//       { title: "Amrit Kaal", time: "7:07 AM to 8:54 AM" },
//       { title: "Brahma Muhurat", time: "5:24 AM to 5:54 AM" },
//     ],
//     inauspicious: [
//       { title: "Rahu Kaal", time: "1:11 PM to 2:44 PM" },
//       { title: "Yamaganda", time: "5:23 AM to 6:57 AM" },
//       { title: "Gulika", time: "8:30 AM to 10:04 AM" },
//       { title: "Dur Muhurat", time: "9:14 AM to 10:00 AM" },
//     ],
//     sunrise: "5:23 AM",
//     sunset: "5:51 PM",
//     moonrise: "3:49 PM",
//     moonset: "4:14 AM",
//     karana: [
//       { title: "Garija", time: "12:24 PM to 2:10 PM" },
//       { title: "Vanija", time: "2:10 PM to 3:22 AM" },
//     ],
//     yoga: "Dhruva",
//     nakshatra: ["Uttara Phalguni", "Hasta"],
//     festivals: [
//       {
//         date: "Oct 23",
//         name: "Bhai Dooj",
//         desc: "A day to honor the sacred bond between brothers and sisters.",
//       },
//       {
//         date: "Oct 23",
//         name: "Guruvaar Visesh",
//         desc: "Thursday fast for Lord Vishnu and strong Jupiter in Kundali.",
//       },
//       {
//         date: "Oct 24",
//         name: "Shukravaar Visesh",
//         desc: "Friday fast for Goddess Lakshmi and prosperity.",
//       },
//       {
//         date: "Oct 25",
//         name: "Vinayak Chaturthi (Kartick Maas Visesh)",
//         desc: "Day of Lord Ganesha for success and wisdom.",
//       },
//     ],
//   };

//   return (
//     <div className="panchang-page">
//       <div className="panchang-header">
//         <h2>Today's Panchang</h2>
//         <p>Utsav Panchang - Precise, Authentic & Rooted in Tradition</p>
//         <h4>{formattedDate}</h4>
//       </div>

//       <div className="panchang-content">
//         {/* LEFT COLUMN */}
//         <div className="panchang-left">
//           <div className="tithi-card">
//             <h3>
//               {panchangData.tithi.month} - {panchangData.tithi.paksha} -{" "}
//               {panchangData.tithi.name}
//             </h3>
//           </div>

//           <div className="panchang-card auspicious">
//             <h4>Auspicious Time</h4>
//             {panchangData.auspicious.map((item, i) => (
//               <p key={i}>
//                 <strong>{item.title}</strong>: {item.time}
//               </p>
//             ))}
//           </div>

//           <div className="panchang-card inauspicious">
//             <h4>Inauspicious Time</h4>
//             {panchangData.inauspicious.map((item, i) => (
//               <p key={i}>
//                 <strong>{item.title}</strong>: {item.time}
//               </p>
//             ))}
//           </div>

//           <div className="sunrise-card">
//             <div className="sun-time">
//               <FaSun /> <span>Sunrise: {panchangData.sunrise}</span>
//             </div>
//             <div className="sun-time">
//               <FaSun /> <span>Sunset: {panchangData.sunset}</span>
//             </div>
//             <div className="moon-time">
//               <FaMoon /> <span>Moonrise: {panchangData.moonrise}</span>
//             </div>
//             <div className="moon-time">
//               <FaMoon /> <span>Moonset: {panchangData.moonset}</span>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="panchang-right">
//           <div className="panchang-card karana-yoga">
//             <h4>Tithi, Nakshatra, Karana & Yoga</h4>
//             <p>
//               <strong>Nakshatra:</strong> {panchangData.nakshatra.join(", ")}
//             </p>
//             <p>
//               <strong>Karana:</strong>{" "}
//               {panchangData.karana.map((k) => k.title).join(", ")}
//             </p>
//             <p>
//               <strong>Yoga:</strong> {panchangData.yoga}
//             </p>
//           </div>

//           <div className="panchang-card festivals">
//             <h4>Upcoming Festivals</h4>
//             <ul>
//               {panchangData.festivals.map((fest, i) => (
//                 <li key={i}>
//                   <span className="fest-date">{fest.date}</span>
//                   <div className="fest-info">
//                     <strong>{fest.name}</strong>
//                     <p>{fest.desc}</p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Panchang;


















import React, { useState } from "react";
import "../styles/Panchang.css";

const panchangData = {
  "2025-10-24": {
    date: "24 October 2025, Friday",
    tithi: "Shukla-Paksha Navami",
    nakshatra: "Dhanishtha",
    yoga: "Dand",
    karana: "Kaulav",
    monthAmanta: "Kartika",
    monthPurnimanta: "Kartika",
    vikramSamvat: "2082 (Kaalyukt)",
    shakaSamvat: "1947 (Vishwavasu)",
    sunSign: "Libra",
    moonSign: "Capricorn",
    dishashool: "WEST",
    moonPlacement: "SOUTH",
    season: "Sharad",
    ayana: "Dakshinayana",
    auspicious: "11:19 AM – 12:03 PM",
    gulikaKaal: "11:41 AM – 1:06 PM",
    rahuKaal: "2:30 PM – 3:55 PM",
    yamghantKaal: "8:52 AM – 10:17 AM",
    sunrise: "6:03 AM",
    sunset: "5:19 PM",
    moonrise: "11:50 AM",
    moonset: "10:24 PM",
    festivals: [
      "Ayudha Puja",
      "Durga Balidan",
      "Maha Navami",
      "Saraswati Pooja",
      "Bengal Vijayadashami",
      "Dussehra",
    ],
  },
  "2025-10-25": {
    date: "25 October 2025, Saturday",
    tithi: "Shukla-Paksha Dashami",
    nakshatra: "Shatabhisha",
    yoga: "Vyatipata",
    karana: "Taitila",
    monthAmanta: "Kartika",
    monthPurnimanta: "Kartika",
    vikramSamvat: "2082 (Kaalyukt)",
    shakaSamvat: "1947 (Vishwavasu)",
    sunSign: "Libra",
    moonSign: "Aquarius",
    dishashool: "NORTH",
    moonPlacement: "EAST",
    season: "Sharad",
    ayana: "Dakshinayana",
    auspicious: "10:30 AM – 11:15 AM",
    gulikaKaal: "12:00 PM – 1:30 PM",
    rahuKaal: "9:00 AM – 10:30 AM",
    yamghantKaal: "3:00 PM – 4:30 PM",
    sunrise: "6:04 AM",
    sunset: "5:18 PM",
    moonrise: "12:30 PM",
    moonset: "11:00 PM",
    festivals: ["Papankusha Ekadashi", "Gandhi Jayanti", "Madhvacharya Jayanti"],
  },
};

const Panchang = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  const data = panchangData[date];

  const changeDate = (offset) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + offset);
    setDate(newDate.toISOString().split("T")[0]);
  };

  return (
    <div className="panchang-main">
      <div className="panchang-header">
        <h2>🕉 Daily Panchang</h2>
        <div className="controls">
          <button onClick={() => changeDate(-1)}>←</button>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={() => changeDate(1)}>→</button>
        </div>
      </div>

      {data ? (
        <div className="panchang-grid">
          {/* Left Section */}
          <div className="left-box">
            <div className="today-card">
              <h4>{data.tithi}</h4>
              <p>{data.date}</p>
            </div>

            <div className="timing-section">
              <h4>Auspicious / Inauspicious Timings</h4>
              <div className="timing-grid">
                <div className="timing-card green">
                  <p>✅ Auspicious</p>
                  <p>{data.auspicious}</p>
                </div>
                <div className="timing-card yellow">
                  <p>🕐 Gulik Kaal</p>
                  <p>{data.gulikaKaal}</p>
                </div>
                <div className="timing-card red">
                  <p>⚠️ Rahu Kaal</p>
                  <p>{data.rahuKaal}</p>
                </div>
                <div className="timing-card pink">
                  <p>🕒 Yamghant Kaal</p>
                  <p>{data.yamghantKaal}</p>
                </div>
              </div>
            </div>

            <div className="sun-section">
              <h4>Sunrise - Sunset</h4>
              <ul>
                <li>🌅 Sunrise: {data.sunrise}</li>
                <li>🌇 Sunset: {data.sunset}</li>
                <li>🌙 Moonrise: {data.moonrise}</li>
                <li>🌘 Moonset: {data.moonset}</li>
              </ul>
            </div>
          </div>

          {/* Middle Section */}
          <div className="center-box">
            <h4>Panchang</h4>
            <div className="info-grid">
              <p><b>Tithi:</b> {data.tithi}</p>
              <p><b>Nakshatra:</b> {data.nakshatra}</p>
              <p><b>Yoga:</b> {data.yoga}</p>
              <p><b>Karana:</b> {data.karana}</p>
              <p><b>Month Amanta:</b> {data.monthAmanta}</p>
              <p><b>Month Purnimanta:</b> {data.monthPurnimanta}</p>
              <p><b>Vikram Samvat:</b> {data.vikramSamvat}</p>
              <p><b>Shaka Samvat:</b> {data.shakaSamvat}</p>
              <p><b>Sun Sign:</b> {data.sunSign}</p>
              <p><b>Moon Sign:</b> {data.moonSign}</p>
              <p><b>Dishashool:</b> {data.dishashool}</p>
              <p><b>Moon Placement:</b> {data.moonPlacement}</p>
              <p><b>Season:</b> {data.season}</p>
              <p><b>Ayana:</b> {data.ayana}</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="right-box">
            <h4>Upcoming Festivals</h4>
            <div className="festival-list">
              {data.festivals.map((fest, i) => (
                <p key={i}>🎉 {fest}</p>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="no-data">No Panchang data available for this date</p>
      )}
    </div>
  );
};

export default Panchang;
