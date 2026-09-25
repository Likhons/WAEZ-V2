// A plain module-level object (not React state) so the checkout form's
// draft values and selected payment method survive navigating away and
// back to /checkout — matching the original's global checkoutFormData /
// checkoutPayMethod variables. This is intentionally NOT localStorage:
// it resets on a real page reload, same as the original.
export const checkoutState = {
  formData: {},
  payMethod: 'card',
}