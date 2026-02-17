(() => {
    const screen = document.getElementById('boot-screen');
    const log = document.getElementById('boot-log');
    const memDisplay = document.getElementById('boot-mem');
    const bar = document.getElementById('boot-bar');
    
    if (!screen) return;

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
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch(e) {}
    };

    let memCount = 0;
    const maxMem = 64000;
    const memInterval = setInterval(() => {
        memCount += 1234;
        if (memCount >= maxMem) {
            memCount = maxMem;
            clearInterval(memInterval);
        }
        memDisplay.innerText = `${memCount}KB OK`;
    }, 50);

    const typeLine = () => {
        if (lineIndex >= sequence.length) {
            finishBoot();
            return;
        }

        const data = sequence[lineIndex];
        const line = document.createElement('div');
        if (data.color) line.className = data.color;
        log.appendChild(line);

        let charIndex = 0;
        
        const progress = ((lineIndex + 1) / sequence.length) * 100;
        bar.style.width = `${progress}%`;

        const typeChar = () => {
            if (charIndex < data.text.length) {
                line.textContent += data.text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, bootSpeed);
            } else {
                lineIndex++;
                if (data.delay === 800) playBeep(1200); // Success beep
                else if (Math.random() > 0.8) playBeep(150, 'sawtooth'); // Random "crunch" noise
                setTimeout(typeLine, data.delay);
            }
        };

        typeChar();
    };

    const finishBoot = () => {
        clearInterval(memInterval);
        memDisplay.innerText = "64KB OK";
        bar.style.width = "100%";
        bar.classList.add('bg-green-500');

        setTimeout(() => {
            const flash = document.createElement('div');
            flash.className = "fixed inset-0 bg-white z-[101] pointer-events-none mix-blend-overlay";
            document.body.appendChild(flash);
            
            screen.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
            screen.style.opacity = "0";
            screen.style.transform = "scale(1.1)";
            
            flash.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });

            setTimeout(() => {
                screen.remove();
                flash.remove();
            }, 500);
        }, 500);
    };

    setTimeout(typeLine, 500);

})();