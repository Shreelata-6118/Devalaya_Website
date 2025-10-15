import React, { useEffect, useState } from 'react';
import CartDrawer from './CartDrawer';
import { useParams } from 'react-router-dom';
import '../styles/TempleDetails.css';
import api from '../api/api';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

const TempleDetails = () => {
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [tabNo, setTabNo] = useState(4);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState(null); // { url: string, index: number }
  const BASE_IMAGE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchTempleAndPrasadam = async () => {
      try {
        const templeRes = await api.get(`/api/v1/devotee/temple/${id}`);
        const templeData = templeRes.data;

        let prasadamFromPooja = [];
        let prasadamFromPrasadamAPI = [];

        try {
          const res1 = await api.get(`/api/v1/devotee/pooja/?temple=${id}&search=prasadam`);
          prasadamFromPooja = res1.data.results || [];
        } catch {}

        try {
          const res2 = await api.get(`/api/v1/devotee/prasadam/?temple=${id}`);
          prasadamFromPrasadamAPI = res2.data.results || [];
        } catch {}

        const combined = [...prasadamFromPooja, ...prasadamFromPrasadamAPI];
        const uniqueMap = new Map();
        combined.forEach(item => { if (item.id) uniqueMap.set(item.id, item); });
        const uniquePrasadam = Array.from(uniqueMap.values());

        const poojaRes = await api.get(`/api/v1/devotee/pooja/?temple=${id}`);
        const poojaList = poojaRes.data.results || [];

        setTemple({ ...templeData, prasadam: uniquePrasadam });
        setFilteredData(poojaList);
      } catch (err) {
        console.error('Error loading temple data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTempleAndPrasadam();
  }, [id]);

  const handleAddToCart = (item) => {
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      cart = [];
    }
    if (!cart.find(c => c.id === item.id)) {
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
    }
    setCartDrawerOpen(true);
  };

  const handleTabSwitch = (tab) => {
    setTabNo(tab);
    setSearch('');
    if (tab === 2) {
      handleSearch('');
    } else {
      setFilteredData([]);
    }
  };

  const handleSearch = async (query = search) => {
    try {
      const res = await api.get(`/api/v1/devotee/pooja/?temple=${id}&search=${query}`);
      setFilteredData(res.data.results || []);
    } catch {}
  };

  const getFullImageUrl = (imgPath) => {
    if (!imgPath || imgPath === 'null') return require('../assets/Default.png');
    return imgPath.startsWith('http') ? imgPath : `${BASE_IMAGE_URL}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
  };

  const handleImageClick = (imageUrl) => {
    const index = temple.images.findIndex(img => getFullImageUrl(img.image) === imageUrl);
    setZoomedImage({ url: imageUrl, index });
  };
  const closeZoomedImage = () => setZoomedImage(null);

  const navigateImage = (direction) => {
    if (!zoomedImage || !temple.images) return;
    const totalImages = temple.images.length;
    const newIndex = (zoomedImage.index + direction + totalImages) % totalImages;
    const newUrl = getFullImageUrl(temple.images[newIndex].image);
    setZoomedImage({ url: newUrl, index: newIndex });
  };

  // ✅ Render Puja Cards
  const renderCards = (data) => (
    <div className="row">
      {data.filter(p => !p.name.toLowerCase().includes('prasadam')).map(p => (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={p.id}>
          <div className="card h-100 shadow-sm border-0 rounded-4" style={{ background: '#fff7ec' }}>
            <div className="card-body d-flex flex-column justify-content-between p-3"
              style={{ border: '1px solid #e0e0e0', borderRadius: '10px' }}>
              <h5 className="fw-bold text-danger text-start mb-3">🌸 {p.name}</h5>
              <div className="text-center mb-3">
                <img
                  src={getFullImageUrl(p.images?.[0]?.image)}
                  alt={p.name}
                  onClick={() => handleImageClick(getFullImageUrl(p.images?.[0]?.image))}
                  onError={(e) => { e.target.onerror = null; e.target.src = require('../assets/Default.png'); }}
                  className="img-fluid rounded shadow-sm"
                  style={{ aspectRatio: '800 / 450', width: '100%', objectFit: 'cover', borderRadius: '10px', border: '2px solid #ffc107' }}
                />
              </div>
              <div className="text-dark small mb-3">
                <p><strong className="text-danger">Details:</strong><br />{p.details || 'N/A'}</p>
                <p><strong className="text-danger">Includes:</strong><br />{p.included || 'N/A'}</p>
                <p><strong className="text-danger">Benefits:</strong><br />{p.excluded || '-'}</p>
                <p><strong className="text-danger">Cost:</strong><br />₹ {p.original_cost || p.cost || 'N/A'} /-</p>
              </div>
              <div className="text-center mt-auto">
                <button
                  className="btn btn-warning fw-semibold px-4"
                  style={{ backgroundColor: '#ff5722', color: 'white' }}
                  onClick={() => handleAddToCart({ ...p, type: 'pooja', cost: p.original_cost || p.cost })}
                >
                  Participate ➜
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ✅ Render Prasadam
  const renderPrasadam = () => (
    <div className="row">
      {temple?.prasadam && temple.prasadam.length > 0 ? (
        temple.prasadam.map(p => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={p.id}>
            <div className="card h-100 shadow-sm border-0 rounded-4" style={{ background: '#fff7ec' }}>
              <div className="card-body d-flex flex-column justify-content-between p-3"
                style={{ border: '1px solid #e0e0e0', borderRadius: '10px' }}>
                <h5 className="fw-bold text-danger text-start mb-3">🍛 {p.name}</h5>
                <div className="text-center mb-3">
                  <img
                    src={getFullImageUrl(p.images?.[0]?.image)}
                    alt={p.name}
                    onClick={() => handleImageClick(getFullImageUrl(p.images?.[0]?.image))}
                    onError={(e) => { e.target.onerror = null; e.target.src = require('../assets/Default.png'); }}
                    className="img-fluid rounded shadow-sm"
                    style={{ aspectRatio: '800 / 450', width: '100%', objectFit: 'cover', borderRadius: '10px', border: '2px solid #ffc107' }}
                  />
                </div>
                <div className="text-dark small mb-3">
                  <p><strong className="text-danger">Details:</strong><br />{p.details || p.pooja_prasadam?.details || 'N/A'}</p>
                  <p><strong className="text-danger">Includes:</strong><br />{p.included || p.pooja_prasadam?.included || 'N/A'}</p>
                  <p><strong className="text-danger">Benefits:</strong><br />{p.excluded || '-'}</p>
                  <p><strong className="text-danger">Cost:</strong><br />₹ {p.original_cost || p.cost || p.pooja_prasadam?.original_cost || 'N/A'} /-</p>
                </div>
                <div className="text-center mt-auto">
                  <button
                    className="btn fw-semibold px-4"
                    style={{ backgroundColor: '#ff5722', color: 'white' }}
                    onClick={() => handleAddToCart({
                      ...p,
                      id: p.pooja_prasadam?.id || p.id || p.prasadam?.id,
                      type: 'prasadam',
                      cost: p.original_cost || p.cost || p.pooja_prasadam?.original_cost
                    })}
                  >
                    Participate ➜
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">No prasadam available for this temple.</p>
      )}
    </div>
  );

  if (loading) return <p>Loading temple details...</p>;
  if (!temple) return <p>No temple found.</p>;

  return (
    <>
      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      {zoomedImage && (
        <div className="zoomed-image-overlay" onClick={closeZoomedImage}>
          <div className="zoomed-image-container">
            <button className="nav-prev" onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}>{'<'}</button>
            <img src={zoomedImage.url} alt="Zoomed" className="zoomed-image" onClick={(e) => e.stopPropagation()} />
            <button className="nav-next" onClick={(e) => { e.stopPropagation(); navigateImage(1); }}>{'>'}</button>
            <button className="close-zoomed-image" onClick={closeZoomedImage}>&times;</button>
          </div>
        </div>
      )}
      <main className="temple-main">
        <section className="temple-container-td container">
          <h2 className="temple-name">{temple.name}</h2>

          {/* Swiper Slider */}
          {temple.images?.length > 0 && (
            <div className="temple-images-section text-center">
              <Swiper
                modules={[Navigation, Autoplay, EffectCoverflow]}
                effect="coverflow"
                navigation={{ prevEl: ".custom-prev", nextEl: ".custom-next" }}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                loop={true}
                centeredSlides={true}
                slidesPerView={3}
                spaceBetween={40}
                speed={800}
                coverflowEffect={{
                  rotate: 0, stretch: 0, depth: 150, modifier: 2.5, slideShadows: false,
                }}
                style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}
              >
                {temple.images.map((img, idx) => (
                  <SwiperSlide key={idx} className="custom-slide">
                    <div className="slide-box">
                      <img
                        src={getFullImageUrl(img.image)}
                        alt={`Temple ${idx}`}
                        className="slide-img"
                        onClick={() => handleImageClick(getFullImageUrl(img.image))}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="swiper-nav">
                <button className="custom-prev">PREV</button>
                <button className="custom-next">NEXT</button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <ul className="nav nav-tabs justify-content-center mt-4 temple-tabs">
            <li className="nav-item" onClick={() => handleTabSwitch(4)}>
              <span className={`nav-link ${tabNo === 4 ? 'active' : ''}`}>Prasadam</span>
            </li>
            <li className="nav-item" onClick={() => handleTabSwitch(2)}>
              <span className={`nav-link ${tabNo === 2 ? 'active' : ''}`}>Puja / Udi / Chadava</span>
            </li>
            <li className="nav-item" onClick={() => handleTabSwitch(3)}>
              <span className={`nav-link ${tabNo === 3 ? 'active' : ''}`}>e-Services</span>
            </li>
            <li className="nav-item" onClick={() => handleTabSwitch(1)}>
              <span className={`nav-link ${tabNo === 1 ? 'active' : ''}`}>About Temple</span>
            </li>
          </ul>

          {/* ✅ About Temple Tab */}
          <div className="tab-content mt-4">
            {tabNo === 4 && <div className="prasadam-section my-2">{renderPrasadam()}</div>}
            {tabNo === 2 && (filteredData.length > 0 ? renderCards(filteredData) : <p className="text-center">No items found.</p>)}
            {tabNo === 3 && <h4 className="text-center text-muted">e-Services coming soon...</h4>}
            {tabNo === 1 && (
              <div className="row about-temple-section">
                {/* Left Column */}
                <div className="col-md-8">
                  <h4>Description</h4>
                  <p>{temple.details}</p>

                  <h4 className="mt-4">Image Gallery</h4>
                  <div className="image-gallery">
                    {temple.images?.map((img, i) => (
                      <img
                        key={i}
                        src={getFullImageUrl(img.image)}
                        alt={`Temple ${i + 1}`}
                        onClick={() => handleImageClick(getFullImageUrl(img.image))}
                        onError={(e) => { e.target.onerror = null; e.target.src = require('../assets/Default.png'); }}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-md-4 order-md-2">
                  <ul className="list-group">
                    <li className="list-group-item"><strong>Taluk:</strong> {temple.taluk}</li>
                    <li className="list-group-item"><strong>District:</strong> {temple.district}</li>
                    <li className="list-group-item"><strong>City:</strong> {temple.city}</li>
                    <li className="list-group-item"><strong>State:</strong> {temple.state}</li>
                    <li className="list-group-item"><strong>Pincode:</strong> {temple.pincode}</li>
                    <li className="list-group-item"><strong>Website:</strong> {temple.website || '-'}</li>
                  </ul>

                  <div className="temple-map-section mt-4">
                    <h5 className="text-center text-danger fw-bold mb-3">📍 Temple Location</h5>
                    <div className="temple-map-container border rounded shadow-sm">
                      {temple.latitude && temple.longitude ? (
                        <iframe
                          title="temple-map"
                          loading="lazy"
                          allowFullScreen
                          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&q=${encodeURIComponent(
                            temple.name
                          )}&center=${temple.latitude},${temple.longitude}&zoom=15`}
                        ></iframe>
                      ) : (
                        <p className="text-muted text-center p-3">Location not available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default TempleDetails;
