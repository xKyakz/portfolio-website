(() => {
    const canvas = document.getElementById('phyCanvas');
    const statsChecks = document.getElementById('phy-checks');
    const statsOpt = document.getElementById('phy-opt');
    
    if (!canvas) return;

    let mode = 'standard';
    let particles = [];
    
    const initParticles = (w, h) => {
        particles = Array.from({ length: 250 }, () => ({
            x: Math.random() * w, 
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 2, 
            vy: (Math.random() - 0.5) * 2
        }));
    };

    const loop = () => {
        if (typeof setupCanvas === 'undefined') return requestAnimationFrame(loop);

        const { ctx, width, height } = setupCanvas(canvas);
        if (particles.length === 0) initParticles(width, height);

        particles.forEach(p => {
            p.x += p.vx; 
            p.y += p.vy;

            if (p.x < 0 || p.x > width) {
                p.x = p.x < 0 ? 0 : width;
                p.vx *= -1;
            }
            if (p.y < 0 || p.y > height) {
                p.y = p.y < 0 ? 0 : height;
                p.vy *= -1;
            }
        });

        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, width, height);
        let checks = 0;

        if (mode === 'standard') {
            ctx.fillStyle = '#71717a';
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.strokeStyle = 'rgba(239, 68, 68, 0.05)';
            ctx.beginPath();
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    checks++;
                    if (Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y) < 40) {
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                    }
                }
            }
            ctx.stroke();
        } else {
            const CELL = 80;
            ctx.strokeStyle = '#27272a';
            ctx.beginPath();
            for (let x = 0; x < width; x += CELL) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
            for (let y = 0; y < height; y += CELL) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
            ctx.stroke();

            const grid = {};
            particles.forEach(p => {
                const key = `${Math.floor(p.x / CELL)},${Math.floor(p.y / CELL)}`;
                if (!grid[key]) grid[key] = [];
                grid[key].push(p);
            });

            ctx.fillStyle = '#22c55e';
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();

                const cx = Math.floor(p.x / CELL);
                const cy = Math.floor(p.y / CELL);

                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        const cell = grid[`${cx + x},${cy + y}`];
                        if (cell) {
                            cell.forEach(n => {
                                if (n === p) return;
                                checks++;
                                if (Math.hypot(p.x - n.x, p.y - n.y) < 40) {
                                    ctx.beginPath();
                                    ctx.moveTo(p.x, p.y);
                                    ctx.lineTo(n.x, n.y);
                                    ctx.stroke();
                                }
                            });
                        }
                    }
                }
            });
        }

        statsChecks.innerText = checks.toLocaleString();
        const worst = (250 * 249) / 2;
        
        if (mode === 'spatial') {
            statsOpt.innerText = `${Math.round(((worst - checks) / worst) * 100)}% FASTER`;
            statsOpt.className = "text-green-500 font-bold";
            statsChecks.className = "text-green-500 font-bold";
        } else {
            statsOpt.innerText = "0% (BASELINE)";
            statsOpt.className = "text-red-500 font-bold";
            statsChecks.className = "text-red-500 font-bold";
        }
        requestAnimationFrame(loop);
    };

    window.setPhyAlgo = type => {
        mode = type;
        const btnStd = document.getElementById('btn-phy-std');
        const btnKyakz = document.getElementById('btn-phy-kyakz');
        const codeStd = document.getElementById('code-phy-std');
        const codeKyakz = document.getElementById('code-phy-kyakz');
        
        const inactiveBtn = "px-4 py-1 text-xs font-bold rounded text-zinc-500 hover:text-white transition-all";
        
        if (type === 'standard') { 
            btnStd.className = "px-4 py-1 text-xs font-bold rounded bg-red-600 text-white transition-all";
            btnKyakz.className = inactiveBtn; 
            codeStd.className = "code-active bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs overflow-hidden text-zinc-500 relative h-40";
            codeKyakz.className = "code-inactive bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs overflow-hidden text-zinc-300 relative h-40";
        } else { 
            btnStd.className = inactiveBtn;
            btnKyakz.className = "px-4 py-1 text-xs font-bold rounded bg-green-600 text-white transition-all"; 
            codeStd.className = "code-inactive bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs overflow-hidden text-zinc-500 relative h-40";
            codeKyakz.className = "code-active bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs overflow-hidden text-zinc-300 relative h-40";
        }
    };

    loop();
})();