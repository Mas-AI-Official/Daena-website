# Script to generate demo pages from old demoes
$demos = @(
    @{name="agent-communication"; title="Agent Communication"; desc="Visualize the Metatron mesh and observe messages traversing 13 interconnected nodes"; audio="Demo 1 Agent Communication.mp3"},
    @{name="budget-calculation"; title="Budget Calculation"; desc="Watch Daena's Finance agents analyze and calculate budgets with precision"; audio="Demo 2 Budget Calculation.mp3"},
    @{name="cmp-pipeline"; title="CMP Pipeline"; desc="Experience the complete Council-Memory-Process pipeline in action"; audio="Demo 3 CMP Pipeline.mp3"},
    @{name="patent-technology"; title="Patent Technology"; desc="Explore Daena's patent-pending NBMF and Enterprise-DNA technologies"; audio="Demo 4 Patent Technology.mp3"},
    @{name="patent-enhanced"; title="Patent Technology Enhanced"; desc="Deep dive into enhanced patent-pending technologies"; audio="Demo 5 Patent Technology Enhanced.mp3"},
    @{name="real-scenario"; title="Real Scenario"; desc="See Daena handle complex real-world business scenarios"; audio="Demo 7 Real Scenario.mp3"},
    @{name="real-talk"; title="Real Talk"; desc="Natural conversation with Daena demonstrating VP-level intelligence"; audio="Demo 6 Real Talk.mp3"},
    @{name="sunflower-honeycomb"; title="Sunflower-Honeycomb"; desc="Visualize the core architecture that powers Daena's decision-making"; audio=""}
)

foreach ($demo in $demos) {
    $demoPath = "live-demos\$($demo.name)\index.html"
    $oldDemoPath = "old demoes\$($demo.name)\demo.html"
    
    if (Test-Path $oldDemoPath) {
        $oldContent = Get-Content $oldDemoPath -Raw
        
        # Extract body content (between <body> and </body>)
        if ($oldContent -match '(?s)<body[^>]*>(.*)</body>') {
            $bodyContent = $matches[1]
            
            # Create new page
            $newPage = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>$($demo.title) • Live Demo</title>
  <link rel="stylesheet" href="/assets/css/global.css">
  <link rel="stylesheet" href="/live-demos/_shared.css">
  <link rel="stylesheet" href="/old demoes/$($demo.name)/live-demo.css">
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
      <a href="/demos.html">Demos</a>
      <a href="/pitch-deck.html">Pitch Deck</a>
      <a class="active" href="/live-demos/">Live Demos</a>
      <a href="/docs.html">Docs & Benchmarks</a>
      <a href="/#contact">Contact</a>
    </nav>
  </header>
  <main class="container">
    <a class="back-link" href="/live-demos/" id="back-to-demos">← Back to Demos</a>
    <h1>$($demo.title)</h1>
    <p class="subtle">$($demo.desc)</p>
    <div class="glass-card" style="padding:1rem; margin-top: 1rem; overflow: visible;">
      $bodyContent
    </div>
    $(if ($demo.audio) { "<audio controls src=`"/live-demos/audio/$($demo.audio)`" style=`"margin-top:1rem;width:100%`"></audio>" })
  </main>
  
  <script src="/js/metatron-hex-network.js"></script>
  <script src="/old demoes/$($demo.name)/live-demo.js"></script>
  <script>
    // Smart back navigation
    (function() {
      const returnSection = sessionStorage.getItem('returnSection') || 'live-demos';
      const returnPage = sessionStorage.getItem('returnPage') || '/live-demos/';
      
      document.getElementById('back-to-demos').addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('returnSection');
        sessionStorage.removeItem('returnPage');
        window.location.href = returnPage;
      });
    })();
  </script>
</body>
</html>
"@
            Set-Content -Path $demoPath -Value $newPage -Encoding UTF8
            Write-Host "Created: $demoPath"
        }
    } else {
        Write-Host "Warning: $oldDemoPath not found"
    }
}

Write-Host "Demo generation complete!"

