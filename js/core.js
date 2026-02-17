const memDisplay = document.getElementById('status-mem');
const logContainer = document.getElementById('activity-log');

window.sfxClick = new Audio('assets/click.mp3'); 
window.sfxHover = new Audio('assets/hover.mp3');
window.bgm = new Audio('assets/bgm.mp3'); 

let sfxVolume = 0.3;
let musicVolume = 0.15;

window.bgm.loop = true;
window.bgm.volume = musicVolume;

const themes = {
    kyakz: { bg: '#09090b', accent: '#ef4444' },
    matrix: { bg: '#020602', accent: '#22c55e' },
    cyberpunk: { bg: '#0f0214', accent: '#d946ef' },
    gold: { bg: '#0f0b02', accent: '#eab308' },
    ocean: { bg: '#020617', accent: '#0ea5e9' },
    overclock: { bg: '#1a0000', accent: '#ff0000' }
};

const sysLogs = [    
    "[GRIM] Init Grimworks kernel v4.2.0",
    "[GRIM] Thread: REALTIME for Dark Star",
    "[GRIM] Bytecode optimized (+14% spd)",
    "[GRIM] Signal bridge: Client <-> Svr",
    "[GRIM] Mem stabilized at 512MB",
    "[GRIM] Patching logic via Crew-Build",
    "[GRIM] Telemetry sent to Master Node",
    "[AUTH] FluxxyBoi pinged (12ms)",
    "[IO] Writing profile: Martianzz",
    "[NET] Gentoi node routing: 99.9%",
    "[MATH] Itxal hash grid recalibrated",
    "[SYS] Dark Star Global-Illum bake",
    "[NET] Replicating 405 entities: Mart",
    "[SEC] Gentoi login encrypted (AES)",
    "[SYS] FluxxyBoi set to Worker #3",
    "[IO] Itxal buffer flushed to DStore",
    "[NET] Latency: Itxal offset adj (4ms)",
    "[MATH] Martianzz flow-field normal",
    "[CREW] Maint-Crew: OPERATIONAL",
    "[CREW] Janitor reaped 142 signals",
    "[CREW] GPU Fan RPM: Within limits",
    "[CREW] Access rotated: Gentoi-Clear",
    "[CREW] FluxxyBoi RemoteEvent throttle",
    "[CREW] Patch 'Maint_v2' deployed",
    "[SEC] Anomalous Seg-7: ISOLATING",
    "[SEC] Suspicious Physics: FluxxyBoi",
    "[SEC] Pattern check: False Positive",
    "[WARN] Anomalous clock: Re-syncing",
    "[MATH] Anomalous vector SIMD fix",
    "[SYS] Buffer overflow block: ANOM",
    "[NET] Packet loss US-E: Martianzz",
    "[NET] Re-syncing client clock tick",
    "[NET] Delta-Comp: 88% bandwidth save",
    "[NET] Gentoi P2P relay established",
    "[NET] UDP Saturated: Coalescing...",
    "[NET] Itxal bandwidth limit: 128kb",
    "[NET] Handshake mismatch: DROP",
    "[SYS] GC Gen-2 complete (1.2ms)",
    "[SYS] Mesh optimize: Dark Star",
    "[SYS] Dark Star VRAM upload OK",
    "[SYS] Texture pool: 12 assets out",
    "[MATH] SIMD Raycast: Martianzz",
    "[MATH] Itxal IK solver converged",
    "[SYS] Parallel Actor: Terrain_Gen",
    "[MATH] Dark Star Octree rebuilt",
    "[SYS] Grimworks Sanity: PASSED",
    "[SEC] Heuristic: SYSTEM CLEAN",
    "[SYS] Dark Star: ALL NOMINAL",
    "[IO] Load: Grimworks_Prod_Final",
    "[SYS] Uptime 432:12:05: GREEN"
];

function setupCanvas(canvas) {
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height };
}

if (memDisplay) {
    setInterval(() => {
        memDisplay.innerText = `MEM: ${Math.floor(Math.random() * 5 + 12)}MB`;
    }, 2000);
}

window.setSfxVolume = (val) => { sfxVolume = val; };
window.setMusicVolume = (val) => { musicVolume = val; window.bgm.volume = val; };

window.playSound = (type) => {
    const sound = (type === 'click' ? window.sfxClick : window.sfxHover).cloneNode();
    sound.volume = type === 'click' ? sfxVolume : (sfxVolume * 0.3);
    sound.play().catch(() => {});
}

window.setTheme = (name) => {
    const t = themes[name] || themes.kyakz;
    const root = document.documentElement.style;
    root.setProperty('--bg-color', t.bg);
    root.setProperty('--accent', t.accent);
    root.setProperty('--accent-dim', t.accent + '20');
    localStorage.setItem('kyakz_theme', name);
};

function bootModule(moduleId) {
    window.playSound('click');
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-zinc-800', 'border-accent', 'text-white');
        btn.classList.add('border-transparent', 'text-zinc-400');
    });

    const activeBtn = document.getElementById('nav-' + moduleId);
    if (activeBtn) {
        activeBtn.classList.add('bg-zinc-800', 'border-accent', 'text-white');
        activeBtn.classList.remove('border-transparent', 'text-zinc-400');
    }
    
    const modules = ['terminal', 'services', 'network', 'physics', 'data', 'ai', 'security', 'procedural', 'portfolio', 'identity', 'settings'];
    modules.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    
    const target = document.getElementById(moduleId);
    if (target) {
        target.classList.remove('hidden');
        window.dispatchEvent(new Event('resize'));
        logActivity(`MODULE_LOAD: /${moduleId}.lua`);
    }
}

function logActivity(msg) {
    if (!logContainer) return;
    const div = document.createElement('div');
    div.className = "text-zinc-400 truncate animate-pulse-short";
    div.innerText = msg || sysLogs[Math.floor(Math.random() * sysLogs.length)];
    logContainer.appendChild(div);
    if (logContainer.children.length > 5) logContainer.removeChild(logContainer.children[0]);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('kyakz_theme');
    if (savedTheme) window.setTheme(savedTheme);

    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('mouseenter', () => window.playSound('hover'));
        btn.addEventListener('click', () => window.playSound('click'));
    });
});

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' && e.key !== 'Escape') return;
    const keyMap = {
        '1': 'terminal', '2': 'services', '3': 'portfolio', '4': 'network',
        '5': 'physics', '6': 'data', '7': 'ai',
        '8': 'security', '9': 'procedural', '0': 'settings'
    };
    if (keyMap[e.key]) bootModule(keyMap[e.key]);
    else if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        bootModule('terminal');
        setTimeout(() => document.getElementById('cmd-input')?.focus(), 50);
    }
});

setInterval(() => { if (Math.random() > 0.7) logActivity(); }, 2500);