# Video Integration Guide

## Adding Video Files to Recorded Demos Section

When you have video files ready, follow these steps to integrate them:

### 1. Video File Structure
Place your video files in the `videos/` directory with this structure:
```
videos/
├── agent-communication-demo.mp4
├── budget-calculation-demo.mp4
├── cmp-pipeline-demo.mp4
├── patent-technology-demo.mp4
├── real-scenario-demo.mp4
└── voice-interaction-demo.mp4
```

### 2. Update Video Cards
Replace the placeholder video cards in `index.html` with actual video elements:

```html
<div class="video-card">
    <div class="video-thumbnail">
        <video controls poster="videos/thumbnails/agent-communication-thumb.jpg">
            <source src="videos/agent-communication-demo.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <div class="play-button">▶️</div>
    </div>
    <div class="video-info">
        <h3>🤝 Agent Communication</h3>
        <p>Real-time collaboration between agents with live narration</p>
        <div class="video-duration">5:30</div>
    </div>
</div>
```

### 3. CSS Updates for Video Elements
Add these styles to make videos look professional:

```css
.video-thumbnail video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 15px;
}

.video-thumbnail:hover .play-button {
    opacity: 0.8;
    transform: scale(1.1);
}
```

### 4. JavaScript for Video Modal
Replace the alert with a video modal:

```javascript
// Video modal functionality
function openVideoModal(videoSrc, title) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>${title}</h3>
            <video controls autoplay>
                <source src="${videoSrc}" type="video/mp4">
            </video>
        </div>
    `;
    document.body.appendChild(modal);
}
```

### 5. Recommended Video Specifications
- **Format**: MP4 (H.264)
- **Resolution**: 1920x1080 (Full HD)
- **Duration**: 3-8 minutes per demo
- **File Size**: Under 100MB per video
- **Thumbnails**: 350x200px JPG images

### 6. Current Status
The recorded demos section is ready and will automatically work once video files are added to the `videos/` directory.

## Next Steps
1. Record your demo videos
2. Compress them to the recommended specifications
3. Add them to the `videos/` directory
4. Update the HTML to use actual video elements
5. Test the video playback functionality
