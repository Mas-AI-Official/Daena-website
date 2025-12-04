# Simple rebuild script - delete existing and copy from old demoes, then apply new layout
Write-Host "Starting demo rebuild..." -ForegroundColor Cyan

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

# Step 1: Delete existing demo folders
Write-Host "`nStep 1: Deleting existing demos..." -ForegroundColor Yellow
foreach ($demo in $demos) {
    $demoPath = "live-demos\$($demo.name)"
    if (Test-Path $demoPath) {
        Remove-Item -Path $demoPath -Recurse -Force
        Write-Host "  Deleted: $($demo.name)" -ForegroundColor Gray
    }
}

# Step 2: Copy from old demoes
Write-Host "`nStep 2: Copying from old demoes..." -ForegroundColor Yellow
foreach ($demo in $demos) {
    $oldPath = "old demoes\$($demo.name)"
    $newPath = "live-demos\$($demo.name)"
    
    if (Test-Path $oldPath) {
        New-Item -ItemType Directory -Path $newPath -Force | Out-Null
        Copy-Item -Path "$oldPath\*" -Destination $newPath -Recurse -Force
        Write-Host "  Copied: $($demo.name)" -ForegroundColor Green
    }
}

# Step 3: Use existing _generate-demos.ps1 but update it
Write-Host "`nStep 3: Generating new index.html files..." -ForegroundColor Yellow
Write-Host "  Using _generate-demos.ps1 approach..." -ForegroundColor Gray

# Now run the existing _generate-demos.ps1 which should work
& "live-demos\_generate-demos.ps1"

Write-Host "`n✓ Rebuild complete!" -ForegroundColor Green

