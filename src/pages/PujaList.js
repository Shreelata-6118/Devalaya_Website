import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../styles/PujaList.css';

const PujaList = () => {
  const [pujas, setPujas] = useState([]);
  const [uniquePujas, setUniquePujas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPujas = async () => {
      try {
        const response = await api.get('/api/v1/devotee/pooja/');
        const pujaList = response.data?.results || [];
        setPujas(pujaList);

        // Get unique puja names
        const map = {};
        pujaList.forEach((puja) => {
          if (!map[puja.name]) {
            map[puja.name] = puja;
          }
        });
        setUniquePujas(Object.values(map));
      } catch (err) {
        setError('Failed to load puja list');
      } finally {
        setLoading(false);
      }
    };
    fetchPujas();
  }, []);

  const handlePujaClick = (pujaName) => {
    // Navigate to a new page with pujaName as param
    navigate(`/puja-temples?puja=${encodeURIComponent(pujaName)}`);
  };

  const filteredPujas = uniquePujas.filter((puja) =>
    puja.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="puja-list-container">
      <h2 className="puja-heading">AVAILABLE PUJA'S</h2>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search Pujas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="search-button">Search</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="puja-cards">
        {loading ? (
          [...Array(6)].map((_, index) => (
            <div className="puja-card skeleton" key={index}>
              <h3 className="skeleton-text">Loading...</h3>
            </div>
          ))
        ) : filteredPujas.length === 0 ? (
          <p>No Pujas found for the search term.</p>
        ) : (
          filteredPujas.map((puja) => (
            <div
              className="puja-card"
              key={puja.name}
              onClick={() => handlePujaClick(puja.name)}
              style={{ cursor: 'pointer' }}
            >
              <div className="puja-name">{puja.name}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PujaList;