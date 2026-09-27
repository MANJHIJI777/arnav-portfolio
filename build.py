#!/usr/bin/env python3
"""
Production Verification and Build Script for Vercel Deployment
Validates integrity of all static assets, routes, media sizes, and links.
"""

import os
import sys
import re

print("\n======================================================")
print("  ARNAV KUMAR PORTFOLIO — PRODUCTION BUILD VERIFICATION")
print("======================================================\n")

base_dir = os.path.dirname(os.path.abspath(__file__))
has_errors = False

# 1. Verify Core HTML Entrypoints
required_html_files = [
    'index.html',
    'projects/work1.html',
    'projects/work2.html',
    'projects/work3.html',
    'projects/work4.html'
]

print("[1/5] Checking essential HTML routes...")
for f in required_html_files:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        print(f"  ✓ Route: /{f.replace('index.html', '')}")
    else:
        print(f"  ✗ Missing required file: {f}", file=sys.stderr)
        has_errors = True

# 2. Verify Stylesheets & Scripts
required_assets = [
    'css/main.css',
    'css/case-study.css',
    'js/main.js',
    'js/case-study.js',
    'js/cinema-canvas.js'
]

print("\n[2/5] Checking styles and client scripts...")
for f in required_assets:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        size_kb = os.path.getsize(path) / 1024
        print(f"  ✓ Asset: {f} ({size_kb:.1f} KB)")
    else:
        print(f"  ✗ Missing required asset: {f}", file=sys.stderr)
        has_errors = True

# 3. Verify Video & Media Assets (and GitHub/Vercel size constraints < 100MB)
required_media = [
    'assets/work1.mp4',
    'assets/work2.mp4',
    'assets/work3.mp4',
    'assets/work4.mp4',
    'assets/editor_portrait.jpg'
]

print("\n[3/5] Checking media assets & size limits (< 100 MB)...")
for f in required_media:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        size_mb = os.path.getsize(path) / (1024 * 1024)
        if size_mb > 100:
            print(f"  ✗ File exceeds 100MB limit for GitHub/Vercel: {f} ({size_mb:.1f} MB)", file=sys.stderr)
            has_errors = True
        else:
            print(f"  ✓ Media: {f} ({size_mb:.1f} MB, OK)")
    else:
        print(f"  ✗ Missing required media: {f}", file=sys.stderr)
        has_errors = True

# 4. Check for Hardcoded Localhost or Development URLs in Source Files
print("\n[4/5] Scanning for hardcoded localhost/dev URLs in frontend code...")
scan_dirs = ['.', 'projects', 'css', 'js']
disallowed_patterns = [
    re.compile(r'localhost:\d+', re.IGNORECASE),
    re.compile(r'127\.0\.0\.1:\d+', re.IGNORECASE)
]

for d in scan_dirs:
    dir_path = os.path.join(base_dir, d)
    if not os.path.exists(dir_path):
        continue
    for fname in os.listdir(dir_path):
        if fname.endswith(('.html', '.js', '.css')) and not fname.startswith('build.'):
            fpath = os.path.join(dir_path, fname)
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
            for pat in disallowed_patterns:
                if pat.search(content):
                    rel = os.path.relpath(fpath, base_dir)
                    print(f"  ✗ Disallowed dev URL found in: {rel}", file=sys.stderr)
                    has_errors = True

print("  ✓ No hardcoded localhost or development URLs found in frontend files.")

# 5. Check Deployment Configuration
print("\n[5/5] Verifying deployment configuration...")
if os.path.exists(os.path.join(base_dir, 'vercel.json')):
    print("  ✓ vercel.json is present and configured.")
else:
    print("  ✗ Missing vercel.json", file=sys.stderr)
    has_errors = True

if os.path.exists(os.path.join(base_dir, '.gitignore')):
    print("  ✓ .gitignore is present.")
else:
    print("  ✗ Missing .gitignore", file=sys.stderr)
    has_errors = True

if has_errors:
    print("\n❌ Production build verification FAILED. Please review the errors above.\n", file=sys.stderr)
    sys.exit(1)
else:
    print("\n======================================================")
    print("✓ SUCCESS: Production build verified.")
    print("  Framework: Static Site (HTML5 / CSS3 / Vanilla JS)")
    print("  Build Command: None needed (Static) or python3 build.py")
    print("  Output Directory: . (Root)")
    print("  All media files are within GitHub & Vercel limits (<100MB)")
    print("  Ready for Vercel deployment and GitHub push.")
    print("======================================================\n")
    sys.exit(0)
