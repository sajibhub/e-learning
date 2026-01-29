// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductByIdApi } from "../api/product.api";
import PaymentModal from "../components/payment/PaymentModal";
import { FaStar, FaRegStar, FaShareAlt, FaHeart, FaShoppingCart, FaArrowLeft, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams(); // get product id from route
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductByIdApi(id);
        setProduct(res.data.product); // API returns single product object
      } catch (err) {
        console.error("Failed to fetch product:", err.response?.data || err.message);
        setError("Failed to load product details");
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const toggleWishlist = () => {
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.productTitle,
        text: `Check out this product: ${product.productTitle}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-6xl w-full p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3 mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="max-w-4xl w-full p-6 bg-white shadow-xl rounded-2xl">
        <div className="text-center py-10">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Link to="/shop" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            <FaArrowLeft className="mr-2" /> Back to Products
          </Link>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="max-w-4xl w-full p-6 bg-white shadow-xl rounded-2xl">
        <div className="text-center py-10">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xl mb-4">Product not found</p>
          <Link to="/shop" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            <FaArrowLeft className="mr-2" /> Back to Products
          </Link>
        </div>
      </div>
    </div>
  );

  // Single product image
  const productImage = product.productImages;
  // Mock rating - in a real app, this would come from the API
  const rating = 4.5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Breadcrumb */}
      <div className=" mx-auto px-6 pt-6">
        <nav className="flex items-center text-sm text-gray-500 mb-6 animate-fade-in">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-blue-600 transition-colors">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{product.productTitle}</span>
        </nav>
      </div>

      <div className=" mx-auto px-6 pb-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl bg-gray-100 group">
                
                <img
                  src={productImage}
                  alt={product.productTitle}
                  className={`w-full h-96 object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://picsum.photos/seed/product/600/400.jpg";
                  }}
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-bounce">
                    New
                  </span>
                )}
                {product.isSale && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                    Sale
                  </span>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div className="animate-slide-in-right">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.productTitle}</h1>

               
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
                <p className="text-3xl font-bold text-blue-600">৳ {product.productPrice}</p>
                {product.originalPrice && (
                  <p className="text-xl text-gray-400 line-through">৳ {product.originalPrice}</p>
                )}
               
              </div>

              {/* Short Description */}
              <p className="text-gray-600 leading-relaxed animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
                {product.shortDescription || product.productDetails?.substring(0, 150) + "..."}
              </p>

              {/* Product Features */}
              {product.features && (
                <div className="py-4 animate-slide-in-right" style={{ animationDelay: "0.3s" }}>
                  <h3 className="font-semibold text-lg mb-2">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 transform transition-all duration-300 hover:translate-x-1">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 py-4 animate-slide-in-right" style={{ animationDelay: "0.4s" }}>
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium shadow-lg"
                  onClick={() => setShowPayment(true)}
                >
                  <FaShoppingCart /> Buy Now
                </button>
                <button
                  className={`border-2 ${isWishlist ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'} text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-md`}
                  onClick={toggleWishlist}
                >
                  <FaHeart className={isWishlist ? "text-red-500" : ""} />
                </button>
                <button
                  className="border-2 border-gray-300 bg-white text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-md"
                  onClick={shareProduct}
                >
                  <FaShareAlt />
                </button>
              </div>

              {/* Product Benefits */}
             
            </div>
          </div>

          {/* Product Description Tabs */}
          <div className="border-t">
            <div className="flex border-b">
              <button className="px-6 py-3 font-medium text-blue-600 border-b-2 border-blue-600 transition-all duration-300">
                Description
              </button>
            </div>
            <div className="p-8">
              <div className="prose max-w-none animate-fade-in">
                <h2 className="text-2xl font-semibold mb-4">Product Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.productDetails}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          productId={id}
          productType="product"
          onClose={() => setShowPayment(false)}
        />
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;