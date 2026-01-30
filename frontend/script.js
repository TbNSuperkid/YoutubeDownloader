function showModal(title, message, type = 'error') {
    const overlay = document.getElementById('modalOverlay');
    const icon = document.getElementById('modalIcon');
    const titleEl = document.getElementById('modalTitle');
    const messageEl = document.getElementById('modalMessage');

    titleEl.textContent = title;
    messageEl.textContent = message;

    // Set icon and style based on type
    if (type === 'success') {
        icon.textContent = '✓';
        icon.className = 'modal-icon success';
    } else {
        icon.textContent = '!';
        icon.className = 'modal-icon error';
    }

    overlay.classList.add('active');
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
}

// Close modal when clicking outside
document.getElementById('modalOverlay').addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

function startDownload() {
    
}

async function loadVideoInfo() {
    const input = document.getElementById('urlInput');
    const url = input.value.trim();

    if (!url) {
        showModal('Keine URL', 'Bitte gib eine YouTube-URL ein!', 'error');
        return;
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        showModal('Ungültige URL', 'Bitte gib eine gültige YouTube-URL ein!', 'error');
        return;
    }

    // Hier würdest du die eigentliche Download-Logik implementieren
    showModal('Download gestartet', 'Dein Video wird heruntergeladen: ' + url, 'success');

    // Optional: Input-Feld leeren
    // input.value = '';

    const info = await window.pywebview.api.get_video_info(url)

    if (info.error) {
        alert(info.error)
        return
    }

    document.getElementById("title").innerText = info.title

    const qualitySelect = document.getElementById("quality")
    qualitySelect.innerHTML = ""

    info.qualities.forEach(q => {
        const opt = document.createElement("option")
        opt.value = q
        opt.textContent = q + "p"
        qualitySelect.appendChild(opt)
    })

   

    
}

function updateProgress(percent, speed) {
  document.getElementById("progress").innerText =
    `${percent} – ${speed}`
}

function downloadFinished() {
  document.getElementById("progress").innerText =
    "Download abgeschlossen 🎉"
}

function downloadError(msg) {
  alert("Fehler: " + msg)
}


// Enter-Taste zum Starten
document.getElementById('urlInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        loadVideoInfo();
    }
});