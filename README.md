# Photo Metadata Toolkit

A browser-based tool to inspect, edit, and remove photo EXIF metadata.

## What it does

- Read metadata from uploaded images
- Edit common EXIF fields (JPEG)
- Remove metadata and download a cleaned image (JPEG)
- Keep processing local in the browser (no backend upload)

## Supported formats

- Read metadata: JPEG, PNG, WebP, TIFF (depends on embedded metadata)
- Edit/remove metadata: JPEG (via `piexifjs`)

## Development

This is a static site (GitHub Pages friendly). Open `index.html` directly, or run any local static server.

Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
