import ProductCard, { type ProductCardData } from "./ProductCard";

export default function CollectionGrid({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif text-2xl mb-3 text-ink">The atelier is between collections.</p>
        <p className="text-sm text-slate">Check back shortly, or request a private viewing.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
