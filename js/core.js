// UTILITY: Canvas Setup
function setupCanvas(canvas) {
    if(!canvas) return null;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height };
}

// SYSTEM: Memory Noise
const memDisplay = document.getElementById('status-mem');
setInterval(() => { memDisplay.innerText = `MEM: ${Math.floor(Math.random() * 5 + 12)}MB`; }, 2000);

// SYSTEM: Boot Loader & Navigation
function bootModule(moduleId) {
    // Reset buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-zinc-800', 'border-red-500', 'text-white');
        btn.classList.add('border-transparent', 'text-zinc-400');
    });
    
    // Highlight Active Button
    const btn = document.getElementById('nav-' + moduleId);
    if(btn) {
        btn.classList.add('bg-zinc-800', 'border-red-500', 'text-white');
        btn.classList.remove('border-transparent', 'text-zinc-400');
    }
    
    // Switch Views
    ['terminal', 'network', 'physics', 'data'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    
    const mod = document.getElementById(moduleId);
    if(mod) mod.classList.remove('hidden');
    
    // Resize canvases to fix blur
    if (moduleId === 'network' || moduleId === 'physics') {
        window.dispatchEvent(new Event('resize'));
    }
}