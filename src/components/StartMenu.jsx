import { motion, AnimatePresence } from 'framer-motion'
import { useSounds } from '../contexts/SoundContext'
import GlassSurface from './GlassSurface'

export default function StartMenu({ isOpen, apps, onAppClick, onClose }) {
  const sounds = useSounds()
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50"
            onClick={() => {
              sounds.click()
              onClose()
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed top-10 left-4 w-80 z-50 overflow-hidden"
          >
            <GlassSurface
              width="100%"
              height="100%"
              borderRadius={20}
              opacity={0.9}
              brightness={105}
              displace={0.2}
              distortionScale={-110}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              className="overflow-hidden w-full"
            >
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold">Shourya Yadav</h2>
              <p className="text-sm text-gray-400">Personal Portfolio</p>
            </div>
            <div className="p-2 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {apps.map((app, index) => (
                  <motion.button
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      sounds.open()
                      onAppClick(app)
                      onClose()
                    }}
                    className="p-3 rounded-lg hover:bg-gray-700 flex flex-col items-center gap-2 transition-colors"
                  >
                    <span className="text-3xl">{app.icon}</span>
                    <span className="text-xs text-center">{app.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
            </GlassSurface>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
