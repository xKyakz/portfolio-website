(() => {
    const canvas = document.getElementById('secCanvas');
    const statusEl = document.getElementById('sec-status');
    const container = document.getElementById('security');

    let history = new Array(100).fill(50);
    let hackType = null;
    let timer = null;

    window.injectHack = type => {
        hackType = type;
        clearTimeout(timer);
        timer = setTimeout(() => { hackType = null; }, 2000);
    };

    const loop = () => {
        if (!container || container.classList.contains('hidden')) return requestAnimationFrame(loop);
        if (typeof setupCanvas === 'undefined') return requestAnimationFrame(loop);

        const { ctx, width, height } = setupCanvas(canvas);

        let velocity = 50;
        let jitter = (Math.random() - 0.5) * 5;

        if (hackType === 'lag') {
            if (Math.random() > 0.8) jitter += (Math.random() > 0.5 ? 100 : -50);
        } else if (hackType === 'fly') {
            velocity = 120;
        }

        history.push(velocity + jitter);
        history.shift();

        const avg = history.reduce((a, b) => a + b) / history.length;
        const variance = history.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / history.length;

        const updateStatus = (text, className) => {
            statusEl.innerText = text;
            statusEl.className = className;
        };

        if (avg > 90) {
            updateStatus("DETECTED: FLY HACK", "text-xl font-bold text-red-500 animate-pulse");
        } else if (variance > 500) {
            updateStatus("ANALYSIS: LAG SPIKE (IGNORED)", "text-xl font-bold text-yellow-500");
        } else {
            updateStatus("STATUS: CLEAN", "text-xl font-bold text-green-500");
        }

        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < height; i += 40) {
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
        }
        ctx.stroke();

        ctx.strokeStyle = avg > 90 ? '#ef4444' : '#22c55e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const step = width / (history.length - 1);
        history.forEach((val, i) => {
            const x = i * step;
            const y = height - (val / 200) * height;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();

        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        const threshY = height - (100 / 200) * height;
        ctx.moveTo(0, threshY);
        ctx.lineTo(width, threshY);
        ctx.stroke();
        ctx.setLineDash([]);

        requestAnimationFrame(loop);
    };

    loop();
})();