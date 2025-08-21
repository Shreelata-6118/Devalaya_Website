import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Chadhava.css";
import api from "../api/api"; // axios instance

const Chadhava = () => {
  const [chadhavaItems, setChadhavaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChadhava = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/v1/devotee/chadhava/");
        console.log("✅ Chadhava API Response:", response.data);

        // Take results array from API
        setChadhavaItems(response.data?.results || []);
      } catch (err) {
        setError("Failed to load Chadhava items. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChadhava();
  }, []);

  const handleOfferNow = (item) => {
    // Pass only assigned_items to the details page
    navigate(`/chadhava/${item.id}`, { state: { assignedItems: item.assigned_items || [] } });
  };

  return (
    <div className="chadhava-wrapper">
      <h1 className="chadhava-title">🛕 Chadhava Offerings</h1>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="chadhava-grid">
          {chadhavaItems.length > 0 ? (
            chadhavaItems.map((item) => {
              const templeImage =
                item.temple?.images?.[0]?.image || "/placeholder.png";
              const pooja = item.pooja_chadhava;
              const assignedItems = item.assigned_items || [];

              return (
                <div key={item.id} className="chadhava-card">
                  <img
                    src={templeImage}
                    alt={item.temple?.name || item.name}
                    className="chadhava-image"
                  />

                  <h3 className="chadhava-name">{item.name}</h3>
                  <p className="chadhava-description">{item.details}</p>

                  <p className="chadhava-temple">
                    Temple: <strong>{item.temple?.name}</strong>
                  </p>

                  {pooja && (
                    <p className="chadhava-cost">
                      Cost: <strong>₹{pooja.cost}</strong>
                    </p>
                  )}

                  {assignedItems.length > 0 && (
                    <div className="assigned-items">
                      <h4>Assigned Items:</h4>
                      <ul>
                        {assignedItems.map((ai) => (
                          <li key={ai.id}>
                            {ai.name} - ₹{ai.cost}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    className="chadhava-btn"
                    onClick={() => handleOfferNow(item)}
                  >
                    Offer Now
                  </button>
                </div>
              );
            })
          ) : (
            <p className="no-items-text">No Chadhava items available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Chadhava;