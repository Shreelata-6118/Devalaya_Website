import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../styles/EventsPage.css';
import moment from 'moment';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://beta.devalayas.com';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/api/v1/devotee/event/?page=1&size=27');
        const eventList = response.data?.results || [];
        setEvents(eventList);
        setFilteredEvents(eventList);
        localStorage.setItem('events', JSON.stringify(eventList));
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load events list');
      } finally {
        setLoading(false);
      }
    };

    setTimeout(fetchEvents, 100);
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((event) =>
        event.name?.toLowerCase().includes(lowercasedSearchTerm) ||
        event.details?.toLowerCase().includes(lowercasedSearchTerm) ||
        event.temple?.name?.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm]);

  const getImageUrl = (event) => {
    const imagePath = event.image && event.image.trim();
    if (imagePath) {
      return imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
    }
    return 'https://via.placeholder.com/300x200?text=Event+Image';
  };

  const handleEventClick = (eventName) => {
    navigate(`/events/${encodeURIComponent(eventName)}`);
  };

  const handleSearch = () => {
    // The useEffect hook now handles filtering, so this can be kept for explicit search button clicks if needed
    // or left empty if we want filtering to be purely reactive
  };
  
  const formatDateRange = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);
    
    if (start.isSame(end, 'day')) {
      return start.format('MMMM Do, YYYY');
    } else {
      return `${start.format('MMM Do')} - ${end.format('MMM Do, YYYY')}`;
    }
  };

  return (
    <div className="events-list-container">
      <h2 className="events-heading">EXPLORE MORE EVENTS</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search Events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="events-cards">
        {loading ? (
          [...Array(8)].map((_, index) => (
            <div className="event-card skeleton" key={index}>
              <div className="event-image skeleton-img" />
              <h3>Loading...</h3>
              <p>Fetching description...</p>
              <p>Loading date...</p>
              <button className="view-button skeleton-button">Loading...</button>
            </div>
          ))
        ) : filteredEvents.length === 0 ? (
          <p>No Events found for the search term.</p>
        ) : (
          filteredEvents.map((event) => (
            <div
              className="event-card"
              key={event.id}
              onClick={() => handleEventClick(event.name)}
            >
              {/* 🔖 Top Left Label */}
              <div className="event-top-label">
                {event.category || 'Event'}
              </div>

              <img
                src={getImageUrl(event)}
                alt={event.name}
                className="event-image"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=Event+Image';
                }}
              />
              <div className="event-content">
                <h3>{event.name || 'Untitled Event'}</h3>
                <p className="event-description">{event.details || 'No description available.'}</p>
                <p className="event-date">
                  <strong>Date:</strong> {event.start && event.end ? formatDateRange(event.start, event.end) : 'Date TBA'}
                </p>
                {event.temple && (
                  <p className="event-temple">
                    <strong>Temple:</strong> {event.temple.name}
                  </p>
                )}
                {event.pooja && (
                  <p className="event-pooja">
                    <strong>Pooja:</strong> {event.pooja.name}
                  </p>
                )}
                <button className="view-button">VIEW DETAILS</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsPage;
