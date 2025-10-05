These scripts help render and compare outputs between a gold branch (with full SVG parsing) and a branch where SVG extraction is disabled.

Prereqs
- Build packages first: `npm run core:build && npm run 2d:build && npm run renderer:build`
- ffmpeg/ffprobe available on PATH.

Render
- Example: `bash render_video.sh packages/proximal-testing-videos/src/svg_static.tsx /tmp/gold_svg_static.mp4`

Compare
- Visual compare (SSIM>=0.999): `bash test_visual_same.sh /tmp/gold.mp4 /tmp/cand.mp4`
- Length compare (<=50ms diff): `bash test_length_same.sh /tmp/gold.mp4 /tmp/cand.mp4`

