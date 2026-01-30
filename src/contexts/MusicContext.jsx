import { createContext, useContext, useState, useRef, useEffect } from 'react'
import { Howl } from 'howler'

const MusicContext = createContext()

export const useMusic = () => {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider')
  }
  return context
}

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const soundRef = useRef(null)
  const progressIntervalRef = useRef(null)

  // Update progress
  useEffect(() => {
    if (isPlaying && soundRef.current) {
      progressIntervalRef.current = setInterval(() => {
        if (soundRef.current) {
          const seek = soundRef.current.seek()
          const dur = soundRef.current.duration()
          if (typeof seek === 'number' && typeof dur === 'number') {
            setProgress(seek)
            setDuration(dur)
          }
        }
      }, 100)
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying])

  const playSong = (song) => {
    // Stop current song if playing - ensure it's fully stopped
    if (soundRef.current) {
      try {
        soundRef.current.stop()
        soundRef.current.unload()
      } catch (error) {
        // Ignore errors when stopping/unloading
      }
      soundRef.current = null
    }

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }

    // Reset state
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)

    if (!song.preview) {
      return
    }

    setCurrentSong(song)

    // Create new Howl instance
    const sound = new Howl({
      src: [song.preview],
      html5: true,
      volume: volume,
      onplay: () => {
        setIsPlaying(true)
        setDuration(sound.duration())
      },
      onend: () => {
        setIsPlaying(false)
        setProgress(0)
      },
      onpause: () => {
        setIsPlaying(false)
      },
      onstop: () => {
        setIsPlaying(false)
        setProgress(0)
      },
      onloaderror: () => {
        setIsPlaying(false)
      }
    })

    soundRef.current = sound
    sound.play()
  }

  const togglePlayPause = () => {
    if (!soundRef.current) return

    if (isPlaying) {
      soundRef.current.pause()
    } else {
      soundRef.current.play()
    }
  }

  const stop = () => {
    if (soundRef.current) {
      soundRef.current.stop()
      soundRef.current.unload()
    }
    setCurrentSong(null)
    setIsPlaying(false)
    setProgress(0)
  }

  const setVolumeLevel = (newVolume) => {
    setVolume(newVolume)
    if (soundRef.current) {
      soundRef.current.volume(newVolume)
    }
  }

  const seekTo = (time) => {
    if (soundRef.current) {
      soundRef.current.seek(time)
      setProgress(time)
    }
  }

  return (
    <MusicContext.Provider value={{
      currentSong,
      isPlaying,
      progress,
      duration,
      volume,
      playSong,
      togglePlayPause,
      stop,
      setVolume: setVolumeLevel,
      seekTo
    }}>
      {children}
    </MusicContext.Provider>
  )
}
