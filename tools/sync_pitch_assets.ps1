param(
  [string]$RepoRoot = "$PSScriptRoot\..",
  [string]$SrcPptx = "D:\Ideas\daena-website\pich deck\daena pitch deck new.pptx",
  [string]$SrcVo = "D:\Ideas\daena-website\pitch deck voice final - mp3"
)

$public = Join-Path $RepoRoot "assets"
$dest = Join-Path $public "pitch"
$voice = Join-Path $dest "voice"

New-Item -ItemType Directory -Force -Path $dest | Out-Null
New-Item -ItemType Directory -Force -Path $voice | Out-Null

# Copy PPTX as normalized file name
if (Test-Path $SrcPptx) {
    Copy-Item $SrcPptx (Join-Path $dest "daena_pitch_deck.pptx") -Force
    Write-Host "Copied PPTX to $dest\daena_pitch_deck.pptx"
} else {
    Write-Warning "Source PPTX not found: $SrcPptx"
}

# Copy voice files and normalize names to slide_##.mp3
if (Test-Path $SrcVo) {
    Get-ChildItem $SrcVo -Filter *.mp3 | ForEach-Object {
        $n = $_.BaseName
        # Extract first number group in filename
        if ($n -match '\d+') {
            $num = [int]$Matches[0]
            $out = "slide_{0:D2}.mp3" -f $num
        } else {
            # fallback: keep original base, but replace spaces
            $out = ($n -replace '\s+', '_') + ".mp3"
        }
        Copy-Item $_.FullName (Join-Path $voice $out) -Force
        Write-Host "Copied $($_.Name) -> $out"
    }
} else {
    Write-Warning "Source voice directory not found: $SrcVo"
}

Write-Host "Assets synced to $dest"

