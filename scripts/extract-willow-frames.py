#!/usr/bin/env python3
"""Extract frames from an animated WebP/GIF/MP4 into willow-frames/ + manifest.json.

Usage:
  python3 scripts/extract-willow-frames.py [source]
Default source: public/assets/coffee/willow-source.webp
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SRC = ROOT / "public/assets/coffee/willow-source.webp"
OUT_DIR = ROOT / "public/assets/coffee/willow-frames"
MAX_EDGE = 960
TARGET_FPS = 12


def extract_with_pillow(src: Path, tmp_dir: Path) -> tuple[list[Path], float]:
    from PIL import Image

    img = Image.open(src)
    n = getattr(img, "n_frames", 1)
    paths: list[Path] = []
    durations_ms: list[int] = []

    for i in range(n):
        img.seek(i)
        frame = img.convert("RGBA")
        # fit longest edge
        w, h = frame.size
        scale = min(1.0, MAX_EDGE / max(w, h))
        if scale < 1:
            frame = frame.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
        out = tmp_dir / f"raw-{i:04d}.png"
        frame.save(out)
        paths.append(out)
        durations_ms.append(int(img.info.get("duration") or 1000 / TARGET_FPS))

    avg = sum(durations_ms) / max(len(durations_ms), 1)
    fps = 1000.0 / avg if avg > 0 else float(TARGET_FPS)
    # Animated WebP often stores bogus ~11ms durations (~90fps). Cap to a sane playback rate.
    if fps > 30:
        fps = float(TARGET_FPS)
    return paths, fps


def extract_with_ffmpeg(src: Path, tmp_dir: Path) -> tuple[list[Path], float]:
    pattern = str(tmp_dir / "raw-%04d.png")
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(src),
        "-vf",
        f"fps={TARGET_FPS},scale='min({MAX_EDGE},iw)':-2",
        pattern,
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    paths = sorted(tmp_dir.glob("raw-*.png"))
    if not paths:
        raise RuntimeError("ffmpeg produced no frames")
    return paths, float(TARGET_FPS)


def main() -> int:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
    if not src.is_file():
        print(f"Missing source: {src}", file=sys.stderr)
        print("Drop your animated WebP at public/assets/coffee/willow-source.webp", file=sys.stderr)
        return 1

    tmp_dir = ROOT / ".tmp-willow-frames"
    tmp_dir.mkdir(exist_ok=True)
    for p in tmp_dir.glob("*"):
        p.unlink()

    print(f"Extracting from {src} …")
    try:
        raw_paths, fps = extract_with_pillow(src, tmp_dir)
        print(f"Pillow: {len(raw_paths)} frames @ ~{fps:.2f} fps")
    except Exception as pillow_err:
        print(f"Pillow failed ({pillow_err}); trying ffmpeg…")
        raw_paths, fps = extract_with_ffmpeg(src, tmp_dir)
        print(f"ffmpeg: {len(raw_paths)} frames @ {fps:.2f} fps")

    # Clear old placeholders, keep README/manifest rewritten
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("*.jpg"):
        old.unlink()
    for old in OUT_DIR.glob("*.webp"):
        old.unlink()
    for old in OUT_DIR.glob("*.png"):
        if old.name != "README.md":
            old.unlink()

    from PIL import Image

    frame_names: list[str] = []
    for i, raw in enumerate(raw_paths):
        # Prefer webp for smaller size; fall back to jpg
        name = f"{i:03d}.webp"
        out = OUT_DIR / name
        im = Image.open(raw).convert("RGB")
        try:
            im.save(out, "WEBP", quality=82, method=4)
        except Exception:
            name = f"{i:03d}.jpg"
            out = OUT_DIR / name
            im.save(out, "JPEG", quality=85, optimize=True)
        frame_names.append(name)

    n = len(frame_names)
    if n < 2:
        print("Need at least 2 frames", file=sys.stderr)
        return 1

    # Heuristic gates: pause near mid-open, finish at end.
    # Tune openEndFrame after visual check (willow centered).
    open_end = max(1, min(n - 2, int(round(n * 0.45))))
    wish_end = n - 1

    manifest = {
        "fps": round(min(max(fps, 8), 24), 2),
        "openEndFrame": open_end,
        "wishEndFrame": wish_end,
        "frames": frame_names,
        "source": str(src.relative_to(ROOT)) if src.is_relative_to(ROOT) else str(src),
    }
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps(manifest, indent=2))
    print(f"Wrote {n} frames → {OUT_DIR}")
    print(f"openEndFrame={open_end} wishEndFrame={wish_end} (edit manifest if pause is early/late)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
