// History and Favorites Feature for Lorem Ipsum Generator
// Saves recent generations and allows favoriting presets

const HISTORY_KEY = 'lorem-history';
const FAVORITES_KEY = 'lorem-favorites';
const MAX_HISTORY = 10;

// Initialize history and favorites on load
document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
    renderFavorites();
    
    // Hook into the original generate function
    const originalGenerate = window.generate;
    window.generate = function() {
        originalGenerate();
        
        // Save to history after generation
        setTimeout(() => {
            saveToHistory();
        }, 100);
    };
});

// Get history from localStorage
function getHistory() {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
}

// Get favorites from localStorage
function getFavorites() {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
}

// Save current generation to history
function saveToHistory() {
    const resultDiv = document.getElementById('result');
    const rawOutput = resultDiv.dataset.rawOutput || resultDiv.innerText;
    
    if (!rawOutput || rawOutput.trim().length === 0) return;
    
    const type = document.getElementById('type').value;
    const count = document.getElementById('count').value;
    const style = document.getElementById('style').value;
    
    const history = getHistory();
    
    // Don't save duplicate of most recent
    if (history.length > 0 && history[0].output === rawOutput) return;
    
    const entry = {
        id: Date.now(),
        type: type,
        count: count,
        style: style,
        output: rawOutput,
        preview: rawOutput.substring(0, 100) + (rawOutput.length > 100 ? '...' : ''),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
    };
    
    history.unshift(entry);
    if (history.length > MAX_HISTORY) {
        history.pop();
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
}

// Render history list
function renderHistory() {
    const history = getHistory();
    const container = document.getElementById('history-list');
    const favorites = getFavorites();
    
    if (history.length === 0) {
        container.innerHTML = '<p class="history-empty">No recent generations yet. Generate some text to see it here!</p>';
        return;
    }
    
    const styleLabels = {
        classic: '📜 Classic',
        bacon: '🥓 Bacon',
        hipster: '☕ Hipster',
        corporate: '💼 Corporate'
    };
    
    const typeLabels = {
        paragraphs: '¶',
        sentences: 'S',
        words: 'W'
    };
    
    container.innerHTML = history.map(item => {
        const isFavorite = favorites.some(f => f.output === item.output);
        return `
            <div class="history-item" data-id="${item.id}">
                <button class="star-btn ${isFavorite ? 'starred' : ''}" onclick="toggleFavorite('${item.id}')" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                    ${isFavorite ? '★' : '☆'}
                </button>
                <div class="history-preview" title="${escapeHtml(item.preview)}">${escapeHtml(item.preview)}</div>
                <div class="history-meta">
                    <span class="history-type">${typeLabels[item.type] || item.type}</span>
                    <span class="history-style ${item.style}">${styleLabels[item.style] || item.style}</span>
                    <span class="history-count">${item.count}</span>
                </div>
                <div class="history-actions">
                    <button class="history-btn" onclick="copyFromHistory('${item.id}')" title="Copy">📋</button>
                    <button class="history-btn" onclick="loadFromHistory('${item.id}')" title="Use settings">⚙️</button>
                    <button class="history-btn" onclick="deleteHistoryItem('${item.id}')" title="Delete">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

// Render favorites list
function renderFavorites() {
    const favorites = getFavorites();
    const container = document.getElementById('favorites-list');
    
    if (favorites.length === 0) {
        container.innerHTML = '<p class="favorites-empty">No saved presets. Click the ⭐ star button after generating to save a preset!</p>';
        return;
    }
    
    const styleLabels = {
        classic: '📜 Classic',
        bacon: '🥓 Bacon',
        hipster: '☕ Hipster',
        corporate: '💼 Corporate'
    };
    
    container.innerHTML = favorites.map((item, index) => `
        <div class="favorite-item">
            <span class="favorite-name">${escapeHtml(item.name || 'Saved Preset')}</span>
            <div class="favorite-meta">
                <span>${styleLabels[item.style] || item.style}</span>
                <span>•</span>
                <span>${item.count} ${item.type}</span>
            </div>
            <div class="favorite-actions">
                <button class="history-btn" onclick="copyFromFavorite(${index})" title="Copy">📋</button>
                <button class="history-btn" onclick="loadFromFavorite(${index})" title="Load">⚙️</button>
                <button class="history-btn" onclick="deleteFavorite(${index})" title="Remove">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Copy text from history
function copyFromHistory(id) {
    const history = getHistory();
    const item = history.find(h => h.id.toString() === id.toString());
    if (item) {
        navigator.clipboard.writeText(item.output).then(() => {
            showToast('📋 Copied from history!');
        });
    }
}

// Load settings from history
function loadFromHistory(id) {
    const history = getHistory();
    const item = history.find(h => h.id.toString() === id.toString());
    if (item) {
        document.getElementById('type').value = item.type;
        document.getElementById('count').value = item.count;
        document.getElementById('style').value = item.style;
        
        // Update the result
        const resultDiv = document.getElementById('result');
        resultDiv.dataset.rawOutput = item.output;
        resultDiv.innerHTML = `<div style="text-align:left;white-space:pre-wrap;">${escapeHtml(item.output)}</div>`;
        
        // Update stats if function exists
        if (typeof updateStats === 'function') {
            updateStats(item.output);
        }
        
        showToast('⚙️ Settings loaded!');
    }
}

// Delete history item
function deleteHistoryItem(id) {
    let history = getHistory();
    history = history.filter(h => h.id.toString() !== id.toString());
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
}

// Clear all history
function clearHistory() {
    if (confirm('Clear all generation history? Favorites will be preserved.')) {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
        showToast('🗑️ History cleared!');
    }
}

// Toggle favorite status
function toggleFavorite(id) {
    const history = getHistory();
    const item = history.find(h => h.id.toString() === id.toString());
    if (!item) return;
    
    let favorites = getFavorites();
    const existingIndex = favorites.findIndex(f => f.output === item.output);
    
    if (existingIndex >= 0) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        showToast('⭐ Removed from favorites');
    } else {
        // Add to favorites with a name
        const name = prompt('Give this preset a name:', `${item.style} ${item.count} ${item.type}`);
        if (name) {
            favorites.push({
                ...item,
                name: name
            });
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            showToast('⭐ Added to favorites!');
        }
    }
    
    renderHistory();
    renderFavorites();
}

// Copy from favorite
function copyFromFavorite(index) {
    const favorites = getFavorites();
    const item = favorites[index];
    if (item) {
        navigator.clipboard.writeText(item.output).then(() => {
            showToast('📋 Copied from favorites!');
        });
    }
}

// Load from favorite
function loadFromFavorite(index) {
    const favorites = getFavorites();
    const item = favorites[index];
    if (item) {
        document.getElementById('type').value = item.type;
        document.getElementById('count').value = item.count;
        document.getElementById('style').value = item.style;
        
        // Update the result
        const resultDiv = document.getElementById('result');
        resultDiv.dataset.rawOutput = item.output;
        resultDiv.innerHTML = `<div style="text-align:left;white-space:pre-wrap;">${escapeHtml(item.output)}</div>`;
        
        // Update stats if function exists
        if (typeof updateStats === 'function') {
            updateStats(item.output);
        }
        
        showToast('⭐ Favorite loaded!');
    }
}

// Delete favorite
function deleteFavorite(index) {
    if (confirm('Remove this saved preset?')) {
        let favorites = getFavorites();
        favorites.splice(index, 1);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        renderFavorites();
        renderHistory();
        showToast('🗑️ Favorite removed');
    }
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show toast notification
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.history-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'history-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #1f2937;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 0.9rem;
        z-index: 1000;
        animation: slideUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Add slideUp animation if not present
if (!document.querySelector('#history-animations')) {
    const style = document.createElement('style');
    style.id = 'history-animations';
    style.textContent = `
        @keyframes slideUp {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
    `;
    document.head.appendChild(style);
}

// Make functions globally available
window.saveToHistory = saveToHistory;
window.clearHistory = clearHistory;
window.toggleFavorite = toggleFavorite;
window.copyFromHistory = copyFromHistory;
window.loadFromHistory = loadFromHistory;
window.deleteHistoryItem = deleteHistoryItem;
window.copyFromFavorite = copyFromFavorite;
window.loadFromFavorite = loadFromFavorite;
window.deleteFavorite = deleteFavorite;
