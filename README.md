# YouTube Downloader

Ein moderner YouTube Downloader mit eleganter Benutzeroberfläche.

## Installation

### 1. Python installieren
Stelle sicher, dass Python 3.8 oder höher installiert ist.

### 2. Abhängigkeiten installieren

```bash
pip install -r requirements.txt
```

### 3. FFmpeg installieren (wichtig für MP3-Konvertierung)

**Windows:**
1. Lade FFmpeg von https://www.gyan.dev/ffmpeg/builds/ herunter
2. Entpacke die Datei
3. Füge den `bin` Ordner zum System PATH hinzu

**Oder mit Chocolatey:**
```bash
choco install ffmpeg
```

**Oder mit Scoop:**
```bash
scoop install ffmpeg
```

## Verwendung

Starte die Anwendung mit:

```bash
python app.py
```

## Features

- ✅ YouTube Videos herunterladen in verschiedenen Qualitäten (360p - 1080p)
- ✅ Audio als MP3 extrahieren (128 - 320 kbps)
- ✅ Live-Vorschau der Video-Informationen
- ✅ Automatischer Download in den Windows Downloads-Ordner
- ✅ Moderne, animierte Benutzeroberfläche
- ✅ Echtzeit-Fortschrittsanzeige (in Konsole)
- ✅ **H.264 Codec** für maximale Kompatibilität (funktioniert ohne extra Codecs)

## Dateistruktur

```
youtube-downloader/
│
├── app.py              # Hauptanwendung (startet das Fenster)
├── api.py              # Backend-Logik (yt-dlp Integration)
├── index.html          # HTML-Struktur
├── style.css           # Styling
├── script.js           # Frontend-Logik
└── requirements.txt    # Python-Abhängigkeiten
```

## Technologien

- **Backend:** Python, yt-dlp, pywebview
- **Frontend:** HTML, CSS, JavaScript
- **Design:** Custom CSS mit Animationen

## Wichtige Hinweise

- Die heruntergeladenen Dateien werden automatisch im Windows Downloads-Ordner gespeichert
- FFmpeg wird für MP3-Konvertierung benötigt
- Bei großen Videos kann der Download etwas dauern
- **Videos werden im H.264-Format heruntergeladen** - funktioniert direkt auf jedem Windows-PC ohne zusätzliche Codecs (kein AV1 Codec Pack nötig!)

## Fehlerbehebung

**"FFmpeg nicht gefunden":**
- Installiere FFmpeg und stelle sicher, dass es im System PATH ist

**"Video kann nicht heruntergeladen werden":**
- Überprüfe die URL
- Stelle sicher, dass das Video nicht privat oder geografisch eingeschränkt ist
- Aktualisiere yt-dlp: `pip install --upgrade yt-dlp`

## Lizenz

Privates Projekt - Nur für den persönlichen Gebrauch.