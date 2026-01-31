import yt_dlp
import webview
import threading
import os
from pathlib import Path


class Api:
    def __init__(self):
        # Windows Downloads-Ordner verwenden
        self.download_path = str(Path.home() / "Downloads")
        os.makedirs(self.download_path, exist_ok=True)

    # ===============================
    # DATEINAMEN MIT NUMMERIERUNG
    # ===============================
    def get_unique_filename(self, filepath):
        """
        Gibt einen eindeutigen Dateinamen zurück.
        Wenn die Datei existiert, fügt (1), (2), etc. hinzu wie in Windows.
        """
        if not os.path.exists(filepath):
            return filepath
        
        # Dateiname und Endung trennen
        base_path = os.path.dirname(filepath)
        filename = os.path.basename(filepath)
        name, ext = os.path.splitext(filename)
        
        # Nummerierung hinzufügen
        counter = 1
        while True:
            new_filename = f"{name} ({counter}){ext}"
            new_filepath = os.path.join(base_path, new_filename)
            
            if not os.path.exists(new_filepath):
                return new_filepath
            
            counter += 1

    # ===============================
    # VIDEO INFOS
    # ===============================
    def get_video_info(self, url):
        try:
            ydl_opts = {
                "quiet": True,
                "no_warnings": True,
                "extract_flat": False
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)

            # Verfügbare Video-Qualitäten extrahieren (nur H.264/AVC)
            video_formats = []
            for f in info.get("formats", []):
                height = f.get("height")
                vcodec = f.get("vcodec", "")
                
                # Nur Videos mit H.264 Codec (avc)
                if height and vcodec and ("avc" in vcodec.lower() or "h264" in vcodec.lower()):
                    video_formats.append(height)
            
            # Deduplizieren und sortieren
            available_video_qualities = sorted(set(video_formats), reverse=True)
            
            # Standard Video-Qualitäten die wir unterstützen
            supported_qualities = [1080, 720, 480, 360]
            
            # Nur die Qualitäten zeigen, die auch verfügbar sind
            video_qualities = [q for q in supported_qualities if q in available_video_qualities]
            
            # Falls keine gefunden, nimm die beste verfügbare
            if not video_qualities and available_video_qualities:
                video_qualities = [available_video_qualities[0]]
            
            # Audio-Formate prüfen (für MP3)
            has_audio = any(f.get("acodec") != "none" for f in info.get("formats", []))
            
            # Audio-Qualitäten (immer verfügbar wenn Audio vorhanden)
            audio_qualities = [320, 256, 192, 128] if has_audio else []

            # Duration in MM:SS Format konvertieren
            duration_seconds = info.get("duration", 0)
            minutes = duration_seconds // 60
            seconds = duration_seconds % 60
            duration_str = f"{minutes}:{seconds:02d}"

            # View count formatieren
            view_count = info.get("view_count", 0)
            if view_count >= 1000000:
                views_str = f"{view_count / 1000000:.1f}M"
            elif view_count >= 1000:
                views_str = f"{view_count / 1000:.1f}K"
            else:
                views_str = str(view_count)

            return {
                "title": info.get("title", "Unbekannter Titel"),
                "channel": info.get("uploader", "Unbekannter Kanal"),
                "views": views_str,
                "duration": duration_str,
                "thumbnail": info.get("thumbnail", ""),
                "video_qualities": video_qualities,  # [1080, 720, 480, ...]
                "audio_qualities": audio_qualities   # [320, 256, 192, 128]
            }

        except Exception as e:
            return {"error": str(e)}

    # ===============================
    # DOWNLOAD STARTEN (THREAD!)
    # ===============================
    def start_download(self, url, quality_option):
        thread = threading.Thread(
            target=self._download,
            args=(url, quality_option),
            daemon=True
        )
        thread.start()
        return {"status": "started"}

    # ===============================
    # DOWNLOAD LOGIK
    # ===============================
    def _download(self, url, quality_option):
        def progress_hook(d):
            if d["status"] == "downloading":
                # Rohe Werte verwenden statt formatierte Strings
                downloaded = d.get("downloaded_bytes", 0)
                total = d.get("total_bytes") or d.get("total_bytes_estimate", 0)
                
                # Prozent berechnen
                if total > 0:
                    percent_value = (downloaded / total) * 100
                    percent = f"{percent_value:.1f}%"
                else:
                    percent = "0%"
                
                # Geschwindigkeit berechnen (Bytes pro Sekunde)
                speed_bytes = d.get("speed", 0)
                if speed_bytes:
                    if speed_bytes >= 1024 * 1024:  # MB/s
                        speed = f"{speed_bytes / (1024 * 1024):.1f} MB/s"
                    elif speed_bytes >= 1024:  # KB/s
                        speed = f"{speed_bytes / 1024:.1f} KB/s"
                    else:
                        speed = f"{speed_bytes:.0f} B/s"
                else:
                    speed = "0 MB/s"
                
                # JavaScript-Funktion aufrufen
                try:
                    webview.windows[0].evaluate_js(
                        f"if(typeof updateProgress === 'function') updateProgress('{percent}', '{speed}')"
                    )
                except:
                    pass

            elif d["status"] == "finished":
                try:
                    webview.windows[0].evaluate_js(
                        "if(typeof downloadFinished === 'function') downloadFinished()"
                    )
                except:
                    pass

        # Quality-Option parsen (z.B. "mp4-1080p" oder "mp3-320")
        parts = quality_option.split("-")
        mode = parts[0]  # mp4 oder mp3
        quality_value = parts[1] if len(parts) > 1 else None

        if mode == "mp3":
            # Audio-Download
            ydl_opts = {
                "format": "bestaudio/best",
                "outtmpl": f"{self.download_path}/%(title)s.%(ext)s",
                "progress_hooks": [progress_hook],
                "nooverwrites": False,  # Erlaube Überschreiben (wir machen eigene Nummerierung)
                "postprocessors": [{
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": quality_value.replace("kbps", "") if quality_value else "192",
                }],
            }

        else:  # mp4
            # Video-Download mit H.264 Codec (kompatibel mit allen Windows-Playern)
            height = quality_value.replace("p", "") if quality_value else "1080"
            ydl_opts = {
                # Lade NUR H.264 Videos herunter (kein AV1, kein VP9)
                # avc1 = H.264, mp4a = AAC Audio
                "format": (
                    f"bestvideo[height<={height}][vcodec^=avc1]+bestaudio[acodec^=mp4a]/best/"
                    f"bestvideo[height<={height}][vcodec^=avc]+bestaudio/best/"
                    f"best[height<={height}][vcodec^=avc]"
                ),
                "merge_output_format": "mp4",
                "outtmpl": f"{self.download_path}/%(title)s.%(ext)s",
                "progress_hooks": [progress_hook],
                "nooverwrites": False,  # Erlaube Überschreiben (wir machen eigene Nummerierung)
            }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # Extrahiere Info um Dateinamen zu bekommen
                info = ydl.extract_info(url, download=False)
                
                # Erstelle erwarteten Dateinamen
                if mode == "mp3":
                    expected_ext = "mp3"
                else:
                    expected_ext = "mp4"
                
                expected_filename = ydl.prepare_filename(info)
                # Ersetze die Endung durch die tatsächliche Endung
                expected_filename = os.path.splitext(expected_filename)[0] + f".{expected_ext}"
                
                # Prüfe ob Datei bereits existiert und erstelle eindeutigen Namen
                unique_filename = self.get_unique_filename(expected_filename)
                
                # Update outtmpl mit eindeutigem Namen
                ydl_opts["outtmpl"] = unique_filename
                
                # Jetzt downloaden mit eindeutigem Namen
                with yt_dlp.YoutubeDL(ydl_opts) as ydl2:
                    ydl2.download([url])

        except Exception as e:
            try:
                webview.windows[0].evaluate_js(
                    f"if(typeof downloadError === 'function') downloadError('{str(e).replace(chr(39), chr(92) + chr(39))}')"
                )
            except:
                pass

    # ===============================
    # DOWNLOAD ORDNER ÄNDERN
    # ===============================
    def set_download_path(self, path):
        self.download_path = path
        os.makedirs(self.download_path, exist_ok=True)
        return {"path": self.download_path}

    # ===============================
    # DOWNLOAD ORDNER ABRUFEN
    # ===============================
    def get_download_path(self):
        return {"path": self.download_path}

    # ===============================
    # APP SCHLIESSEN
    # ===============================
    def close_app(self):
        webview.windows[0].destroy()