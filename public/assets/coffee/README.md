# Coffee chat assets

## Stills

| File | Use |
|------|-----|
| `nikki-frown.jpg` (or `.png`) | OG / Twitter preview + in-page meme face |
| `bear-terror.jpg` (or `.png`) | In-page recoil reaction |

Filenames must match `coffee.html` meta tags (`nikki-frown.jpg`).

## Willow source → frames

1. Drop your animated WebP (box open → willow break) at:

`public/assets/coffee/willow-source.webp`

2. Extract frames + rewrite `manifest.json`:

```bash
python3 scripts/extract-willow-frames.py
```

Or pass a custom path:

```bash
python3 scripts/extract-willow-frames.py /path/to/willow.webp
```

Outputs numbered `000.webp`… under `public/assets/coffee/willow-frames/` and sets:

- `fps` — from the source (clamped ~8–24)
- `openEndFrame` — heuristic ~45% (pause when willow is centered — **tune this**)
- `wishEndFrame` — last frame

3. Open `/coffee`, click through the ritual, and adjust `openEndFrame` in `manifest.json` if the pause is early/late.

```json
{
  "fps": 12,
  "openEndFrame": 40,
  "wishEndFrame": 90,
  "frames": ["000.webp", "001.webp", "..."]
}
```
