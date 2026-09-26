# AdaDex — anonymous project page

Static page based on the Nerfies project-page template. No authors, affiliations, logos, or analytics.

## Adding visuals

Every blank slot is a `<div class="media-placeholder">` that shows the file path it expects, with a
`<!-- Replace with: ... -->` comment right above it giving the exact markup to use.

1. Drop the file at the path shown (for example `static/videos/comparison/adadex.mp4`).
2. Replace the placeholder `<div>` with the markup from the comment:
   - carousel clip: `<video muted loop playsinline controls src="./static/videos/..."></video>` inside `.carousel-item`
   - skill/task card: `<video autoplay muted loop playsinline src="..."></video>`
   - real-world main player: `<video id="real-feature" class="deployment-feature-video" ...>` (keep the id so the thumbnails still switch it)
   - figures: `<img class="paper-figure" src="./static/images/..." />`
   - teaser: uncomment the `hero-video` block at the top of `<body>` and delete the `is-hero` placeholder.
3. To add or remove carousel clips, add or remove `.carousel-item` elements. The arrows adapt automatically.

When the paper PDF is ready, put it at `static/pdf/adadex.pdf`, give the Paper button
`href="./static/pdf/adadex.pdf" target="_blank"`, and remove its `is-coming-soon` class.

## Preview

```
python -m http.server 8000   # then open http://localhost:8000
```

## Deploy

Served by GitHub Pages from the `main` branch of `adadexanonymous/adadexanonymous.github.io`, at
`https://adadexanonymous.github.io`. Commits use an anonymous identity (set in this repo's local git config); the git
author name and email are visible publicly.

## Local preview and clip review

`python ../adadex_build/serve.py 53647` serves the site at `/` and a clip review page at `/review/` (build folder only,
never deployed). Tick bad clips there and press Save: it writes their record ids to `../adadex_build/exclude.txt`.
Rebuild with `python pick_rendered.py && python gen3.py && python gen_review.py` in `../adadex_build/`.

## Videos

The videos in `static/videos/` are Blender renders, re-encoded to 1280 px H.264 with metadata stripped and neutral
file names (`<category>/<category>_NN.mp4`, `compare/<split>-NN_<method>.mp4`, `sim2sim/s2s-NN_<simulator>.mp4`).
Rollouts that failed or did not reach the final goal are left out of the galleries. The comparison section shows
every benchmark motion for all methods.

The build scripts live outside this folder in `../adadex_build/` because they contain local paths:

- `pick_rendered.py` selects and encodes the clips and writes `rendered_clips.json`.
- `gen3.py` regenerates `index.html` from `skeleton.html` and `rendered_clips.json`. It overwrites `index.html`, so
  hand edits there would be lost.
