import Image from "next/image";

function ProductModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl w-full">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {product.product_name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Image
                src={product.main_image}
                alt={product.product_name}
                width={500}
                height={500}
                style={{ objectFit: "contain" }}
              />
            </div>
            <div>
              <p className="text-gray-700 mb-4">{product.description}</p>
              <p className="text-lg font-semibold">
                Price: ${product.discounted_price}
              </p>
              <p>Brand: {product.brand}</p>
              <p>Category: {product.category_name}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 px-6 py-4 text-right">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
