import ProductCard from './ProductCard.jsx'
import EmptyState from './EmptyState.jsx'

function ProductGrid({
  products,
  emptyTitle = 'No products found',
  emptyBody = 'Try a different filter or check back soon.',
}) {
  if (!products.length) {
    return (
      <div className="p-grid">
        <EmptyState icon="—" title={emptyTitle} body={emptyBody} />
      </div>
    )
  }

  return (
    <div className="p-grid">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export default ProductGrid