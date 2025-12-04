# Rebuild all live demos from old demoes with new layout
# This script deletes existing demos and copies from old demoes, then applies new layout

Write-Host "Starting demo rebuild process..." -ForegroundColor Cyan

# List of demos to process
$demos = @(
    @{ name = "agent-communication"; title = "Agent Communication"; description = "Watch 6 intelligent AI agents collaborate in real-time on product launch analysis with live narration" },
    @{ name = "budget-calculation"; title = "Budget Calculation"; description = "See how Daena's Finance agents analyze and calculate budgets with real-time decision-making" },
    @{ name = "cmp-pipeline"; title = "CMP Pipeline"; description = "Experience the complete Council-Memory-Process pipeline in action" },
    @{ name = "patent-technology"; title = "Patent Technology"; description = "Explore Daena's patent-pending NBMF and Enterprise-DNA technologies" },
    @{ name = "patent-enhanced"; title = "Patent Enhanced"; description = "Explore Daena's enhanced patent analysis with AI-powered insights" },
    @{ name = "real-talk"; title = "Real Talk"; description = "Listen to natural conversations between Daena agents discussing business scenarios" },
    @{ name = "real-scenario"; title = "Real Scenario"; description = "Watch Daena handle real-world business scenarios with multi-agent coordination" },
    @{ name = "sunflower-honeycomb"; title = "Sunflower-Honeycomb"; description = "Visualize the core architecture that powers Daena's decision-making" }
)

# Step 1: Delete existing demo folders (except shared files)
Write-Host "`nStep 1: Cleaning existing demo folders..." -ForegroundColor Yellow
foreach ($demo in $demos) {
    $demoPath = "live-demos\$($demo.name)"
    if (Test-Path $demoPath) {
        Write-Host "  Deleting: $demoPath" -ForegroundColor Gray
        Remove-Item -Path $demoPath -Recurse -Force
    }
}

# Step 2: Copy demos from old demoes to live-demos
Write-Host "`nStep 2: Copying demos from old demoes..." -ForegroundColor Yellow
foreach ($demo in $demos) {
    $oldPath = "old demoes\$($demo.name)"
    $newPath = "live-demos\$($demo.name)"
    
    if (Test-Path $oldPath) {
        Write-Host "  Copying: $oldPath -> $newPath" -ForegroundColor Gray
        New-Item -ItemType Directory -Path $newPath -Force | Out-Null
        
        # Copy all files from old demo
        Copy-Item -Path "$oldPath\*" -Destination $newPath -Recurse -Force
        
        Write-Host "    ✓ Copied $($demo.name)" -ForegroundColor Green
    } else {
        Write-Host "    ✗ Not found: $oldPath" -ForegroundColor Red
    }
}

# Step 3: Create new index.html for each demo with new layout
Write-Host "`nStep 3: Creating new index.html files with unified layout..." -ForegroundColor Yellow

