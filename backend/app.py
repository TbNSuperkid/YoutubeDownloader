# -*- coding: utf-8 -*-
"""
YouTube Downloader - Hauptprogramm
Startet die Desktop-App
"""

import webview
from api import Api
import os
import sys


def resource_path(relative_path):
    """
    Gibt den absoluten Pfad zur Ressource zurueck.
    Funktioniert sowohl im Development als auch als .exe
    """
    try:
        # PyInstaller erstellt einen temp folder und speichert den Pfad in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        # Wenn nicht als .exe gestartet, nutze normalen Pfad
        base_path = os.path.abspath(".")
    
    return os.path.join(base_path, relative_path)
icon_path = resource_path("frontend/assets/icon.ico")
html_path = resource_path("index.html")

if __name__ == "__main__":
    api = Api()

    webview.create_window(
        title="Youtube Downloader",
        url=html_path,
        js_api=api,
        maximized=True,
        resizable=True,
       
    )

    webview.start( icon=icon_path)
