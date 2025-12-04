# Extract JavaScript from old demos and add to new live-demos
$demos = @(
    @{name='sunflower-honeycomb'; class='SunflowerHoneycombDemo'; audio='Demo 1 Agent Communication.mp3'},
    @{name='real-talk'; class='DaenaRealTalkDemo'; audio='Demo 6 Real Talk.mp3'},
    @{name='real-scenario'; class='DaenaRealScenarioDemo'; audio='Demo 7 Real Scenario.mp3'},
    @{name='patent-technology'; class='DaenaPatentTechnologyDemo'; audio='Demo 4 Patent Technology.mp3'},
    @{name='patent-enhanced'; class='DaenaEnhancedPatentDemo'; audio='Demo 5 Patent Technology Enhanced.mp3'}
)

foreach ($demo in $demos) {
    $oldPath = "old demoes\$($demo.name)\demo.html"
    $newPath = "live-demos\$($demo.name)\index.html"
    
    if (Test-Path $oldPath -and Test-Path $newPath) {
        Write-Host "Processing $($demo.name)..."
        # Extract script content between <script> tags containing the class
        $oldContent = Get-Content $oldPath -Raw
        $classPattern = "class\s+$($demo.class)"
        $scriptStart = $oldContent.IndexOf('<script>', $oldContent.IndexOf($classPattern))
        if ($scriptStart -gt 0) {
            $scriptEnd = $oldContent.IndexOf('</script>', $scriptStart) + 9
            $js = $oldContent.Substring($scriptStart, $scriptEnd - $scriptStart)
            $js = $js -replace '../voice-over-demos/', '/live-demos/audio/'
            
            # Read new file
            $newContent = Get-Content $newPath -Raw
            $audioInsert = $newContent.IndexOf('<!-- Audio Elements -->')
            if ($audioInsert -gt 0) {
                $afterAudio = $newContent.IndexOf('</audio>', $audioInsert) + 8
                $beforeScript = $newContent.IndexOf('<script>', $afterAudio)
                if ($beforeScript -gt 0) {
                    $newContent = $newContent.Substring(0, $beforeScript) + "`n  <script src=`"/js/metatron-hex-network.js`"></script>`n  " + $js + "`n  " + $newContent.Substring($beforeScript)
                    Set-Content -Path $newPath -Value $newContent -Encoding UTF8
                    Write-Host "  ✓ Fixed $($demo.name)"
                }
            }
        }
    }
}
Write-Host "Done!"
