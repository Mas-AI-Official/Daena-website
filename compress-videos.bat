@echo off
echo 🎬 Daena Video Compression Tool
echo ================================
echo.

REM Create compressed videos directory
if not exist "videos\compressed" mkdir "videos\compressed"

echo 📁 Created compressed videos directory
echo.

REM Check if ffmpeg is available
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ FFmpeg not found. Please install FFmpeg first.
    echo.
    echo 📥 Download FFmpeg from: https://ffmpeg.org/download.html
    echo 📋 Or use online compression tools:
    echo    - https://www.freeconvert.com/video-compressor
    echo    - https://www.clideo.com/compress-video
    echo.
    echo 🎯 Target: Compress videos to under 10MB each
    echo.
    pause
    exit /b 1
)

echo ✅ FFmpeg found. Starting compression...
echo.

REM Compress each video
echo Compressing Agent Communication...
ffmpeg -i "videos\agent communication.mp4" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "videos\compressed\agent communication.mp4"

echo Compressing Budget Calculation...
ffmpeg -i "videos\budget calculation demo.mp4" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "videos\compressed\budget calculation demo.mp4"

echo Compressing CMP Pipeline...
ffmpeg -i "videos\CMP PIPELINBE DEMO.mp4" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "videos\compressed\CMP PIPELINBE DEMO.mp4"

echo Compressing Patent Technology...
ffmpeg -i "videos\patent Technology.mp4" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "videos\compressed\patent Technology.mp4"

echo Compressing Patent Technology Enhanced...
ffmpeg -i "videos\patent Technology - Made with Clipchamp.mp4" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "videos\compressed\patent Technology - Made with Clipchamp.mp4"

echo Compressing Real Scenario...
ffmpeg -i "videos\REAL SENARIO DEMO.mp4" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "videos\compressed\REAL SENARIO DEMO.mp4"

echo Compressing Real Talk to Daena...
ffmpeg -i "videos\real talk to daena and whole system - Made with Clipchamp.mp4" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart -y "videos\compressed\real talk to daena and whole system - Made with Clipchamp.mp4"

echo.
echo ✅ Video compression complete!
echo 📁 Compressed videos saved to: videos\compressed\
echo 🌐 Ready for online hosting!
echo.
pause
