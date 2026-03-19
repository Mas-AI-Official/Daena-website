import os
import re

NAVBAR_HTML = """
    <!-- Standard Navbar -->
    <nav class="fixed w-full z-50 transition-all duration-300" id="navbar" style="background: rgba(15, 15, 35, 0.95); backdrop-filter: blur(20px); border-bottom: 2px solid rgba(255, 215, 0, 0.3);">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-20">
                <!-- Logo -->
                <div class="flex-shrink-0">
                    <a href="/" class="flex items-center gap-2 group">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-400/20 group-hover:shadow-yellow-400/40 transition-all duration-300">
                            <span class="text-black font-bold text-xl">D</span>
                        </div>
                        <span class="font-bold text-xl tracking-tight text-white group-hover:text-yellow-400 transition-colors">DAENA</span>
                    </a>
                </div>
                
                <!-- Desktop Menu -->
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-8">
                        <a href="/#features" class="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
                        <a href="/#technology" class="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Technology</a>
                        <a href="/docs.html#advanced-demos" class="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Live Demos</a>
                        <a href="/docs.html" class="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Docs</a>
                    </div>
                </div>

                <!-- Mobile menu button -->
                <div class="-mr-2 flex md:hidden">
                    <button type="button" id="mobile-menu-btn" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span class="sr-only">Open main menu</span>
                        <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div class="hidden md:hidden" id="mobile-menu">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 backdrop-blur-md">
                <a href="/#features" class="text-gray-300 hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium">Features</a>
                <a href="/#technology" class="text-gray-300 hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium">Technology</a>
                <a href="/docs.html#advanced-demos" class="text-gray-300 hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium">Live Demos</a>
                <a href="/docs.html" class="text-gray-300 hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium">Docs</a>
            </div>
        </div>
    </nav>
    <script>
        // Mobile menu toggle
        document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });
    </script>
"""

HEAD_INJECTIONS = """
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Global CSS -->
    <link rel="stylesheet" href="/assets/css/global.css">
    
    <!-- Metatron Background Script -->
    <script src="/js/metatron-hex-network.js"></script>
"""

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Inject Head Content
    if "metatron-hex-network.js" not in content:
        # Use regex to replace </head> case-insensitively
        content = re.sub(r'</head>', HEAD_INJECTIONS + "\n</head>", content, flags=re.IGNORECASE)

    # Remove old navbar (div class="navbar" or nav class="navbar")
    content = re.sub(r'<nav class="navbar">.*?</nav>', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'<div class="navbar">.*?</div>', '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove old animated background if present
    content = re.sub(r'<div class="animated-bg">.*?</div>', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'<div class="animated-bg"></div>', '', content, flags=re.IGNORECASE)

    # Inject New Navbar after <body>
    if 'id="navbar"' not in content:
        content = re.sub(r'<body>', "<body>\n" + NAVBAR_HTML, content, flags=re.IGNORECASE)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes for {filepath}")

def main():
    root_dir = r"d:\Ideas\daena-website\live-demos"
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file == "index.html":
                filepath = os.path.join(subdir, file)
                update_file(filepath)

if __name__ == "__main__":
    main()
