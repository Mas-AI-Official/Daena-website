# Video Setup Instructions

## Current Status

✅ Video file copied: `public/videos/daena_intro.mp4`  
✅ Captions file created: `public/videos/daena_en.vtt`  
⚠️ WebM version needed: `public/videos/daena_intro.webm`  
⚠️ Poster image needed: `public/videos/daena_poster.jpg`

## Required Actions

### 1. Convert to WebM Format

For better browser compatibility and smaller file size, create a WebM version:

```bash
# Using ffmpeg (recommended)
ffmpeg -i "public/videos/daena_intro.mp4" \
  -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -c:a libopus -b:a 128k \
  "public/videos/daena_intro.webm"

# Or using online tools:
# - CloudConvert: https://cloudconvert.com/mp4-to-webm
# - FreeConvert: https://www.freeconvert.com/mp4-to-webm
```

**Target specs:**
- Codec: VP9 (or VP8 for compatibility)
- Quality: CRF 30 (good balance)
- Audio: Opus 128k
- Resolution: 1080p (1920×1080)
- Max file size: <50 MB

### 2. Generate Poster Image

Extract a frame from the video to use as the poster:

```bash
# Using ffmpeg (extract frame at 2 seconds)
ffmpeg -i "public/videos/daena_intro.mp4" \
  -ss 00:00:02 \
  -vframes 1 \
  -q:v 2 \
  "public/videos/daena_poster.jpg"

# Or extract at a specific time (e.g., 5 seconds)
ffmpeg -i "public/videos/daena_intro.mp4" \
  -ss 00:00:05 \
  -vframes 1 \
  -vf "scale=1920:1080" \
  -q:v 2 \
  "public/videos/daena_poster.jpg"
```

**Target specs:**
- Format: JPEG
- Resolution: 1920×1080 (16:9 aspect ratio)
- Quality: 85-90% (good balance of size/quality)
- File size: <500 KB

### 3. Optimize Video Files

Ensure both MP4 and WebM are optimized:

```bash
# Optimize MP4 (H.264)
ffmpeg -i "public/videos/daena_intro.mp4" \
  -c:v libx264 -preset slow -crf 23 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  "public/videos/daena_intro_optimized.mp4"

# Then replace original
mv "public/videos/daena_intro_optimized.mp4" "public/videos/daena_intro.mp4"
```

### 4. Verify File Sizes

Check that files meet requirements:
- `daena_intro.mp4`: <50 MB
- `daena_intro.webm`: <50 MB (should be smaller)
- `daena_poster.jpg`: <500 KB

### 5. Test Video Playback

1. Open `index.html` in a browser
2. Verify video autoplays (muted)
3. Check captions display correctly
4. Test on mobile devices
5. Verify poster image shows before play

## Video Specifications

- **Format**: MP4 (H.264) + WebM (VP9)
- **Resolution**: 1920×1080 (1080p)
- **Aspect Ratio**: 16:9
- **Frame Rate**: 30 fps (or 24 fps)
- **Audio**: AAC (MP4) / Opus (WebM), 128kbps
- **Duration**: ~1:30 (90 seconds)
- **Max File Size**: 50 MB per format

## Accessibility Checklist

- ✅ Captions file (VTT) created
- ✅ Video has `aria-label`
- ✅ Keyboard-accessible controls
- ✅ Autoplay with muted (respects user preferences)
- ⚠️ Test with screen readers
- ⚠️ Verify color contrast in captions

## Performance Checklist

- ✅ `preload="metadata"` set (prevents LCP regression)
- ✅ Poster image for instant display
- ✅ Lazy loading for below-the-fold videos
- ⚠️ Verify LCP < 2.5s on mobile
- ⚠️ Check CLS < 0.03

## SEO Checklist

- ✅ JSON-LD VideoObject schema added
- ✅ OpenGraph video tags added
- ✅ Twitter Card player tags added
- ✅ Poster image for social sharing
- ✅ Video duration in schema

## Quick Commands

```bash
# Full conversion pipeline
ffmpeg -i "diveo/Daena 1.mp4" \
  -c:v libx264 -preset slow -crf 23 -movflags +faststart \
  -c:a aac -b:a 128k \
  "public/videos/daena_intro.mp4"

ffmpeg -i "public/videos/daena_intro.mp4" \
  -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -c:a libopus -b:a 128k \
  "public/videos/daena_intro.webm"

ffmpeg -i "public/videos/daena_intro.mp4" \
  -ss 00:00:02 -vframes 1 -vf "scale=1920:1080" -q:v 2 \
  "public/videos/daena_poster.jpg"
```

## Notes

- The video is currently in `public/videos/daena_intro.mp4`
- WebM and poster need to be generated
- All pages are ready and will work once these files are created
- The video section is fully responsive and accessible

