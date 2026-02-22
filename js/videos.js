(() => {
    const container = document.getElementById('video-grid');
    if (!container) return;

    const videoList = [
        {
            title: "TEST_NAME_01",
            desc: "I will implement video demos here soon.",
            file: "assets/demo1.mp4",
            tags: ["One", "Two", "Three"]
        },
        {
            title: "TEST_NAME_02",
            desc: "I will implement video demos here soon.",
            file: "assets/demo2.mp4",
            tags: ["One", "Two", "Three"]
        }
    ];

    let html = '';

    videoList.forEach(vid => {
        html += `
        <div class="bg-zinc-900/50 border border-zinc-700 rounded-xl overflow-hidden flex flex-col group hover:border-accent transition-all shadow-lg">
            <div class="relative bg-black aspect-video border-b border-zinc-800">
                <video src="${vid.file}" controls preload="metadata" class="w-full h-full object-contain"></video>
            </div>
            <div class="p-5 flex-1 flex flex-col">
                <h3 class="text-white font-bold mb-2 text-lg">${vid.title}</h3>
                <p class="text-zinc-400 text-xs mb-4 leading-relaxed flex-1">${vid.desc}</p>
                <div class="flex flex-wrap gap-2">
                    ${vid.tags.map(tag => `<span class="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[9px] font-bold text-zinc-500 uppercase tracking-wider">${tag}</span>`).join('')}
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;
})();