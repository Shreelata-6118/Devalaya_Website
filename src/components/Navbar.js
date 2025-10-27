import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaShoppingCart,
  FaBars,
  FaSignOutAlt,
  FaCalendarAlt,
  FaPlaceOfWorship,
} from "react-icons/fa";
import { useUserAuth } from "../context/UserAuthContext";
import { logout as apiLogout } from "../api/api";
import "../styles/Navbar.css";
import logo from "../assets/NewLogo.png";
import extraLogo from "../assets/logo2.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { user, logout } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount); // ✅ custom event
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const openDrawer = () => setCartDrawerOpen(true);
    window.addEventListener("open-cart-drawer", openDrawer);
    return () => window.removeEventListener("open-cart-drawer", openDrawer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const combo = document.querySelector(".goog-te-combo");
      const container = document.getElementById("google-language-container");
      if (combo && container && !container.contains(combo)) {
        container.innerHTML = "";
        container.appendChild(combo);
        combo.classList.add("language-select");
        combo.selectedIndex = 0;
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Call the API logout endpoint with limit parameter
      await apiLogout();
    } catch (error) {
      console.warn('API logout failed:', error);
    }
    
    // Clear cart immediately
    localStorage.removeItem("cart");
    setCartCount(0);
    // Notify other components that cart has been cleared
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("cartUpdated"));
    
    // Then proceed with the existing logout logic
    logout()
      .then(() => {
        setDropdownOpen(false);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <>
<div className="d-block d-lg-none py-1 bg-white">
  <div className="d-flex justify-content-center align-items-center px-3" style={{ maxWidth: "100%" }}>
    <img
      src={logo}
      alt="Devalaya Logo"
      className="img-fluid me-2"
      style={{ maxHeight: "40px", width: "auto" }}
    />
    <img
      src={extraLogo}
      alt="Extra Logo"
      className="img-fluid"
      style={{ maxHeight: "40px", width: "auto" }}
    />
  </div>
</div>
      <nav className="navbar container-fluid">
        <div className="nav-left">
        <img src={extraLogo} alt="Extra Logo" className="extra-logo d-none d-lg-block" />
          <Link to="/">
            <img src={logo} alt="Devalaya Logo" className="logo d-none d-lg-block" />
          </Link>
        </div>

        <div className={`nav-center ${menuOpen ? "open" : ""}`}>
          <ul className="nav-links">
            <li><NavLink to="/">HOME</NavLink></li>
            <li><NavLink to="/puja">PUJA</NavLink></li>
            <li><NavLink to="/prasadam">PRASADAM</NavLink></li>
            <li><NavLink to="/events">EVENTS</NavLink></li>
            <li><NavLink to="/chadhava">CHADHAVA</NavLink></li>
            <li><NavLink to="/panchang">PANCHANG</NavLink></li>
            <li><NavLink to="/about">ABOUT US</NavLink></li>
            <li><NavLink to="/contact">CONTACT US</NavLink></li>
          </ul>
        </div>

        <div className="nav-right">
          <div id="google-language-container" />

          {!user ? (
            <>
              <Link to="/login" className="nav-button login-text-btn">
                Login
              </Link>
              <button
                className="nav-button"
                onClick={() => setCartDrawerOpen(true)}
                aria-label="Open cart drawer"
              >
                <FaShoppingCart className="icon" />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </>
          ) : (
            <>
              <div className="profile-dropdown-container" ref={dropdownRef}>
                <button className="profile-avatar orange-avatar" onClick={toggleDropdown}>
                  <FaUser className="icon" />
                </button>
                {dropdownOpen && (
                  <div className="profile-dropdown-menu">
                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FaUser className="icon" /> My Profile
                    </Link>
                    <Link to="/suggest-temple" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FaPlaceOfWorship className="icon" /> Suggest Temple
                    </Link>
                    <Link to="/bookings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FaCalendarAlt className="icon" /> My Bookings
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <FaSignOutAlt className="icon" /> Log Out
                    </button>
                  </div>
                )}
              </div>
              <button
                className="nav-button"
                onClick={() => setCartDrawerOpen(true)}
                aria-label="Open cart drawer"
              >
                <FaShoppingCart className="icon" />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </>
          )}
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </div>
      </nav>

      {/* Block CartDrawer on login and payment success pages */}
      {cartDrawerOpen && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/payment-success') && (() => {
        const CartDrawer = require("./CartDrawer").default;
        return <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />;
      })()}
    </>
  );
};

export default Navbar;
