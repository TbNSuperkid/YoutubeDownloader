import webview
from api import Api


if __name__ == "__main__":
    api = Api()

    webview.create_window(
        title="Youtube Downloader",
        url="../frontend/index.html",
        js_api=api,
        maximized=True
    )

    webview.start()
