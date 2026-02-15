// utils
function setupCanvas(canvas) {
    if(!canvas) return null;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height };
}

// boot
const memDisplay = document.getElementById('status-mem');
if(memDisplay) {
    setInterval(() => { memDisplay.innerText = `MEM: ${Math.floor(Math.random() * 5 + 12)}MB`; }, 2000);
}

function bootModule(moduleId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-zinc-800', 'border-red-500', 'text-white');
        btn.classList.add('border-transparent', 'text-zinc-400');
    });

    const btn = document.getElementById('nav-' + moduleId);
    if(btn) {
        btn.classList.add('bg-zinc-800', 'border-red-500', 'text-white');
        btn.classList.remove('border-transparent', 'text-zinc-400');
    }

    ['terminal', 'network', 'physics', 'data', 'ai'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden');
    });

    const mod = document.getElementById(moduleId);
    if(mod) mod.classList.remove('hidden');

    if (moduleId === 'network' || moduleId === 'physics' || moduleId === 'ai') {
        window.dispatchEvent(new Event('resize'));
    }
}