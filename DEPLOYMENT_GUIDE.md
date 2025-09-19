# Daena Website Deployment Guide

## Quick Deployment Steps

### Option 1: Using the Deploy Script (Recommended)
1. Open Command Prompt in the `daena-website` folder
2. Run: `deploy-to-github.bat`
3. Follow the prompts

### Option 2: Manual Git Commands
1. Open Command Prompt in the `daena-website` folder
2. Run these commands:

```bash
# Add all files
git add .

# Commit changes
git commit -m "Update website with yellow/blue theme and professional charts"

# Push to GitHub
git push origin main
```

### Option 3: Using GitHub Desktop
1. Open GitHub Desktop
2. Select your repository
3. Review the changes
4. Add commit message: "Update website with yellow/blue theme and professional charts"
5. Click "Commit to main"
6. Click "Push origin"

## What Was Updated

✅ **Yellow & Blue Color Scheme**: Complete theme overhaul
✅ **Honeycomb Graphics**: Added corner decorations and background patterns
✅ **Professional Charts**: Better data visualizations for market data
✅ **Enhanced Layout**: More professional and polished design
✅ **Improved Typography**: Better fonts and text effects

## After Deployment

- Your website will be live at: https://daena.mas-ai.co
- Changes may take 1-2 minutes to appear due to caching
- Clear your browser cache if you don't see changes immediately

## Troubleshooting

If the deployment fails:
1. Check your GitHub repository URL
2. Ensure you have push permissions
3. Verify your internet connection
4. Check if the repository exists and is accessible

## Files Updated

- `index.html` - Main website with new design
- `pitch-deck-presentation.html` - Updated presentation
- `deploy-to-github.bat` - New deployment script
