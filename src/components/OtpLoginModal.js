
import React, { useState, useEffect, useRef } from "react";
import { Alert, Spinner } from "react-bootstrap";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../firebase";
import { useUserAuth } from "../context/UserAuthContext";
import { sendMobileOtp } from "../api/api";
import "../styles/OtpLoginModal.css";

const OtpLoginModal = ({ onClose, onLoginSuccess }) => {
  const { setUser } = useUserAuth();
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const recaptchaContainerRef = useRef(null);
  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    if (recaptchaContainerRef.current && !recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        recaptchaContainerRef.current,
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved:", response);
          },
          "expired-callback": () => {
            console.warn("reCAPTCHA expired. Please re-verify.");
            setError("reCAPTCHA expired. Please try sending OTP again.");
          },
        }
      );
    }
    return () => {
      recaptchaVerifierRef.current = null;
    };
  }, []);

  const handleSendOtp = async () => {
    setError("");
    setIsLoading(true);

    if (!mobile) {
      setError("Please enter a mobile number.");
      setIsLoading(false);
      return;
    }

    const cleanedMobile = mobile.replace(/[^0-9]/g, "");
    const phoneNumber = `${countryCode}${cleanedMobile}`;

    if (cleanedMobile.length < 7 || cleanedMobile.length > 15) {
      setError("Please enter a valid mobile number (7-15 digits).");
      setIsLoading(false);
      return;
    }

    try {
      const appVerifier = recaptchaVerifierRef.current;

      if (!appVerifier) {
        setError("reCAPTCHA not initialized. Please refresh the page.");
        setIsLoading(false);
        return;
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      setError("");
      alert("OTP sent successfully to " + phoneNumber);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(`Failed to send OTP: ${err.message || "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setIsLoading(true);

    if (!otp) {
      setError("Please enter the OTP.");
      setIsLoading(false);
      return;
    }

    try {
      if (!window.confirmationResult) {
        setError("OTP sending process was not completed. Please send OTP first.");
        setIsLoading(false);
        return;
      }
      const result = await window.confirmationResult.confirm(otp);
      const firebaseUser = result.user;
      const mobile_number = firebaseUser.phoneNumber;

      try {
        const backendResponse = await sendMobileOtp(mobile_number);

        const userObj = {
          mobile: mobile_number,
          backendUser: backendResponse,
        };

        localStorage.setItem("user", JSON.stringify(userObj));
        if (backendResponse.token) {
          localStorage.setItem("token", backendResponse.token);
        }

        setUser(userObj);
        onLoginSuccess();
      } catch (err) {
        console.error("Backend login failed:", err);
        setError(
          "OTP verified, but backend login failed. Please contact support."
        );
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError(`OTP verification failed: ${err.message || "An unknown error occurred."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-login-modal-overlay">
      <div className="otp-login-modal">
        <div className="modal-header">
          <h3 className="login-title">Login with OTP</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {error && <Alert variant="danger">{error}</Alert>}

          <div className="phone-input-group">
            <select
              className="country-code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              disabled={isLoading}
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
            </select>
            <input
              className="input-field"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => {
                const re = /^[0-9\b]+$/;
                if (e.target.value === "" || re.test(e.target.value)) {
                  setMobile(e.target.value);
                }
              }}
              disabled={isLoading || otpSent}
              maxLength={15}
            />
          </div>

          {!otpSent ? (
            <button
              className="btn-primary"
              onClick={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? <Spinner as="span" animation="border" size="sm" /> : "SEND OTP"}
            </button>
          ) : (
            <>
              <div className="input-field-group">
                <input
                  type={showOtp ? "text" : "password"}
                  className="input-field with-icon"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLoading}
                  maxLength={6}
                />
                <span className="input-icon" onClick={() => setShowOtp(!showOtp)}>
                  {showOtp ? "🙈" : "👁️"}
                </span>
              </div>
              <button
                className="btn-primary"
                onClick={handleVerifyOtp}
                disabled={isLoading}
              >
                {isLoading ? <Spinner as="span" animation="border" size="sm" /> : "SUBMIT OTP"}
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setError("");
                  setIsLoading(false);
                }}
                disabled={isLoading}
              >
                Resend / Change Number
              </button>
            </>
          )}
        </div>
        <div id="recaptcha-container" ref={recaptchaContainerRef} />
      </div>
    </div>
  );
};

export default OtpLoginModal;
