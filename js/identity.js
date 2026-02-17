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
                    desc: "Enforcing rigid type-checking across the codebase. This eliminates 95% of runtime errors before they happen and enables compiler optimizations for faster execution."
                },
                { 
                    name: "Parallel Actors", 
                    desc: "Utilizing the Actor model to desynchronize heavy compute tasks (like terrain generation or raycasting) onto separate hardware threads, freeing up the main render thread."
                },
                { 
                    name: "SIMD Math", 
                    desc: "Single Instruction, Multiple Data. optimizing vector math operations to process batches of physics calculations in a single CPU cycle."
                },
                { 
                    name: "Janitor / Maid", 
                    desc: "Automated memory lifecycle management. Ensures that when an object is destroyed, every connection, instance, and signal linked to it is cleaned up to prevent memory leaks."
                }
            ]
        },
        {
            category: "Network Architecture",
            color: "red",
            skills: [
                { 
                    name: "Buffer Serialization", 
                    desc: "Bypassing standard remote events by writing raw bytes to a memory buffer. This reduces packet size by up to 90% compared to JSON or standard tables."
                },
                { 
                    name: "Delta Compression", 
                    desc: "Only transmitting the data that has CHANGED since the last frame, rather than the entire state. Crucial for low-bandwidth environments."
                },
                { 
                    name: "Lag Compensation", 
                    desc: "Server-side 'Rewind' logic. When a player fires a shot, the server temporarily rolls back the hitboxes to where they were on that player's screen to verify the hit."
                },
                { 
                    name: "Clock Sync", 
                    desc: "Synchronizing the client's clock with the server's to predict movement and interpolate entities smoothly, masking latency artifacts."
                }
            ]
        },
        {
            category: "Infrastructure",
            color: "purple",
            skills: [
                { 
                    name: "Rojo / VS Code", 
                    desc: "Professional workflow enabling the use of external editors (VS Code), Git version control, and Copilot within the Roblox ecosystem."
                },
                { 
                    name: "Wally Pkg Mgr", 
                    desc: "Dependency management for Roblox. Allows for the modular installation of community packages (like Promise, Maid, Signal) with strict version locking."
                },
                { 
                    name: "Lune Automation", 
                    desc: "Running Luau scripts outside of Roblox. I use this for build pipelines, automated testing, and filesystem manipulation."
                },
                { 
                    name: "Git Flow", 
                    desc: "Standardized branching strategy. Features are developed in isolation, tested, and then merged into 'Main' to ensure production stability."
                }
            ]
        },
        {
            category: "Algorithms",
            color: "yellow",
            skills: [
                { 
                    name: "ECS (Matter)", 
                    desc: "Entity Component System. A data-oriented paradigm that separates data (Components) from logic (Systems), allowing for massive scalability compared to OOP."
                },
                { 
                    name: "Spatial Hash", 
                    desc: "A constant-time O(1) collision detection algorithm. Partitions the world into a grid, so we only check collisions against nearby neighbors."
                },
                { 
                    name: "Flow Fields", 
                    desc: "Pathfinding optimization for crowds. Instead of calculating a path for every unit, we generate a 'field' of vectors that guides all units to the target simultaneously."
                },
                { 
                    name: "Verlet Integration", 
                    desc: "A numerical method for integrating equations of motion. Used for stable simulation of soft bodies, ropes, and cloth physics."
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