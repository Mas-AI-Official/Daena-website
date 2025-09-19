@echo off
echo ========================================
echo Deploying Daena Website to GitHub Pages
echo ========================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo.
)

REM Add all files to git
echo Adding files to Git...
git add .

REM Commit changes
echo Committing changes...
git commit -m "Update website with yellow/blue theme, honeycomb graphics, and professional data visualizations"

REM Check if remote origin exists
git remote -v >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo WARNING: No remote repository found!
    echo You need to add your GitHub repository as origin:
    echo git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    echo.
    echo Please run this command with your actual GitHub repository URL
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

REM Push to GitHub
echo Pushing to GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Website deployed to GitHub Pages
    echo ========================================
    echo.
    echo Your website should be live at: https://daena.mas-ai.co
    echo.
    echo Note: It may take 1-2 minutes for changes to appear
    echo due to GitHub Pages caching.
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Failed to push to GitHub
    echo ========================================
    echo.
    echo Please check:
    echo 1. Your GitHub repository URL is correct
    echo 2. You have push permissions
    echo 3. Your internet connection is working
    echo.
)

echo.
pause
