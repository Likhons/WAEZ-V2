export function fakeFetch(data, { delay = 260, failRate = 0 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (failRate > 0 && Math.random() < failRate) reject(new Error('Network error'))
      else resolve(data)
    }, delay)
  })
}