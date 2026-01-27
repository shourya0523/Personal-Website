import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, Volume2, Search, Music, Heart } from 'lucide-react'
import { useMusic } from '../contexts/MusicContext'

// Favorite song - plays by default
const FAVORITE_SONG = {
  id: 'favorite-1',
  title: 'It\'s Called: Freefall',
  artist: 'Rainbow Kitten Surprise',
  album: 'How to: Friend, Love, Freefall',
  duration: 0, // Will be set when loaded
  preview: '/music/favorite-song.mp3',
  cover: '/music/album-cover.png',
  isFavorite: true
}

export default function MusicPlayer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [songs, setSongs] = useState([])
  const [favorites] = useState([FAVORITE_SONG]) // Favorites list
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false)
  const { currentSong, isPlaying, progress, duration, volume, playSong, togglePlayPause, setVolume, seekTo } = useMusic()

  // Auto-play favorite song on mount
  useEffect(() => {
    if (!hasAutoPlayed && FAVORITE_SONG.preview) {
      // Small delay to ensure audio context is ready and user interaction
      const timer = setTimeout(() => {
        try {
          playSong(FAVORITE_SONG)
          setHasAutoPlayed(true)
        } catch (error) {
          console.log('Auto-play prevented by browser. Click play to start.')
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [hasAutoPlayed, playSong])

  // Search for songs using Deezer API (no authentication required, includes preview URLs)
  const searchSongs = async (query) => {
    if (!query.trim()) {
      setError('Please enter a search query.')
      return
    }

    setIsLoading(true)
    setSongs([])
    setError(null)
    
    const deezerApiUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=20`
    
    // Try multiple CORS proxy services as fallbacks
    const proxyServices = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(deezerApiUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(deezerApiUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(deezerApiUrl)}`,
    ]
    
    let lastError = null
    
    for (let i = 0; i < proxyServices.length; i++) {
      const proxyUrl = proxyServices[i]
      try {
        console.log(`[${i + 1}/${proxyServices.length}] Trying proxy:`, proxyUrl.substring(0, 60) + '...')
        
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        })
        
        console.log('Response status:', response.status, response.statusText)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const text = await response.text()
        console.log('Response text preview:', text.substring(0, 200))
        
        let data
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.error('Failed to parse JSON:', parseError)
          throw new Error('Invalid JSON response from API')
        }
        
        console.log('Parsed data:', data)
        
        // Check for API errors
        if (data.error) {
          console.error('Deezer API Error:', data.error)
          throw new Error(data.error.message || 'API error')
        }
        
        // Process results
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          const processedSongs = data.data
            .filter(track => track.preview) // Only include tracks with previews
            .map(track => ({
              id: track.id,
              title: track.title,
              artist: track.artist?.name || 'Unknown Artist',
              album: track.album?.title || 'Unknown Album',
              duration: track.duration,
              preview: track.preview, // 30-second preview URL
              cover: track.album?.cover_medium || track.album?.cover || ''
            }))
          
          if (processedSongs.length > 0) {
            setSongs(processedSongs)
            console.log(`✅ Success! Found ${processedSongs.length} songs`)
            setIsLoading(false)
            return // Success!
          } else {
            setSongs([])
            setError('No songs with previews found. Try a different search term.')
            setIsLoading(false)
            return
          }
        } else {
          setSongs([])
          setError('No results found. Try a different search term.')
          setIsLoading(false)
          return
        }
      } catch (error) {
        console.error(`❌ Proxy ${i + 1} failed:`, error.message)
        lastError = error
        if (i === proxyServices.length - 1) {
          // Last proxy failed
          console.error('All proxy attempts failed')
          setError(`Search failed: ${error.message}. Please check your internet connection and try again.`)
          setIsLoading(false)
        }
        // Continue to next proxy
        continue
      }
    }
  }

  // Handle play song
  const handlePlaySong = (song) => {
    if (!song.preview) {
      alert('Preview not available for this song')
      return
    }
    playSong(song)
  }

  // Handle seek
  const handleSeek = (e) => {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    const seekTime = percent * duration
    seekTo(seekTime)
  }

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
  }

  // Format time
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="p-8 text-white h-full overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Music className="w-8 h-8 text-blue-400" />
          <h1 className="text-4xl font-bold">Music Player</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchSongs(searchQuery)}
                placeholder="Search for songs, artists..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
              />
            </div>
            <button
              onClick={() => searchSongs(searchQuery)}
              disabled={isLoading || !searchQuery.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300"
          >
            <p className="font-medium">Error: {error}</p>
            <p className="text-sm mt-1 text-red-400">Try searching again or check your connection.</p>
            <p className="text-xs mt-2 text-red-500">Check browser console (F12) for detailed error logs.</p>
          </motion.div>
        )}

        {/* Search Results - Show above favorites */}
        {songs.length > 0 && (
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Search Results</h2>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {songs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handlePlaySong(song)}
                    className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-colors ${
                      currentSong?.id === song.id
                        ? 'bg-blue-600/30 border border-blue-500'
                        : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50'
                    }`}
                  >
                      {song.cover && (
                        <img
                          src={song.cover}
                          alt={song.album}
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{song.title}</h4>
                        <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                        <p className="text-xs text-gray-500">{song.album}</p>
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatTime(song.duration)}
                      </div>
                      {currentSong?.id === song.id && isPlaying && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-3 h-3 bg-blue-400 rounded-full"
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 text-gray-400 mb-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4">Searching...</p>
          </div>
        )}

        {/* Favorites Section - Show when no search results */}
        {favorites.length > 0 && songs.length === 0 && !isLoading && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              <h2 className="text-xl font-bold">Favorites</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((song) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => {
                    // If this is the current song, toggle play/pause
                    // Otherwise, play the song
                    if (currentSong?.id === song.id) {
                      togglePlayPause()
                    } else {
                      handlePlaySong(song)
                    }
                  }}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all ${
                    currentSong?.id === song.id
                      ? 'ring-2 ring-blue-500 scale-105'
                      : 'hover:scale-105'
                  }`}
                >
                  {song.cover && (
                    <div className="relative aspect-square">
                      <img
                        src={song.cover}
                        alt={song.album}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        {currentSong?.id === song.id && isPlaying ? (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-16 h-16 bg-blue-500/80 rounded-full flex items-center justify-center cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              togglePlayPause()
                            }}
                          >
                            <Pause className="w-8 h-8 text-white" />
                          </motion.div>
                        ) : currentSong?.id === song.id && !isPlaying ? (
                          <motion.div
                            className="w-16 h-16 bg-blue-500/60 rounded-full flex items-center justify-center cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              togglePlayPause()
                            }}
                          >
                            <Play className="w-8 h-8 text-white ml-1" />
                          </motion.div>
                        ) : (
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-3 bg-gray-800/80 backdrop-blur-sm">
                    <h3 className="font-semibold truncate">{song.title}</h3>
                    <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                    {song.album && (
                      <p className="text-xs text-gray-500 truncate">{song.album}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Current Song Player */}
        {currentSong && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-6 mb-6">
              {currentSong.cover && (
                <img
                  src={currentSong.cover}
                  alt={currentSong.album}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{currentSong.title}</h3>
                <p className="text-gray-400">{currentSong.artist}</p>
                <p className="text-sm text-gray-500">{currentSong.album}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div
              className="w-full h-2 bg-gray-700 rounded-full cursor-pointer mb-4"
              onClick={handleSeek}
            >
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
              />
            </div>

            {/* Time Display */}
            <div className="flex justify-between text-sm text-gray-400 mb-6">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <button
                onClick={togglePlayPause}
                className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-4 justify-center">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-32"
              />
              <span className="text-sm text-gray-400 w-12">{Math.round(volume * 100)}%</span>
            </div>
          </motion.div>
        )}

        {/* Empty State - Show when no search results and no favorites playing */}
        {songs.length === 0 && !isLoading && !error && !currentSong && (
          <div className="text-center py-12 text-gray-400">
            <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Search for songs using Deezer API</p>
            <p className="text-sm mt-2 text-gray-500">Try searching for an artist or song name</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
