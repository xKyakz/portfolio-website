(() => {
    const canvas = document.getElementById('procCanvas');
    const coordDisplay = document.getElementById('proc-coords');
    const container = document.getElementById('procedural');

    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const lerp = (a, b, t) => a + (b - a) * t;

    const noise = (x, y) => {
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return n - Math.floor(n);
    };

    const smoothNoise = (x, y) => {
        const i = Math.floor(x);
        const j = Math.floor(y);
        
        const a = noise(i, j);
        const b = noise(i + 1, j);
        const c = noise(i, j + 1);
        const d = noise(i + 1, j + 1);
        
        let u = x - i;
        let v = y - j;
        
        u = u * u * (3 - 2 * u);
        v = v * v * (3 - 2 * v);

        return lerp(lerp(a, b, u), lerp(c, d, u), v);
    };

    const loop = () => {
        if (container?.classList.contains('hidden')) return requestAnimationFrame(loop);
        if (typeof setupCanvas === 'undefined') return requestAnimationFrame(loop);

        const { ctx, width, height } = setupCanvas(canvas);
        const TILE_SIZE = 20;

        const startCol = Math.floor(offsetX / TILE_SIZE);
        const startRow = Math.floor(offsetY / TILE_SIZE);
        const numCols = Math.ceil(width / TILE_SIZE) + 1;
        const numRows = Math.ceil(height / TILE_SIZE) + 1;

        const shiftX = offsetX % TILE_SIZE;
        const shiftY = offsetY % TILE_SIZE;

        for (let c = 0; c < numCols; c++) {
            for (let r = 0; r < numRows; r++) {
                const worldX = startCol + c;
                const worldY = startRow + r;

                const val = smoothNoise(worldX * 0.1, worldY * 0.1);
                
                if (val < 0.3) ctx.fillStyle = '#0ea5e9';
                else if (val < 0.35) ctx.fillStyle = '#fde047';
                else if (val < 0.6) ctx.fillStyle = '#22c55e';
                else ctx.fillStyle = '#166534';

                ctx.fillRect(
                    (c * TILE_SIZE) - shiftX, 
                    (r * TILE_SIZE) - shiftY, 
                    TILE_SIZE, 
                    TILE_SIZE
                );
            }
        }

        if (coordDisplay) coordDisplay.innerText = `${Math.floor(offsetX)}, ${Math.floor(offsetY)}`;
        requestAnimationFrame(loop);
    };

    loop();

    if (canvas) {
        canvas.onmousedown = e => {
            isDragging = true;
            [lastX, lastY] = [e.clientX, e.clientY];
            canvas.style.cursor = 'grabbing';
        };

        window.onmousemove = e => {
            if (isDragging) {
                offsetX -= (e.clientX - lastX);
                offsetY -= (e.clientY - lastY);
                [lastX, lastY] = [e.clientX, e.clientY];
            }
        };

        window.onmouseup = () => {
            isDragging = false;
            canvas.style.cursor = 'move';
        };
    }
})();