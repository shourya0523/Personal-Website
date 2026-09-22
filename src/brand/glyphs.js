// Paper-cut glyph set. Each glyph is inner SVG markup for a 24x24 viewBox.
// Fills use currentColor (the ink); the `.dot` accent takes --icon-dot. No strokes, so they cut cleanly at any size.
export const glyphs = {
  about: '<circle cx="12" cy="9" r="4.5"/><path d="M4 21c1.2-4 4.2-6 8-6s6.8 2 8 6z"/><circle class="dot" cx="18.5" cy="5.5" r="2.2"/>',
  projects: '<rect x="3" y="4" width="18" height="6" rx="3"/><rect x="3" y="14" width="11" height="6" rx="3"/><circle class="dot" cx="19" cy="17" r="3"/>',
  resume: '<path d="M6 3h8l5 5v13H6z"/><path class="dot" d="M14 3v5h5z"/>',
  contact: '<rect x="3" y="6" width="18" height="13" rx="3.5"/><path class="paper" d="M5 8h14l-7 5.5z" opacity=".9"/><circle class="dot" cx="19.5" cy="6" r="2.4"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="3.5"/><path class="paper" d="M7 9l3.5 3L7 15l1.5 1.5L13 12 8.5 7.5z"/><rect class="dot" x="12.5" y="14" width="5" height="2.4" rx="1.2"/>',
  music: '<circle cx="8" cy="17" r="3.8"/><path d="M10.5 17V5l9-2.2V6l-7 1.8V17z"/><circle class="dot" cx="17" cy="15.5" r="3.3"/>',
  files: '<path d="M3 7a2 2 0 0 1 2-2h4.5l2 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path class="paper" d="M3 10h18v1.5H3z" opacity=".35"/><circle class="dot" cx="18" cy="15" r="2.2"/>',
  settings: '<path d="M12 3l2.1 1.2 2.4-.4 1.2 2.1 2.1 1.2-.4 2.4L21 12l-1.6 1.9.4 2.4-2.1 1.2-1.2 2.1-2.4-.4L12 21l-2.1-1.2-2.4.4-1.2-2.1-2.1-1.2.4-2.4L3 12l1.6-1.9-.4-2.4 2.1-1.2 1.2-2.1 2.4.4z"/><circle class="paper" cx="12" cy="12" r="3.4"/><circle class="dot" cx="12" cy="12" r="1.6"/>',
  // file kinds
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4.5l2 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path class="paper" d="M3 10h18v1.5H3z" opacity=".35"/>',
  doc: '<path d="M6 3h8l5 5v13H6z"/><path class="paper" d="M9 12h6v1.6H9zM9 15.5h6v1.6H9z" opacity=".8"/><path class="dot" d="M14 3v5h5z"/>',
  md: '<path d="M6 3h8l5 5v13H6z"/><path class="paper" d="M8.5 17v-6h1.6l1.9 2.6L13.9 11h1.6v6h-1.5v-3.4l-2 2.6-2-2.6V17z" opacity=".9"/><path class="dot" d="M14 3v5h5z"/>',
  json: '<path d="M6 3h8l5 5v13H6z"/><path class="paper" d="M9.4 11c-1 0-1.4.5-1.4 1.3v1.1c0 .6-.2.8-.8.8v1.2c.6 0 .8.2.8.8v1.1c0 .8.4 1.3 1.4 1.3v-1.2c-.3 0-.4-.1-.4-.4v-1c0-.6-.2-1-.7-1.2.5-.2.7-.6.7-1.2v-1c0-.3.1-.4.4-.4zm5.2 0v1.2c.3 0 .4.1.4.4v1c0 .6.2 1 .7 1.2-.5.2-.7.6-.7 1.2v1c0 .3-.1.4-.4.4v1.2c1 0 1.4-.5 1.4-1.3v-1.1c0-.6.2-.8.8-.8v-1.2c-.6 0-.8-.2-.8-.8v-1.1c0-.8-.4-1.3-1.4-1.3z" opacity=".9"/><path class="dot" d="M14 3v5h5z"/>',
  pdf: '<path d="M6 3h8l5 5v13H6z"/><path class="paper" d="M9 11h2.2c1.2 0 1.9.7 1.9 1.7s-.7 1.7-1.9 1.7h-.8V17H9zm1.4 1.2v1.1h.7c.4 0 .6-.2.6-.55s-.2-.55-.6-.55z" opacity=".9"/><path class="dot" d="M14 3v5h5z"/>',
  link: '<path d="M10.2 13.8a3.6 3.6 0 0 0 5.1 0l2.2-2.2a3.6 3.6 0 0 0-5.1-5.1l-1 1 1.4 1.4 1-1a1.6 1.6 0 1 1 2.3 2.3l-2.2 2.2a1.6 1.6 0 0 1-2.3 0z"/><path d="M13.8 10.2a3.6 3.6 0 0 0-5.1 0l-2.2 2.2a3.6 3.6 0 0 0 5.1 5.1l1-1-1.4-1.4-1 1a1.6 1.6 0 1 1-2.3-2.3l2.2-2.2a1.6 1.6 0 0 1 2.3 0z"/><circle class="dot" cx="18.5" cy="18.5" r="2"/>',
  txt: '<path d="M6 3h8l5 5v13H6z"/><path class="paper" d="M9 11h6v1.5H9zM9 14h6v1.5H9zM9 17h4v1.5H9z" opacity=".85"/><path class="dot" d="M14 3v5h5z"/>',
}
export const glyphNames = Object.keys(glyphs)
