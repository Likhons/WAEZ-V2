// Writes a message to the hidden #liveRegion element so screen readers
// speak it. Clearing the text first, then setting it a frame later,
// forces assistive tech to notice the change even if the same message
// was announced recently — matches the original announce() exactly.
export function announce(message) {
  const region = document.getElementById('liveRegion')
  if (!region) return
  region.textContent = ''
  requestAnimationFrame(() => {
    region.textContent = message
  })
}