# Script to fix all demo pages by removing duplicate headers and fixing structure

$demos = @(
    @{ name = "real-talk"; title = "Real Talk"; description = "Natural conversation with Daena demonstrating VP-level intelligence" },
    @{ name = "real-scenario"; title = "Real Scenario"; description = "See Daena handle complex real-world business scenarios" },
    @{ name = "patent-enhanced"; title = "Patent Technology Enhanced"; description = "Deep dive into enhanced patent-pending technologies" },
    @{ name = "sunflower-honeycomb"; title = "Sunflower-Honeycomb"; description = "Visualize the core architecture that powers Daena's decision-making" },
    @{ name = "budget-calculation"; title = "Budget Calculation"; description = "See how Daena's Finance agents analyze and calculate budgets" },
    @{ name = "cmp-pipeline"; title = "CMP Pipeline"; description = "Experience the complete Council-Memory-Process pipeline in action" },
    @{ name = "agent-communication"; title = "Agent Communication"; description = "Watch 6 intelligent AI agents collaborate in real-time" }
)

foreach ($demo in $demos) {
    $demoPath = "live-demos\$($demo.name)\index.html"
    
    if (-not (Test-Path $demoPath)) {
        Write-Host "Skipping $($demo.name) - file not found"
        continue
    }
    
    Write-Host "Fixing $($demo.name)..."
    
    $content = Get-Content $demoPath -Raw -Encoding UTF8
    
    # Remove duplicate header section (from line 34 to line 44 approximately)
    # Pattern: <header class="header"> ... </header> inside glass-card
    $content = $content -replace '(?s)<header class="header">.*?</header>', ''
    
    # Remove duplicate container divs that wrap main-content
    # Pattern: <div class="container">\s*<div class="main-content">
    $content = $content -replace '(?s)<div class="container">\s*<div class="main-content">', '<div class="main-content">'
    
    # Fix closing divs - remove extra </div> before </div> that closes glass-card
    # This is tricky, so we'll be more careful
    
    # Ensure voice player CSS is linked
    if ($content -notmatch 'voice-player\.css') {
        $content = $content -replace '(?s)(<link rel="stylesheet" href="/live-demos/_shared\.css">)', "`$1`n  <link rel="stylesheet" href="/live-demos/voice-player.css">"
    }
    
    # Ensure voice player JS is linked
    if ($content -notmatch 'voice-player\.js') {
        # Find where scripts are and add voice-player.js before demo-full.js
        $content = $content -replace '(?s)(<script src="/js/metatron-hex-network\.js"></script>)', "`$1`n  <script src="/live-demos/voice-player.js"></script>"
    }
    
    # Fix voice config loading in demo-full.js if it exists
    $demoJsPath = "live-demos\$($demo.name)\demo-full.js"
    if (Test-Path $demoJsPath) {
        $jsContent = Get-Content $demoJsPath -Raw -Encoding UTF8
        
        # Fix config path
        $jsContent = $jsContent -replace "fetch\('config\.json'\)", "fetch('/old demoes/$($demo.name)/config.json')"
        $jsContent = $jsContent -replace "fetch\('\.\./config\.json'\)", "fetch('/old demoes/$($demo.name)/config.json')"
        $jsContent = $jsContent -replace "fetch\('/live-demos/.*?/config\.json'\)", "fetch('/old demoes/$($demo.name)/config.json')"
        
        # Fix audio path replacement
        if ($jsContent -match 'config\.audio.*replace') {
            $jsContent = $jsContent -replace "(config\.audio\s*=\s*config\.audio\.replace\('\.\./voice-over-demos/',\s*'/live-demos/audio/')", "config.audio = config.audio.replace('../voice-over-demos/', '/live-demos/audio/')"
        } else {
            # Add audio path fix if not present
            $jsContent = $jsContent -replace "(const config = await response\.json\(\);)", "`$1`n                        // Update audio path to point to live-demos/audio`n                        if (config.audio) {`n                            config.audio = config.audio.replace('../voice-over-demos/', '/live-demos/audio/');`n                        }"
        }
        
        Set-Content $demoJsPath $jsContent -Encoding UTF8 -NoNewline
        Write-Host "  Fixed demo-full.js"
    }
    
    # Copy config.json if it exists in old demoes
    $oldConfigPath = "old demoes\$($demo.name)\config.json"
    $newConfigPath = "live-demos\$($demo.name)\config.json"
    if ((Test-Path $oldConfigPath) -and -not (Test-Path $newConfigPath)) {
        Copy-Item $oldConfigPath $newConfigPath -Force
        Write-Host "  Copied config.json"
    }
    
    # Ensure CSS file exists - extract from old demo if needed
    $cssPath = "live-demos\$($demo.name)\live-demo.css"
    if (-not (Test-Path $cssPath)) {
        $oldDemoPath = "old demoes\$($demo.name)\demo.html"
        if (Test-Path $oldDemoPath) {
            $oldContent = Get-Content $oldDemoPath -Raw -Encoding UTF8
            
            # Extract CSS from <style> tag
            if ($oldContent -match '(?s)<style>(.*?)</style>') {
                $css = $matches[1]
                # Remove body background and header styles that conflict
                $css = $css -replace '(?s)body\s*\{[^}]*\}', ''
                $css = $css -replace '(?s)\.header\s*\{[^}]*\}', ''
                $css = $css -replace '(?s)\.container\s*\{[^}]*\}', ''
                
                Set-Content $cssPath $css -Encoding UTF8
                Write-Host "  Extracted and created live-demo.css"
            }
        }
    }
    
    # Clean up the HTML content
    Set-Content $demoPath $content -Encoding UTF8 -NoNewline
    Write-Host "  Fixed index.html"
    Write-Host ""
}

Write-Host "All demos fixed!"

