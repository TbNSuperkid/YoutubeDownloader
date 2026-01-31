import webview
from api import Api

icon_path = "frontend/assets/icon.ico"

if __name__ == "__main__":
    api = Api()

    webview.create_window(
        title="Youtube Downloader",
        url="../frontend/index.html",
        js_api=api,
        maximized=True,
        resizable=True,
        #icon="../frontend/assets/icon.png"
    )

    webview.start( icon=icon_path)
