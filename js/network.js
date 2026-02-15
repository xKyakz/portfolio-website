// --- 3. NETWORK ---
(function() {
    const canvas = document.getElementById('netCanvas');
    const slider = document.getElementById('pingSlider');
    const pingDisplay = document.getElementById('pingValue');
    
    if(!canvas) return;

    let algorithm = 'standard';
    let tick = 0;
    const positionBuffer = [];
    const target = { x: 0, y: 0, radius: 20 };
    const particles = [];

    function loop() {
        // Core function from core.js must be loaded
        if(typeof setupCanvas === 'undefined') return requestAnimationFrame(loop);

        const { ctx, width, height } = setupCanvas(canvas);
        tick++;
        
        // Logic
        target.x = width / 2 + Math.sin(tick * 0.02) * (width * 0.35);
        target.y = height / 2 + Math.cos(tick * 0.03) * (height * 0.2);
        positionBuffer.push({ x: target.x, y: target.y });
        if (positionBuffer.length > 600) positionBuffer.shift();

        const ping = parseInt(slider.value);
        pingDisplay.innerText = ping;

        // Draw
        ctx.fillStyle = '#18181b'; ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = '#27272a'; ctx.beginPath();
        for(let i=0; i<width; i+=40) { ctx.moveTo(i,0); ctx.lineTo(i,height); }
        for(let i=0; i<height; i+=40) { ctx.moveTo(0,i); ctx.lineTo(width,i); }
        ctx.stroke();

        const ghostIndex = Math.floor(positionBuffer.length - 1 - (ping / 16));
        const ghostPos = positionBuffer[Math.max(0, ghostIndex)] || target;

        if (algorithm === 'standard') {
            ctx.fillStyle = '#3f3f46'; ctx.beginPath();
            ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2); ctx.fill();
        }

        ctx.shadowBlur = 15; ctx.shadowColor = '#ef4444';
        ctx.fillStyle = '#ef4444'; ctx.beginPath();
        ctx.arc(ghostPos.x, ghostPos.y, target.radius, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        particles.forEach((p, i) => {
            p.life--;
            ctx.fillStyle = p.color; ctx.globalAlpha = p.life / 30;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
            if (p.life <= 0) particles.splice(i, 1);
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(loop);
    }
    loop();

    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const ping = parseInt(slider.value);
        let hit = false;

        if (algorithm === 'standard') {
            const dist = Math.hypot(mouseX - target.x, mouseY - target.y);
            if (dist < target.radius) hit = true;
        } else {
            const ghostIndex = Math.floor(positionBuffer.length - 1 - (ping / 16));
            const pastPos = positionBuffer[Math.max(0, ghostIndex)] || target;
            const dist = Math.hypot(mouseX - pastPos.x, mouseY - pastPos.y);
            if (dist < target.radius) hit = true;
        }

        particles.push({
            x: mouseX, y: mouseY, 
            color: hit ? '#22c55e' : '#71717a',
            radius: hit ? 10 : 4, life: 30
        });
    });

    window.setAlgo = function(type) {
        algorithm = type;
        const btnStd = document.getElementById('btn-algo-std');
        const btnKyakz = document.getElementById('btn-algo-kyakz');
        const codeStd = document.getElementById('code-net-std');
        const codeKyakz = document.getElementById('code-net-kyakz');

        const activeBtn = "px-4 py-1 text-xs font-bold rounded bg-red-600 text-white transition-all";
        const inactiveBtn = "px-4 py-1 text-xs font-bold rounded text-zinc-500 hover:text-white transition-all";
        
        if(type === 'standard') { 
            btnStd.className = activeBtn; btnKyakz.className = inactiveBtn; 
            codeStd.className = "code-active bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs overflow-hidden text-zinc-500 relative h-40";
            codeKyakz.className = "code-inactive bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs overflow-hidden text-zinc-300 relative h-40";
        } else { 
            btnStd.className = inactiveBtn; btnKyakz.className = activeBtn; 
            codeStd.className = "code-inactive bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs overflow-hidden text-zinc-500 relative h-40";
            codeKyakz.className = "code-active bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs overflow-hidden text-zinc-300 relative h-40";
        }
    };
})();