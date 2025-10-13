// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/api";
// import "../styles/PujaList.css";

// const PujaList = () => {
//   const [pujas, setPujas] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const itemsPerPage = 18; // As per the user's request
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchPujas(currentPage);
//   }, [currentPage]);

//   const fetchPujas = async (page) => {
//     setLoading(true);
//     try {
//       const response = await api.get(`/api/v1/devotee/pooja/?page=${page}&size=${itemsPerPage}`);
//       let pujaList = response.data?.results || [];
//       const totalCount = response.data?.count || 0;
//       setTotalPages(Math.ceil(totalCount / itemsPerPage));

//       // Remove prasadam and chadhava entries
//       /*
//       pujaList = pujaList.filter((puja) => {
//         const checkText = `${puja.name || ""} ${puja.details || ""} ${puja.description || ""}`.toLowerCase();
//         return !checkText.includes("prasadam") && !checkText.includes("chadhava");
//       });
//       */

//       setPujas(pujaList);
//     } catch (err) {
//       console.error("Failed to load pujas:", err);
//       setError("Failed to load pujas");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   const filteredPujas = pujas.filter((puja) => {
//     const categoryFilter = selectedCategory.toLowerCase();
//     const pujaCategory =
//       typeof puja.category === "string"
//         ? puja.category
//         : puja.category?.name || "";

//     const checkText = `${pujaCategory} ${puja.name || ""} ${puja.details || ""} ${puja.description || ""}`.toLowerCase();

//     const matchesCategory =
//       selectedCategory === "All" || checkText.includes(categoryFilter);

//     const matchesSearch =
//       puja.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       puja.temple?.name?.toLowerCase().includes(searchTerm.toLowerCase());

//     return matchesCategory && matchesSearch;
//   });

  

//   const handleBookNow = (puja) => {
//     const cart = JSON.parse(localStorage.getItem("cart")) || [];
//     const alreadyExists = cart.find((item) => item.id === puja.id);

//     if (!alreadyExists) {
//       const item = {
//         id: puja.id,
//         name: puja.name,
//         description: puja.details || puja.description || "",
//         cost: puja.amount || puja.original_cost || puja.cost || 0,
//         images: puja.images,
//         quantity: 1,
//         final_total: puja.amount || puja.original_cost || puja.cost || 0,
//       };
//       cart.push(item);
//       localStorage.setItem("cart", JSON.stringify(cart));
//       window.dispatchEvent(new Event("storage"));
//     }
//     navigate("/cart");
//   };

//   const truncateText = (text, limit) => {
//     if (!text) return "";
//     return text.length > limit ? text.substring(0, limit) + "..." : text;
//   };

//   const categories = [
//     "All",
//     "Abhishek",
//     "Mahamangalarti",
//     "Rudrabhishek",
//     "Homa",
//     "Havan",
//     "Anushthan",
//   ];

  

//   const getImageUrl = (puja) => {
//     if (puja?.images?.length > 0 && puja.images[0].image) {
//       return puja.images[0].image;
//     } else if (puja?.temple?.images?.length > 0 && puja.temple.images[0].image) {
//       return puja.temple.images[0].image;
//     } else if (puja?.god?.image) {
//       return puja.god.image;
//     }
//     return "https://via.placeholder.com/400x220?text=No+Image";
//   };

//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxPageButtons = 3; // Show a maximum of 3 page numbers

//     if (totalPages <= maxPageButtons) {
//       // If total pages are less than or equal to maxPageButtons, show all pages
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
//       let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

//       // Adjust startPage if we are at the end of the total pages
//       if (endPage === totalPages) {
//         startPage = Math.max(1, totalPages - maxPageButtons + 1);
//       }
//       // Adjust endPage if we are at the beginning of the total pages
//       if (startPage === 1) {
//         endPage = Math.min(totalPages, maxPageButtons);
//       }

