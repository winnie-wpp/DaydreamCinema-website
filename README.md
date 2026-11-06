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
- `js/worlds.js`: the Sets tab, a full-screen slideshow. Each set plays its video full screen; its 3 renders are thumbnails to swap in a still; Next / arrow keys / swipe zoom to the next set. `#worlds/<slug>` links to one set. Each set lives in `assets/sets/<slug>/` as `shot-1..3.jpg`, `thumb-1..3.jpg` and `video.mp4`; add it to the `SETS` list with a title, "inspired by" and one line.
- `assets/echo-wardrobe/1.0.0/`: Echo's wardrobe picker, copied unchanged from the echo-wardrobe handoff. Opened from the "Explore Echo's wardrobe" button on the Cast tab (`#wardrobe`). Don't edit files inside it; to update, copy in a new versioned folder and change the iframe `data-src` in `index.html`.

## Adding more theater boxes
Drop new mp4s in `assets/videos/`, add their paths to `SCENES`, raise `CELL_COUNT` for more boxes. Videos are spread across the boxes automatically.
