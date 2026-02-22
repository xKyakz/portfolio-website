(() => {
    const mount = document.getElementById('services-container');
    if (!mount) return;

const tiers = [
        {
            id: "MODULE_INJECTION",
            name: "Component Scripting",
            cost: "$25.00 - $60.00 USD",
            devex: "7,000 - 17,000 R$",
            details: "I will create a single, fully functioning feature for your game, like a custom inventory, a secure saving system, or a weapon mechanic.",
            chips: ["LUA_U", "CLEAN_API", "PLUG_N_PLAY"]
        },
        {
            id: "SYSTEM_ARCHITECTURE",
            name: "Core Engine / Framework",
            cost: "$125.00 - $250.00+ USD",
            devex: "35,000 - 70,000+ R$",
            details: "I will build the entire foundation of your game. This includes the main game loop, securing the server against hackers, and ensuring everything runs smoothly.",
            chips: ["SCALABLE", "ACID_DATA", "HIGH_UPTIME"]
        },
        {
            id: "PERFORMANCE_AUDIT",
            name: "Optimization & Security",
            cost: "$25.00 USD / Hour",
            devex: "7,000 R$ / Hour",
            details: "I will fix your broken or laggy game. I track down memory leaks, patch security holes to stop exploiters, and make your game run perfectly on mobile devices.",
            chips: ["PROFILER", "ANTI_EXPLOIT", "FIXER"]
        }
    ];

    let html = '<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">';

    tiers.forEach(t => {
        html += `
        <div class="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl hover:border-accent transition-all">
            <div class="text-[10px] font-bold text-zinc-500 mb-2 tracking-widest">${t.id}</div>
            <div class="text-xl font-bold text-white mb-1">${t.name}</div>
            <div class="text-accent font-mono text-sm">${t.cost}</div>
            <div class="text-zinc-500 font-mono text-[10px] mb-4 uppercase">Robux: ${t.devex}</div>
            <p class="text-zinc-400 text-xs mb-6 leading-relaxed">${t.details}</p>
            <div class="flex flex-wrap gap-2">
                ${t.chips.map(c => `<span class="px-2 py-0.5 bg-zinc-800 text-[9px] text-zinc-400 rounded border border-zinc-700">${c}</span>`).join('')}
            </div>
        </div>`;
    });

    html += `</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-zinc-800 pt-8">
        <div>
            <h3 class="text-white font-bold mb-4 flex items-center text-sm">
                <span class="text-accent mr-2">>></span> CLIENT_REQUIREMENTS
            </h3>
            <ul class="space-y-4 text-xs text-zinc-400 leading-relaxed">
                <li class="flex items-start">
                    <span class="text-accent mr-2 font-bold">01.</span>
                    <span><strong class="text-zinc-300 uppercase">Clear Instructions:</strong> I need a highly detailed list of what you want. Vague ideas lead to mistakes; clear directions mean you get exactly what you paid for.</span>
                </li>
                <li class="flex items-start">
                    <span class="text-accent mr-2 font-bold">02.</span>
                    <span><strong class="text-zinc-300 uppercase">Free Adjustments:</strong> If you need minor changes after I finish (like tweaking a speed value or moving a UI button), I will do it for free.</span>
                </li>
                <li class="flex items-start">
                    <span class="text-accent mr-2 font-bold">03.</span>
                    <span><strong class="text-zinc-300 uppercase">Assets Ready:</strong> I am a programmer, not an artist. All 3D models, user interfaces (UI), and animations must be finished and given to me before I begin scripting.</span>
                </li>
                <li class="flex items-start">
                    <span class="text-accent mr-2 font-bold">04.</span>
                    <span><strong class="text-zinc-300 uppercase">Fixed Scope:</strong> The quoted price strictly covers the original task list. Asking to add brand-new mechanics or major redesigns halfway through the project will cost extra.</span>
                </li>
                <li class="flex items-start">
                    <span class="text-accent mr-2 font-bold">05.</span>
                    <span><strong class="text-zinc-300 uppercase">Payment Terms:</strong> For larger architecture projects, a partial upfront payment is required to lock in my schedule. I do not accept percentage-based pay (% revenue) for unreleased games.</span>
                </li>
            </ul>
        </div>
        <div>
            <h3 class="text-white font-bold mb-4 flex items-center text-sm">
                <span class="text-accent mr-2">>></span> THE_KYAKZ_WARRANTY
            </h3>
            <div class="bg-black/40 border border-zinc-800 p-5 rounded-lg border-l-2 border-l-accent">
                <p class="text-xs text-zinc-400 italic mb-4">
                    "I don't just write scripts; I build reliable game foundations based on six years of programming experience. My code is designed to be fast, secure, and unbreakable."
                </p>
                <div class="space-y-2 text-[11px]">
                    <div class="flex items-center text-green-500 font-bold uppercase tracking-tighter">
                        <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                        Lifetime Bug-Fix Guarantee
                    </div>
                    <p class="text-zinc-500 leading-tight">
                        If a bug or error is found in the code I wrote for you, I will fix it immediately at zero cost. I take full responsibility for my work.
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-12 text-center">
        <a href="https://x.com/xKyakz" target="_blank" class="inline-block bg-accent hover:bg-red-600 text-white font-bold py-3 px-10 rounded transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            [INITIATE_CONTRACT]
        </a>
        <div class="mt-3 text-[9px] text-zinc-600 font-mono tracking-widest uppercase">Encrypted Uplink Established // twitter.com</div>
    </div>`;

    mount.innerHTML = html;
})();