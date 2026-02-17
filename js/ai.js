(() => {
    const canvas = document.getElementById('aiCanvas');
    const computeDisplay = document.getElementById('ai-compute');
    const container = document.getElementById('ai');
    
    if (!canvas) return;

    let cols = 30;
    let rows = 0;
    let size = 0;
    let grid = [];
    let target = { x: 25, y: 10 };
    let agents = [];
    let boundX = 0;
    let boundY = 0;

    for (let i = 0; i < 500; i++) {
        agents.push({ x: 0, y: 0, vx: 0, vy: 0, speed: Math.random() * 0.5 + 2 });
    }

    const initGrid = (width, height) => {
        size = Math.floor(width / cols);
        rows = Math.floor(height / size);
        boundX = cols * size;
        boundY = rows * size;

        canvas.height = boundY;
        canvas.width = boundX;
        
        grid = Array.from({ length: cols }, () => 
            Array.from({ length: rows }, () => ({ 
                wall: false, 
                vec: { x: 0, y: 0 }, 
                dist: 999 
            }))
        );
        
        agents.forEach(a => {
            a.x = Math.random() * (boundX - 10) + 5;
            a.y = Math.random() * (boundY - 10) + 5;
        });
        
        calcFlow();
    };

    const calcFlow = () => {
        const start = performance.now();
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                grid[x][y].dist = 999;
            }
        }
        
        const queue = [];
        if (target.x >= 0 && target.x < cols && target.y >= 0 && target.y < rows) {
            grid[target.x][target.y].dist = 0;
            queue.push(target);
        }

        while (queue.length > 0) {
            const curr = queue.shift();
            [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dx, dy]) => {
                const nx = curr.x + dx;
                const ny = curr.y + dy;
                if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !grid[nx][ny].wall && grid[nx][ny].dist === 999) {
                    grid[nx][ny].dist = grid[curr.x][curr.y].dist + 1;
                    queue.push({ x: nx, y: ny });
                }
            });
        }

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (grid[x][y].wall || grid[x][y].dist === 999) {
                    grid[x][y].vec = { x: 0, y: 0 };
                    continue;
                }
                
                let best = { dist: grid[x][y].dist, dx: 0, dy: 0 };
                [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dx, dy]) => {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[nx][ny].dist < best.dist) {
                        best = { dist: grid[nx][ny].dist, dx, dy };
                    }
                });
                
                const len = Math.hypot(best.dx, best.dy);
                if (len > 0) grid[x][y].vec = { x: best.dx / len, y: best.dy / len };
            }
        }
        
        if (computeDisplay) {
            computeDisplay.innerText = `${(performance.now() - start).toFixed(2)}ms`;
        }
    };

    const loop = () => {
        if (container?.classList.contains('hidden')) return requestAnimationFrame(loop);
        if (typeof setupCanvas === 'undefined') return requestAnimationFrame(loop);

        const { ctx, width } = setupCanvas(canvas);
        const rect = canvas.parentElement.getBoundingClientRect();
        
        if (size === 0 || Math.abs(Math.floor(width / cols) - size) > 1) {
            initGrid(width, rect.height);
        }

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const cx = x * size;
                const cy = y * size;
                if (grid[x][y].wall) {
                    ctx.fillStyle = '#3f3f46';
                    ctx.fillRect(cx + 1, cy + 1, size - 2, size - 2);
                } else if (x === target.x && y === target.y) {
                    ctx.fillStyle = '#22c55e';
                    ctx.fillRect(cx + 1, cy + 1, size - 2, size - 2);
                } else {
                    ctx.strokeStyle = '#27272a';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    const mx = cx + size / 2;
                    const my = cy + size / 2;
                    ctx.moveTo(mx, my);
                    ctx.lineTo(mx + grid[x][y].vec.x * (size / 3), my + grid[x][y].vec.y * (size / 3));
                    ctx.stroke();
                }
            }
        }

        const accent = getComputedStyle(document.body).getPropertyValue('--accent') || '#ef4444';
        ctx.fillStyle = accent;
        
        agents.forEach(a => {
            for (let i = 0; i < 16; i++) {
                const gx = Math.floor(a.x / size);
                const gy = Math.floor(a.y / size);
                
                if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
                    const f = grid[gx][gy].vec;
                    a.vx += f.x * 0.04; 
                    a.vy += f.y * 0.04;
                }
                
                a.vx *= 0.99;
                a.vy *= 0.99;
                
                const nextX = a.x + (a.vx * a.speed) * 0.0625;
                const nextY = a.y + (a.vy * a.speed) * 0.0625;
                const nextGx = Math.floor(nextX / size);
                const nextGy = Math.floor(nextY / size);

                if (nextGx >= 0 && nextGx < cols && nextGy >= 0 && nextGy < rows && grid[nextGx][nextGy].wall) {
                    a.vx *= -0.5;
                    a.vy *= -0.5;
                } else {
                    a.x = nextX;
                    a.y = nextY;
                }

                a.x = Math.max(1, Math.min(a.x, boundX - 1));
                a.y = Math.max(1, Math.min(a.y, boundY - 1));
            }
            
            ctx.beginPath();
            ctx.arc(a.x, a.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(loop);
    };

    canvas.onmousedown = e => {
        if (e.button === 2) e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / size);
        const y = Math.floor((e.clientY - rect.top) / size);
        
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            if (e.button === 0) {
                if (x !== target.x || y !== target.y) {
                    grid[x][y].wall = !grid[x][y].wall;
                    calcFlow();
                }
            } else if (e.button === 2) {
                if (!grid[x][y].wall) {
                    target = { x, y };
                    calcFlow();
                }
            }
        }
    };

    canvas.oncontextmenu = e => e.preventDefault();
    loop();
})();