foreach ($demo in $demos) {
    $demoPath = "live-demos\$($demo.name)"
    $demoHtml = "$demoPath\demo.html"
    $indexHtml = "$demoPath\index.html"
    
    if (Test-Path $demoHtml) {
        Write-Host "  Processing: $($demo.name)" -ForegroundColor Gray
        
        # Read the old demo.html
        $oldContent = Get-Content $demoHtml -Raw -Encoding UTF8
        
        # Extract the content between <body> and </body>
        if ($oldContent -match '(?s)<body[^>]*>(.*?)</body>') {
            $bodyContent = $matches[1]
            
            # Remove old navbar/header if present
            $bodyContent = $bodyContent -replace '(?s)<nav[^>]*>.*?</nav>', ''
            $bodyContent = $bodyContent -replace '(?s)<header[^>]*>.*?</header>', ''
            $bodyContent = $bodyContent -replace '(?s)<div[^>]*class="navbar"[^>]*>.*?</div>', ''
            
            # Extract title
            $title = $demo.title
            if ($oldContent -match '<title>([^<]+)</title>') {
                $titleMatch = $matches[1]
                if ($titleMatch -notmatch 'Daena AI') {
                    $title = $titleMatch -replace 'Demo|Daena AI\s*-\s*', ''
                }
            }
            
            # Check for demo-specific CSS and JS files
            $cssLinks = ''
            $jsScripts = ''
            
            $demoCss = "$demoPath\live-demo.css"
            if (Test-Path $demoCss) {
                $cssLinks = "`n  <link rel=`"stylesheet`" href=`"/live-demos/$($demo.name)/live-demo.css`">"
            }
            
            $demoJs = "$demoPath\live-demo.js"
            if (Test-Path $demoJs) {
                $jsScripts = "`n  <script src=`"/live-demos/$($demo.name)/live-demo.js`" defer></script>"
            }
            
            # Extract inline scripts (everything between <script> and </script> that's not a src)
            $inlineScripts = ''
            $scriptMatches = [regex]::Matches($oldContent, '(?s)<script(?![^>]*src=)[^>]*>(.*?)</script>')
            foreach ($match in $scriptMatches) {
                $scriptContent = $match.Groups[1].Value
                # Remove skin.js initialization
                if ($scriptContent -notmatch 'skin\.js') {
                    $inlineScripts += "`n  <script>`n$scriptContent`n  </script>"
                }
            }
            
            # Check for config.json and voice player
            $hasConfig = Test-Path "$demoPath\config.json"
            $voicePlayerHtml = ''
            if ($hasConfig) {
                $voicePlayerHtml = "`n  <link rel=`"stylesheet`" href=`"/live-demos/voice-player.css`">`n  <script src=`"/live-demos/voice-player.js`"></script>"
            }
            
            # Build the HTML content
            $htmlParts = @()
            $htmlParts += "<!doctype html>"
            $htmlParts += "<html lang=`"en`">"
            $htmlParts += "<head>"
            $htmlParts += "  <meta charset=`"utf-8`" />"
            $htmlParts += "  <meta name=`"viewport`" content=`"width=device-width,initial-scale=1`" />"
            $htmlParts += "  <title>$title • Live Demo</title>"
            $htmlParts += "  <meta name=`"description`" content=`"$($demo.description)`">"
            $htmlParts += "  <script src=`"https://cdn.tailwindcss.com`"></script>"
            $htmlParts += "  <link rel=`"stylesheet`" href=`"/assets/css/global.css`">"
            $htmlParts += "  <link rel=`"stylesheet`" href=`"/live-demos/_shared.css`">"
            if ($cssLinks) { $htmlParts += $cssLinks }
            if ($voicePlayerHtml) { $htmlParts += $voicePlayerHtml }
            $htmlParts += "</head>"
            $htmlParts += "<body class=`"metatron-bg`">"
            $htmlParts += "  <div class=`"metatron-bg`"></div>"
            $htmlParts += "  <div class=`"metatron-pattern-bg`"></div>"
            $htmlParts += "  <canvas id=`"metatron-hex-canvas`"></canvas>"
            $htmlParts += "  <nav class=`"fixed top-0 left-0 right-0 z-[100]`" role=`"navigation`" style=`"pointer-events: none;`">"
            $htmlParts += "    <div class=`"max-w-7xl mx-auto px-4 pt-4`" style=`"pointer-events: auto;`">"
            $htmlParts += "      <div class=`"glass-card flex items-center justify-between p-4`" style=`"position: relative; z-index: 100;`">"
            $htmlParts += "        <a href=`"/`" class=`"text-xl font-bold`">Daena</a>"
            $htmlParts += "        <div class=`"hidden md:flex items-center gap-6`">"
            $htmlParts += "          <a href=`"/`" class=`"hover:text-yellow-400 transition`">Home</a>"
            $htmlParts += "          <a href=`"/#demos`" class=`"hover:text-yellow-400 transition`">Demos</a>"
            $htmlParts += "          <a href=`"/#pitch`" class=`"hover:text-yellow-400 transition`">Pitch Deck</a>"
            $htmlParts += "          <a href=`"/docs.html#live`" class=`"hover:text-yellow-400 transition`">Live Demo</a>"
            $htmlParts += "          <a href=`"/docs.html#advanced-demos`" class=`"hover:text-yellow-400 transition`">Docs & Benchmarks</a>"
            $htmlParts += "          <a href=`"/#contact`" class=`"hover:text-yellow-400 transition`">Contact</a>"
            $htmlParts += "        </div>"
            $htmlParts += "      </div>"
            $htmlParts += "    </div>"
            $htmlParts += "  </nav>"
            $htmlParts += "  <main class=`"container`" style=`"margin-top: 100px; padding: 2rem 1rem;`">"
            $htmlParts += "    <a class=`"back-link`" href=`"/docs.html#advanced-demos`" id=`"back-to-demos`" style=`"display: inline-block; margin-bottom: 1rem; padding: 0.5rem 1rem; background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 8px; text-decoration: none; color: #FFD700; transition: all 0.3s;`">← Back to Advanced Interactive Demos</a>"
            $htmlParts += "    <h1 style=`"font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; margin-bottom: 0.5rem;`">$title</h1>"
            $htmlParts += "    <p class=`"subtle`" style=`"opacity: 0.8; font-size: 1.1rem; margin-bottom: 2rem;`">$($demo.description)</p>"
            $htmlParts += "    <div class=`"glass-card`" style=`"padding: 2rem; margin-top: 1rem; overflow: visible;`">"
            $htmlParts += $bodyContent
            $htmlParts += "    </div>"
            $htmlParts += "  </main>"
            $htmlParts += "  <script src=`"/js/metatron-hex-network.js`"></script>"
            if ($jsScripts) { $htmlParts += $jsScripts }
            if ($inlineScripts) { $htmlParts += $inlineScripts }
            $htmlParts += "  <script>"
            $htmlParts += "    (function() {"
            $htmlParts += "      sessionStorage.setItem('returnSection', 'advanced-demos');"
            $htmlParts += "      sessionStorage.setItem('returnPage', '/docs.html#advanced-demos');"
            $htmlParts += "      const backBtn = document.getElementById('back-to-demos');"
            $htmlParts += "      if (backBtn) {"
            $htmlParts += "        backBtn.addEventListener('click', function(e) {"
            $htmlParts += "          e.preventDefault();"
            $htmlParts += "          window.location.href = '/docs.html#advanced-demos';"
            $htmlParts += "        });"
            $htmlParts += "      }"
            $htmlParts += "    })();"
            $htmlParts += "  </script>"
            $htmlParts += "</body>"
            $htmlParts += "</html>"
            
            # Write new index.html
            $newHtml = $htmlParts -join "`n"
            Set-Content -Path $indexHtml -Value $newHtml -Encoding UTF8 -NoNewline
            Write-Host "    ✓ Created index.html for $($demo.name)" -ForegroundColor Green
        } else {
            Write-Host "    ✗ Could not extract body content from $demoHtml" -ForegroundColor Red
        }
    } else {
        Write-Host "    ✗ demo.html not found: $demoHtml" -ForegroundColor Red
    }
}

