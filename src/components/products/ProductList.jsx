"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Image as ImageIcon,
  Tag,
  Box,
  Layers,
  Shield,
  Info,
} from "lucide-react";
import Image from "next/image";

const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-800 border border-gray-700 rounded-lg`}
      >
        <ImageIcon className="w-12 h-12 text-gray-500" />
        <span className="ml-2 text-gray-500">Image Not Available</span>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => setError(true)}
      />
    </div>
  );
};

const renderStars = (rating, size = "sm") => {
  const starSizes = {
    sm: "text-sm",
    lg: "text-2xl",
  };

  return [...Array(5)].map((_, i) => {
    const starValue = i + 1;
    const isFullStar = rating >= starValue;
    const isHalfStar = rating >= starValue - 0.5 && rating < starValue;

    return (
      <span key={i} className={`relative ${starSizes[size]}`}>
        <span className="text-gray-600">☆</span>
        {(isFullStar || isHalfStar) && (
          <span
            className="text-yellow-500 absolute top-0 left-0 overflow-hidden"
            style={{
              width: isHalfStar ? "50%" : "100%",
            }}
          >
            ★
          </span>
        )}
      </span>
    );
  });
};

const ProductModal = ({ product, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("specifications");

  const imageUrls = useMemo(() => {
    if (Array.isArray(product.image_urls)) {
      return product.image_urls;
    }
    if (typeof product.image_urls === "string") {
      try {
        return JSON.parse(product.image_urls);
      } catch (e) {
        console.error("Failed to parse image_urls:", e);
        return product.main_image ? [product.main_image] : [];
      }
    }
    return product.main_image ? [product.main_image] : [];
  }, [product.image_urls, product.main_image]);

  const specifications = useMemo(() => {
    if (Array.isArray(product.specifications)) {
      return product.specifications;
    }
    if (typeof product.specifications === "string") {
      try {
        return JSON.parse(product.specifications);
      } catch (e) {
        console.error("Failed to parse specifications:", e);
        return [];
      }
    }
    return [];
  }, [product.specifications]);

  const colors = useMemo(() => {
    if (Array.isArray(product.colors)) {
      return product.colors;
    }
    if (typeof product.colors === "string") {
      try {
        return JSON.parse(product.colors);
      } catch (e) {
        console.error("Failed to parse colors:", e);
        return [];
      }
    }
    return [];
  }, [product.colors]);

  const sizes = useMemo(() => {
    if (Array.isArray(product.sizes)) {
      return product.sizes;
    }
    if (typeof product.sizes === "string") {
      try {
        return JSON.parse(product.sizes);
      } catch (e) {
        console.error("Failed to parse sizes:", e);
        return [];
      }
    }
    return [];
  }, [product.sizes]);

  const categories = useMemo(() => {
    if (Array.isArray(product.categories)) {
      return product.categories;
    }
    if (typeof product.categories === "string") {
      try {
        return JSON.parse(product.categories);
      } catch (e) {
        console.error("Failed to parse categories:", e);
        return [];
      }
    }
    return [];
  }, [product.categories]);

  const tabs = [
    {
      id: "specifications",
      label: "Specifications",
      icon: <Box className="w-5 h-5 mr-2" />,
    },
    {
      id: "details",
      label: "Product Details",
      icon: <Info className="w-5 h-5 mr-2" />,
    },
    {
      id: "description",
      label: "Description",
      icon: <Layers className="w-5 h-5 mr-2" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto pt-8 md:pt-4 md:items-center">
      <div className="bg-zinc-900 text-white rounded-2xl max-w-6xl w-full my-8 flex flex-col overflow-hidden shadow-2xl border border-gray-800">
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-lg md:text-xl font-bold flex items-center text-gray-300 break-words max-w-[80%]">
            <Tag className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 flex-shrink-0 text-blue-500" />
            <span className="line-clamp-1">{product.product_name}</span>
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-800 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 overflow-y-auto custom-scrollbar">
          <div>
            <div className="mb-4 relative h-[300px] sm:h-[400px] md:h-[500px]">
              {imageUrls.length > 0 ? (
                <Image
                  src={imageUrls[currentImageIndex]}
                  alt={product.product_name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-lg"
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
                  <ImageIcon className="w-16 h-16 text-gray-600" />
                  <p className="ml-2 text-gray-400">No image available</p>
                </div>
              )}
            </div>
            <div className="flex space-x-2 overflow-x-auto mt-4 pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
              <div className="flex space-x-2 whitespace-nowrap">
                {imageUrls.length > 1 &&
                  imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className={`inline-block relative min-w-[60px] w-16 md:w-20 h-16 md:h-20 rounded-md overflow-hidden cursor-pointer ${
                        index === currentImageIndex
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        src={url}
                        alt={`Product thumbnail ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div>
              <p className="text-xl md:text-2xl font-bold text-blue-600">
                ${product.discounted_price.toFixed(2)}
                {product.initial_price && (
                  <span className="ml-2 line-through text-gray-500 text-sm md:text-base">
                    ${product.initial_price.toFixed(2)}
                  </span>
                )}
              </p>
              <div className="flex items-center mt-2">
                {renderStars(product.rating || 0, "lg")}
                <span className="ml-2 text-sm md:text-base text-gray-400">
                  ({product.rating || 0}) - {product.review_count || 0} Reviews
                </span>
              </div>
            </div>

            <div className="flex overflow-x-auto border-b border-gray-700 mb-4 pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center px-2 md:px-4 py-2 transition-colors whitespace-nowrap text-sm md:text-base ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="max-h-[300px] md:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
              {activeTab === "specifications" && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-300">
                    Full Specifications
                  </h3>
                  <table className="w-full">
                    <tbody>
                      {specifications.map((spec, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          <td className="py-2 pr-2 font-medium text-gray-300 text-sm md:text-base">
                            {spec.name}
                          </td>
                          <td className="py-2 text-gray-400 text-sm md:text-base">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-300 flex items-center">
                      <Shield className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-500" />
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs md:text-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {sizes.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-300">
                        Available Sizes:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((size, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs md:text-sm"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {colors.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-300">
                        Available Colors:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs md:text-sm"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "description" && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-300">
                    Product Description
                  </h3>
                  <p className="text-gray-400 whitespace-pre-wrap text-sm md:text-base">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductListingPage({ productsData }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-gray-800 text-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-200">
            Product Catalog
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-gray-700 bg-gray-900"
                >
                  <div className="h-72 bg-gray-800 rounded-lg mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-800 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-800 rounded w-2/3 animate-pulse"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {productsData.map((product) => (
            <div
              key={product.id}
              className="group relative p-4 rounded-xl overflow-hidden transition-all duration-300 border border-zinc-800 bg-zinc-900 hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)] hover:-translate-y-0.5 will-change-transform cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
              </div>

              <div className="relative">
                <div className="mb-4 overflow-hidden rounded-lg h-72 relative">
                  <ImageWithFallback
                    src={product.main_image}
                    alt={product.product_name}
                    className="w-full h-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between mt-3">
                    <p className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm text-xs text-gray-300">
                      ${product.discounted_price.toFixed(2)}
                    </p>

                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating || 0)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 leading-snug line-clamp-2">
                    {product.product_name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </div>
  );
}
