import axios from 'axios';

// 🔧 Config
const API_CONFIG = {
  servers: {
    beta: {
      base: "https://beta.devalayas.com",
      presetToken: "9e65dcf08308a3f623c34491a92b282707edbe2c", // 🟢 Guest token
    },
    live: {
      base: "https://live.devalayas.com",
      presetToken: "e52a308c58887782d13a6fce7ae0258f8b6dfde1",
    },
  },
  current: 'beta', //r Change to 'live' for production
};

const { base, presetToken } = API_CONFIG.servers[API_CONFIG.current];

// ✅ Axios instance
const api = axios.create({
  baseURL: base,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add token to every request + block guest on protected
api.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem('authToken');
    const token = userToken || presetToken;

    

    // ❌ Guest token block
    const protectedRoutes = [
      '/api/v1/devotee/profile/',
      '/api/v1/devotee/pooja_request/',
      '/api/v1/devotee/profile/edit/',
      '/api/v1/devotee/profile/update/',
      '/api/v1/devotee/bulk_pooja_request/',
      '/api/v1/devotee/pooja_request/payment/',
      '/api/v1/devotee/payment_key/',
    ];
    const isProtected = protectedRoutes.some(route => config.url.includes(route));

    if (isProtected && token === presetToken) {
      // Use a custom error message or handle cancellation gracefully
      return Promise.reject(new axios.Cancel('🔒 Guest token not allowed. Please login.'));
    }

    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 403 Forbidden globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      const userToken = localStorage.getItem('authToken');
      if (userToken) {
        // If user was logged in, token might have expired
        localStorage.removeItem('authToken');
        localStorage.removeItem('devoteeProfile');
        alert("Your session has expired. Please log in again.");
      }
      // Redirect to login page
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

// ✅ x-www-form-urlencoded helper
const toFormUrlEncoded = (obj) =>
  Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');

// ✅ Auto token generation (guest only)
export const autoGenerateToken = async () => {
  const storedMobile = localStorage.getItem('mobileNumber');
  const mobileNumber =
    storedMobile &&
    storedMobile !== 'null' &&
    storedMobile !== '+919080706050'
      ? storedMobile
      : '+919080706050';

  const payload = {
    mobile_number: mobileNumber,
    login_token: '123',
    app_version: '1',
    device_model: 'Browser',
    user_type: 'Devotee',
    lang: 'en',
  };

  try {
    const response = await api.post('/api/v1/auth/', toFormUrlEncoded(payload), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const data = response.data;

    if (data?.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('devoteeProfile', JSON.stringify(data));
      if (mobileNumber !== '+919080706050') {
        localStorage.setItem('mobileNumber', mobileNumber);
      }
    }

    return data;
  } catch (error) {
    console.error('❌ Auto token generation failed:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Send OTP to mobile
export const sendMobileOtp = async (mobile_number) => {
  const payload = {
    mobile_number,
    login_token: '123',
    app_version: '1',
    device_model: 'Browser',
    user_type: 'Devotee',
    lang: 'en',
  };

  const response = await api.post('/api/v1/auth/', toFormUrlEncoded(payload), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const data = response.data;

  if (data?.token) {
    localStorage.setItem('authToken', data.token); // 🔁 Replace guest token
    localStorage.setItem('devoteeProfile', JSON.stringify(data));
    localStorage.setItem('mobileNumber', mobile_number);
  }

  return data;
};

// ✅ Login with OTP
export const loginWithOtp = async ({ mobile_number, email, otp }) => {
  const payload = {
    otp,
    login_token: '123',
    app_version: '1',
    device_model: 'Browser',
    user_type: 'Devotee',
  };

  if (mobile_number) payload.mobile_number = mobile_number;
  if (email) payload.email = email;

  const response = await api.post('/api/v1/devotee/login/', toFormUrlEncoded(payload), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const data = response?.data?.data;

  if (data?.token) {
    localStorage.setItem('authToken', data.token); // 🔁 Replace guest token
    localStorage.setItem('devoteeProfile', JSON.stringify(data));
  }

  return data;
};

// ✅ Get devotee profile
export const getDevoteeProfile = async () => {
  try {
    const response = await api.get('/api/v1/devotee/profile/');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching profile:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Update devotee profile
export const updateDevoteeProfile = async (profileData) => {
  try {
    // The API expects a PUT request to /api/v1/devotee/profile/update/
    const response = await api.put('/api/v1/devotee/profile/update/', profileData);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating profile:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Logout (remove only real token)
export const logout = async () => {
  try {
    // Get the user token
    const userToken = localStorage.getItem('authToken');
    const token = userToken || presetToken;
    
    // Make the API call with explicit Authorization header
    await api.get('/api/v1/auth/logout/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
  } catch (error) {
    console.warn('⚠️ Server logout failed:', error.response?.data || error.message);
  }

  // 🧹 Only clear real token, fallback to guest
  localStorage.removeItem('authToken');
  localStorage.removeItem('devoteeProfile');
  // mobileNumber is retained for fallback
};

export default api;
