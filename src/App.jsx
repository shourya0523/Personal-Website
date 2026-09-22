import { OSProvider, useOS } from './os/OSContext'
import { SoundProvider } from './contexts/SoundContext'
import { MusicProvider } from './contexts/MusicContext'
import Desktop from './os/Desktop'
import './styles/base.css'

function Shell() { const os = useOS(); return <SoundProvider enabled={os.settings.sound}><MusicProvider><Desktop /></MusicProvider></SoundProvider> }
export default function App() { return <OSProvider><Shell /></OSProvider> }
