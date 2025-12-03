# PowerShell Script to Create Pull Request
# This script uses GitHub API to create a PR

$repo = "Mas-AI-Official/Daena-website"
$base = "main"
$head = "fix/mobile-1"
$title = "fix(mobile): comprehensive mobile layout fixes"

# Read PR description
$body = Get-Content -Path "PR_DESCRIPTION.md" -Raw

# GitHub API endpoint
$url = "https://api.github.com/repos/$repo/pulls"

# Create PR payload
$payload = @{
    title = $title
    head = $head
    base = $base
    body = $body
} | ConvertTo-Json

Write-Host "Creating Pull Request..."
Write-Host "Repository: $repo"
Write-Host "Base: $base <- Head: $head"
Write-Host "Title: $title"
Write-Host ""

# Note: This requires a GitHub Personal Access Token
# Set your token as an environment variable: $env:GITHUB_TOKEN
# Or modify this script to include your token

if ($env:GITHUB_TOKEN) {
    $headers = @{
        "Authorization" = "token $env:GITHUB_TOKEN"
        "Accept" = "application/vnd.github.v3+json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $payload -ContentType "application/json"
        Write-Host "✅ Pull Request created successfully!" -ForegroundColor Green
        Write-Host "PR Number: $($response.number)" -ForegroundColor Green
        Write-Host "PR URL: $($response.html_url)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Opening PR in browser..."
        Start-Process $response.html_url
    }
    catch {
        Write-Host "❌ Error creating PR:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host ""
        Write-Host "Please check:" -ForegroundColor Yellow
        Write-Host "1. GitHub token is set: `$env:GITHUB_TOKEN" -ForegroundColor Yellow
        Write-Host "2. Token has 'repo' permissions" -ForegroundColor Yellow
        Write-Host "3. Branch '$head' exists on remote" -ForegroundColor Yellow
    }
}
else {
    Write-Host "⚠️  GitHub token not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To use this script:" -ForegroundColor Cyan
    Write-Host "1. Create a GitHub Personal Access Token with 'repo' scope" -ForegroundColor Cyan
    Write-Host "2. Set it as environment variable:" -ForegroundColor Cyan
    Write-Host "   `$env:GITHUB_TOKEN = 'your-token-here'" -ForegroundColor Cyan
    Write-Host "3. Run this script again" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or create PR manually:" -ForegroundColor Cyan
    Write-Host "https://github.com/$repo/pull/new/$head" -ForegroundColor Cyan
}





