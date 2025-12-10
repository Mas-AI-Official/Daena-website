param(
  [string]$RepoRoot = "$PSScriptRoot\.."
)

$pptx = Join-Path $RepoRoot "assets\pitch\daena_pitch_deck.pptx"
$pdf  = Join-Path $RepoRoot "assets\pitch\daena_pitch_deck.pdf"

if (-not (Test-Path $pptx)) {
    Write-Error "PPTX file not found: $pptx"
    exit 1
}

# Try PowerPoint COM first
try {
    Write-Host "Attempting to export using PowerPoint COM..."
    $pp = New-Object -ComObject PowerPoint.Application
    $pp.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue
    
    $pres = $pp.Presentations.Open($pptx, $false, $false, $false)
    $pres.SaveAs($pdf, 32) # 32 = ppSaveAsPDF
    $pres.Close()
    $pp.Quit()
    
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($pp) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Host "Exported PDF to $pdf"
} catch {
    Write-Warning "PowerPoint COM failed: $_"
    Write-Host "Trying LibreOffice fallback..."
    
    # Fallback to LibreOffice
    $libreOffice = "C:\Program Files\LibreOffice\program\soffice.exe"
    if (Test-Path $libreOffice) {
        $outDir = Split-Path $pdf -Parent
        & $libreOffice --headless --convert-to pdf --outdir $outDir $pptx
        Write-Host "Exported PDF using LibreOffice to $pdf"
    } else {
        Write-Error "Neither PowerPoint nor LibreOffice available. Please install one of them."
        exit 1
    }
}

