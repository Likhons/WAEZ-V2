export function cartColorName(product, colorIdx) {
  return product.colorNames[colorIdx ?? 0] || product.colorNames[0]
}