import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWeddingCards } from '../api/api';
import '../styles/WeddingCard.css';

const WeddingCard = () => {
  const [poojaCards, setPoojaCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeddingCards = async () => {
      try {
        setLoading(true);
        const data = await getWeddingCards(1); // Start with page 1
        const cards = data.results || data;
        setPoojaCards(cards);
        setFilteredCards(cards);
        setError(null);
      } catch (err) {
        setError('Failed to fetch wedding cards. Please try again.');
        console.error('Error fetching wedding cards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeddingCards();
  }, []);

  useEffect(() => {
    let filtered = poojaCards;

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((card) =>
        card.name?.toLowerCase().includes(lowercasedSearchTerm) ||
        card.details?.toLowerCase().includes(lowercasedSearchTerm) ||
        card.temple?.name?.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    setFilteredCards(filtered);
  }, [poojaCards, searchTerm]);

  const getImageUrl = (card) => {
    if (card.images && card.images.length > 0) {
      return card.images[0].image;
    }
    return 'https://via.placeholder.com/300x200?text=Wedding+Card';
  };

  const handleCardClick = (cardId) => {
    // Navigate to puja details or a specific wedding card page
    navigate(`/puja/${cardId}`);
  };

  const handleBookNow = (e, card) => {
    e.stopPropagation(); // Prevent card click navigation

    try {
      const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItemIndex = currentCart.findIndex(item => item.id === card.id);

      if (existingItemIndex === -1) {
        // Add new item
        const cartItem = {
          id: card.id,
          name: card.name || 'Unnamed Pooja',
          details: card.details || card.included || 'No description available.',
          original_cost: card.original_cost || 0,
          cost: card.original_cost || 0,
          images: card.images || [],
          temple: card.temple,
          quantity: 1
        };
        currentCart.push(cartItem);
      } else {
        // Increment quantity if already exists
        currentCart[existingItemIndex].quantity += 1;
      }

      localStorage.setItem('cart', JSON.stringify(currentCart));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('open-cart-drawer'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="wedding-card-container">
        <h2 className="wedding-heading">WEDDING CARDS Blessings</h2>
        <div className="wedding-cards">
          {[...Array(8)].map((_, index) => (
            <div className="wedding-card skeleton" key={index}>
              <div className="wedding-image skeleton-img" />
              <h3>Loading...</h3>
              <p>Fetching description...</p>
              <p>Loading temple...</p>
              <button className="view-button skeleton-button">Loading...</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wedding-card-container">
        <h2 className="wedding-heading">WEDDING CARDS Blessings</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="wedding-card-container">
      <h2 className="wedding-heading">WEDDING CARD BLESSINGS</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search temples offering wedding card blessings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="search-button">Search</button>
      </div>

      <div className="wedding-cards">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <div
              className="wedding-card"
              key={card.id}
            >
              {/* 🔖 Top Left Label */}
              <div className="wedding-top-label">
                Temple
              </div>

              <img
                src={getImageUrl(card)}
                alt={card.name}
                className="wedding-image"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=Wedding+Card';
                }}
              />
              <div className="wedding-content">
                <h3>{card.name || 'Unnamed Pooja'}</h3>
                <p className="wedding-description">
                  <strong style={{ color: '#f44336' }}>Details:</strong> {card.details || 'No description available.'}
                </p>
                <p className="wedding-description">
                  <strong style={{ color: '#f44336' }}>Include's:</strong> {card.included || 'No includes available.'}
                </p>
                <p className="wedding-description">
                  <strong style={{ color: '#f44336' }}>Benefits:</strong> {card.excluded || 'No benefits available.'}
                </p>
                {card.temple && (
                  <p className="wedding-temple">
                    <strong style={{color:'#f44336'}}>Temple:</strong> {card.temple.name}
                  </p>
                )}
                <p className="wedding-instruction">
                 <strong>Instruction:</strong> Print the invoice, pack it along with the wedding card, and send it to the temple address.
                </p>
                {card.original_cost && (
                  <p className="wedding-price">
                    <strong>Price:</strong> ₹{card.original_cost}
                  </p>
                )}
                <button className="view-button" onClick={(e) => handleBookNow(e, card)}>participate Now</button>
              </div>
            </div>
          ))
        ) : (
          <p>No wedding cards found for the search term.</p>
        )}
      </div>
    </div>
  );
};

export default WeddingCard;
