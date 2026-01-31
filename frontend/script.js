// Modal functions
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
document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Show loading overlay
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

// Hide loading overlay
function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// Main download function
async function startDownload() {
    const input = document.getElementById('urlInput');
    const url = input.value.trim();
    
    // Validation
    if (!url) {
        showModal('Keine URL', 'Bitte gib eine YouTube-URL ein!', 'error');
        return;
    }
    
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        showModal('Ungültige URL', 'Bitte gib eine gültige YouTube-URL ein!', 'error');
        return;
    }
    
    // Show loading
    showLoading();
    
    // ===============================
    // BACKEND INTEGRATION
    // ===============================
    try {
        // Echte API-Call zum Python Backend
        const videoData = await pywebview.api.get_video_info(url);
        
        if (videoData.error) {
            hideLoading();
            showModal('Fehler', `Video konnte nicht geladen werden: ${videoData.error}`, 'error');
            return;
        }
        
        // Video-Vorschau anzeigen
        displayVideoPreview(videoData);
        moveContainerToTop();
        hideLoading();
        
    } catch (error) {
        hideLoading();
        showModal('Fehler', 'Verbindung zum Backend fehlgeschlagen. Bitte starte die App neu.', 'error');
        console.error('Backend Error:', error);
    }
    
    /* ===============================
     * MOCKUP CODE (AUSKOMMENTIERT)
     * ===============================
    // Simulate API call to get video info
    // In production, you would call your backend here
    setTimeout(() => {
        // Simulate successful video info retrieval
        const videoData = getVideoInfo(url);
        
        if (videoData) {
            displayVideoPreview(videoData);
            moveContainerToTop();
            hideLoading();
        } else {
            hideLoading();
            showModal('Fehler', 'Video konnte nicht geladen werden. Bitte versuche es erneut.', 'error');
        }
    }, 1500);
    */
}

/* ===============================
 * MOCKUP FUNCTION (AUSKOMMENTIERT)
 * ===============================
// Mock function to simulate video info retrieval
// In production, replace this with actual API call
function getVideoInfo(url) {
    // This is mock data - in production, you'd fetch this from YouTube API or your backend
    return {
        title: "Beispiel Video Titel - Tutorial für Anfänger",
        channel: "Demo Kanal",
        views: "1.234.567",
        duration: "12:34",
        thumbnail: "https://via.placeholder.com/1280x720/1a1a24/ff3366?text=Video+Thumbnail"
    };
}
*/

// Move container to top of screen
function moveContainerToTop() {
    const container = document.getElementById('headerContainer');
    container.classList.add('moved-to-top');
}

// Display video preview
function displayVideoPreview(videoData) {
    const preview = document.getElementById('videoPreview');
    const thumbnail = document.getElementById('videoThumbnail');
    const title = document.getElementById('videoTitle');
    const channel = document.getElementById('videoChannel');
    const views = document.getElementById('videoViews');
    const duration = document.getElementById('videoDuration');
    
    // Set video data
    thumbnail.src = videoData.thumbnail;
    title.textContent = videoData.title;
    channel.textContent = videoData.channel;
    views.textContent = `${videoData.views} Aufrufe`;
    duration.textContent = videoData.duration;
    
    // Dynamisches Dropdown mit verfügbaren Qualitäten erstellen
    buildQualityDropdown(videoData.video_qualities || [], videoData.audio_qualities || []);
    
    // Show preview
    preview.classList.add('active');
}

