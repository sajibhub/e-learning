// src/components/products/ProductList.jsx
import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products }) => {
  // Group products by category
  const grouped = products.reduce((acc, product) => {
    const categoryName = product.category?.name || "Uncategorized";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(product);
    return acc;
  }, {});

  return (
    <div className=" mx-auto px-4 py-8 space-y-10">
      {Object.keys(grouped).map((category, index) => (
        <div key={category} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
            <div className="ml-4 h-1 flex-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {grouped[category].map((product, productIndex) => (
              <div 
                key={product._id} 
                className="transform transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${(index * 0.1) + (productIndex * 0.05)}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ProductList;