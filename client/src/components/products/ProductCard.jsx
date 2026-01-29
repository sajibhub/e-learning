// src/components/products/ProductCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        <img
          src={product.productImages}
          alt={product.productTitle}
          className={`w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://picsum.photos/seed/product/400/300.jpg";
          }}
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            New
          </span>
        )}
        {product.isSale && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Sale
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.productTitle}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.productDetails.substring(0, 100)}...
        </p>
        <div className="flex items-center justify-between">
          <p className="font-bold text-xl text-blue-600">৳ {product.productPrice}</p>
          {product.originalPrice && (
            <p className="text-sm text-gray-400 line-through">৳ {product.originalPrice}</p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ProductCard;