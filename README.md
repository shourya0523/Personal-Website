# Shourya Yadav - Personal Portfolio Website

A unique personal website designed as a mock operating system interface, featuring a desktop and mobile experience with smooth animations and a modern dark theme.

## Features

### Desktop Experience
- **Mock OS Interface**: Hybrid OS design with windows, dock, taskbar, and desktop icons
- **Window Management**: Drag, resize, minimize, maximize, and close windows
- **File Explorer**: Navigate through your portfolio content like a file system
- **Terminal**: Interactive terminal with custom commands
- **Start Menu**: Quick access to all applications
- **Dock**: Bottom dock with app shortcuts and active window indicators

### Mobile Experience
- **Mobile Layout**: Optimized mobile interface with app drawer
- **Bottom Navigation**: Easy access to home and apps
- **Swipe Gestures**: Native mobile interactions
- **App Drawer**: Full-screen app launcher

### Content Sections
- **About**: Personal introduction and skills
- **Projects**: Portfolio of your work
- **Resume**: Professional experience and education
- **Contact**: Contact form and social links
- **Awards**: Recognition and achievements
- **Leadership**: Leadership roles and impact

### Design Features
- **Font Selection**: Demo page with 8 font options to choose from
- **Dark Theme**: Modern dark color scheme
- **Animations**: Smooth transitions and interactions powered by Framer Motion
- **Responsive**: Fully responsive design for all screen sizes

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Font Selection

Visit the "Font Demo" app from the start menu or dock to:
1. Browse through 8 different font options
2. Preview how each font looks with your content
3. Click "Apply to Website" to set your preferred font
4. Your selection will be saved and persist across sessions

Available fonts:
- Inter
- JetBrains Mono
- Space Grotesk
- DM Sans
- Poppins
- Manrope
- Outfit
- Sora

## Customization

### Adding New Content

1. **New Page**: Create a new component in `src/pages/`
2. **Add to Apps**: Add your new page to the `apps` array in `src/App.jsx`
3. **Add Icon**: Add a desktop icon in the `desktopIcons` array

### Modifying Colors

Edit the Tailwind classes in components to change the color scheme. The current theme uses:
- Background: Gray-900 to Black gradient
- Accent: Blue-500/600
- Text: White with gray variations

### Adding Animations

All components use Framer Motion. You can add more animations by:
1. Importing `motion` from `framer-motion`
2. Wrapping elements with `motion.div` or other motion components
3. Adding animation props like `initial`, `animate`, `whileHover`, etc.

## Tech Stack

- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **Framer Motion**: Animation library
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Google Fonts**: Typography

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Window.jsx
│   ├── Dock.jsx
│   ├── Taskbar.jsx
│   ├── StartMenu.jsx
│   ├── DesktopIcon.jsx
│   ├── MobileLayout.jsx
│   ├── FileExplorer.jsx
│   └── Terminal.jsx
├── pages/           # Content pages
│   ├── About.jsx
│   ├── Projects.jsx
│   ├── Resume.jsx
│   ├── Contact.jsx
│   ├── Awards.jsx
│   ├── Leadership.jsx
│   └── FontDemo.jsx
├── contexts/        # React contexts
│   └── WindowContext.jsx
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## License

Personal project - All rights reserved
