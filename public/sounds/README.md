# Paper/Nature Sound Effects

This directory is for paper and nature-based sound effects used throughout the website.

## Current Setup

The sound system uses **Mixkit's free sound library** (https://mixkit.co/free-sound-effects/) which provides paper and nature sounds via CDN. The system will:

1. **First**: Try to load sounds from Mixkit CDN (paper page turns, rustles, crinkles)
2. **Second**: Fall back to local files in this directory if CDN fails
3. **Third**: Generate paper-like sounds using Web Audio API if both fail

## Optional: Local Sound Files

You can add local sound files to this directory to override the CDN sounds:

- `paper-click.mp3` - Short paper rustle/click sound
- `paper-open.mp3` - Paper page flip/open sound  
- `paper-close.mp3` - Paper crinkle/close sound
- `paper-hover.mp3` - Subtle paper rustle for hover effects
- `paper-notification.mp3` - Paper rustle notification sound
- `paper-maximize.mp3` - Paper flip sound for maximize
- `paper-minimize.mp3` - Paper crinkle sound for minimize

## Free Sound Libraries

Great sources for paper/nature sound effects:
- **Mixkit.co** - Free paper and nature sound effects (currently in use)
- **Freesound.org** - Community-driven library with extensive paper sounds
- **Zapsplat.com** - Free paper sound effects library
- **BBC Sound Effects Library** - Nature and environmental sounds

## File Format

Supported formats: MP3, WAV, OGG, WebM
Recommended: MP3 for best browser compatibility
