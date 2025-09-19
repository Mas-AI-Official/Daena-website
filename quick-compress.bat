@echo off
echo 🚀 Quick Video Compression for Daena Website
echo ============================================
echo.

REM Create compressed directory if it doesn't exist
if not exist "videos\compressed" mkdir "videos\compressed"

echo 📊 Current video sizes:
echo.
Get-ChildItem videos\*.mp4 | ForEach-Object { 
    $sizeMB = [math]::Round($_.Length/1MB,2)
    Write-Host "$($_.Name): $sizeMB MB" 
}

echo.
echo 🎯 Target: Compress to under 10MB each
echo.

REM Check if ffmpeg is available
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ FFmpeg not found. Please install FFmpeg first.
    echo.
    echo 📥 Quick install:
    echo 1. Download from: https://ffmpeg.org/download.html
    echo 2. Extract to C:\ffmpeg
    echo 3. Add C:\ffmpeg\bin to your PATH
    echo.
    echo 🔄 Or use online compression:
    echo - https://www.freeconvert.com/video-compressor
    echo - Upload each video and compress to 8-10MB
    echo - Save to videos\compressed\ folder
    echo.
    pause
    exit /b 1
)

echo ✅ FFmpeg found. Starting compression...
echo.

REM Compress the largest videos first
echo 🔥 Compressing REAL SENARIO DEMO (18.2 MB → ~8 MB)...
ffmpeg -i "videos\REAL SENARIO DEMO.mp4" -c:v libx264 -crf 30 -preset fast -c:a aac -b:a 96k -movflags +faststart -y "videos\compressed\REAL SENARIO DEMO.mp4"

echo 🔥 Compressing Real Talk to Daena (18.61 MB → ~8 MB)...
ffmpeg -i "videos\real talk to daena and whole system - Made with Clipchamp.mp4" -c:v libx264 -crf 30 -preset fast -c:a aac -b:a 96k -movflags +faststart -y "videos\compressed\real talk to daena and whole system - Made with Clipchamp.mp4"

echo.
echo ✅ Compression complete!
echo.
echo 📊 New compressed sizes:
echo.
Get-ChildItem videos\compressed\*.mp4 | ForEach-Object { 
    $sizeMB = [math]::Round($_.Length/1MB,2)
    Write-Host "$($_.Name): $sizeMB MB" 
}

echo.
echo 🌐 Ready for fast online streaming!
echo 📁 Files saved to: videos\compressed\
echo.
pause
