// Lorem Ipsum Generator
const LOREM_WORDS = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
    "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
    "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
    "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
    "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
    "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
    "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab",
    "illo", "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae",
    "dicta", "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur",
    "aut", "odit", "autem", "ratione", "sequi", "nesciunt", "neque", "dolorem"
];

const FUNNY_WORDS = [
    "bacon", "pancetta", "porchetta", "prosciutto", "salami", "brisket",
    "meatball", "sirloin", "tenderloin", "pastrami", "corned", "beef",
    "chuck", "ribeye", "flank", "strip", "t-bone", "short", "ribs",
    "pork", "belly", "shoulder", "ham", "turducken", "sausage"
];

const HIPSTER_WORDS = [
    "kombucha", "vape", "artisan", "craft", "single-origin", "small-batch",
    "locally-sourced", "farm-to-table", "organic", "sustainable", "fair-trade",
    "handcrafted", "bespoke", "microbrew", "vinyl", "vintage", "thrifted",
    "fixie", "mustache", "tattooed", "distillery", "rooftop", "paleo",
    "gluten-free", "activated", "charcoal", "avocado", "toast"
];

const CORPORATE_WORDS = [
    "synergy", "leverage", "scalable", "robust", "streamlined", "holistic",
    "paradigm", "deliverables", "bandwidth", "actionable", "deliver",
    "core", "competency", "stakeholder", "value-add", "incentivize",
    "onboarding", "visibility", "vertical", "silo", "circle", "back",
    "pivot", "move", "needle", "deep", "dive", "boil", "ocean"
];

// Generate random sentences
function generateSentence(wordList, minWords = 8, maxWords = 15) {
    const numWords = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words = [];
    for (let i = 0; i < numWords; i++) {
        const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
        words.push(randomWord);
    }
    // Capitalize first letter and add period
    const sentence = words.join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

// Generate paragraphs
function generateParagraphs(count, style) {
    let wordList;
    switch (style) {
        case 'bacon': wordList = FUNNY_WORDS; break;
        case 'hipster': wordList = HIPSTER_WORDS; break;
        case 'corporate': wordList = CORPORATE_WORDS; break;
        default: wordList = LOREM_WORDS;
    }
    
    const paragraphs = [];
    for (let i = 0; i < count; i++) {
        const numSentences = Math.floor(Math.random() * 4) + 3; // 3-6 sentences
        const sentences = [];
        for (let j = 0; j < numSentences; j++) {
            sentences.push(generateSentence(wordList));
        }
        paragraphs.push(sentences.join(' '));
    }
    return paragraphs.join('\n\n');
}

// Generate words
function generateWords(count, style) {
    let wordList;
    switch (style) {
        case 'bacon': wordList = FUNNY_WORDS; break;
        case 'hipster': wordList = HIPSTER_WORDS; break;
        case 'corporate': wordList = CORPORATE_WORDS; break;
        default: wordList = LOREM_WORDS;
    }
    
    const words = [];
    for (let i = 0; i < count; i++) {
        words.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    return words.join(' ');
}

// Generate sentences
function generateSentences(count, style) {
    let wordList;
    switch (style) {
        case 'bacon': wordList = FUNNY_WORDS; break;
        case 'hipster': wordList = HIPSTER_WORDS; break;
        case 'corporate': wordList = CORPORATE_WORDS; break;
        default: wordList = LOREM_WORDS;
    }
    
    const sentences = [];
    for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(wordList));
    }
    return sentences.join(' ');
}

// Main generate function
function generate() {
    const type = document.getElementById('type').value;
    const count = parseInt(document.getElementById('count').value) || 5;
    const style = document.getElementById('style').value;
    const withHTML = document.getElementById('html-tags').checked;
    
    let output = '';
    
    switch (type) {
        case 'paragraphs':
            output = generateParagraphs(count, style);
            if (withHTML) {
                output = output.split('\n\n').map(p => `<p>${p}</p>`).join('\n');
            }
            break;
        case 'sentences':
            output = generateSentences(count, style);
            break;
        case 'words':
            output = generateWords(count, style);
            break;
    }
    
    const resultDiv = document.getElementById('result');
    if (withHTML && type === 'paragraphs') {
        resultDiv.innerHTML = `<div style="text-align:left;white-space:pre-wrap;font-family:monospace;font-size:0.9em;background:#0f0f1a;padding:1rem;border-radius:8px;overflow-x:auto;">${escapeHtml(output)}</div>`;
    } else {
        resultDiv.innerHTML = `<div style="text-align:left;white-space:pre-wrap;">${output}</div>`;
    }
    
    // Store raw output for copying
    resultDiv.dataset.rawOutput = output;
    
    // Update stats
    updateStats(output);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateStats(text) {
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    const paragraphs = text.split('\n\n').filter(p => p.trim()).length;
    
    document.getElementById('stats').innerHTML = `
        <div class="stat-box">
            <div class="stat-item"><span>${words}</span> words</div>
            <div class="stat-item"><span>${chars}</span> chars</div>
            <div class="stat-item"><span>${paragraphs}</span> paragraphs</div>
        </div>
    `;
}

function copy() {
    const resultDiv = document.getElementById('result');
    const rawOutput = resultDiv.dataset.rawOutput || resultDiv.innerText;
    
    navigator.clipboard.writeText(rawOutput).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Copied!';
        setTimeout(() => btn.innerHTML = originalText, 2000);
    });
}

function clearAll() {
    document.getElementById('result').innerHTML = '';
    document.getElementById('stats').innerHTML = '';
    document.getElementById('count').value = '5';
}

// Update count label
function updateCountLabel() {
    const type = document.getElementById('type').value;
    const labels = {
        paragraphs: 'Paragraphs',
        sentences: 'Sentences',
        words: 'Words'
    };
    document.getElementById('count-label').textContent = `Number of ${labels[type]}:`;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('type').addEventListener('change', updateCountLabel);
    generate(); // Generate on load
    
    // Offline indicator
    const offlineIndicator = document.createElement('div');
    offlineIndicator.id = 'offline-indicator';
    offlineIndicator.textContent = '📡 Offline Mode';
    offlineIndicator.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#ff6b6b;color:white;text-align:center;padding:8px;font-weight:500;display:none;z-index:9999;transition:all 0.3s;';
    document.body.appendChild(offlineIndicator);
    
    window.addEventListener('online', () => {
        offlineIndicator.style.display = 'none';
    });
    window.addEventListener('offline', () => {
        offlineIndicator.style.display = 'block';
    });
    
    // PWA Install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });
    
    function showInstallPrompt() {
        const prompt = document.createElement('div');
        prompt.id = 'pwa-install-prompt';
        prompt.innerHTML = `
            <div style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#6f42c1;color:white;padding:15px 25px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.3);display:flex;align-items:center;gap:15px;z-index:10000;">
                <span>📱 Install for offline use!</span>
                <button id="install-btn" style="background:white;color:#6f42c1;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-weight:600;">Install</button>
                <button id="dismiss-btn" style="background:rgba(255,255,255,0.2);color:white;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;">✕</button>
            </div>
        `;
        document.body.appendChild(prompt);
        
        document.getElementById('install-btn').addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(() => {
                prompt.remove();
            });
        });
        
        document.getElementById('dismiss-btn').addEventListener('click', () => {
            prompt.remove();
        });
    }
});
