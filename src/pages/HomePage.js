import React, { useEffect } from 'react';
import EventBannerCarousel from '../components/EventBannerCarousel';

// import bannerImage from '../assets/banner.png'; // Phone image

import '../styles/HomePage.css';
import '../styles/CardSection.css'; // Keep if you have card-specific styles

import TempleList from '../components/TempleList';
import { getDevoteeProfile } from '../api/api';

// import carouselImage1 from '../assets/d1.png';
// import carouselImage2 from '../assets/d2.png';
// import carouselImage3 from '../assets/d3.png';

// import googlePlay from '../assets/googlePlay.png';
// import appStore from '../assets/appStore.png';

const HomePage = () => {
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await getDevoteeProfile();
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  return (
      <div className="homepage">
        <EventBannerCarousel />
        {/* Small Screen Navigation Buttons */}
        {/* <ButtonSmScreen /> */}
        {/* ======= Temple List Section ======= */}
        <div className="temple-list-section">
          <div className="homepage-content">
            <TempleList />
          </div>
        </div>
      </div>
  );
};

export default HomePage;