// Erstelle Dropdown mit verfügbaren Qualitäten
function buildQualityDropdown(videoQualities, audioQualities) {
    const selectItems = document.querySelector('.select-items');
    const selectSelected = document.querySelector('.select-selected');
    const hiddenInput = document.getElementById('qualitySelect');
    
    // Leere das Dropdown
    selectItems.innerHTML = '';
    
    // Quality-Namen Mapping
    const qualityNames = {
        1080: 'MP4 - 1080p (Full HD)',
        720: 'MP4 - 720p (HD)',
        480: 'MP4 - 480p',
        360: 'MP4 - 360p',
        320: 'MP3 - 320 kbps',
        256: 'MP3 - 256 kbps',
        192: 'MP3 - 192 kbps',
        128: 'MP3 - 128 kbps'
    };
    
    let firstItem = null;
    
    // Video-Qualitäten hinzufügen
    videoQualities.forEach((quality, index) => {
        const div = document.createElement('div');
        div.setAttribute('data-value', `mp4-${quality}p`);
        div.textContent = qualityNames[quality] || `MP4 - ${quality}p`;
        div.addEventListener('click', handleDropdownItemClick);
        selectItems.appendChild(div);
        
        if (index === 0) {
            firstItem = div;
        }
    });
    
    // Audio-Qualitäten hinzufügen
    audioQualities.forEach(quality => {
        const div = document.createElement('div');
        div.setAttribute('data-value', `mp3-${quality}`);
        div.textContent = qualityNames[quality] || `MP3 - ${quality} kbps`;
        div.addEventListener('click', handleDropdownItemClick);
        selectItems.appendChild(div);
        
        if (!firstItem) {
            firstItem = div;
        }
    });
    
    // Falls keine Qualitäten verfügbar, zeige Fallback
    if (!firstItem) {
        const div = document.createElement('div');
        div.setAttribute('data-value', 'mp4-720p');
        div.textContent = 'MP4 - 720p (HD)';
        div.addEventListener('click', handleDropdownItemClick);
        selectItems.appendChild(div);
        firstItem = div;
    }
    
    // Setze erste Option als ausgewählt
    if (firstItem) {
        selectSelected.textContent = firstItem.textContent;
        hiddenInput.value = firstItem.getAttribute('data-value');
        firstItem.classList.add('same-as-selected');
    }
}

// Handler für Dropdown-Item-Klicks
function handleDropdownItemClick(e) {
    e.stopPropagation();
    
    const selectSelected = document.querySelector('.select-selected');
    const selectItems = document.querySelector('.select-items');
    const hiddenInput = document.getElementById('qualitySelect');
    const items = selectItems.querySelectorAll('div');
    
    // Remove previous selection
    items.forEach(i => i.classList.remove('same-as-selected'));
    
    // Update selected item
    selectSelected.textContent = this.textContent;
    hiddenInput.value = this.getAttribute('data-value');
    this.classList.add('same-as-selected');
    
    // Close dropdown
    selectItems.classList.add('select-hide');
    selectSelected.classList.remove('select-arrow-active');
}

// Initiate actual download
async function initiateDownload() {
    const qualitySelect = document.getElementById('qualitySelect');
    const selectedQuality = qualitySelect.value; // z.B. "mp4-1080p"
    const selectedQualityText = qualitySelect.options ? 
        qualitySelect.options[qualitySelect.selectedIndex].text : 
        document.querySelector('.select-selected').textContent;
    const url = document.getElementById('urlInput').value;
    
    showLoading();
    
    // ===============================
    // BACKEND INTEGRATION
    // ===============================
    try {
        // Echten Download starten
        const result = await pywebview.api.start_download(url, selectedQuality);
        
        hideLoading();
        
        // Progress-Anzeige einblenden
        showProgressBar();
        
        console.log('Download started:', {
            url: url,
            quality: selectedQuality
        });
        
    } catch (error) {
        hideLoading();
        showModal('Fehler', 'Download konnte nicht gestartet werden. Bitte versuche es erneut.', 'error');
        console.error('Download Error:', error);
    }
    
    /* ===============================
     * MOCKUP CODE (AUSKOMMENTIERT)
     * ===============================
    // Simulate download initiation
    setTimeout(() => {
        hideLoading();
        showModal(
            'Download gestartet!', 
            `Dein Video wird in ${selectedQuality} heruntergeladen. Der Download beginnt in Kürze.`,
            'success'
        );
        
        // Here you would actually trigger the download
        // For example: window.location.href = downloadUrl;
        console.log('Download started:', {
            url: url,
            quality: qualitySelect.value
        });
    }, 1000);
    */
}

// Show Progress Bar
function showProgressBar() {
    const container = document.getElementById('downloadProgressContainer');
    
    // Reset Progress-Werte
    document.getElementById('progressPercent').textContent = '0%';
    document.getElementById('progressSpeed').textContent = '0 MB/s';
    document.getElementById('progressBarFill').style.width = '0%';
    document.getElementById('progressStatus').textContent = 'Datei wird heruntergeladen...';
    
    container.classList.add('active');
}

