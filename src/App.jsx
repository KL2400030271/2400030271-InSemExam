import { useState, useMemo } from "react";
import "./App.css";

function App() {
  const products = [
    {
      id: 1,
      name: "Apple iPhone 15",
      price: 79999,
      originalPrice: 89999,
      category: "Mobile",
      brand: "Apple",
      rating: 4.8,
      reviews: 1247,
      image: "https://m.media-amazon.com/images/I/71d7rfSl0wL._SL1500_.jpg",
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Samsung Galaxy S24",
      price: 69999,
      originalPrice: 79999,
      category: "Mobile",
      brand: "Samsung",
      rating: 4.6,
      reviews: 892,
      image: "https://m.media-amazon.com/images/I/71RVuBs3q9L._SL1500_.jpg",
      badge: "New",
    },
    {
      id: 3,
      name: "HP Pavilion 15 Laptop",
      price: 58999,
      originalPrice: 68999,
      category: "Laptop",
      brand: "HP",
      rating: 4.5,
      reviews: 654,
      image: "https://m.media-amazon.com/images/I/71cQWYVtcBL._AC_SL1500_.jpg",
      badge: "Student Choice",
    },
    {
      id: 4,
      name: "MacBook Air M2",
      price: 99999,
      originalPrice: 109999,
      category: "Laptop",
      brand: "Apple",
      rating: 4.9,
      reviews: 2103,
      image: "https://m.media-amazon.com/images/I/71vFKBpKakL._SL1500_.jpg",
      badge: "Premium",
    },
    {
      id: 5,
      name: "JBL Tour One M2 Headphones",
      price: 24999,
      originalPrice: 29999,
      category: "Accessories",
      brand: "JBL",
      rating: 4.6,
      reviews: 734,
      image: "https://m.media-amazon.com/images/I/71vFKBpKakL._SL1500_.jpg",
      badge: "Noise Cancelling",
    },
    {
      id: 6,
      name: "Apple Watch Series 9",
      price: 41999,
      originalPrice: 45999,
      category: "Accessories",
      brand: "Apple",
      rating: 4.5,
      reviews: 934,
      image: "https://m.media-amazon.com/images/I/71XMTLtZd5L._SL1500_.jpg",
      badge: "Smart Watch",
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [wishlist, setWishlist] = useState(new Set());

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : aValue < bValue
          ? -1
          : 0
        : aValue < bValue
        ? 1
        : aValue > bValue
        ? -1
        : 0;
    });

    return filtered;
  }, [selectedCategory, searchQuery, sortBy, sortOrder]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const newWishlist = new Set(prev);
      newWishlist.has(productId)
        ? newWishlist.delete(productId)
        : newWishlist.add(productId);
      return newWishlist;
    });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const getDiscountPercentage = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <div className="container">
      <h1>Product Listing</h1>

      <div className="control-panel">
        <div className="control-group">
          <label>Search: </label>
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>Category: </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Sort By: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <div className="control-group">
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
      </div>

      <hr />

      <div className="product-grid">
        {filteredAndSortedProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredAndSortedProducts.map((p) => {
            const isWished = wishlist.has(p.id);
            const discount = getDiscountPercentage(p.originalPrice, p.price);

            return (
              <div className="product-card" key={p.id}>
                <div className="card-header">
                  <img src={p.image} alt={p.name} className="product-img" />
                  <button
                    className={`wishlist-btn ${isWished ? "wished" : ""}`}
                    onClick={() => toggleWishlist(p.id)}
                  >
                    {isWished ? "Remove from Wishlist" : "Add to Wishlist"}
                  </button>
                  {p.badge && <span className="badge">{p.badge}</span>}
                </div>

                <h3>{p.name}</h3>
                <p className="brand">By {p.brand}</p>

                <div className="price-details">
                  <span className="current-price">{formatPrice(p.price)}</span>
                  {discount > 0 && (
                    <>
                      <span className="original-price">
                        {formatPrice(p.originalPrice)}
                      </span>
                      <span className="discount-percent">
                        ({discount}% OFF)
                      </span>
                    </>
                  )}
                </div>

                <div className="rating-stock">
                  <span>Rating: {p.rating}</span>
                </div>

                <p>Category: {p.category}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;