//       for (let i = startPage; i <= endPage; i++) {
//         pageNumbers.push(i);
//       }
//     }
//     return pageNumbers;
//   };

//   return (
//     <div className="puja-list-container">
//       <h2 className="puja-heading">Available Pujas</h2>

//       <div className="category-section">
//         {categories.map((category) => (
//           <button
//             key={category}
//             className={`category-button ${selectedCategory === category ? "active" : ""}`}
//             onClick={() => {
//               setSelectedCategory(category);
//             }}
//           >
//             {category}
//           </button>
//         ))}
//       </div>

//       <div className="search-bar">
//         <div className="search-input-wrapper">
//           <input
//             type="text"
//             placeholder="Search by puja or temples..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//             }}
//             className="search-input"
//           />
//           {searchTerm && (
//             <button className="clear-inside" onClick={() => setSearchTerm("")}>
//               ✖
//             </button>
//           )}
//         </div>
//         <button className="search-button" onClick={() => {}}>
//           SEARCH
//         </button>
//       </div>

//       <div className="puja-cards">
//         {loading ? (
//           [...Array(6)].map((_, index) => (
//             <div className="puja-card skeleton" key={index}>
//               <h3 className="skeleton-text">Loading...</h3>
//             </div>
//           ))
//         ) : error ? (
//           <p className="error-text">{error}</p>
//         ) : filteredPujas.length === 0 ? (
//           <p>No pujas found.</p>
//         ) : (
//           filteredPujas.map((puja, idx) => {
//             const imageUrl = getImageUrl(puja);
//             const price = puja.amount || puja.original_cost || puja.cost || 0;
//             return (
//               <div key={puja.id || idx} className="puja-card">
//                 <div className="puja-image-box">
//                   <img
//                     src={imageUrl}
//                     alt={puja.name}
//                     className="puja-image"
//                     loading="lazy"
//                     onError={(e) => {
//                       e.target.src = "https://via.placeholder.com/400x220?text=No+Image";
//                     }}
//                   />
//                 </div>
//                 <h3 className="puja-name">{puja.name}</h3>
//                 <div className="puja-info">
//                   <p>🛕 {puja.temple?.name || "N/A"}</p>
//                   <p>🙏 {puja.god?.name || "N/A"}</p>
//                   <p>
//                     ⭐ {truncateText(puja.details || puja.description || "Spiritual harmony", 80)}
//                   </p>
//                   <p className="puja-price">
//                     💰 ₹
//                     {price.toLocaleString("en-IN", {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
                    
//                   </p>
//                   <div className="button-wrapper">
//                     <button className="view-details-btn" onClick={() => navigate(`/puja/${puja.id}`)}>
//                       View Details
//                     </button>
//                     <button className="book-button" onClick={() => handleBookNow(puja)}>
//                       Participate
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       <div className="pagination-controls">
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="pagination-button pagination-nav-button"
//         >
//           Prev
//         </button>
//         {getPageNumbers().map((pageNumber) => (
//           <button
//             key={pageNumber}
//             onClick={() => handlePageChange(pageNumber)}
//             className={`pagination-button ${currentPage === pageNumber ? "active" : ""}`}
//           >
//             {pageNumber}
//           </button>
//         ))}
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="pagination-button pagination-nav-button"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PujaList;





import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { FaStar } from "react-icons/fa";
import "../styles/PujaList.css";

