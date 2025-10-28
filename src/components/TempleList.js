import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTemples, setSearch } from '../redux/templeSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/TempleList.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import api from '../api/api';

const SkeletonCard = () => (
  <div className="temple-list-card skeleton">
    <div className="skeleton-img" />
    <div className="skeleton-text title" />
    <div className="skeleton-text location" />
    <div className="skeleton-button" />
  </div>
);

const TempleList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
      setTouchEnd(null); // otherwise the swipe is fired even with a single touch
      setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      if (isLeftSwipe) {
          setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
      }
      if (isRightSwipe) {
          setCurrentEventIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
      }
      setTouchStart(null);
      setTouchEnd(null);
  };

  const onMouseDown = (e) => {
    if (e.target.closest('.temple-list-search-wrapper')) return;
    e.preventDefault();
    setIsMouseDown(true);
    setTouchStart(e.clientX);
  };

  const onMouseMove = (e) => {
    e.preventDefault();
    if (!isMouseDown) return;
    setTouchEnd(e.clientX);
  };

  const onMouseUp = () => {
    if (!isMouseDown) return;
    setIsMouseDown(false);
    onTouchEnd();
  };


  useEffect(() => {
    if (events.length > 0) {
      const timer = setInterval(() => {
        setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
      }, 10000);
      return () => clearInterval(timer);
    }
  }, [events]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/api/v1/devotee/event/?page=1&size=10');
        const data = response?.data;
        if (data?.results) {
          const filteredEvents = data.results.filter(e => e.event_devotee && e.image);
          const sortedEvents = filteredEvents.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
          setEvents(sortedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error.response?.data || error.message);
      }
    };
    fetchEvents();
  }, []);

  const {
    temples = [],
    loading = false,
    search = ''
  } = useSelector((state) => state.temple || {});

  const [page, setPage] = useState(1);
  const pageSize = 15;
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    dispatch(fetchTemples());
  }, [dispatch]);

  const filteredTemples = temples.filter((temple) =>
    temple.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTemples.length / pageSize);
  const paginated = filteredTemples.slice((page - 1) * pageSize, page * pageSize);

  const handlePageClick = (number) => setPage(number);
  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  const getImageUrl = (temple) => {
  // If cover_image exists and is not null
  if (temple.cover_image) {
    return temple.cover_image.startsWith('http')
      ? temple.cover_image
      : `${BASE_URL}${temple.cover_image}`;
  }

  // If cover_image is null, use the first temple image
  const firstImg = temple.images?.[0]?.url || temple.images?.[0]?.image;
  if (firstImg) {
    return firstImg.startsWith('http') ? firstImg : `${BASE_URL}${firstImg}`;
  }

  // Fallback placeholder
  return 'https://via.placeholder.com/300x200?text=No+Image';
};

  const getEventImageUrl = (event) => {
    if (event && event.image) {
      const imageUrl = event.image;
      if (imageUrl && imageUrl !== 'null') {
        return imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
      }
    }
    return 'https://via.placeholder.com/300x200?text=No+Image'; // Fallback image
  };

  return (
    <div className="temple-list-container">

      <style>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
        @media (max-width: 768px) {
          .event-container {
            flex-direction: column;
            gap: 1rem;
          }
          .event-img-second {
            display: none;
          }
          .event-img-first {
            width: 100%;
            text-align: center;
          }
          .explore-title {
            order: 2;
          }
          .search-bar {
            order: 3;
          }
        }
      `}</style>

      {/* 🔔 Important Notice */}
      <div className="notice-bar">
        <div className="notice-text">
          ⚠ Important Notice: www.devalayas.com and csc.devalayas.com are the only officially authorized platforms for online temple services such as puja bookings and prasadam delivery, authorized by the Government of Karnataka and respective temple authorities, in collaboration with CSC e-Governance. For any doubts, verify authenticity by contacting our official support team. Book with trust. Serve with devotion.  
          ⚠ ಪ್ರಮುಖ ಸೂಚನೆ: www.devalayas.com ಮತ್ತು csc.devalayas.com ಮಾತ್ರ ಅಧಿಕೃತವಾಗಿ ಅಧಿಕೃತವಾದ ಆನ್‌ಲೈನ್ ದೇವಾಲಯ ಸೇವೆಗಳಾದ ಪೂಜೆ ಬುಕಿಂಗ್ ಮತ್ತು ಪ್ರಸಾದ ವಿತರಣೆಗೆ ವೇದಿಕೆಗಳಾಗಿದ್ದು, ಇದನ್ನು ಕರ್ನಾಟಕ ಸರ್ಕಾರ ಮತ್ತು ಆಯಾ ದೇವಾಲಯ ಅಧಿಕಾರಿಗಳು CSC ಇ-ಗವರ್ನೆನ್ಸ್ ಸಹಯೋಗದೊಂದಿಗೆ ಅಧಿಕೃತಗೊಳಿಸಿದ್ದಾರೆ. ಯಾವುದೇ ಸಂದೇಹಗಳಿದ್ದರೆ, ನಮ್ಮ ಅಧಿಕೃತ ಬೆಂಬಲ ತಂಡವನ್ನು ಸಂಪರ್ಕಿಸುವ ಮೂಲಕ ದೃಢೀಕರಣವನ್ನು ಪರಿಶೀಲಿಸಿ. ನಂಬಿಕೆಯೊಂದಿಗೆ ಬುಕ್ ಮಾಡಿ. ಭಕ್ತಿಯಿಂದ ಸೇವೆ ಮಾಡಿ.
        </div>
      </div>
      <div
        className="event-container"
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '20px', width: '100%', flexWrap: 'nowrap', userSelect: 'none' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div className="event-img-first" style={{ flex: '3 0 0%', position: 'relative' }}>
          {events.length > 0 && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={getEventImageUrl(events[currentEventIndex])}
                alt={events[currentEventIndex]?.title || 'Event'}
                onClick={() => navigate('/events')}
                style={{ width: '80%', height: 'auto', borderRadius: '8px', objectFit: 'cover', margin: '10px auto 0 auto', display: 'block', cursor: 'pointer' }}
              />
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: '#ff5722',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                zIndex: 1,
                animation: 'blink 1s infinite'
              }}>
                On Going Event
              </div>
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex'
              }}>
                {events.map((_, idx) => (
                  <span
                    key={idx}
                    style={{
                      height: '10px',
                      width: '10px',
                      backgroundColor: currentEventIndex === idx ? '#ff5722' : 'white',
                      borderRadius: '50%',
                      margin: '0 3px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setCurrentEventIndex(idx)}
                  ></span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="explore-title" style={{ flex: '4 0 0%' }}>
          {/* Search Bar */}
          <h1 className="temple-list-title">EXPLORE MORE TEMPLES</h1>
          <div className="temple-list-search search-bar">
            <div className="temple-list-search-wrapper">
              <input
                type="text"
                className="temple-list-search-input"
                placeholder="Search Temples..."
                value={search}
                onChange={(e) => {
                  e.stopPropagation();
                  dispatch(setSearch(e.target.value));
                }}
                onKeyPress={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              />
              {search && (
                <button
                  className="temple-list-clear-btn"
                  onClick={() => dispatch(setSearch(''))}
                >
                  ✖
                </button>
              )}
            </div>
            <button
              className="temple-list-search-btn"
              style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }}
            >
              SEARCH
            </button>
          </div>
        </div>
        <div className="event-img-second" style={{ flex: '3 0 0%', position: 'relative' }}>
          {events.length > 1 && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={getEventImageUrl(events[(currentEventIndex + 1) % events.length])}
                alt={events[(currentEventIndex + 1) % events.length]?.title || 'Event'}
                onClick={() => navigate('/events')}
                style={{ width: '80%', height: 'auto', borderRadius: '8px', objectFit: 'cover', margin: '10px auto 0 auto', display: 'block', cursor: 'pointer' }}
              />
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: '#ff5722',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                zIndex: 1,
                animation: 'blink 1s infinite'
              }}>
                On Going Event
              </div>
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex'
              }}>
                {events.map((_, idx) => (
                  <span
                    key={idx}
                    style={{
                      height: '10px',
                      width: '10px',
                      backgroundColor: (currentEventIndex + 1) % events.length === idx ? '#ff5722' : 'white',
                      borderRadius: '50%',
                      margin: '0 3px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setCurrentEventIndex(idx)}
                  ></span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Temples Grid */}
      <div className="temple-list-grid">
        {loading
          ? Array(10).fill(0).map((_, idx) => <SkeletonCard key={idx} />)
          : paginated.map((temple) => (
              <div key={temple.id} className="temple-list-card">
                <img
                  src={getImageUrl(temple)}
                  alt={temple.name}
                  onClick={() => navigate(`/Temples/${temple.id}`)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                <div className="temple-list-card-body">
                  <h6 className="temple-list-card-title">{temple.name}</h6>
                  <p className="temple-list-card-location">
                    <FaMapMarkerAlt className="temple-list-location-icon" />{' '}
                    {temple.district || temple.taluk || 'Unknown Location'}
                  </p>
                  <button
                    className="temple-list-btn"
                    onClick={() => navigate(`/Temples/${temple.id}`)}
                  >
                    PARTICIPATE
                  </button>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      {!loading && (
        <div className="temple-list-pagination" style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          <button className="btn btn-outline-danger btn-sm" onClick={handlePrev} disabled={page === 1}>Prev</button>
          {(() => {
            let start = Math.max(1, page - 1);
            let end = Math.min(totalPages, page + 1);
            if (page === 1) end = Math.min(totalPages, 3);
            if (page === totalPages) start = Math.max(1, totalPages - 2);
            const pages = [];
            for (let i = start; i <= end; i++) pages.push(i);
            return pages.map((num) => (
              <button
                key={num}
                onClick={() => handlePageClick(num)}
                className={`btn btn-sm ${page === num ? 'btn-danger' : 'btn-outline-primary'}`}
              >
                {num}
              </button>
            ));
          })()}
          <button className="btn btn-outline-danger btn-sm" onClick={handleNext} disabled={page === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default TempleList;
