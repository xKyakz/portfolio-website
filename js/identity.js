(() => {
    const mountPoint = document.getElementById('tech-stack-mount');
    if (!mountPoint) return;

    const stack = [
        {
            category: "Core Engineering",
            color: "blue",
            skills: [
                { 
                    name: "Luau (Strict)", 
                    desc: "Writing highly disciplined code. By strictly defining what every piece of data is, I catch 95% of bugs before the game even runs, resulting in faster and more stable gameplay."
                },
                { 
                    name: "Parallel Actors", 
                    desc: "Multi-threading. I split heavy background tasks (like loading massive maps) onto separate CPU cores so your game never freezes or drops frames for the player."
                },
                { 
                    name: "SIMD Math", 
                    desc: "Advanced math optimization. I structure game physics so the computer can process large groups of calculations all at once, rather than one by one."
                },
                { 
                    name: "Janitor / Maid", 
                    desc: "Automated cleanup systems. When a player leaves or a match ends, my code automatically deletes all unused memory to prevent the server from crashing over time."
                }
            ]
        },
        {
            category: "Network Architecture",
            color: "red",
            skills: [
                { 
                    name: "Buffer Serialization", 
                    desc: "Data compression. Instead of sending bulky messages between the server and players, I send tiny, raw data packets, reducing internet usage by up to 90%."
                },
                { 
                    name: "Delta Compression", 
                    desc: "Smart updates. Instead of updating everything on the screen every second, my system only updates the exact things that just moved or changed."
                },
                { 
                    name: "Lag Compensation", 
                    desc: "Fair combat systems. If a player shoots someone on their screen, the server 'rewinds' time to check if it was a fair hit, making combat feel smooth even on bad Wi-Fi."
                },
                { 
                    name: "Clock Sync", 
                    desc: "Keeping everyone on the same page. I sync the player's game clock perfectly with the server to stop characters from teleporting or stuttering."
                }
            ]
        },
        {
            category: "Infrastructure",
            color: "purple",
            skills: [
                { 
                    name: "Rojo / VS Code", 
                    desc: "Professional studio setup. I don't code directly inside Roblox; I use industry-standard software tools that allow for faster typing and better code organization."
                },
                { 
                    name: "Wally Pkg Mgr", 
                    desc: "A library system. It lets me safely install and manage tested, community-made tools without risking broken game files."
                },
                { 
                    name: "Lune Automation", 
                    desc: "Automated workflows. I use external scripts to automatically test features and build the game files without needing to open Roblox Studio."
                },
                { 
                    name: "Git Flow", 
                    desc: "Safe updates. I build and test new features in an isolated 'sandbox' before adding them to the live game, guaranteeing players never see broken updates."
                }
            ]
        },
        {
            category: "Algorithms",
            color: "yellow",
            skills: [
                { 
                    name: "ECS (Matter)", 
                    desc: "A modern way to organize game code. Instead of attaching scripts to every object, I group data together so the game can handle thousands of items without lagging."
                },
                { 
                    name: "Spatial Hash", 
                    desc: "Instant collision detection. Instead of checking every object on the map to see if they touched, the system only checks objects standing right next to each other."
                },
                { 
                    name: "Flow Fields", 
                    desc: "Smart AI movement. Instead of calculating a complex path for 100 different zombies, I create a 'current' that guides the whole crowd to the player at once."
                },
                { 
                    name: "Verlet Integration", 
                    desc: "Advanced physics math. I use this to create realistic, bouncy movement for things like ropes, capes, and cloth."
                }
            ]
        }
    ];

    const showModal = (title, desc, color) => {
        const existing = document.getElementById('tech-modal');
        if(existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'tech-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4';
        modal.onclick = (e) => { if(e.target === modal) modal.remove() };

        modal.innerHTML = `
            <div class="bg-zinc-900 border border-${color}-500/50 w-full max-w-lg rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] transform transition-all scale-100">
                <div class="bg-${color}-900/20 p-4 border-b border-${color}-900/50 flex justify-between items-center">
                    <h3 class="text-${color}-400 font-bold font-mono text-lg tracking-wider uppercase flex items-center">
                        <span class="w-2 h-2 bg-${color}-500 rounded-full mr-3 animate-pulse"></span>
                        ${title}
                    </h3>
                    <button onclick="document.getElementById('tech-modal').remove()" class="text-zinc-500 hover:text-white transition-colors">✕</button>
                </div>
                <div class="p-6">
                    <div class="text-[10px] text-zinc-500 font-mono uppercase mb-2">System Definition //</div>
                    <p class="text-zinc-300 text-sm leading-relaxed font-mono border-l-2 border-${color}-500/30 pl-4">
                        ${desc}
                    </p>
                </div>
                <div class="bg-black/40 p-3 flex justify-between items-center text-[10px] text-zinc-600 font-mono">
                    <span>INDEX: ${Math.floor(Math.random() * 9000) + 1000}</span>
                    <span>ACCESS: GRANTED</span>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    };

    const render = () => {
        const gridHTML = stack.map(group => {
            const bg = `bg-${group.color}-900/20`;
            const border = `border-${group.color}-800/50`;
            const text = `text-${group.color}-300`;
            const hover = `hover:bg-${group.color}-900/40 hover:border-${group.color}-500 hover:text-white`;

            return `
            <div class="bg-black/40 border border-zinc-700/50 p-3 rounded hover:border-zinc-500 transition-colors">
                <div class="text-[10px] text-zinc-500 font-bold font-mono mb-2 uppercase tracking-wider flex items-center">
                    <span class="w-1.5 h-1.5 rounded-full bg-${group.color}-500 mr-2"></span>
                    ${group.category}
                </div>
                <div class="flex flex-wrap gap-2">
                    ${group.skills.map((skill, index) => `
                        <button onclick="window.triggerTechModal('${group.category}', ${index})" 
                           class="px-2 py-1 ${bg} border ${border} ${text} ${hover} text-xs font-mono rounded cursor-pointer transition-all flex items-center group">
                            ${skill.name}
                            <span class="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-${group.color}-400">?</span>
                        </button>
                    `).join('')}
                </div>
            </div>`;
        }).join('');

        mountPoint.innerHTML = `
            <div class="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
                <h3 class="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center">
                    <span class="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
                    Technical Arsenal
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${gridHTML}
                </div>
            </div>
        `;
    };

    window.triggerTechModal = (catName, skillIndex) => {
        const category = stack.find(g => g.category === catName);
        if(category) {
            const skill = category.skills[skillIndex];
            showModal(skill.name, skill.desc, category.color);
        }
    };

    render();
})();