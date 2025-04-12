import ProductCard from "./ProductCard";

function ProductList({ products, onProductClick }) {
  if (!products || products.length === 0) {
    return <p>No products available.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
}

export default ProductList;
