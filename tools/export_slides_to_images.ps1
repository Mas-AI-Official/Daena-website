param(
  [string]$RepoRoot = "$PSScriptRoot\.."
)

$pptx = Join-Path $RepoRoot "assets\pitch\daena_pitch_deck.pptx"
$imagesDir = Join-Path $RepoRoot "images"

if (-not (Test-Path $pptx)) {
    Write-Error "PPTX file not found: $pptx"
    exit 1
}

# Create images directory if it doesn't exist
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Force -Path $imagesDir | Out-Null
}

# Try PowerPoint COM to export slides as images
try {
    Write-Host "Exporting slides to images using PowerPoint COM..."
    $pp = New-Object -ComObject PowerPoint.Application
    $pp.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue
    
    $pres = $pp.Presentations.Open($pptx, $true, $true, $false)
    
    $slideCount = $pres.Slides.Count
    Write-Host "Found $slideCount slides"
    
    for ($i = 1; $i -le $slideCount; $i++) {
        $slide = $pres.Slides.Item($i)
        $outputPath = Join-Path $imagesDir "slide-$i.png"
        
        # Export slide as PNG
        $slide.Export($outputPath, "PNG", 1920, 1080) # 1920x1080 resolution
        
        Write-Host "Exported slide $i to $outputPath"
    }
    
    $pres.Close()
    $pp.Quit()
    
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($pres) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($pp) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Host "Successfully exported $slideCount slides to $imagesDir"
} catch {
    Write-Error "PowerPoint COM export failed: $_"
    Write-Host "Please ensure PowerPoint is installed and the PPTX file is not corrupted."
    exit 1
}

