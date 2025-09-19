@echo off
echo Deploying Daena Pitch Deck Website...
echo.

REM Check if required folders exist
if not exist "images" (
    echo Creating images folder...
    mkdir images
)

if not exist "audio" (
    echo Creating audio folder...
    mkdir audio
)

echo.
echo Website structure ready!
echo.
echo Next steps:
echo 1. Upload slide images (slide-1.png to slide-13.png) to the images/ folder
echo 2. Upload audio files (slide-1.mp3 to slide-13.mp3) to the audio/ folder
echo 3. Upload Daena_Pitch_Deck.pptx to the root directory
echo 4. Open index.html in your browser to test
echo.
echo For placeholder images, open create-placeholder-images.html in your browser
echo.
pause
