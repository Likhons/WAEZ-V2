function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="p-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="p-card p-skel" key={i}>
          <div className="p-media"></div>
          <div className="p-meta">
            <div className="p-meta-line w60"></div>
            <div className="p-meta-line w35"></div>
            <div className="p-meta-line w20"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductGridSkeleton