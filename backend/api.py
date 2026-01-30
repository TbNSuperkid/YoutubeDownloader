import yt_dlp
import webview
import threading
import os


class Api:
    def __init__(self):
        self.download_path = os.path.join(os.getcwd(), "downloads")
        os.makedirs(self.download_path, exist_ok=True)

    # ===============================
    # VIDEO INFOS
    # ===============================
    def get_video_info(self, url):
        try:
            with yt_dlp.YoutubeDL({"quiet": True}) as ydl:
                info = ydl.extract_info(url, download=False)

            qualities = sorted(
                {f.get("height") for f in info["formats"] if f.get("height")},
                reverse=True
            )

            return {
                "title": info.get("title"),
                "duration": info.get("duration"),
                "thumbnail": info.get("thumbnail"),
                "qualities": qualities
            }

        except Exception as e:
            return {"error": str(e)}

    # ===============================
    # DOWNLOAD STARTEN (THREAD!)
    # ===============================
    def start_download(self, url, mode, quality=None):
        thread = threading.Thread(
            target=self._download,
            args=(url, mode, quality),
            daemon=True
        )
        thread.start()

    # ===============================
    # DOWNLOAD LOGIK
    # ===============================
    def _download(self, url, mode, quality):
        def progress_hook(d):
            if d["status"] == "downloading":
                percent = d.get("_percent_str", "").strip()
                speed = d.get("_speed_str", "")
                webview.evaluate_js(
                    f"updateProgress('{percent}', '{speed}')"
                )

            elif d["status"] == "finished":
                webview.evaluate_js("downloadFinished()")

        if mode == "mp3":
            ydl_opts = {
                "format": "bestaudio/best",
                "outtmpl": f"{self.download_path}/%(title)s.%(ext)s",
                "progress_hooks": [progress_hook],
                "postprocessors": [{
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }],
            }

        else:  # mp4
            ydl_opts = {
                "format": f"bestvideo[height={quality}]+bestaudio/best",
                "merge_output_format": "mp4",
                "outtmpl": f"{self.download_path}/%(title)s.%(ext)s",
                "progress_hooks": [progress_hook],
            }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])

        except Exception as e:
            webview.evaluate_js(
                f"downloadError('{str(e)}')"
            )

    # ===============================
    # DOWNLOAD ORDNER ÄNDERN
    # ===============================
    def set_download_path(self, path):
        self.download_path = path
        os.makedirs(self.download_path, exist_ok=True)
        return self.download_path

    # ===============================
    # APP SCHLIESSEN
    # ===============================
    def close_app(self):
        webview.windows[0].destroy()
