# Rebuild all live-demos pages with new unified layout
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

$navbarHtml = @'
  <nav class="fixed top-0 left-0 right-0 z-[100]" role="navigation" style="pointer-events: none;">
    <div class="max-w-7xl mx-auto px-4 pt-4" style="pointer-events: auto;">
      <div class="glass-card flex items-center justify-between p-4" style="position: relative; z-index: 100;">
        <a href="/" class="text-xl font-bold">Daena</a>
        <div class="hidden md:flex items-center gap-6">
          <a href="/" class="hover:text-yellow-400 transition">Home</a>
          <a href="/#demos" class="hover:text-yellow-400 transition">Demos</a>
          <a href="/#pitch" class="hover:text-yellow-400 transition">Pitch Deck</a>
          <a href="/docs.html#live" class="hover:text-yellow-400 transition">Live Demo</a>
          <a href="/docs.html#advanced-demos" class="hover:text-yellow-400 transition">Docs & Benchmarks</a>
          <a href="/#contact" class="hover:text-yellow-400 transition">Contact</a>
        </div>
        <button class="md:hidden" aria-label="Menu" id="mobile-menu-btn">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      <div class="hidden md:hidden p-4 border-t border-white/10" id="mobile-menu">
        <div class="flex flex-col gap-4">
          <a href="/" class="hover:text-yellow-400 transition">Home</a>
          <a href="/#demos" class="hover:text-yellow-400 transition">Demos</a>
          <a href="/#pitch" class="hover:text-yellow-400 transition">Pitch Deck</a>
          <a href="/docs.html#live" class="hover:text-yellow-400 transition">Live Demo</a>
          <a href="/docs.html#advanced-demos" class="hover:text-yellow-400 transition">Docs & Benchmarks</a>
          <a href="/#contact" class="hover:text-yellow-400 transition">Contact</a>
        </div>
      </div>
    </div>
  </nav>
'@

foreach ($demo in $demos) {
    $demoName = $demo.name
    $demoFile = "live-demos\$demoName\demo.html"
    $indexFile = "live-demos\$demoName\index.html"
    $cssFile = "live-demos\$demoName\live-demo.css"
    $jsFile = "live-demos\$demoName\live-demo.js"
    $configFile = "live-demos\$demoName\config.json"
    
    if (Test-Path $demoFile) {
        Write-Host "Processing: $demoName" -ForegroundColor Cyan
        
        $content = Get-Content $demoFile -Raw -Encoding UTF8
        
        # Extract body content
        if ($content -match '(?s)<body[^>]*>(.*?)</body>') {
            $bodyContent = $matches[1]
            
            # Remove old navigation/headers
            $bodyContent = $bodyContent -replace '(?s)<nav[^>]*>.*?</nav>', ''
            $bodyContent = $bodyContent -replace '(?s)<header[^>]*>.*?</header>', ''
            $bodyContent = $bodyContent -replace '(?s)<div[^>]*class="navbar"[^>]*>.*?</div>', ''
            $bodyContent = $bodyContent -replace '(?s)<div[^>]*class="demo-header"[^>]*>.*?</div>', ''
            $bodyContent = $bodyContent -replace '(?s)<h1[^>]*class="demo-title"[^>]*>.*?</h1>', ''
            $bodyContent = $bodyContent -replace '(?s)<p[^>]*class="demo-subtitle"[^>]*>.*?</p>', ''
            
            # Extract inline styles
            $styles = ''
            $styleMatches = [regex]::Matches($content, '(?s)<style[^>]*>(.*?)</style>')
            foreach ($match in $styleMatches) {
                $styleContent = $match.Groups[1].Value
                if ($styleContent -notmatch 'skin\.css|daena-skin') {
                    $styles += $styleContent + "`n"
                }
            }
            
            # Extract inline scripts
            $scripts = ''
            $scriptMatches = [regex]::Matches($content, '(?s)<script(?![^>]*src=)[^>]*>(.*?)</script>')
            foreach ($match in $scriptMatches) {
                $scriptContent = $match.Groups[1].Value
                if ($scriptContent -notmatch 'skin\.js|daena-skin') {
                    $scripts += $scriptContent + "`n"
                }
            }
            
            # Check for separate CSS/JS files
            $cssLink = ''
            $jsLink = ''
            if (Test-Path $cssFile) {
                $cssLink = "`n  <link rel=`"stylesheet`" href=`"/live-demos/$demoName/live-demo.css`">"
            }
            if (Test-Path $jsFile) {
                $jsLink = "`n  <script src=`"/live-demos/$demoName/live-demo.js`" defer></script>"
            }
            
            # Check for config.json and voice player
            $voicePlayer = ''
            if (Test-Path $configFile) {
                $voicePlayer = "`n  <link rel=`"stylesheet`" href=`"/live-demos/voice-player.css`">`n  <script src=`"/live-demos/voice-player.js`"></script>"
            }
            
            # Build HTML
            $html = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>$($demo.title) • Live Demo</title>
  <meta name="description" content="$($demo.description)" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/assets/css/global.css">
  <link rel="stylesheet" href="/assets/css/live-demos.css">
$cssLink
$voicePlayer
  <style>
$styles
  </style>
</head>
<body class="metatron-bg">
  <div class="metatron-bg"></div>
  <div class="metatron-pattern-bg"></div>
  <canvas id="metatron-hex-canvas"></canvas>
  
$navbarHtml
  
  <main class="page">
    <header class="demo-header">
      <a class="btn-back" href="/docs.html#advanced-demos">← Back to Advanced Interactive Demos</a>
    </header>
    
    <div class="card glass">
      <h1 style="font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; margin-bottom: 0.5rem; margin-top: 0;">$($demo.title)</h1>
      <p style="opacity: 0.8; font-size: 1.1rem; margin-bottom: 2rem; margin-top: 0;">$($demo.description)</p>
      
$bodyContent
    </div>
  </main>
  
  <script src="/js/metatron-hex-network.js"></script>
$jsLink
$voicePlayer
  <script>
$scripts
  </script>
  <script>
    (function() {
      sessionStorage.setItem('returnSection', 'advanced-demos');
      sessionStorage.setItem('returnPage', '/docs.html#advanced-demos');
      
      const backBtn = document.querySelector('.btn-back');
      if (backBtn) {
        backBtn.addEventListener('click', function(e) {
          e.preventDefault();
          window.location.href = '/docs.html#advanced-demos';
        });
      }
      
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
          mobileMenu.classList.toggle('hidden');
        });
      }
    })();
  </script>
</body>
</html>
"@
            
            Set-Content -Path $indexFile -Value $html -Encoding UTF8 -NoNewline
            Write-Host "  Created: $indexFile" -ForegroundColor Green
        }
    }
}

Write-Host "`nDone!" -ForegroundColor Green

