# Coffee chat assets

## Stills

| File | Use |
|------|-----|
| `nikki-frown.jpg` (or `.png`) | OG / Twitter preview + in-page meme face |
| `bear-terror.jpg` (or `.png`) | In-page recoil reaction |

Filenames must match `coffee.html` meta tags (`nikki-frown.jpg`).

## Willow frame sequence

Export your willow-box video as numbered frames and drop them here:

`public/assets/coffee/willow-frames/`

Update `manifest.json`:

```json
{
  "fps": 12,
  "openEndFrame": 40,
  "wishEndFrame": 90,
  "frames": ["000.jpg", "001.jpg", "..."]
}
```

- `openEndFrame` — index where the willow is **centered**; intro pauses here for “make a wish”
- `wishEndFrame` — final break / aftermath frame; then the site reveals
- Frame files are loaded from the same folder as the names in `frames`

Placeholder frames ship for local testing until your export is ready.
