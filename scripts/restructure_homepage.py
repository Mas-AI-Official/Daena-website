#!/usr/bin/env python3
"""
Restructure homepage to keep only requested sections
"""

import re

# Read the current index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Sections to KEEP on homepage:
# 1. What Daena Can Do For You (id="benefits")
# 2. Latest Revolutionary Features (id="latest-features")
# 3. Agent Communication Visualization (id="agent-communication-viz")
# 4. Why Daena Beats the Competition (id="how-we-compare")
# 5. Live Interactive Demos (id="demos")
# 6. Recorded Demo Videos (class="recorded-demos")
# 7. Investor Presentation (need to find)
# 8. Ready to Transform Your Business? (id="contact")

# Find and extract sections
sections_to_keep = [
    r'<!-- What Daena Can Do For You Section -->.*?</section>',
    r'<!-- Latest Features Section -->.*?</section>',
    r'<!-- .*Agent Communication Visualization.*?-->.*?</section>',
    r'<!-- .*Why Daena Beats.*?-->.*?</section>',
    r'<!-- Demo Section -->.*?</section>',
    r'<!-- Recorded Demos Section -->.*?</section>',
    r'<!-- .*Investor Presentation.*?-->.*?</section>',
    r'<!-- Contact Section -->.*?</section>',
]

print("This script will help identify sections. Manual restructuring recommended.")
print("Sections found:")

for pattern in sections_to_keep:
    matches = re.findall(pattern, content, re.DOTALL)
    if matches:
        print(f"Found: {len(matches)} matches")
    else:
        print(f"Not found: {pattern[:50]}...")

