// App registry. Every app is a lazy component receiving { windowId, ...props } and using useOS() for OS services.
import { lazy } from 'react'
export const apps = [
  { id: 'about', label: 'About', icon: 'about', component: lazy(() => import('../apps/About')), size: { w: 860, h: 640 }, desktop: true, dock: true },
  { id: 'projects', label: 'Projects', icon: 'projects', component: lazy(() => import('../apps/Projects')), size: { w: 940, h: 660 }, desktop: true, dock: true },
  { id: 'resume', label: 'Resume', icon: 'resume', component: lazy(() => import('../apps/Resume')), size: { w: 940, h: 680 }, desktop: true, dock: true },
  { id: 'contact', label: 'Contact', icon: 'contact', component: lazy(() => import('../apps/Contact')), size: { w: 720, h: 520 }, desktop: true, dock: true },
  { id: 'files', label: 'Files', icon: 'files', component: lazy(() => import('../apps/Files')), size: { w: 900, h: 600 }, desktop: false, dock: true },
  { id: 'terminal', label: 'Terminal', icon: 'terminal', component: lazy(() => import('../apps/Terminal')), size: { w: 780, h: 520 }, desktop: true, dock: true },
  { id: 'music', label: 'Music', icon: 'music', component: lazy(() => import('../apps/Music')), size: { w: 820, h: 600 }, desktop: false, dock: true },
  { id: 'settings', label: 'Settings', icon: 'settings', component: lazy(() => import('../apps/Settings')), size: { w: 680, h: 520 }, desktop: false, dock: true },
]
export const appById = Object.fromEntries(apps.map(a => [a.id, a]))