// Hide Progress Bar
function hideProgressBar() {
    const container = document.getElementById('downloadProgressContainer');
    container.classList.remove('active');
}

// Verhindere Schließen durch Klick außerhalb (Download läuft)
document.getElementById('downloadProgressContainer')?.addEventListener('click', function(e) {
    // Nur schließen, wenn direkt auf Overlay geklickt wird (nicht erlaubt während Download)
    if (e.target === this) {
        // Optional: Zeige Hinweis dass Download läuft
        // showModal('Download läuft', 'Bitte warte bis der Download abgeschlossen ist oder klicke auf X zum Abbrechen.', 'error');
    }
});

// Optional Progress Update Functions (vom Backend aufgerufen)
function updateProgress(percent, speed) {
    console.log(`Download Progress: ${percent} @ ${speed}`);
    
    // Update Progress-Anzeige
    const percentEl = document.getElementById('progressPercent');
    const speedEl = document.getElementById('progressSpeed');
    const fillEl = document.getElementById('progressBarFill');
    
    // Prozent anzeigen
    percentEl.textContent = percent;
    
    // Geschwindigkeit anzeigen
    speedEl.textContent = speed || '0 MB/s';
    
    // Progress-Bar füllen
    const percentValue = parseFloat(percent.replace('%', ''));
    if (!isNaN(percentValue)) {
        fillEl.style.width = percentValue + '%';
    }
}

function downloadFinished() {
    console.log('Download finished!');
    
    // Verstecke Progress-Bar
    hideProgressBar();
    
    // Zeige Success-Modal
    showModal(
        'Download abgeschlossen!',
        'Dein Video wurde erfolgreich heruntergeladen und befindet sich in deinem Downloads-Ordner.',
        'success'
    );
}

function downloadError(error) {
    console.error('Download Error:', error);
    
    // Verstecke Progress-Bar
    hideProgressBar();
    
    // Zeige Error-Modal
    showModal(
        'Download fehlgeschlagen',
        `Ein Fehler ist aufgetreten: ${error}`,
        'error'
    );
}

// Cancel Download Function
function cancelDownload() {
    // Hier würdest du das Backend aufrufen, um den Download abzubrechen
    console.log('Download cancelled by user');
    
    hideProgressBar();
    
    showModal(
        'Download abgebrochen',
        'Der Download wurde erfolgreich abgebrochen.',
        'error'
    );
    
    // TODO: Backend-Call zum Abbrechen implementieren
    // await pywebview.api.cancel_download();
}

// Enter key to start
document.getElementById('urlInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        startDownload();
    }
});

// Optional: Add a "New Download" button functionality
function resetDownloader() {
    const container = document.getElementById('headerContainer');
    const preview = document.getElementById('videoPreview');
    const input = document.getElementById('urlInput');
    
    container.classList.remove('moved-to-top');
    preview.classList.remove('active');
    input.value = '';
}

// Custom Dropdown Functionality
document.addEventListener('DOMContentLoaded', function() {
    const customSelect = document.getElementById('customSelect');
    const selectSelected = customSelect.querySelector('.select-selected');
    const selectItems = customSelect.querySelector('.select-items');
    const hiddenInput = document.getElementById('qualitySelect');
    
    // Toggle dropdown
    selectSelected.addEventListener('click', function(e) {
        e.stopPropagation();
        closeAllSelect(this);
        selectItems.classList.toggle('select-hide');
        this.classList.toggle('select-arrow-active');
    });
    
    // Select item
    const items = selectItems.querySelectorAll('div');
    items.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Remove previous selection
            items.forEach(i => i.classList.remove('same-as-selected'));
            
            // Update selected item
            selectSelected.textContent = this.textContent;
            hiddenInput.value = this.getAttribute('data-value');
            this.classList.add('same-as-selected');
            
            // Close dropdown
            selectItems.classList.add('select-hide');
            selectSelected.classList.remove('select-arrow-active');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        closeAllSelect();
    });
    
    function closeAllSelect(element) {
        const items = document.querySelectorAll('.select-items');
        const selected = document.querySelectorAll('.select-selected');
        
        items.forEach(function(item, index) {
            if (element !== selected[index]) {
                item.classList.add('select-hide');
                selected[index].classList.remove('select-arrow-active');
            }
        });
    }
    
    // Mark first item as selected by default
    items[0].classList.add('same-as-selected');
});