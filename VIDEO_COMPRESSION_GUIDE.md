# 🎬 Video Compression Guide for Online Hosting

## Problem
Your demo videos are too large for GitHub hosting:
- **GitHub limit**: 100MB per file
- **Your largest videos**: 18+ MB each
- **Solution**: Compress videos to under 10MB each

## Quick Solution Options

### Option 1: Use the Batch Script (Recommended)
1. **Run the compression script**:
   ```bash
   # Double-click: compress-videos.bat
   # Or run in terminal: .\compress-videos.bat
   ```

2. **Requirements**: Install FFmpeg first
   - Download from: https://ffmpeg.org/download.html
   - Add to system PATH

### Option 2: Online Compression Tools
If you don't want to install FFmpeg, use these online tools:

#### **FreeConvert.com** (Recommended)
1. Go to: https://www.freeconvert.com/video-compressor
2. Upload each video file
3. Set compression to "High" or "Medium"
4. Target size: 8-10MB
5. Download compressed videos
6. Save to `videos/compressed/` folder

#### **Clideo.com**
1. Go to: https://www.clideo.com/compress-video
2. Upload videos one by one
3. Choose "Compress to specific size"
4. Set target: 10MB
5. Download and save to `videos/compressed/`

### Option 3: Manual FFmpeg Commands
If you have FFmpeg installed, run these commands:

```bash
# Navigate to daena-website directory
cd "d:\Ideas\daena-website"

# Create compressed directory
mkdir videos\compressed

# Compress each video
ffmpeg -i "videos\agent communication.mp4" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "videos\compressed\agent communication.mp4"

ffmpeg -i "videos\budget calculation demo.mp4" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "videos\compressed\budget calculation demo.mp4"

ffmpeg -i "videos\CMP PIPELINBE DEMO.mp4" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "videos\compressed\CMP PIPELINBE DEMO.mp4"

ffmpeg -i "videos\patent Technology.mp4" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "videos\compressed\patent Technology.mp4"

ffmpeg -i "videos\patent Technology - Made with Clipchamp.mp4" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "videos\compressed\patent Technology - Made with Clipchamp.mp4"

ffmpeg -i "videos\REAL SENARIO DEMO.mp4" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "videos\compressed\REAL SENARIO DEMO.mp4"

ffmpeg -i "videos\real talk to daena and whole system - Made with Clipchamp.mp4" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "videos\compressed\real talk to daena and whole system - Made with Clipchamp.mp4"
```

## After Compression

### 1. Check File Sizes
```bash
# Check compressed file sizes
dir videos\compressed
```

### 2. Test the Online Player
1. Open `video-player.html` in your browser
2. Test each video to ensure they play correctly
3. Check that all videos load without errors

### 3. Deploy to GitHub
```bash
git add videos/compressed/
git commit -m "Add compressed videos for online hosting"
git push origin main
```

## File Structure After Compression
```
daena-website/
├── videos/
│   ├── compressed/           # ← Compressed videos (under 10MB each)
│   │   ├── agent communication.mp4
│   │   ├── budget calculation demo.mp4
│   │   ├── CMP PIPELINBE DEMO.mp4
│   │   ├── patent Technology.mp4
│   │   ├── patent Technology - Made with Clipchamp.mp4
│   │   ├── REAL SENARIO DEMO.mp4
│   │   └── real talk to daena and whole system - Made with Clipchamp.mp4
│   └── [original videos]     # ← Keep originals as backup
├── video-player.html         # ← Online video player
└── index.html               # ← Updated with new video links
```

## Quality Settings Explained
- **CRF 28**: Good quality with significant compression
- **Preset Medium**: Balanced compression speed vs file size
- **AAC 128k**: Good audio quality at reasonable size
- **+faststart**: Enables streaming (videos start playing before fully loaded)

## Expected Results
- **Original videos**: 18+ MB each
- **Compressed videos**: 5-10 MB each
- **Quality**: Still professional and clear
- **Loading**: Fast streaming on all devices

## Troubleshooting
- **Videos still too large**: Increase CRF to 30-32
- **Quality too low**: Decrease CRF to 25-26
- **Audio issues**: Check AAC codec support
- **Streaming issues**: Ensure +faststart flag is used

Once compressed, your videos will play directly online just like your pitch deck! 🚀
