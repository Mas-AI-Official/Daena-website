# Fix agent-communication demo HTML structure
$file = "live-demos\agent-communication\index.html"
$content = Get-Content $file -Raw

# Fix the broken HTML structure
$content = $content -replace '(?s)</div></div></div></div><!-- Communication Log -->', '</div></div></div></div><!-- Communication Log -->'
$content = $content -replace '(?s)</div></div><!-- Stats Dashboard -->', '</div></div><!-- Stats Dashboard -->'
$content = $content -replace '(?s)<div class="stat-label">Total Messages</div></div>', '<div class="stat-label">Total Messages</div></div>'
$content = $content -replace '(?s)<div class="stat-label">Cross-Department</div></div><div class="stat-card">', '<div class="stat-label">Cross-Department</div></div><div class="stat-card">'
$content = $content -replace '(?s)</div></div><!-- Audio Controls -->', '</div></div><!-- Audio Controls -->'

# Fix the specific broken section
$content = $content -replace '(?s)<div class="agent-mini" id="prod-exec">Exec</div></div></div></div><!-- Communication Log -->', '<div class="agent-mini" id="prod-exec">Exec</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Communication Log -->'

$content = $content -replace '(?s)<div class="communication-log">\s*<h3 class="log-title">[^<]*</h3>\s*<div id="communication-log">\s*<p[^>]*>[^<]*</p></div></div><!-- Stats Dashboard -->', '<div class="communication-log">
            <h3 class="log-title">🤝 Agent Communication Log</h3>
            <div id="communication-log">
                <p style="color: #999; font-style: italic; text-align: center; padding: 2rem;">
                    Agent communications will appear here when demo executes...
                </p>
            </div>
        </div>

        <!-- Stats Dashboard -->'

$content = $content -replace '(?s)<div class="stat-label">Total Messages</div></div>', '<div class="stat-label">Total Messages</div>
            </div>'

$content = $content -replace '(?s)<div class="stat-label">Cross-Department</div></div><div class="stat-card">', '<div class="stat-label">Cross-Department</div>
            </div>
            <div class="stat-card">'

$content = $content -replace '(?s)</div></div><!-- Audio Controls -->', '</div>
        </div>

        <!-- Audio Controls -->'

Set-Content $file -Value $content -NoNewline
Write-Host "Fixed agent-communication HTML structure"

