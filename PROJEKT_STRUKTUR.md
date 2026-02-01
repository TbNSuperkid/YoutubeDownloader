# 📁 Projekt-Struktur

## ✅ Deine Ordnerstruktur (Backend/Frontend getrennt):

```
YOUTUBE_DOWNLOADER/              ← Hauptordner
│
├── 📁 backend/                  ← Python Backend
│   ├── app.py                   ← Hauptprogramm
│   └── api.py                   ← Backend-Logik
│
├── 📁 frontend/                 ← HTML/CSS/JS Frontend
│   ├── index.html               ← HTML-Struktur
│   ├── style.css                ← Styling
│   ├── script.js                ← JavaScript-Logik
│   └── 📁 assets/               ← (Optional) Icons, Bilder
│       ├── icon.ico
│       └── icon.png
│
├── 📁 downloads/                ← (Wird automatisch erstellt)
│
├── 📄 requirements.txt          ← Python-Abhängigkeiten
├── 📄 build.py                  ← Build-Script
├── 📄 build.bat                 ← Windows Batch-File
├── 📄 YouTube-Downloader.spec   ← PyInstaller Config
│
├── 📄 .gitignore                ← Git ignorieren
├── 📖 README.md                 ← Hauptdokumentation
├── 📖 BUILD_ANLEITUNG.md        ← Build-Anleitung
└── 📖 SCHNELLSTART.md           ← Quick-Start
```

## 🎯 Dateien platzieren:

### Backend-Ordner (`backend/`):
```
backend/
├── app.py    ← Von outputs kopieren
└── api.py    ← Von outputs kopieren
```

### Frontend-Ordner (`frontend/`):
```
frontend/
├── index.html    ← Von outputs kopieren
├── style.css     ← Von outputs kopieren
└── script.js     ← Von outputs kopieren
```

### Hauptordner (Root):
```
YouTube_Downloader/
├── requirements.txt           ← Von outputs kopieren
├── build.py                   ← Von outputs kopieren
├── build.bat                  ← Von outputs kopieren
├── YouTube-Downloader.spec    ← Von outputs kopieren
└── README.md                  ← Von outputs kopieren
```

## 🚀 Build-Prozess:

### 1. Abhängigkeiten installieren
```bash
# Im Hauptordner (YOUTUBE_DOWNLOADER/)
pip install -r requirements.txt
```

### 2. EXE erstellen
```bash
# Option 1: Batch-File (Doppelklick)
build.bat

# Option 2: Python-Script
python build.py

# Option 3: Manuell mit spec
pyinstaller YouTube-Downloader.spec
```

### 3. Ergebnis
```
YOUTUBE_DOWNLOADER/
├── backend/
├── frontend/
├── build/          ← Temporäre Dateien (kannst löschen)
└── dist/           ← HIER IST DEINE .EXE! 🎉
    └── YouTube-Downloader.exe
```

## 📦 Nach dem Build:

Die fertige `.exe` aus `dist/` kannst du:
- ✅ Auf andere PCs kopieren
- ✅ Umbenennen (z.B. `YouTube-Downloader-v1.0.exe`)
- ✅ Verteilen (keine Installation nötig!)

## 💡 App normal starten (ohne EXE):

```bash
# Im Hauptordner
python backend/app.py
```

## 🎨 Optional: Icon hinzufügen

Falls du ein Icon für die .exe willst:

1. Erstelle `frontend/assets/icon.ico`
2. Ändere in `YouTube-Downloader.spec`:
   ```python
   icon='frontend/assets/icon.ico',
   ```
3. Build neu: `python build.py`

## 📋 Checkliste vor dem Build:

- [ ] Alle Dateien an richtiger Stelle
- [ ] `requirements.txt` installiert
- [ ] FFmpeg installiert (für MP3)
- [ ] `backend/app.py` und `backend/api.py` vorhanden
- [ ] `frontend/index.html`, `style.css`, `script.js` vorhanden

## 🔧 Troubleshooting:

**"No module named 'api'"**
→ Stelle sicher, dass `api.py` im `backend/` Ordner ist

**"index.html not found"**
→ Stelle sicher, dass HTML im `frontend/` Ordner ist

**"ImportError: ..."**
→ `pip install -r requirements.txt` erneut ausführen

---

**Deine Struktur ist jetzt professionell organisiert! 🎯**
