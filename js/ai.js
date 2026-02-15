(function() {
    // 1. Inject the Module UI
    const container = document.getElementById('ai');
    if (!container) return; // Safety check

    container.innerHTML = `
        <div class="mb-4">
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-1">AI Navigation <span class="text-[var(--accent)]">//</span> Flow Fields</h2>
            <p class="text-zinc-400 text-sm">Pathfinding for 1,000+ units. <strong>Click to place/remove walls.</strong></p>
        </div>
        <div class="relative flex-1 bg-zinc-900/50 border border-zinc-700 rounded-xl overflow-hidden cursor-crosshair min-h-[300px]">
            <canvas id="aiCanvas" class="w-full h-full"></canvas>
            
            <div class="absolute top-4 left-4 pointer-events-none text-xs font-mono text-zinc-500 bg-black/60 p-2 rounded backdrop-blur-sm border border-zinc-800">
                <div>AGENTS: <span class="text-white font-bold">500</span></div>
                <div>COMPUTE: <span id="ai-compute" class="text-green-500 font-bold">0ms</span></div>
            </div>
        </div>
        
        <div class="mt-4 bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs text-zinc-400 relative">
             <div class="absolute top-0 right-0 bg-red-900/50 text-red-200 text-[9px] px-2 py-0.5 rounded-bl uppercase tracking-wider">Flow Field Algo</div>
<pre>
<span class="text-purple-400">function</span> <span class="text-blue-400">FlowField:Update</span>(target)
    <span class="text-zinc-500">-- 1. Flood Fill Distance Map (Dijkstra)</span>
    <span class="text-blue-400">self</span>:CalculateDistances(target)
    
    <span class="text-zinc-500">-- 2. Generate Vector Field</span>
    <span class="text-purple-400">for</span> x, y <span class="text-purple-400">in</span> <span class="text-blue-400">grid</span> <span class="text-purple-400">do</span>
        <span class="text-zinc-500">-- Agent just looks at ground to see direction</span>
        <span class="text-blue-400">grid</span>[x][y].Vector = <span class="text-blue-400">self</span>:GetLowestNeighbor(x, y)
    <span class="text-purple-400">end</span>
<span class="text-purple-400">end</span>
</pre>
        </div>
    `;

    // 2. The Logic
    const canvas = document.getElementById('aiCanvas');
    const computeDisplay = document.getElementById('ai-compute');
    
    let cols = 20, rows = 12; // Grid size
    let size = 40; // Cell size (px)
    let grid = []; 
    let target = {x: 18, y: 6}; // Destination
    let agents = [];

    // Initialize Agents
    for(let i=0; i<500; i++) {
        agents.push({
            x: Math.random() * 800, 
            y: Math.random() * 600, 
            vx: 0, 
            vy: 0,
            speed: Math.random() * 0.5 + 2 // Slight speed variance
        });
    }

    function resetGrid() {
        grid = [];
        for(let x=0; x<cols; x++) {
            grid[x] = [];
            for(let y=0; y<rows; y++) {
                grid[x][y] = { 
                    wall: false, 
                    vec: {x:0, y:0}, 
                    dist: 999 // Infinite distance initially
                };
            }
        }
        calcFlow();
    }

    function calcFlow() {
        const start = performance.now();
        
        // Step A: Reset Distances
        for(let x=0; x<cols; x++) {
            for(let y=0; y<rows; y++) {
                if(grid[x][y].wall) grid[x][y].dist = 999;
                else grid[x][y].dist = 999;
            }
        }
        
        // Step B: Breadth-First Search (Flood Fill) from Target
        let q = [];
        grid[target.x][target.y].dist = 0;
        q.push(target);

        while(q.length > 0) {
            let curr = q.shift();
            // Check 4 neighbors
            [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dx, dy]) => {
                let nx = curr.x+dx, ny = curr.y+dy;
                // Bounds check + Wall check + Unvisited check
                if(nx>=0 && nx<cols && ny>=0 && ny<rows && !grid[nx][ny].wall && grid[nx][ny].dist===999) {
                    grid[nx][ny].dist = grid[curr.x][curr.y].dist + 1;
                    q.push({x:nx, y:ny});
                }
            });
        }

        // Step C: Generate Vectors (Point to neighbor with lowest distance)
        for(let x=0; x<cols; x++) {
            for(let y=0; y<rows; y++) {
                if(grid[x][y].wall || grid[x][y].dist===999) {
                    grid[x][y].vec = {x:0, y:0};
                    continue;
                }
                
                let best = {dist: grid[x][y].dist, dx:0, dy:0};
                
                [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dx, dy]) => {
                    let nx = x+dx, ny = y+dy;
                    if(nx>=0 && nx<cols && ny>=0 && ny<rows && grid[nx][ny].dist < best.dist) {
                        best = {dist: grid[nx][ny].dist, dx, dy};
                    }
                });
                
                // Normalize vector
                grid[x][y].vec = {x: best.dx, y: best.dy};
            }
        }
        
        const end = performance.now();
        computeDisplay.innerText = (end - start).toFixed(2) + "ms";
    }

    // Initial Setup
    resetGrid();
    // Add some random walls for interest
    for(let i=0; i<15; i++) {
        let wx = Math.floor(Math.random() * cols);
        let wy = Math.floor(Math.random() * rows);
        if((wx !== target.x || wy !== target.y) && wx > 2) {
            grid[wx][wy].wall = true;
        }
    }
    calcFlow();

    // 3. The Animation Loop
    function loop() {
        // If tab is hidden, skip render to save battery
        if(container.classList.contains('hidden')) return requestAnimationFrame(loop);
        if(typeof setupCanvas === 'undefined') return requestAnimationFrame(loop);

        const { ctx, width, height } = setupCanvas(canvas);
        
        // Recalculate cell size based on screen width
        const cellW = width / cols;
        const cellH = height / rows;

        // Draw Grid
        for(let x=0; x<cols; x++) {
            for(let y=0; y<rows; y++) {
                let cx = x * cellW;
                let cy = y * cellH;
                
                if(grid[x][y].wall) {
                    ctx.fillStyle = '#3f3f46'; // Wall color
                    ctx.fillRect(cx+1, cy+1, cellW-2, cellH-2);
                } else if (x === target.x && y === target.y) {
                    ctx.fillStyle = '#22c55e'; // Target color (Green)
                    ctx.fillRect(cx+1, cy+1, cellW-2, cellH-2);
                } else {
                    // Draw tiny vector arrow
                    ctx.strokeStyle = '#27272a';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    let mx = cx + cellW/2;
                    let my = cy + cellH/2;
                    ctx.moveTo(mx, my);
                    ctx.lineTo(mx + grid[x][y].vec.x * 8, my + grid[x][y].vec.y * 8);
                    ctx.stroke();
                }
            }
        }

        // Draw & Update Agents
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#ef4444';
        
        agents.forEach(a => {
            // 1. Determine which cell we are in
            let gx = Math.floor(a.x / cellW);
            let gy = Math.floor(a.y / cellH);
            
            // 2. Read the vector from that cell (The "Flow")
            if(gx>=0 && gx<cols && gy>=0 && gy<rows) {
                let force = grid[gx][gy].vec;
                a.vx += force.x * 0.5; // Acceleration
                a.vy += force.y * 0.5;
            }
            
            // 3. Physics (Friction + Movement)
            a.vx *= 0.9; 
            a.vy *= 0.9;
            a.x += a.vx * a.speed; 
            a.y += a.vy * a.speed;
            
            // 4. Wrap around screen (for infinite flow effect)
            if(a.x < 0) a.x = width;
            if(a.x > width) a.x = 0;
            if(a.y < 0) a.y = height;
            if(a.y > height) a.y = 0;

            // 5. Draw Dot
            ctx.beginPath(); 
            ctx.arc(a.x, a.y, 3, 0, Math.PI*2); 
            ctx.fill();
        });

        requestAnimationFrame(loop);
    }
    loop();

    // 4. Interaction (Place Walls)
    canvas.addEventListener('mousedown', e => {
        const rect = canvas.getBoundingClientRect();
        // Calculate which cell was clicked
        // (Using standard 20x12 grid assumption logic relative to canvas size)
        const cellW = rect.width / cols;
        const cellH = rect.height / rows;
        
        const x = Math.floor((e.clientX - rect.left) / cellW);
        const y = Math.floor((e.clientY - rect.top) / cellH);
        
        // Don't overwrite target
        if(x !== target.x || y !== target.y) {
            grid[x][y].wall = !grid[x][y].wall; // Toggle wall
            calcFlow(); // Re-calculate the ENTIRE map instantly
        }
    });
})();