import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventBannerCarousel.css';
import api from '../api/api';

const EventBannerCarousel = () => {
  const [events, setEvents] = useState([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/v1/devotee/event/')
      .then(res => {
        const data = res.data;
        // Filter events with event_devotee true and a non-null video key
        const videoEvents = (data.results || []).filter(e => e.event_devotee && e.video);
        setEvents(videoEvents);
      })
      .catch(error => {
        console.error("Error fetching event videos:", error);
      });
    const interval = setInterval(() => {
      setCurrent(prev => (events.length ? (prev + 1) % events.length : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length]);

  const handleCarouselClick = () => {
    navigate(`/events`);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevents the carousel's click handler from being called
    navigate(`/events`);
  };

  if (!events.length) return null;

  return (
    <div className="event-banner-carousel" onClick={handleCarouselClick} style={{ cursor: 'pointer' }}>
      <h2 className="carousel-heading">Ongoing Events</h2>
      <video
        key={events[current].id}
        src={events[current].video}
        autoPlay
        muted
        loop
      />
      <button className="participate-button-event" onClick={handleButtonClick}>Participate Now</button>
    </div>
  );
};

export default EventBannerCarousel;
