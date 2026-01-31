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
}

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
    
    // Show preview
    preview.classList.add('active');
}

// Initiate actual download
function initiateDownload() {
    const qualitySelect = document.getElementById('qualitySelect');
    const selectedQuality = qualitySelect.options[qualitySelect.selectedIndex].text;
    const url = document.getElementById('urlInput').value;
    
    showLoading();
    
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