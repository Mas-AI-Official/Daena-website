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
  <link rel="stylesheet" href="/live-demos/$($demo.name)/live-demo.css">
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
      </div>
    </div>
  </nav>
  <main class="container" style="margin-top: 100px;">
    <a class="back-link" href="/docs.html#advanced-demos" id="back-to-demos" style="display: inline-block; margin-bottom: 1rem; padding: 0.5rem 1rem; background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 8px; text-decoration: none; color: #FFD700;">← Back to Advanced Interactive Demos</a>
    <h1>$($demo.title)</h1>
    <p class="subtle">$($demo.desc)</p>
    <div class="glass-card" style="padding:1rem; margin-top: 1rem; overflow: visible;">
      $bodyContent
    </div>
    $(if ($demo.audio) { "<audio controls src=`"/live-demos/audio/$($demo.audio)`" style=`"margin-top:1rem;width:100%`"></audio>" })
  </main>
  
  <script src="/js/metatron-hex-network.js"></script>
  <script src="/live-demos/$($demo.name)/live-demo.js"></script>
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
            Set-Content -Path $demoPath -Value $newPage -Encoding UTF8
            Write-Host "Created: $demoPath"
        }
    } else {
        Write-Host "Warning: $oldDemoPath not found"
    }
}

Write-Host "Demo generation complete!"

