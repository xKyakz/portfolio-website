(() => {
    const container = document.getElementById('portfolio-tree');
    const preview = document.getElementById('portfolio-preview');
    
    if (!container) return;

    const fileSystem = {
        "COMMISSIONS": [
            { 
                name: "client_gentoi.log", 
                icon: "📂",
                title: "PROJECT: ANOMALOUS",
                meta: "ROLE: Lead Scripter | STATUS: LIVE",
                link: "https://www.youtube.com/@Gentoi",
                linkText: "Gentoi's Youtube",
                desc: "Architected the underlying framework for this 1v5 asymmetrical horror cycle. The primary engineering focus was a 'Kinetic Movement' suite, featuring client-predicted vaulting, sliding, and momentum conservation to ensure competitive fluidity. I also built the modular objective interaction engine, utilizing strict server-side validation to prevent exploits without introducing input latency.",
                context: "An asymmetrical horror experience inspired by Dead by Daylight and Pillar Chase 2. Survivors utilize fast-paced traversal tech to complete 5-stage objectives while evading a roster of Monsters, each assigned a specific 'Threat Level' based on their mechanical complexity.",
                features: [
                    { name: "Kinetic Controller", value: "Momentum-based Slide/Vault Physics" },
                    { name: "Threat System", value: "Dynamic Killer Ability Scaling" },
                    { name: "Objective Logic", value: "5-Stage Generator/Exit Gate Loop" },
                    { name: "Loot Economy", value: "RNG Chest Generation & XP Buffs" }
                ]
            },
            { 
                name: "grimworks_sys.log", 
                icon: "📂", 
                title: "SYSTEM: GRIMWORKS",
                meta: "ROLE: Full Stack Lead | STATUS: LIVE",
                link: "https://discord.gg/grimworks",
                linkText: "Join Grimworks Discord",
                desc: "Spearheading the full-stack development pipeline. On the backend, I designed a fault-tolerant data replication layer to ensure combat states and inventory transactions remain synced under load. For the frontend, I built a reactive UI framework that interpolates heavy server data into smooth visual feedback. The critical challenge is maintaining a rigid Server-Authoritative state while preserving the 'feel' of a client-sided action game.",
                context: "A high-fidelity ecosystem pushing the limits of the Roblox engine. Grimworks focuses on creating mechanic-heavy experiences that require robust backend architecture to handle complex combat states, secure data replication, and intricate inventory management.",
                features: [
                    { name: "Replication Layer", value: "Fault-Tolerant State Syncing" },
                    { name: "Reactive UI", value: "Interpolated Visual Feedback" },
                    { name: "Netcode", value: "Custom Lag Compensation (Rewind)" },
                    { name: "Security", value: "Anti-Exploit Remote Wrapping" }
                ]
            }
        ],
        "R&D_LABS": [
            { 
                name: "lumin_gi.core", 
                icon: "☢️",
                title: "LUMIN: VOXEL GLOBAL ILLUMINATION",
                meta: "VERSION: 0.0.4a | TYPE: Graphics Engine",
                desc: "A real-time global illumination solver written entirely in Luau. Zero pre-baked lighting. Instead, it discretizes the workspace into a bit-packed 3D voxel grid to simulate light bounce and color bleeding.<br><br>Utilizes <strong>Parallel Luau</strong> to offload ray-marching to worker threads, allowing dynamic light sources (flashlights, muzzle flashes) to update the ambient environment instantly without impacting the main render thread.",
                features: [
                    { name: "Voxel Grid", value: "Bit-Packed Spatial Data" },
                    { name: "Parallelization", value: "Multi-Threaded Ray Marching" },
                    { name: "Lighting", value: "Dynamic Color Bleeding" },
                    { name: "Optimization", value: "Frustum Culling" }
                ]
            }
        ],
        "SNIPPETS": [
            { 
                name: "spatial_hash.lua", 
                icon: "📝",
                type: "code",
                content: `-- O(1) Spatial Partitioning
-- Efficiently queries massive entity counts by checking localized cells.
local SpatialHash = {}
SpatialHash.__index = SpatialHash

function SpatialHash.new(cellSize)
    return setmetatable({ _grid = {}, _cell = cellSize }, SpatialHash)
end

function SpatialHash:Insert(obj, pos)
    local key = math.floor(pos.X/self._cell).."_"..math.floor(pos.Z/self._cell)
    if not self._grid[key] then self._grid[key] = {} end
    table.insert(self._grid[key], obj)
end

function SpatialHash:Query(pos, radius)
    local results = {}
    local cx, cz = math.floor(pos.X/self._cell), math.floor(pos.Z/self._cell)
    -- Only check immediate neighbors (3x3 grid)
    for x = -1, 1 do
        for z = -1, 1 do
            local cell = self._grid[(cx+x).."_"..(cz+z)]
            if cell then
                for _, obj in ipairs(cell) do
                    if (obj.Position - pos).Magnitude <= radius then
                        table.insert(results, obj)
                    end
                end
            end
        end
    end
    return results
end`
            },
            { 
                name: "bit_packer.lua", 
                icon: "📝",
                type: "code",
                content: `-- Binary Serialization
-- Compresses 8 boolean flags into a single byte to save bandwidth.
local BitBuffer = {}

function BitBuffer.Pack(bools)
    local byte = 0
    for i, b in ipairs(bools) do
        if b then
            -- OR the bit into position
            byte = bit32.bor(byte, bit32.lshift(1, i-1))
        end
    end
    return string.char(byte)
end

function BitBuffer.Unpack(char)
    local byte = string.byte(char)
    local bools = {}
    for i = 1, 8 do
        -- AND the bit to check if set
        table.insert(bools, bit32.band(byte, bit32.lshift(1, i-1)) ~= 0)
    end
    return bools
end

return BitBuffer`
            },
            { 
                name: "actor_dispatch.lua", 
                icon: "📝",
                type: "code",
                content: `-- Parallel Luau Dispatcher
-- Offloads heavy math to separate hardware threads.
local ActorPool = {}

function ActorPool:Dispatch(jobData)
    local actor = self:_getIdleActor()
    
    task.desynchronize() -- Break out of the serial execution phase
    
    -- This runs on a different hardware thread now
    local result = actor:SendMessage("Compute", jobData)
    
    task.synchronize() -- Sync back to main thread to apply changes
    
    return result
end`
            },
            { 
                name: "lag_rewind.lua", 
                icon: "📝",
                type: "code",
                content: `-- Server-Side Hitbox Rewind
-- Rolls back entity positions to validate hits based on client ping.
function HitboxSystem:VerifyHit(player, target, timestamp)
    local pingFrames = math.floor(player:GetNetworkPing() * 60)
    local history = self.Snapshots[target]
    
    -- Get the target's position exactly when the player fired
    local oldState = history:GetFrame(serverTime - pingFrames)
    
    local hit = false
    -- Move hitbox back in time
    target.HumanoidRootPart.CFrame = oldState.CFrame
    
    if self:Raycast(player.Weapon.Position, player.AimDir) then
        hit = true
    end
    
    -- Snap back to current reality
    target.HumanoidRootPart.CFrame = currentState.CFrame
    return hit
end`
            },
            { 
                name: "proc_ik.lua", 
                icon: "📝",
                type: "code",
                content: `-- Procedural Inverse Kinematics
-- Solves joint angles for dynamic foot placement on uneven terrain.
function SolveIK(origin, target, limbLength)
    local d = (target - origin).Magnitude
    
    -- Law of Cosines
    local c1 = (d^2 + limbLength.Upper^2 - limbLength.Lower^2) / (2 * d * limbLength.Upper)
    local angle = math.acos(math.clamp(c1, -1, 1))
    
    local baseCF = CFrame.new(origin, target)
    return baseCF * CFrame.Angles(angle, 0, 0)
end`
            }
        ]
    };

    const renderTree = () => {
        let html = '';
        for (const [folder, files] of Object.entries(fileSystem)) {
            html += `
                <div class="mb-4">
                    <div class="text-xs font-bold text-zinc-500 mb-2 px-2 flex items-center">
                        <span class="mr-2">📁</span> ${folder}
                    </div>
                    <div class="space-y-1">
                        ${files.map((file, index) => `
                            <button onclick="openFile('${folder}', ${index})" class="w-full text-left px-4 py-2 text-xs md:text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded flex items-center transition-all group">
                                <span class="mr-2 opacity-50 group-hover:opacity-100">${file.icon}</span>
                                ${file.name}
                            </button>
                        `).join('')}
                    </div>
                </div>`;
        }
        container.innerHTML = html;
    };

    window.openFile = (folder, index) => {
        const file = fileSystem[folder][index];
        
        preview.innerHTML = `<div class="h-full flex items-center justify-center text-accent font-mono animate-pulse">DECRYPTING ${file.name}...</div>`;
        
        setTimeout(() => {
            if (file.type === 'code') {
                preview.innerHTML = `
                    <div class="h-full flex flex-col">
                        <div class="border-b border-zinc-800 pb-4 mb-4">
                            <div class="text-xl font-bold text-white mb-1">${file.name}</div>
                            <div class="text-xs text-zinc-500">LUA SOURCE FILE // READ ONLY</div>
                        </div>
                        <div class="flex-1 overflow-auto bg-black/30 p-4 rounded border border-zinc-800 font-mono text-xs text-zinc-300">
                            <pre>${escapeHtml(file.content)}</pre>
                        </div>
                    </div>`;
            } else {
                let featuresHtml = '';
                if (file.features) {
                    featuresHtml = `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                            ${file.features.map(f => `
                                <div class="bg-zinc-900/40 border border-zinc-700/50 p-3 rounded hover:border-accent/30 transition-colors group">
                                    <div class="text-[10px] text-zinc-500 uppercase font-mono mb-1 group-hover:text-accent transition-colors">${f.name}</div>
                                    <div class="text-xs text-zinc-300 font-mono border-l-2 border-zinc-700 pl-2 group-hover:border-accent transition-colors">${f.value}</div>
                                </div>
                            `).join('')}
                        </div>`;
                }

                preview.innerHTML = `
                    <div class="h-full flex flex-col custom-scroll overflow-y-auto pr-2">
                        <div class="border-b border-zinc-800 pb-4 mb-4">
                            <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">${file.title}</h2>
                            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div class="font-mono text-xs text-accent bg-accent/10 px-2 py-1 rounded inline-block border border-accent/20">${file.meta}</div>
                                ${file.link ? `<a href="${file.link}" target="_blank" class="px-3 py-1 bg-blue-900/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500 hover:text-white transition-all rounded text-[10px] font-bold tracking-wide flex items-center group">
                                    ${file.linkText} <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </a>` : ''}
                            </div>
                        </div>

                        <div class="mb-6">
                            <div class="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center">
                                <span class="w-1 h-1 bg-white rounded-full mr-2"></span>
                                Technical Dossier
                            </div>
                            <div class="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed border-l-2 border-zinc-800 pl-4">
                                <p>${file.desc}</p>
                            </div>
                        </div>

                        ${file.context ? `
                        <div class="mb-6 bg-black/20 p-4 rounded border border-zinc-800">
                            <div class="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center">
                                <span class="w-1 h-1 bg-zinc-500 rounded-full mr-2"></span>
                                Target Intel
                            </div>
                            <p class="text-zinc-400 text-xs leading-relaxed font-mono">
                                ${file.context}
                            </p>
                        </div>` : ''}

                        ${featuresHtml ? `
                        <div>
                            <div class="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center">
                                <span class="w-1 h-1 bg-accent rounded-full mr-2"></span>
                                System Manifest
                            </div>
                            ${featuresHtml}
                        </div>` : ''}

                        <div class="mt-auto pt-8 flex justify-between items-end opacity-50">
                            <div class="text-[10px] text-zinc-600 font-mono">
                                HASH: ${Math.random().toString(36).substr(2, 9).toUpperCase()}<br>
                                ENCRYPTION: AES-256
                            </div>
                        </div>
                    </div>`;
            }
        }, 300);
    };

    const escapeHtml = text => {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    };

    renderTree();
})();