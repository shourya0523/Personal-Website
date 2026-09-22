import * as swell from './swell'
import * as survey from './survey'
import * as circuit from './circuit'
export const scenes = { swell, survey, circuit }
export const sceneList = [swell, survey, circuit].map(s => ({ id: s.id, label: s.label }))
export const DEFAULT_WALLPAPER = 'swell'
export { WallpaperEngine } from './engine'
