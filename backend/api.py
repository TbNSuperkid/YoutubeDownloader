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

            # Verfügbare Qualitäten extrahieren
            qualities = sorted(
                {f.get("height") for f in info.get("formats", []) if f.get("height")},
                reverse=True
            )

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
                "qualities": qualities
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
                percent = d.get("_percent_str", "0%").strip()
                speed = d.get("_speed_str", "N/A")
                # JavaScript-Funktion aufrufen (falls implementiert)
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
            }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])

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