# Step 4: Copy voice-over audio files if not already present
Write-Host "`nStep 4: Ensuring audio files are present..." -ForegroundColor Yellow
$audioSource = "old demoes\voice-over-demos"
$audioDest = "live-demos\audio"
if (Test-Path $audioSource) {
    if (-not (Test-Path $audioDest)) {
        New-Item -ItemType Directory -Path $audioDest -Force | Out-Null
    }
    Copy-Item -Path "$audioSource\*" -Destination $audioDest -Force
    Write-Host "  ✓ Audio files copied" -ForegroundColor Green
}

# Step 5: Ensure voice-player files are present
Write-Host "`nStep 5: Ensuring voice-player files are present..." -ForegroundColor Yellow
$voicePlayerCss = "old demoes\voice-player.css"
$voicePlayerJs = "old demoes\voice-player.js"
if (Test-Path $voicePlayerCss) {
    Copy-Item -Path $voicePlayerCss -Destination "live-demos\voice-player.css" -Force
    Write-Host "  ✓ voice-player.css copied" -ForegroundColor Green
}
if (Test-Path $voicePlayerJs) {
    Copy-Item -Path $voicePlayerJs -Destination "live-demos\voice-player.js" -Force
    Write-Host "  ✓ voice-player.js copied" -ForegroundColor Green
}

Write-Host "`n✓ Demo rebuild complete!" -ForegroundColor Green
Write-Host "All demos have been copied and updated with the new layout." -ForegroundColor Cyan
