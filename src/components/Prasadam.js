import React, { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/Prasadam.css";

const Prasadam = () => {
  const [prasadamList, setPrasadamList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPrasadam = async () => {
      try {
        setLoading(true);

        const [poojaRes, prasadamRes] = await Promise.all([
          api.get("/api/v1/devotee/pooja/?page=1&size=18&search=prasadam"),
          api.get("/api/v1/devotee/pooja/?page=1&size=18&search=prasada"),
          api.get("/api/v1/devotee/prasadam/"),
        ]);

        const poojaItems = poojaRes.data?.results || [];
        const prasadamItems = prasadamRes.data?.results || [];

        const filteredPooja = poojaItems.filter(
          (item) =>
            item.name?.toLowerCase().includes("prasadam") ||
            item.name?.toLowerCase().includes("prasad")
        );

        const combined = [...filteredPooja, ...prasadamItems];

        setPrasadamList(combined);
        setFilteredList(combined);
        setLoading(false);
      } catch (err) {
        console.error("Prasadam API Error:", err);
        setError("Failed to load prasadam data.");
        setLoading(false);
      }
    };

    fetchPrasadam();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredList(prasadamList);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const filtered = prasadamList.filter((item) => {
      const poojaPrasadam = item.pooja_prasadam || {};
      const name = (item.name || poojaPrasadam.name || "").toLowerCase();
      const temple = (item.temple?.name || poojaPrasadam.temple?.name || "").toLowerCase();

      return name.includes(lower) || temple.includes(lower);
    });

    setFilteredList(filtered);
  }, [searchTerm, prasadamList]);

  const addToCart = (item) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const prasadamId = item.pooja_prasadam?.id || item.id;
      const existingItem = cart.find((cartItem) => cartItem.id === prasadamId);

      const poojaPrasadam = item.pooja_prasadam || {};
      const cost = poojaPrasadam.cost || item.cost || 0;
      const finalTotal = poojaPrasadam.original_cost || item.original_cost || cost;

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          ...item,
          id: prasadamId,
          quantity: 1,
          cost,
          final_total: finalTotal,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("open-cart-drawer"));
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Could not add item to cart.");
    }
  };

  if (loading) {
    return (
      <div className="prasadam-loading">
        <div className="prasadam-loader"></div>
        <p>Loading prasadam...</p>
      </div>
    );
  }

  if (error) return <div className="prasadam-error">{error}</div>;
  if (!prasadamList.length) return <div className="prasadam-error">No prasadam available.</div>;

  return (
    <div>
      {/* 🔍 Search Bar */}
      <div className="prasadam-search-bar">
        <div className="prasadam-search-input-wrapper">
          <input
            type="text"
            placeholder="Search by prasadam or temples..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="prasadam-search-input"
          />
          {searchTerm && (
            <button
              className="prasadam-clear-inside"
              onClick={() => setSearchTerm("")}
            >
              ✖
            </button>
          )}
        </div>
        <button className="prasadam-search-button">SEARCH</button>
      </div>

      {/* Cards */}
      <div className="prasadam-wrapper">
        {filteredList.map((prasadam) => {
          const poojaPrasadam = prasadam.pooja_prasadam || {};
          const mediaUrl =
            prasadam.temple?.images?.[0]?.image ||
            poojaPrasadam.temple?.images?.[0]?.image;

          const includes = poojaPrasadam.included || prasadam.included || "Not specified";
          const benefits = poojaPrasadam.excluded || prasadam.excluded || "-";

          const rawCost =
            poojaPrasadam.original_cost ||
            poojaPrasadam.cost ||
            prasadam.original_cost ||
            prasadam.cost ||
            null;

          const costDisplay =
            rawCost && !isNaN(rawCost) ? `₹ ${rawCost}/-` : "₹ Not specified";

          return (
            <div key={prasadam.id} className="prasadam-card">
              <div className="prasadam-top-label">Prasadam</div>

              {mediaUrl && (
                <div className="prasadam-image-wrapper">
                  {/\.mp4$|\.webm$|\.ogg$/i.test(mediaUrl) ? (
                    <video
                      src={mediaUrl}
                      className="prasadam-video"
                      controls
                      autoPlay
                      muted
                    >
                      Your browser does not support video tag.
                    </video>
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={prasadam.name}
                      className="prasadam-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                </div>
              )}

              <h4 className="prasadam-title">
                🌸 {prasadam.name || poojaPrasadam.name || "Prasadam"}
              </h4>

              <div className="prasadam-card-content">
                <p>
                  <span className="prasadam-label">Details:</span>{" "}
                  {prasadam.details || poojaPrasadam.details || "N/A"}
                </p>
                <p>
                  <span className="prasadam-label">Include's:</span> {includes}
                </p>
                <p>
                  <span className="prasadam-label">Benefits:</span> {benefits}
                </p>
                <p>
                  <span className="prasadam-label">Cost:</span> {costDisplay}
                </p>
              </div>

              <button
                className="prasadam-book-btn"
                onClick={() => addToCart(prasadam)}
              >
                Book ➜
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Prasadam;