const PujaList = () => {
  const [pujas, setPujas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 18;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPujas(currentPage);
  }, [currentPage]);

  const fetchPujas = async (page) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/v1/devotee/pooja/?page=${page}&size=${itemsPerPage}`
      );
      let pujaList = response.data?.results || [];
      const totalCount = response.data?.count || 0;
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
      setPujas(pujaList);
    } catch (err) {
      console.error("Failed to load pujas:", err);
      setError("Failed to load pujas");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleBookNow = (puja) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const alreadyExists = cart.find((item) => item.id === puja.id);

    if (!alreadyExists) {
      const item = {
        id: puja.id,
        name: puja.name,
        description: puja.details || puja.description || "",
        cost: puja.amount || puja.original_cost || puja.cost || 0,
        images: puja.images,
        quantity: 1,
        final_total: puja.amount || puja.original_cost || puja.cost || 0,
      };
      cart.push(item);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("storage"));
    }
    navigate("/cart");
  };

  const truncateText = (text, limit) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const categories = [
    "All",
    "Abhishek",
    "Mahamangalarti",
    "Rudrabhishek",
    "Homa",
    "Havan",
    "Anushthan",
  ];

  const getImageUrl = (puja) => {
    if (puja?.images?.length > 0 && puja.images[0].image) return puja.images[0].image;
    if (puja?.temple?.images?.length > 0 && puja.temple.images[0].image)
      return puja.temple.images[0].image;
    if (puja?.god?.image) return puja.god.image;
    return "https://via.placeholder.com/400x220?text=No+Image";
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 3;
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
      if (endPage === totalPages) startPage = Math.max(1, totalPages - maxPageButtons + 1);
      if (startPage === 1) endPage = Math.min(totalPages, maxPageButtons);
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // ✅ Filtered pujas based on category and search
  const filteredPujas = pujas.filter((puja) => {
    const categoryFilter = selectedCategory.toLowerCase();
    const pujaCategory =
      typeof puja.category === "string" ? puja.category : puja.category?.name || "";

    const checkText = `${pujaCategory} ${puja.name || ""} ${puja.details || ""} ${
      puja.description || ""
    }`.toLowerCase();

    const matchesCategory = selectedCategory === "All" || checkText.includes(categoryFilter);

    const matchesSearch =
      puja.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      puja.temple?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="puja-list-container">
      <h2 className="puja-heading">Available Pujas</h2>

      <div className="category-section">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="search-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search by puja or temples..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-inside" onClick={() => setSearchTerm("")}>
              ✖
            </button>
          )}
        </div>
        <button className="search-button">SEARCH</button>
      </div>

      <div className="puja-cards">
        {loading ? (
          [...Array(6)].map((_, index) => (
            <div className="puja-card skeleton" key={index}>
              <h3 className="skeleton-text">Loading...</h3>
            </div>
          ))
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : filteredPujas.length === 0 ? (
          <p>No pujas found.</p>
        ) : (
          filteredPujas.map((puja, idx) => {
            const imageUrl = getImageUrl(puja);
            const price = puja.amount || puja.original_cost || puja.cost || 0;
            const rating = puja.rating || 4.5;
            const reviewsCount = puja.reviews_count || 100;

            return (
              <div key={puja.id || idx} className="puja-card">
                <div className="puja-image-box">
                  <img
                    src={imageUrl}
                    alt={puja.name}
                    className="puja-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x220?text=No+Image";
                    }}
                  />
                </div>
                <h3 className="puja-name">{puja.name}</h3>
                <div className="puja-info">
                  <p>🛕 {puja.temple?.name || "N/A"}</p>
                  <p>🙏 {puja.god?.name || "N/A"}</p>
                  <p>
                    ⭐ {truncateText(puja.details || puja.description || "Spiritual harmony", 80)}
                  </p>

                  {/* ✅ Price + Star Rating Row */}
                  <div className="price-rating-row">
                    <p className="puja-price">
                      💰 ₹
                      {price.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <div className="ratings">
                      <FaStar className="star" /> {rating} ({reviewsCount}+ ratings)
                    </div>
                  </div>

                  <div className="button-wrapper">
                    <button
                      className="view-details-btn"
                      onClick={() => navigate(`/puja/${puja.id}`)}
                    >
                      View Details
                    </button>
                    <button className="book-button" onClick={() => handleBookNow(puja)}>
                      Participate
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button pagination-nav-button"
        >
          Prev
        </button>
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`pagination-button ${
              currentPage === pageNumber ? "active" : ""
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button pagination-nav-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PujaList;
