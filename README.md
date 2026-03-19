# Daena AI Website

A comprehensive website for Daena AI featuring company information and an interactive pitch deck presentation.

## Website Structure

### Main Website (`index.html`)
- **Company Overview**: Information about Daena AI and its revolutionary technology
- **Features Section**: Core capabilities and benefits
- **Pitch Deck Access**: Multiple ways to view/download the presentation
- **Contact Information**: Direct links to email, website, and GitHub

### Interactive Pitch Deck (`pitch-deck-presentation.html`)
- **13 Interactive Slides**: Complete pitch deck with exact slide images
- **Auto-play Voice-over**: Automatic audio playback with 1.5-second transitions
- **Manual Controls**: Play/pause, previous/next navigation
- **Keyboard Navigation**: Arrow keys, spacebar, and escape key support
- **Responsive Design**: Works on desktop and mobile devices
- **Fallback Content**: Text-based fallbacks if images fail to load

## Features

### 🎯 **Exact Slide Structure (1-13):**
1. **Title Slide** - Daena VP introduction
2. **Problems** - 4 key issues with current AI systems
3. **Solution** - 4 key components of Daena's approach
4. **Daena VP** - Core features and capabilities
5. **How It Works** - CMP orchestration process
6. **Market Opportunity & ROI** - Market size and growth projections
7. **Business Model** - 4 revenue streams
8. **Traction** - Current status + scale readiness
9. **Go-to-Market Strategy** - 4-stage approach
10. **Market Size** - TAM/SAM/SOM analysis
11. **Technology Comparison** - vs competitors
12. **Funding Ask** - $12M + $1M bonus
13. **Thank You** - Contact information

### 🎵 **Voice-over System:**
- Auto-play after 1.5 seconds
- Seamless transitions between slides
- Manual controls for navigation
- Progress bar and slide counter
- Keyboard shortcuts (spacebar, arrows, escape)

### 📱 **Responsive Design:**
- Works on all devices
- Modern gradient backgrounds
- Professional styling
- Mobile-optimized controls

## Setup Instructions

### 1. Upload Slide Images
Place the following slide images in the `images/` folder:
- `slide-1.png` - Title Slide
- `slide-2.png` - Problems Slide
- `slide-3.png` - Solution Slide
- `slide-4.png` - Daena VP Slide
- `slide-5.png` - How It Works Slide
- `slide-6.png` - Market Opportunity Slide
- `slide-7.png` - Business Model Slide
- `slide-8.png` - Traction Slide
- `slide-9.png` - Go-to-Market Strategy Slide
- `slide-10.png` - Market Size Slide
- `slide-11.png` - Technology Comparison Slide
- `slide-12.png` - Funding Ask Slide
- `slide-13.png` - Thank You Slide

### 2. Upload Audio Files
Place the following audio files in the `audio/` folder:
- `slide-1.mp3` - Title Slide Voice-over
- `slide-2.mp3` - Problems Slide Voice-over
- `slide-3.mp3` - Solution Slide Voice-over
- `slide-4.mp3` - Daena VP Slide Voice-over
- `slide-5.mp3` - How It Works Slide Voice-over
- `slide-6.mp3` - Market Opportunity Slide Voice-over
- `slide-7.mp3` - Business Model Slide Voice-over
- `slide-8.mp3` - Traction Slide Voice-over
- `slide-9.mp3` - Go-to-Market Strategy Slide Voice-over
- `slide-10.mp3` - Market Size Slide Voice-over
- `slide-11.mp3` - Technology Comparison Slide Voice-over
- `slide-12.mp3` - Funding Ask Slide Voice-over
- `slide-13.mp3` - Thank You Slide Voice-over

### 3. Upload PowerPoint File
Place the original PowerPoint file as `Daena_Pitch_Deck.pptx` in the root directory for download functionality.

## How to Use

### Main Website
1. Open `index.html` in your browser
2. Navigate through sections using the menu
3. Click "View Pitch Deck" to launch the interactive presentation
4. Use download buttons to get PowerPoint or PDF versions

### Interactive Presentation
1. **Automatic Playback**: The presentation starts automatically with voice-over
2. **Manual Controls**: Use the control panel at the bottom to play/pause or navigate
3. **Keyboard Shortcuts**:
   - `Spacebar`: Play/Pause
   - `Left Arrow`: Previous slide
   - `Right Arrow`: Next slide
   - `Escape`: Return to main website
4. **Navigation**: Use the back button or escape key to return to the main website

## Technical Details

- **HTML5**: Modern web standards
- **CSS3**: Responsive design with gradients and animations
- **JavaScript**: Interactive functionality and audio management
- **Audio Format**: MP3 files for broad compatibility
- **Image Format**: PNG files for high quality
- **Responsive**: Works on desktop, tablet, and mobile devices

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## File Structure

```
daena-website/
├── index.html                      # Main website
├── pitch-deck-presentation.html    # Interactive presentation
├── Daena_Pitch_Deck.pptx          # Downloadable PowerPoint file
├── daena Pitch Deck .pdf          # Downloadable PDF file
├── README.md                       # This file
├── create-placeholder-images.html  # Tool to generate test images
├── deploy.bat                      # Deployment script
├── images/                         # Slide images folder
│   ├── slide-1.png
│   ├── slide-2.png
│   └── ... (up to slide-13.png)
└── audio/                          # Voice-over audio folder
    ├── slide-1.mp3
    ├── slide-2.mp3
    └── ... (up to slide-13.mp3)
```

## Key Improvements Made

1. **Fixed Slide Display Issues**: Slides now properly fit within the window using `object-fit: contain`
2. **Proper Website Structure**: Main website explains Daena with pitch deck section
3. **Better Navigation**: Easy access to both website and presentation
4. **Responsive Design**: Works perfectly on all screen sizes
5. **Error Handling**: Graceful fallbacks if images or audio fail to load
6. **Keyboard Support**: Full keyboard navigation for accessibility

## Related Repositories

- **[AI-Autonomous Company OS](https://github.com/Mas-AI-Official/AI-Autonomus-company-OS)** - Public architecture documentation for the governance-first orchestration system that powers Daena. Contains schemas, examples, and governance specifications.

## Support

For technical support or questions about the presentation, contact:
- Email: masoud.masoori@gmail.com
- Website: https://mas-ai.co
- GitHub: https://github.com/Masoud-Masoori/daena