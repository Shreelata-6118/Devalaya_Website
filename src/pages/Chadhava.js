import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Chadhava.css";
import api from "../api/api"; // axios instance

const Chadhava = () => {
  const [chadhavaItems, setChadhavaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChadhava = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/v1/devotee/chadhava/");
        console.log("✅ Chadhava API Response:", response.data);

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
    navigate(`/chadhava/${item.temple.id}`, { state: { item: item } });
  };

  const handleSearch = () => {
    // Implement search functionality here
    console.log("Searching for:", searchTerm);
  };

  const filteredChadhavaItems = chadhavaItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chadhava-wrapper">
      <h1 className="chadhava-title">🛕 Chadhava Offerings</h1>

      <div className="chadhava-search-container">
        <input
          type="text"
          placeholder="Search for Chadhava..."
          className="chadhava-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="chadhava-search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="chadhava-grid">
          {filteredChadhavaItems.length > 0 ? (
            filteredChadhavaItems.map((item) => {
              // Prefer pooja_chadhava.images[0].image, then temple image, then placeholder
              const chadhavaImage =
                item.pooja_chadhava?.images?.[0]?.image ||
                // item.temple?.images?.[0]?.image ||
                "/placeholder.png";

              return (
                <div key={item.id} className="chadhava-card">
                  {/* 🔹 Label inside card */}
                  <div className="chadhava-label"><span className="blinking-text">Chadhava</span></div>

                  <img
                    src={chadhavaImage}
                    // alt={item.pooja_chadhava?.images?.[0]?.title || item.temple?.name || item.name}
                    className="chadhava-image"
                  />

                  <div className="chadhava-content">
                    <h3 className="chadhava-name">{item.name}</h3>
                    {/* <p className="chadhava-description">{item.details}</p> */}
                    <p className="chadhava-temple">
                      <strong>Temple: </strong> {item.temple?.name}
                    </p>
                    {/* Included and Excluded details */}
                    {(item.included || item.pooja_chadhava?.included) && (
                      <p className="chadhava-included">
                        <strong>Chadhava items: </strong>{item.included || item.pooja_chadhava?.included}
                      </p>
                    )}
                    {(item.excluded || item.pooja_chadhava?.excluded) && (
                      <p className="chadhava-excluded">
                        <strong>Benefits: </strong> {item.excluded || item.pooja_chadhava?.excluded}
                      </p>
                    )}
                    <button
                      className="view-button"
                      onClick={() => handleOfferNow(item)}
                    >
                      Offer Now
                    </button>
                  </div>
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