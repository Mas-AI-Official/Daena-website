# Fix CSS/JS links in all demo index.html files
$demos = @(
    @{ name = "agent-communication"; hasCss = $true; hasJs = $true },
    @{ name = "budget-calculation"; hasCss = $true; hasJs = $true },
    @{ name = "cmp-pipeline"; hasCss = $true; hasJs = $false },
    @{ name = "patent-technology"; hasCss = $false; hasJs = $false },
    @{ name = "patent-enhanced"; hasCss = $false; hasJs = $false },
    @{ name = "real-talk"; hasCss = $false; hasJs = $false },
    @{ name = "real-scenario"; hasCss = $false; hasJs = $false },
    @{ name = "sunflower-honeycomb"; hasCss = $false; hasJs = $false }
)

foreach ($demo in $demos) {
    $demoName = $demo.name
    $indexFile = "live-demos\$demoName\index.html"
    $cssFile = "live-demos\$demoName\live-demo.css"
    $jsFile = "live-demos\$demoName\live-demo.js"
    $configFile = "live-demos\$demoName\config.json"
    
    if (Test-Path $indexFile) {
        Write-Host "Processing: $demoName" -ForegroundColor Cyan
        
        $content = Get-Content $indexFile -Raw -Encoding UTF8
        
        # Check if CSS file exists and add link if needed
        if ($demo.hasCss -and (Test-Path $cssFile)) {
            $cssLink = "<link rel=`"stylesheet`" href=`"/live-demos/$demoName/live-demo.css`">"
            if ($content -notmatch "live-demo\.css") {
                # Insert after _shared.css
                $content = $content -replace '(<link rel="stylesheet" href="/live-demos/_shared\.css">)', "`$1`n  $cssLink"
                Write-Host "  Added CSS link" -ForegroundColor Green
            }
        }
        
        # Check if JS file exists and add script if needed
        if ($demo.hasJs -and (Test-Path $jsFile)) {
            $jsScript = "<script src=`"/live-demos/$demoName/live-demo.js`" defer></script>"
            if ($content -notmatch "live-demo\.js") {
                # Insert before closing body tag or after metatron script
                if ($content -match '(<script src="/js/metatron-hex-network\.js"></script>)') {
                    $content = $content -replace '(<script src="/js/metatron-hex-network\.js"></script>)', "`$1`n  $jsScript"
                } else {
                    $content = $content -replace '(</body>)', "  $jsScript`n`$1"
                }
                Write-Host "  Added JS script" -ForegroundColor Green
            }
        }
        
        # Check if config.json exists and add voice player if needed
        if (Test-Path $configFile) {
            $voicePlayerCss = "<link rel=`"stylesheet`" href=`"/live-demos/voice-player.css`">"
            $voicePlayerJs = "<script src=`"/live-demos/voice-player.js`"></script>"
            
            if ($content -notmatch "voice-player\.css") {
                # Insert after _shared.css
                $content = $content -replace '(<link rel="stylesheet" href="/live-demos/_shared\.css">)', "`$1`n  $voicePlayerCss"
                Write-Host "  Added voice-player CSS" -ForegroundColor Green
            }
            
            if ($content -notmatch "voice-player\.js") {
                # Insert before closing body tag or after metatron script
                if ($content -match '(<script src="/js/metatron-hex-network\.js"></script>)') {
                    $content = $content -replace '(<script src="/js/metatron-hex-network\.js"></script>)', "`$1`n  $voicePlayerJs"
                } else {
                    $content = $content -replace '(</body>)', "  $voicePlayerJs`n`$1"
                }
                Write-Host "  Added voice-player JS" -ForegroundColor Green
            }
        }
        
        # Fix any duplicate voice-player links/scripts
        $content = $content -replace '(?s)(<link rel="stylesheet" href="/live-demos/voice-player\.css">.*?)<link rel="stylesheet" href="/live-demos/voice-player\.css">', '$1'
        $content = $content -replace '(?s)(<script src="/live-demos/voice-player\.js"></script>.*?)<script src="/live-demos/voice-player\.js"></script>', '$1'
        
        Set-Content -Path $indexFile -Value $content -Encoding UTF8 -NoNewline
        Write-Host "  Updated: $indexFile" -ForegroundColor Yellow
    }
}

Write-Host "`nDone!" -ForegroundColor Green

