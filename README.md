# Daydream Cinema website

Plain HTML, CSS and JavaScript. No build step.

## Where things live
- `index.html`: page structure for all tabs: Now showing, Cast (`#characters`), Sets (`#worlds`), Cinema (`#cinema`), Shop (`#store`). The logo goes to the home wall (`#home`)
- `css/style.css`: all styling; color and font tokens at the top
- `js/main.js`: content and interactions
  - `FILMS`: now showing posters, blurbs, showtimes
  - `CELL_COUNT`, `CELLS`, `SCENES`: screening wall boxes and their videos
  - `BLOBS`, `ITEMS`: blob profiles and store items
- `assets/`: images, posters, room stills, character cutouts, scene videos
- `js/worlds.js`: the Sets tab (move your light to paint colour into a pencil sketch). Add a world to the `WORLDS` list and put its render in `assets/worlds/`. Optional `outline` = your own pencil version; otherwise one is generated (needs a local server).
- `assets/echo-wardrobe/1.0.0/`: Echo's wardrobe picker, copied unchanged from the echo-wardrobe handoff. Opened from the "Explore Echo's wardrobe" button on the Cast tab (`#wardrobe`). Don't edit files inside it; to update, copy in a new versioned folder and change the iframe `data-src` in `index.html`.

## Adding more theater boxes
Drop new mp4s in `assets/videos/`, add their paths to `SCENES`, raise `CELL_COUNT` for more boxes. Videos are spread across the boxes automatically.
# DaydreamCinema-website
