import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWallpaper } from '../contexts/WallpaperContext'
import { extractColorsFromImage } from '../utils/colorExtractor'
import { Search, Loader2, Image as ImageIcon } from 'lucide-react'

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY'

export default function WallpaperSelector() {
  const { wallpaperUrl, updateWallpaper } = useWallpaper()
  const [searchQuery, setSearchQuery] = useState('nature')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [extractingColors, setExtractingColors] = useState(false)
  const [error, setError] = useState(null)

  // Load popular images on mount
  useEffect(() => {
    fetchImages('nature')
  }, [])

  const fetchImages = async (query = searchQuery) => {
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
      setError('Please set VITE_UNSPLASH_ACCESS_KEY in your .env file')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch images from Unsplash')
      }

      const data = await response.json()
      setImages(data.results || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching images:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      fetchImages(searchQuery)
    }
  }

  const handleImageSelect = async (image) => {
    setSelectedImage(image.id)
    setExtractingColors(true)
    setError(null)

    try {
      // Use regular size for better color extraction
      const imageUrl = image.urls.regular || image.urls.full
      
      // Extract colors from the image
      const colors = await extractColorsFromImage(imageUrl, 10)
      
      // Update wallpaper and particle colors
      updateWallpaper(imageUrl, colors)
      
      // Show success feedback
      setTimeout(() => {
        setExtractingColors(false)
      }, 500)
    } catch (err) {
      setError('Failed to extract colors from image')
      console.error('Error extracting colors:', err)
      setExtractingColors(false)
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-white">Wallpaper Selector</h1>
          <p className="text-gray-400">Choose a wallpaper and customize particle colors</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for wallpapers..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Loading...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Info Message */}
        {!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY' ? (
          <div className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200">
            <p className="font-semibold mb-1">Unsplash API Key Required</p>
            <p className="text-sm">
              To use this feature, please:
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Get a free API key from <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" className="underline">Unsplash Developers</a></li>
                <li>Create a <code className="bg-black/30 px-1 rounded">.env</code> file in your project root</li>
                <li>Add: <code className="bg-black/30 px-1 rounded">VITE_UNSPLASH_ACCESS_KEY=your_key_here</code></li>
              </ol>
            </p>
          </div>
        ) : null}

        {/* Image Grid */}
        {extractingColors && (
          <div className="mb-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-200 flex items-center gap-2">
            <Loader2 className="animate-spin" size={20} />
            Extracting colors from image...
          </div>
        )}

        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <motion.div
                key={image.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImage === image.id
                    ? 'border-purple-500 ring-2 ring-purple-500'
                    : 'border-transparent hover:border-white/30'
                }`}
                onClick={() => handleImageSelect(image)}
              >
                <img
                  src={image.urls.small}
                  alt={image.alt_description || 'Wallpaper'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs opacity-0 hover:opacity-100 transition-opacity">
                  <p className="truncate">{image.user.name}</p>
                </div>
                {selectedImage === image.id && (
                  <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                    <ImageIcon size={16} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-12 text-gray-400">
            <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
            <p>No images found. Try a different search term.</p>
          </div>
        )}

        {/* Current Wallpaper Info */}
        {wallpaperUrl && (
          <div className="mt-6 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-white">Current Wallpaper</h3>
            <div className="flex items-center gap-4">
              <img
                src={wallpaperUrl}
                alt="Current wallpaper"
                className="w-32 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-300 truncate">{wallpaperUrl}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Particle colors have been customized based on this image
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
