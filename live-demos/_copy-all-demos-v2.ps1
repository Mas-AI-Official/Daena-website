# Copy all demos from old demoes to live-demos with new layout
$oldDemosPath = "old demoes"
$liveDemosPath = "live-demos"
$voiceOverPath = "old demoes\voice-over-demos"

# List of all demos to copy
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

# Copy voice-over audio files
if (Test-Path $voiceOverPath) {
    $audioDest = "$liveDemosPath\audio"
    if (-not (Test-Path $audioDest)) {
        New-Item -ItemType Directory -Path $audioDest -Force | Out-Null
    }
    Copy-Item "$voiceOverPath\*" -Destination $audioDest -Force
    Write-Host "✓ Copied voice-over audio files to $audioDest"
}

# Copy voice-player files
if (Test-Path "$oldDemosPath\voice-player.js") {
    Copy-Item "$oldDemosPath\voice-player.js" -Destination "$liveDemosPath\voice-player.js" -Force
    Write-Host "✓ Copied voice-player.js"
}
if (Test-Path "$oldDemosPath\voice-player.css") {
    Copy-Item "$oldDemosPath\voice-player.css" -Destination "$liveDemosPath\voice-player.css" -Force
    Write-Host "✓ Copied voice-player.css"
}

foreach ($demo in $demos) {
    $demoName = $demo.name
    $oldDemoPath = "$oldDemosPath\$demoName"
    $newDemoPath = "$liveDemosPath\$demoName"
    
    if (-not (Test-Path $oldDemoPath)) {
        Write-Host "⚠ Skipping $demoName - not found in old demoes"
        continue
    }
    
    Write-Host "`n📁 Processing $demoName..."
    
    # Create directory if it doesn't exist
    if (-not (Test-Path $newDemoPath)) {
        New-Item -ItemType Directory -Path $newDemoPath -Force | Out-Null
    }
    
    # Copy demo.html to index.html
    $oldDemoFile = "$oldDemoPath\demo.html"
    if (Test-Path $oldDemoFile) {
        $newIndexFile = "$newDemoPath\index.html"
        
        # Read the old demo HTML
        $oldContent = Get-Content $oldDemoFile -Raw -Encoding UTF8
        
        # Extract title and description
        $title = $demo.title
        $description = $demo.description
        if ($oldContent -match '<title[^>]*>(.*?)</title>') {
            $title = $matches[1] -replace 'Daena AI - |Demo', '' -replace '\s+', ' ' -replace '^\s+|\s+$', ''
        }
        if ($oldContent -match '<meta[^>]*name="description"[^>]*content="([^"]*)"') {
            $description = $matches[1]
        }
        
        # Extract all style blocks
        $allStyles = ''
        $styleMatches = [regex]::Matches($oldContent, '(?s)<style[^>]*>(.*?)</style>')
        foreach ($match in $styleMatches) {
            $allStyles += $match.Groups[1].Value + "`n"
        }
        
        # Extract all script blocks (but exclude the skin scripts)
        $allScripts = ''
        $scriptMatches = [regex]::Matches($oldContent, '(?s)<script[^>]*>(.*?)</script>')
        foreach ($match in $scriptMatches) {
            $scriptContent = $match.Groups[1].Value
            # Skip skin scripts
            if ($scriptContent -notmatch 'skin\.js|daena-skin') {
                $allScripts += $scriptContent + "`n"
            }
        }
        
        # Extract body content - get everything between <body> and </body>
        $bodyContent = ''
        if ($oldContent -match '(?s)<body[^>]*>(.*?)</body>') {
            $bodyContent = $matches[1]
            
            # Remove old navigation/header elements
            $bodyContent = $bodyContent -replace '(?s)<nav[^>]*class="navbar"[^>]*>.*?</nav>', ''
            $bodyContent = $bodyContent -replace '(?s)<header[^>]*>.*?</header>', ''
            $bodyContent = $bodyContent -replace '(?s)<div[^>]*class="navbar"[^>]*>.*?</div>', ''
            $bodyContent = $bodyContent -replace '(?s)<div[^>]*class="nav-container"[^>]*>.*?</div>', ''
            $bodyContent = $bodyContent -replace '(?s)<div[^>]*class="nav-buttons"[^>]*>.*?</div>', ''
            $bodyContent = $bodyContent -replace '(?s)<a[^>]*class="back-button"[^>]*>.*?</a>', ''
            $bodyContent = $bodyContent -replace '(?s)<a[^>]*class="logo"[^>]*>.*?</a>', ''
            
            # Remove demo-header if it exists (we'll use the main page header)
            $bodyContent = $bodyContent -replace '(?s)<div[^>]*class="demo-header"[^>]*>.*?</div>', ''
            $bodyContent = $bodyContent -replace '(?s)<h1[^>]*class="demo-title"[^>]*>.*?</h1>', ''
            $bodyContent = $bodyContent -replace '(?s)<p[^>]*class="demo-subtitle"[^>]*>.*?</p>', ''
        }
        
        # Create new HTML with new layout
        $newHtml = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>$title • Live Demo</title>
  <meta name="description" content="$description" />
  <link rel="stylesheet" href="/assets/css/global.css">
  <link rel="stylesheet" href="/live-demos/_shared.css">
  <link rel="stylesheet" href="/live-demos/voice-player.css">
  <style>
$allStyles
  </style>
</head>
<body class="metatron-bg">
  <!-- Metatron Background Layers -->
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
    <h1>$title</h1>
    <p class="subtle">$description</p>
    <div class="glass-card" style="padding: 2rem; margin-top: 1rem; overflow: visible;">
      $bodyContent
    </div>
  </main>
  
  <script src="/js/metatron-hex-network.js"></script>
  <script src="/live-demos/voice-player.js"></script>
  <script>
$allScripts
  </script>
  <script>
    // Smart back navigation
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
      
      // Mobile menu toggle
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
            
            Set-Content $newIndexFile -Value $newHtml -Encoding UTF8 -NoNewline
            Write-Host "  ✓ Created $newIndexFile"
        } else {
            Write-Host "  ⚠ demo.html not found for $demoName"
        }
    }
    
    # Copy config.json if exists
    if (Test-Path "$oldDemoPath\config.json") {
        Copy-Item "$oldDemoPath\config.json" -Destination "$newDemoPath\config.json" -Force
        Write-Host "  ✓ Copied config.json"
    }
    
    # Copy CSS files if they exist separately
    if (Test-Path "$oldDemoPath\live-demo.css") {
        Copy-Item "$oldDemoPath\live-demo.css" -Destination "$newDemoPath\live-demo.css" -Force
        Write-Host "  ✓ Copied live-demo.css"
    }
    
    # Copy JS files if they exist separately
    if (Test-Path "$oldDemoPath\live-demo.js") {
        Copy-Item "$oldDemoPath\live-demo.js" -Destination "$newDemoPath\live-demo.js" -Force
        Write-Host "  ✓ Copied live-demo.js"
    }
}

Write-Host "`n✅ All demos copied successfully!"

