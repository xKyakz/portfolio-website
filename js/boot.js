(() => {
    const screen = document.getElementById('boot-screen');
    const log = document.getElementById('boot-log');
    const bootMem = document.getElementById('boot-mem');
    const bar = document.getElementById('boot-bar');
    
    if (!screen) return;

    const overlay = document.createElement('div');
    overlay.className = "absolute inset-0 flex items-center justify-center bg-black z-[110] cursor-pointer group";
    overlay.innerHTML = `<div class="text-accent font-bold animate-pulse group-hover:scale-105 transition-transform underline tracking-widest uppercase">[ Click to Initialize System ]</div>`;
    screen.appendChild(overlay);

    const bootSpeed = 2;
    const sequence = [
        { text: "FLUXFORGE KERNEL RE-V6 [BUILD 1029]", delay: 50 },
        { text: "CORE: 64-BIT LUAU VM // JIT-COMPILER ENABLED", delay: 50 },
        { text: "MOUNTING /ROOT/ARCHIVES/COMMISSIONS ... OK", delay: 200 },
        { text: "LINKING REPLICATION_GRAPH (PORT 420) ... SUCCESS", delay: 100 },
        { text: "INITIALIZING PARALLEL ACTOR_POOL [THREAD_COUNT: 8] ...", delay: 150 },
        { text: "ALLOCATING VIRTUAL HEAP SPACE ... 64MB", delay: 100 },
        { text: "LOADING SUBSYSTEMS:", delay: 300 },
        { text: "  > NETCODE_REWIND ......... [ ACTIVE ]", delay: 50, color: "text-blue-400" },
        { text: "  > SPATIAL_HASH_O(1) ...... [ ACTIVE ]", delay: 50, color: "text-blue-400" },
        { text: "  > FLOW_FIELD_AI .......... [ ACTIVE ]", delay: 50, color: "text-blue-400" },
        { text: "  > HEURISTIC_SECURITY ..... [ ACTIVE ]", delay: 50, color: "text-blue-400" },
        { text: "VERIFYING USER PERMISSIONS ... KYAKZ // ADMIN", delay: 400 },
        { text: "OS BOOT COMPLETE. ACCESS GRANTED.", delay: 600, color: "text-green-500 font-bold" }
    ];

    let lineIndex = 0;
    
    const playBeep = (freq = 800, type = 'square') => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch(e) {}
    };

    const startBoot = () => {
        overlay.remove();
        if (window.bgm) window.bgm.play().catch(() => {});
        
        let memCount = 0;
        const memInterval = setInterval(() => {
            memCount += 1234;
            if (memCount >= 64000) {
                memCount = 64000;
                clearInterval(memInterval);
            }
            if (bootMem) bootMem.innerText = `${memCount}KB OK`;
        }, 50);

        typeLine();
    };

    overlay.onclick = startBoot;

    const typeLine = () => {
        if (lineIndex >= sequence.length) {
            setTimeout(finishBoot, 500);
            return;
        }

        const data = sequence[lineIndex];
        const line = document.createElement('div');
        if (data.color) line.className = data.color;
        log.appendChild(line);

        let charIndex = 0;
        bar.style.width = `${((lineIndex + 1) / sequence.length) * 100}%`;

        const typeChar = () => {
            if (charIndex < data.text.length) {
                line.textContent += data.text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, bootSpeed);
            } else {
                lineIndex++;
                if (data.text.includes("COMPLETE")) playBeep(1200);
                else if (Math.random() > 0.8) playBeep(200, 'sawtooth');
                setTimeout(typeLine, data.delay);
            }
        };
        typeChar();
    };

    const finishBoot = () => {
        bar.classList.add('bg-green-500');
        setTimeout(() => {
            const flash = document.createElement('div');
            flash.className = "fixed inset-0 bg-white z-[120] pointer-events-none mix-blend-overlay";
            document.body.appendChild(flash);
            
            screen.style.transition = "opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
            screen.style.opacity = "0";
            screen.style.transform = "scale(1.1)";
            
            setTimeout(() => {
                screen.remove();
                flash.remove();
            }, 800);
        }, 500);
    };
})();