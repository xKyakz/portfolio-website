(() => {
    const get = id => document.getElementById(id);
    const elements = {
        walletA: get('wallet-a-val'),
        walletB: get('wallet-b-val'),
        packet: get('data-packet'),
        status: get('data-status'),
        crashBtn: get('btn-crash'),
        btnStd: get('btn-data-std'),
        btnKyakz: get('btn-data-kyakz'),
        codeStd: get('code-data-std'),
        codeKyakz: get('code-data-kyakz')
    };

    let state = {
        mode: 'standard',
        walletA: 1000,
        walletB: 0,
        inProgress: false,
        crashed: false,
        timer: null
    };

    const updateUI = (wallet, value) => {
        if (elements[wallet]) elements[wallet].textContent = value;
    };

    const setStatus = (msg, className) => {
        if (!elements.status) return;
        elements.status.textContent = msg;
        elements.status.className = `mt-8 font-mono text-xs md:text-sm h-6 ${className}`;
    };

    const resetPacket = () => {
        const { packet } = elements;
        packet.style.transition = 'none';
        packet.style.left = '0%';
        packet.style.opacity = '0';
        packet.className = "w-6 h-6 md:w-8 md:h-8 bg-yellow-500 rounded-full absolute -top-2.5 md:-top-3.5 left-0 shadow-[0_0_15px_rgba(234,179,8,0.5)] flex items-center justify-center text-[10px] md:text-xs font-bold text-black";
        void packet.offsetWidth;
    };

    window.setDataAlgo = type => {
        state.mode = type;
        state.walletA = 1000;
        state.walletB = 0;
        state.inProgress = false;
        state.crashed = false;

        updateUI('walletA', 1000);
        updateUI('walletB', 0);
        resetPacket();
        setStatus("Ready.", "text-zinc-500");
        
        elements.crashBtn?.classList.add('btn-disabled');

        const active = "px-4 py-1 text-xs font-bold rounded bg-red-600 text-white transition-all";
        const inactive = "px-4 py-1 text-xs font-bold rounded text-zinc-500 hover:text-white transition-all";
        
        if (elements.btnStd && elements.btnKyakz) {
            elements.btnStd.className = type === 'standard' ? active : inactive;
            elements.btnKyakz.className = type === 'standard' ? inactive : active;
        }

        if (elements.codeStd && elements.codeKyakz) {
            elements.codeStd.classList.remove('code-active', 'code-inactive');
            elements.codeKyakz.classList.remove('code-active', 'code-inactive');
            
            if (type === 'standard') {
                elements.codeStd.classList.add('code-active');
                elements.codeKyakz.classList.add('code-inactive');
            } else {
                elements.codeStd.classList.add('code-inactive');
                elements.codeKyakz.classList.add('code-active');
            }
        }
    };

    window.startTransaction = () => {
        if (state.inProgress || state.walletA < 500) {
            if (state.walletA < 500) {
                state.walletA = 1000;
                updateUI('walletA', 1000);
            }
            return;
        }

        state.inProgress = true;
        state.crashed = false;
        resetPacket();
        elements.crashBtn?.classList.remove('btn-disabled');

        const oldA = state.walletA;
        state.walletA -= 500;
        animate(elements.walletA, oldA, state.walletA, 500);

        setStatus("Sending...", "text-blue-400");
        elements.packet.style.opacity = '1';
        elements.packet.style.transition = 'left 3s linear';
        elements.packet.style.left = '100%';

        state.timer = setTimeout(() => {
            if (!state.crashed) {
                const oldB = state.walletB;
                state.walletB += 500;
                animate(elements.walletB, oldB, state.walletB, 500);
                setStatus("SUCCESS.", "text-green-500");
                elements.packet.style.opacity = '0';
                state.inProgress = false;
                elements.crashBtn?.classList.add('btn-disabled');
            }
        }, 3000);
    };

    window.simulateCrash = () => {
        if (!state.inProgress) return;
        state.crashed = true;
        clearTimeout(state.timer);

        const rect = elements.packet.getBoundingClientRect();
        const parentRect = elements.packet.parentElement.getBoundingClientRect();
        const percent = ((rect.left - parentRect.left) / elements.packet.parentElement.offsetWidth) * 100;

        elements.packet.style.transition = 'none';
        elements.packet.style.left = `${percent}%`;
        setStatus("⚠ CONNECTION LOST", "text-red-500 font-bold animate-pulse");
        elements.packet.classList.add('bg-red-600', 'text-white');

        setTimeout(() => {
            if (state.mode === 'standard') {
                setStatus("FAILURE: Money Lost.", "text-red-500");
                elements.packet.style.opacity = '0';
                state.inProgress = false;
            } else {
                setStatus("ATOMIC: Rolling back...", "text-yellow-500");
                elements.packet.style.transition = 'left 1s ease-out';
                elements.packet.style.left = '0%';
                setTimeout(() => {
                    const oldA = state.walletA;
                    state.walletA += 500;
                    animate(elements.walletA, oldA, state.walletA, 500);
                    setStatus("SAFE: Refunded.", "text-green-500");
                    elements.packet.style.opacity = '0';
                    state.inProgress = false;
                }, 1000);
            }
            elements.crashBtn?.classList.add('btn-disabled');
        }, 1000);
    };

    function animate(obj, start, end, duration) {
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }
})();