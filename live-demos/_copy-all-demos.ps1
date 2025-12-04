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
    Write-Host "Copied voice-over audio files to $audioDest"
}

# Copy voice-player files
if (Test-Path "$oldDemosPath\voice-player.js") {
    Copy-Item "$oldDemosPath\voice-player.js" -Destination "$liveDemosPath\voice-player.js" -Force
    Write-Host "Copied voice-player.js"
}
if (Test-Path "$oldDemosPath\voice-player.css") {
    Copy-Item "$oldDemosPath\voice-player.css" -Destination "$liveDemosPath\voice-player.css" -Force
    Write-Host "Copied voice-player.css"
}

foreach ($demo in $demos) {
    $demoName = $demo.name
    $oldDemoPath = "$oldDemosPath\$demoName"
    $newDemoPath = "$liveDemosPath\$demoName"
    
    if (-not (Test-Path $oldDemoPath)) {
        Write-Host "Skipping $demoName - not found in old demoes"
        continue
    }
    
    Write-Host "Processing $demoName..."
    
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
        
        # Extract the main content (everything between body tags, excluding navbar/header)
        # Find the main content area
        if ($oldContent -match '(?s)<body[^>]*>(.*?)</body>') {
            $bodyContent = $matches[1]
            
            # Remove old navbar/header if present
            $bodyContent = $bodyContent -replace '(?s)<nav[^>]*>.*?</nav>', ''
            $bodyContent = $bodyContent -replace '(?s)<header[^>]*>.*?</header>', ''
            $bodyContent = $bodyContent -replace '(?s)<div[^>]*class="navbar"[^>]*>.*?</div>', ''
            
            # Extract style and script tags from head
            $styles = ''
            $scripts = ''
            if ($oldContent -match '(?s)<style[^>]*>(.*?)</style>') {
                $styles = $matches[1]
            }
            if ($oldContent -match '(?s)<script[^>]*>(.*?)</script>') {
                $scripts = $matches[1]
            }
            
            # Extract title and description from old content
            $title = $demo.title
            $description = $demo.description
            if ($oldContent -match '<title[^>]*>(.*?)</title>') {
                $title = $matches[1] -replace 'Daena AI - |Demo', '' -replace '\s+', ' ' -replace '^\s+|\s+$', ''
            }
            if ($oldContent -match '<meta[^>]*name="description"[^>]*content="([^"]*)"') {
                $description = $matches[1]
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
$styles
  </style>
</head>
<body class="metatron-bg">
  <!-- Metatron Background Layers -->
  <div class="metatron-bg"></div>
  <div class="metatron-pattern-bg"></div>
  <canvas id="metatron-hex-canvas"></canvas>
  
  <header class="topbar glass">
    <a class="brand" href="/">Daena</a>
    <nav>
      <a href="/">Home</a>
      <a href="/#demos">Demos</a>
      <a href="/#pitch">Pitch Deck</a>
      <a href="/docs.html#advanced-demos">Live Demos</a>
      <a href="/docs.html">Docs & Benchmarks</a>
      <a href="/#contact">Contact</a>
    </nav>
  </header>
  <main class="container">
    <a class="back-link" href="/docs.html#advanced-demos" id="back-to-demos">← Back to Demos</a>
    <h1>$title</h1>
    <p class="subtle">$description</p>
    <div class="glass-card" style="padding: 2rem; margin-top: 1rem; overflow: visible;">
      $bodyContent
    </div>
  </main>
  
  <script src="/js/metatron-hex-network.js"></script>
  <script src="/live-demos/voice-player.js"></script>
  <script>
$scripts
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
    })();
  </script>
</body>
</html>
"@
            
            Set-Content $newIndexFile -Value $newHtml -Encoding UTF8 -NoNewline
            Write-Host "  Created $newIndexFile"
        }
    }
    
    # Copy config.json if exists
    if (Test-Path "$oldDemoPath\config.json") {
        Copy-Item "$oldDemoPath\config.json" -Destination "$newDemoPath\config.json" -Force
        Write-Host "  Copied config.json"
    }
    
    # Copy CSS files if they exist separately
    if (Test-Path "$oldDemoPath\live-demo.css") {
        Copy-Item "$oldDemoPath\live-demo.css" -Destination "$newDemoPath\live-demo.css" -Force
        Write-Host "  Copied live-demo.css"
    }
    
    # Copy JS files if they exist separately
    if (Test-Path "$oldDemoPath\live-demo.js") {
        Copy-Item "$oldDemoPath\live-demo.js" -Destination "$newDemoPath\live-demo.js" -Force
        Write-Host "  Copied live-demo.js"
    }
}

Write-Host "`nAll demos copied successfully!"

