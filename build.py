"""
Build-Script für YouTube Downloader
Erstellt eine standalone .exe mit PyInstaller
"""

import PyInstaller.__main__
import os
import sys

# Aktuelles Verzeichnis
current_dir = os.path.dirname(os.path.abspath(__file__))

# PyInstaller Optionen
PyInstaller.__main__.run([
    'backend/app.py',                  # Hauptdatei im backend Ordner
    '--name=YouTubeDownloader',       # Name der .exe
    '--onefile',                       # Alles in eine Datei
    '--windowed',                      # Kein Konsolen-Fenster
    '--icon=frontend/assets/icon.ico',                     # Optional: Pfad zu .ico Datei
    
    # Füge alle benötigten Dateien hinzu (aus frontend/)
    '--add-data=frontend/index.html;.',
    '--add-data=frontend/style.css;.',
    '--add-data=frontend/script.js;.',
    
    # Versteckte Imports (wichtig für yt-dlp)
    '--hidden-import=yt_dlp',
    '--hidden-import=yt_dlp.extractor',
    '--hidden-import=yt_dlp.downloader',
    '--hidden-import=certifi',
    '--hidden-import=websocket',
    '--hidden-import=mutagen',
    '--collect-all=yt_dlp',
    
    # Python Path für backend Ordner
    '--paths=backend',
    
    # Optimierungen
    '--clean',                         # Lösche Cache vor Build
    '--noconfirm',                     # Überschreibe ohne Frage
    
    # Output-Verzeichnis
    '--distpath=dist',
    '--workpath=build',
    '--specpath=.',
])

print("\n" + "="*60)
print("✓ Build erfolgreich abgeschlossen!")
print("="*60)
print(f"\nDeine .exe befindet sich hier:")
print(f"  → {os.path.join(current_dir, 'dist', 'YouTubeDownloader.exe')}")
print("\nDie .exe ist standalone und benötigt keine Installation!")
print("="*60)