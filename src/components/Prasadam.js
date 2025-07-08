// import React, { useEffect, useState } from 'react';
// import api from '../api/api';
// import '../styles/Prasadam.css';

// const Prasadam = () => {
//   const [prasadamList, setPrasadamList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPrasadam = async () => {
//       try {
//         const response = await api.get('/api/v1/devotee/prasadam/');
//         console.log("Prasadam API Response:", response.data); // Debug log

//         if (Array.isArray(response.data.results)) {
//           setPrasadamList(response.data.results);
//         } else if (Array.isArray(response.data.data)) {
//           setPrasadamList(response.data.data);
//         } else {
//           console.error("Unexpected API response structure:", response.data);
//           setError("Unexpected API response format.");
//         }
//       } catch (err) {
//         console.error("Error fetching prasadam:", err);
//         setError('Failed to load prasadam data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPrasadam();
//   }, []);

//   if (loading) {
//     return <div className="prasadam-loading">Loading prasadam...</div>;
//   }

//   if (error) {
//     return <div className="prasadam-error">{error}</div>;
//   }

//   if (!prasadamList.length) {
//     return <div className="prasadam-error">No prasadam available.</div>;
//   }

//   return (
//     <div className="prasadam-container">
//       {prasadamList.map((prasadam) => (
//         <div key={prasadam.id} className="prasadam-card">
//           <h3>🪔 {prasadam.name || 'Prasadam'}</h3>
//           {prasadam.image && (
//             <img
//               src={prasadam.image}
//               alt={prasadam.name}
//               className="prasadam-image"
//             />
//           )}
//           <p><strong>Details:</strong> {prasadam.details || 'N/A'}</p>
//           <p><strong>Includes:</strong> {prasadam.includes || 'N/A'}</p>
//           <p><strong>Benefits:</strong> {prasadam.benefits || '-'}</p>
//           <p><strong>Cost:</strong> ₹ {prasadam.cost || 'N/A'} /-</p>
//           <button className="prasadam-add-btn">ADD TO CART ➡️</button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Prasadam;







import React, { useEffect, useState } from 'react';
import api from '../api/api';
import '../styles/Prasadam.css';

const Prasadam = () => {
  const [prasadamList, setPrasadamList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrasadam = async () => {
      try {
        const response = await api.get('/api/v1/devotee/prasadam/');
        if (Array.isArray(response.data.results)) {
          setPrasadamList(response.data.results);
        } else {
          setError("Unexpected API response format.");
        }
      } catch (err) {
        setError('Failed to load prasadam data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrasadam();
  }, []);

  if (loading) return <div className="prasadam-loading">Loading prasadam...</div>;
  if (error) return <div className="prasadam-error">{error}</div>;
  if (!prasadamList.length) return <div className="prasadam-error">No prasadam available.</div>;

  return (
    <div className="prasadam-container">
      {prasadamList.map((prasadam) => {
        const imageUrl = prasadam.temple?.images?.[0]?.image;

        return (
          <div key={prasadam.id} className="prasadam-card">
            <h3>🪔 {prasadam.name || 'Prasadam'}</h3>

            {imageUrl && (
              <img
                src={imageUrl}
                alt={prasadam.name}
                className="prasadam-image"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl);
                  e.target.style.display = 'none';
                }}
              />
            )}

            <p><strong>Details:</strong> {prasadam.details || 'N/A'}</p>
            <p><strong>Includes:</strong> {prasadam.includes || 'N/A'}</p>
            <p><strong>Benefits:</strong> {prasadam.benefits || '-'}</p>
            <p><strong>Cost:</strong> ₹ {prasadam.cost ? `${prasadam.cost} /-` : 'N/A'}</p>

            <button className="prasadam-add-btn">ADD TO CART ➡️</button>
          </div>
        );
      })}
    </div>
  );
};

export default Prasadam;
