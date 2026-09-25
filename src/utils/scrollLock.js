// Shared scroll-lock counter, matching the original script.js behavior.
// Multiple overlays (mobile drawer, quick view, search modal, cart drawer)
// can all call lockScroll() independently — the page only becomes
// scrollable again once every overlay that locked it has unlocked it.
let openOverlayCount = 0

export function lockScroll() {
  openOverlayCount++
  document.body.style.overflow = 'hidden'
}

export function unlockScroll() {
  openOverlayCount = Math.max(0, openOverlayCount - 1)
  if (openOverlayCount === 0) {
    document.body.style.overflow = ''
  }
}