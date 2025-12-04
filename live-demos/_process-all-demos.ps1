# Process all demos - create index.html with new layout
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

foreach ($demo in $demos) {
    $demoName = $demo.name
    $oldFile = "old demoes\$demoName\demo.html"
    $newFile = "live-demos\$demoName\index.html"
    
    if (Test-Path $oldFile) {
        Write-Host "Processing: $demoName" -ForegroundColor Cyan
        
        $content = Get-Content $oldFile -Raw -Encoding UTF8
        
        # Extract body content
        if ($content -match '(?s)<body[^>]*>(.*?)</body>') {
            $body = $matches[1]
            
            # Remove old navigation/headers
            $body = $body -replace '(?s)<nav[^>]*>.*?</nav>', ''
            $body = $body -replace '(?s)<header[^>]*>.*?</header>', ''
            $body = $body -replace '(?s)<div[^>]*class="navbar"[^>]*>.*?</div>', ''
            $body = $body -replace '(?s)<div[^>]*class="demo-header"[^>]*>.*?</div>', ''
            $body = $body -replace '(?s)<h1[^>]*class="demo-title"[^>]*>.*?</h1>', ''
            $body = $body -replace '(?s)<p[^>]*class="demo-subtitle"[^>]*>.*?</p>', ''
            
            # Extract styles and scripts
            $styles = ''
            $styleMatches = [regex]::Matches($content, '(?s)<style[^>]*>(.*?)</style>')
            foreach ($match in $styleMatches) {
                $styles += $match.Groups[1].Value + "`n"
            }
            
            $scripts = ''
            $scriptMatches = [regex]::Matches($content, '(?s)<script(?![^>]*src=)[^>]*>(.*?)</script>')
            foreach ($match in $scriptMatches) {
                $scriptContent = $match.Groups[1].Value
                if ($scriptContent -notmatch 'skin\.js|daena-skin') {
                    $scripts += $scriptContent + "`n"
                }
            }
            
            # Check for config.json
            $hasConfig = Test-Path "live-demos\$demoName\config.json"
            $voicePlayer = ''
            if ($hasConfig) {
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
  <link rel="stylesheet" href="/live-demos/_shared.css">
$voicePlayer
  <style>
$styles
  </style>
</head>
<body class="metatron-bg">
  <div class="metatron-bg"></div>
  <div class="metatron-pattern-bg"></div>
  <canvas id="metatron-hex-canvas"></canvas>
  
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
  
  <main class="container" style="margin-top: 100px; padding: 2rem 1rem;">
    <a class="back-link" href="/docs.html#advanced-demos" id="back-to-demos" style="display: inline-block; margin-bottom: 1rem; padding: 0.5rem 1rem; background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 8px; text-decoration: none; color: #FFD700; transition: all 0.3s;">← Back to Advanced Interactive Demos</a>
    <h1 style="font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; margin-bottom: 0.5rem;">$($demo.title)</h1>
    <p class="subtle" style="opacity: 0.8; font-size: 1.1rem; margin-bottom: 2rem;">$($demo.description)</p>
    <div class="glass-card" style="padding: 2rem; margin-top: 1rem; overflow: visible;">
$body
    </div>
  </main>
  
  <script src="/js/metatron-hex-network.js"></script>
$voicePlayer
  <script>
$scripts
  </script>
  <script>
    (function() {
      sessionStorage.setItem('returnSection', 'advanced-demos');
      sessionStorage.setItem('returnPage', '/docs.html#advanced-demos');
      const backBtn = document.getElementById('back-to-demos');
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
            
            Set-Content -Path $newFile -Value $html -Encoding UTF8 -NoNewline
            Write-Host "  Created: $newFile" -ForegroundColor Green
        }
    }
}

Write-Host "`nDone!" -ForegroundColor Green

