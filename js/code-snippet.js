// =============================================
//  Code Snippet Typing Animation
//  Synced with hero photo transition effects:
//  ERROR → Glitch | COMPILE → Loading | RUN → Scan Line
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    const codeBody = document.getElementById('codeBody');
    const codeTerminal = document.getElementById('codeTerminal');
    const photoWrapper = document.getElementById('photoWrapper');
    const speechBubble = document.getElementById('speechBubble');
    if (!codeBody || !codeTerminal) return;

    // Get photo elements
    const photoAvatar = document.querySelector('.photo-avatar');
    const photoReal = document.querySelector('.photo-real');

    // Speed settings (ms)
    const CHAR_SPEED = 70;
    const LINE_PAUSE = 500;
    const SECTION_PAUSE = 800;
    const ERROR_PAUSE = 2000;
    const FINAL_PAUSE = 4000;

    // ---- Helpers ----

    function createLine(indent = 0) {
        const line = document.createElement('div');
        line.className = 'line';
        if (indent > 0) {
            line.style.paddingLeft = (indent * 16) + 'px';
        }
        return line;
    }

    function addCursor(container) {
        removeCursor();
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.id = 'typingCursor';
        container.appendChild(cursor);
    }

    function removeCursor() {
        const existing = document.getElementById('typingCursor');
        if (existing) existing.remove();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Type text into a line element, character by character
    async function typeLine(container, segments, indent = 0) {
        const line = createLine(indent);
        container.appendChild(line);

        for (const seg of segments) {
            const span = document.createElement('span');
            span.className = seg.cls || 'syn-default';
            span.textContent = '';
            line.appendChild(span);

            for (let i = 0; i < seg.text.length; i++) {
                removeCursor();
                span.textContent += seg.text[i];
                addCursor(line);
                await sleep(CHAR_SPEED);
            }
        }

        removeCursor();
        addCursor(line);
        await sleep(LINE_PAUSE);
    }

    // Type a terminal line
    async function typeTermLine(text, cls = 'term-cmd') {
        codeTerminal.classList.add('visible');
        const line = document.createElement('div');
        line.className = 'term-line';
        codeTerminal.appendChild(line);

        const span = document.createElement('span');
        span.className = cls;
        span.textContent = '';
        line.appendChild(span);

        for (let i = 0; i < text.length; i++) {
            removeCursor();
            span.textContent += text[i];
            addCursor(line);
            await sleep(CHAR_SPEED);
        }

        removeCursor();
        return line;
    }

    // Show instant terminal output (no typing)
    async function showTermOutput(text, cls = 'term-cmd') {
        codeTerminal.classList.add('visible');
        const line = document.createElement('div');
        line.className = 'term-line';
        const span = document.createElement('span');
        span.className = cls;
        span.textContent = text;
        line.appendChild(span);
        codeTerminal.appendChild(line);
        return line;
    }

    // Clear all
    function clearAll() {
        codeBody.innerHTML = '';
        codeTerminal.innerHTML = '';
        codeTerminal.classList.remove('visible');
    }

    // ---- Photo Effect Helpers ----

    function triggerEffect(effectClass, durationMs) {
        if (!photoWrapper) return;
        photoWrapper.classList.add(effectClass);
        setTimeout(() => {
            photoWrapper.classList.remove(effectClass);
        }, durationMs);
    }

    function swapToReal() {
        if (!photoAvatar || !photoReal) return;
        photoAvatar.classList.remove('active');
        photoReal.classList.add('active');
    }

    function swapToAvatar() {
        if (!photoAvatar || !photoReal) return;
        photoReal.classList.remove('active');
        photoAvatar.classList.add('active');
    }

    // ---- Speech Bubble Helper ----

    function showBubble(text, duration = 2000) {
        if (!speechBubble) return;
        speechBubble.textContent = text;
        speechBubble.classList.add('show');

        if (duration > 0) {
            setTimeout(() => {
                speechBubble.classList.remove('show');
            }, duration);
        }
    }

    function hideBubble() {
        if (!speechBubble) return;
        speechBubble.classList.remove('show');
    }

    // ---- Animation Sequence ----

    async function runAnimation() {
        clearAll();

        // Make sure we start on avatar
        swapToAvatar();

        // Blinking cursor on empty editor
        const emptyLine = createLine();
        codeBody.appendChild(emptyLine);
        addCursor(emptyLine);

        // Start: 🗨️ Bora codar!
        showBubble('Bora codar!', 3000);
        await sleep(1500);

        emptyLine.remove();

        // Line 1: public class Inicio {
        await typeLine(codeBody, [
            { text: 'public class', cls: 'syn-keyword' },
            { text: ' ', cls: 'syn-default' },
            { text: 'Inicio', cls: 'syn-class' },
            { text: ' {', cls: 'syn-bracket' }
        ]);

        // Line 2:   public static void main(String[] args) {
        await typeLine(codeBody, [
            { text: 'public static void', cls: 'syn-keyword' },
            { text: ' ', cls: 'syn-default' },
            { text: 'main', cls: 'syn-method' },
            { text: '(', cls: 'syn-bracket' },
            { text: 'String[]', cls: 'syn-class' },
            { text: ' ', cls: 'syn-default' },
            { text: 'args', cls: 'syn-param' },
            { text: ') {', cls: 'syn-bracket' }
        ], 1);

        // Line 3:     System.out.println("Olá, Mundo!");
        await typeLine(codeBody, [
            { text: 'System', cls: 'syn-class' },
            { text: '.out.', cls: 'syn-default' },
            { text: 'println', cls: 'syn-method' },
            { text: '(', cls: 'syn-bracket' },
            { text: '"Olá, mundo."', cls: 'syn-string' },
            { text: ');', cls: 'syn-bracket' }
        ], 2);

        // Line 4:   }  (close main)
        await typeLine(codeBody, [
            { text: '}', cls: 'syn-bracket' }
        ], 1);

        removeCursor();
        await sleep(SECTION_PAUSE);

        // ❌ FORGOT the closing } — go straight to compile
        await typeTermLine('$ javac Inicio.java', 'term-prompt');
        await sleep(600);

        // Error! → ⚡ GLITCH EFFECT & 🗨️ Speech
        showBubble('Hmm... algo deu errado', 3500);
        await showTermOutput('error: reached end of file', 'term-error');
        await showTermOutput('while parsing', 'term-error');
        await showTermOutput('1 error', 'term-error');
        triggerEffect('glitch', 600);
        await sleep(ERROR_PAUSE);

        // Clear terminal
        codeTerminal.innerHTML = '';
        codeTerminal.classList.remove('visible');

        // Go back and add the missing }
        await sleep(500);

        // Fix: 🗨️ Ah, faltou a chave!
        showBubble('Ah, faltou a chave!', 3000);
        await sleep(1000); // little pause to "think"

        await typeLine(codeBody, [
            { text: '}', cls: 'syn-bracket' }
        ]);

        removeCursor();
        await sleep(SECTION_PAUSE);

        // Terminal: compile again → 🔄 LOADING EFFECT & 🗨️ Agora sim!
        showBubble('Agora sim! 🚀', 3500);
        triggerEffect('loading', 2000);
        await typeTermLine('$ javac Inicio.java', 'term-prompt');
        await sleep(500);
        await showTermOutput('✓ Compilado com sucesso', 'term-success');
        await sleep(600);

        // Run it → 💻 SCAN LINE starts immediately + swap to real photo
        triggerEffect('scanning', 1800);
        await typeTermLine('$ java Inicio', 'term-prompt');
        swapToReal();
        await sleep(400);

        await showTermOutput('Olá, mundo.', 'term-output');
        await sleep(800);
        await showTermOutput('Iniciando missão...', 'term-success');

        // Keep real photo visible for a good while (equal time to avatar)
        await sleep(8000);

        // Fade back to avatar for next cycle
        swapToAvatar();
        await sleep(800);
    }

    // ---- Loop ----
    async function loop() {
        while (true) {
            await runAnimation();
        }
    }

    // Start with a small delay after page load
    setTimeout(loop, 2000);
});
