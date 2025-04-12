import Image from "next/image";

function ProductCard({ product, onClick }) {
  if (!product) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-48 flex items-center justify-center">
        <p className="text-gray-500">Product information unavailable</p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-300"
      onClick={() => onClick(product.id)}
    >
      <div className="relative h-48">
        {product.main_image ? (
          <Image
            src={product.main_image}
            alt={product.product_name || "Product image"}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {product.product_name || "Unnamed Product"}
        </h3>
        <p className="text-gray-600 text-sm">
          ${product.discounted_price || product.initial_price || "Price unavailable"}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;