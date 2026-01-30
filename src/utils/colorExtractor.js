// Cache for storing extracted colors by image URL
const colorCache = new Map()

/**
 * Extract dominant colors from an image with caching
 * @param {string} imageUrl - URL of the image
 * @param {number} colorCount - Number of colors to extract (default: 10)
 * @returns {Promise<string[]>} Array of hex color codes
 */
export async function extractColorsFromImage(imageUrl, colorCount = 10) {
  // Check cache first
  const cacheKey = `${imageUrl}-${colorCount}`
  if (colorCache.has(cacheKey)) {
    return Promise.resolve(colorCache.get(cacheKey))
  }
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Set canvas size
        canvas.width = img.width
        canvas.height = img.height
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0)
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        // Sample pixels (every Nth pixel for performance)
        // Reduced from 1000 to 500 samples for better performance
        const sampleRate = Math.max(1, Math.floor(data.length / 4 / 500))
        const colors = []
        
        for (let i = 0; i < data.length; i += 4 * sampleRate) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const a = data[i + 3]
          
          // Skip transparent pixels
          if (a < 128) continue
          
          // Convert to hex
          const hex = rgbToHex(r, g, b)
          colors.push({ hex, r, g, b })
        }
        
        // Group similar colors and get dominant ones
        const dominantColors = getDominantColors(colors, colorCount)

        // Cache the result
        colorCache.set(cacheKey, dominantColors)

        // Limit cache size to prevent memory issues (keep last 50 images)
        if (colorCache.size > 50) {
          const firstKey = colorCache.keys().next().value
          colorCache.delete(firstKey)
        }

        resolve(dominantColors)
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = imageUrl
  })
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * Get dominant colors using k-means clustering
 */
function getDominantColors(colors, k) {
  if (colors.length === 0) return []
  
  // Simple approach: use k-means clustering
  const clusters = kMeansClustering(colors, k)
  
  // Sort by cluster size and get colors
  const sortedClusters = clusters
    .map((cluster, index) => ({
      size: cluster.length,
      color: getAverageColor(cluster),
      index
    }))
    .sort((a, b) => b.size - a.size)
  
  return sortedClusters.map(c => c.color)
}

/**
 * Simple k-means clustering
 */
function kMeansClustering(colors, k) {
  if (colors.length <= k) {
    return colors.map(c => [c])
  }
  
  // Initialize centroids randomly
  const centroids = []
  for (let i = 0; i < k; i++) {
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    centroids.push({ r: randomColor.r, g: randomColor.g, b: randomColor.b })
  }
  
  let clusters = []
  let iterations = 0
  const maxIterations = 10
  
  while (iterations < maxIterations) {
    // Assign colors to nearest centroid
    clusters = Array(k).fill(null).map(() => [])
    
    colors.forEach(color => {
      let minDistance = Infinity
      let nearestCluster = 0
      
      centroids.forEach((centroid, index) => {
        const distance = colorDistance(color, centroid)
        if (distance < minDistance) {
          minDistance = distance
          nearestCluster = index
        }
      })
      
      clusters[nearestCluster].push(color)
    })
    
    // Update centroids
    let changed = false
    centroids.forEach((centroid, index) => {
      if (clusters[index].length > 0) {
        const avg = getAverageColor(clusters[index])
        const newCentroid = { r: avg.r, g: avg.g, b: avg.b }
        
        if (colorDistance(centroid, newCentroid) > 1) {
          changed = true
        }
        
        centroids[index] = newCentroid
      }
    })
    
    if (!changed) break
    iterations++
  }
  
  return clusters.filter(c => c.length > 0)
}

/**
 * Calculate color distance (Euclidean distance in RGB space)
 */
function colorDistance(c1, c2) {
  const dr = c1.r - c2.r
  const dg = c1.g - c2.g
  const db = c1.b - c2.b
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

/**
 * Get average color from a cluster
 */
function getAverageColor(cluster) {
  if (cluster.length === 0) return { r: 0, g: 0, b: 0 }
  
  const sum = cluster.reduce(
    (acc, color) => ({
      r: acc.r + color.r,
      g: acc.g + color.g,
      b: acc.b + color.b
    }),
    { r: 0, g: 0, b: 0 }
  )
  
  const avg = {
    r: Math.round(sum.r / cluster.length),
    g: Math.round(sum.g / cluster.length),
    b: Math.round(sum.b / cluster.length)
  }
  
  return rgbToHex(avg.r, avg.g, avg.b)
}
