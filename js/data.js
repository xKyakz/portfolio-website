// data transaction simulation logic
(function() {
    let mode = 'standard';
    let walletA = 1000;
    let walletB = 0;
    let inProgress = false;
    let crashed = false;

    const elA = document.getElementById('wallet-a-val');
    const elB = document.getElementById('wallet-b-val');
    const packet = document.getElementById('data-packet');
    const status = document.getElementById('data-status');
    const crashBtn = document.getElementById('btn-crash');

    if(!elA) return;

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function updateUI(prevA, prevB) {
        animateValue(elA, prevA, walletA, 500);
        animateValue(elB, prevB, walletB, 500);
    }

    function resetPacket() {
         packet.style.transition = 'none';
         packet.style.left = '0%';
         packet.style.opacity = '0';
         packet.className = "w-6 h-6 md:w-8 md:h-8 bg-yellow-500 rounded-full absolute -top-2.5 md:-top-3.5 left-0 shadow-[0_0_15px_rgba(234,179,8,0.5)] flex items-center justify-center text-[10px] md:text-xs font-bold text-black";
         void packet.offsetWidth;
    }

    function reset() {
        walletA = 1000; walletB = 0; 
        elA.innerText = 1000; elB.innerText = 0;
        resetPacket();
        inProgress = false; crashed = false;
        status.innerText = "Ready."; status.className = "mt-8 font-mono text-xs md:text-sm text-zinc-500 h-6";
        crashBtn.classList.add('btn-disabled');
    }

    window.startTransaction = function() {
        if(inProgress) return;
        
        if(walletA < 500) {
            const oldA = walletA;
            walletA = 1000; 
            animateValue(elA, oldA, 1000, 500);
            return; 
        }

        inProgress = true; crashed = false;
        resetPacket();
        crashBtn.classList.remove('btn-disabled');

        const prevA = walletA;
        walletA -= 500;
        animateValue(elA, prevA, walletA, 500);

        status.innerText = "Sending..."; status.className = "mt-8 font-mono text-xs md:text-sm text-blue-400 h-6";
        
        packet.style.opacity = '1';
        packet.style.transition = 'left 3s linear';
        packet.style.left = '100%';

        window.transactionTimer = setTimeout(() => {
            if(!crashed) {
                const prevB = walletB;
                walletB += 500;
                animateValue(elB, prevB, walletB, 500);
                status.innerText = "SUCCESS."; status.className = "mt-8 font-mono text-xs md:text-sm text-green-500 h-6";
                packet.style.opacity = '0'; inProgress = false;
                crashBtn.classList.add('btn-disabled');
            }
        }, 3000);
    };

    window.simulateCrash = function() {
        if(!inProgress) return;
        crashed = true;
        clearTimeout(window.transactionTimer);
        
        const rect = packet.getBoundingClientRect();
        const parentRect = packet.parentElement.getBoundingClientRect();
        const percent = ((rect.left - parentRect.left) / packet.parentElement.offsetWidth) * 100;
        
        packet.style.transition = 'none'; packet.style.left = percent + '%';
        status.innerText = "⚠ CONNECTION LOST"; status.className = "mt-8 font-mono text-xs md:text-sm text-red-500 h-6 font-bold animate-pulse";
        packet.classList.add('bg-red-600', 'text-white');

        setTimeout(() => {
            if(mode === 'standard') {
                status.innerText = "FAILURE: Money Lost.";
                packet.style.opacity = '0'; inProgress = false;
            } else {
                status.innerText = "ATOMIC: Rolling back..."; status.className = "mt-8 font-mono text-xs md:text-sm text-yellow-500 h-6";
                packet.style.transition = 'left 1s ease-out'; packet.style.left = '0%';
                setTimeout(() => {
                    const prevA = walletA;
                    walletA += 500; 
                    animateValue(elA, prevA, walletA, 500);
                    status.innerText = "SAFE: Refunded."; status.className = "mt-8 font-mono text-xs md:text-sm text-green-500 h-6";
                    packet.style.opacity = '0'; inProgress = false;
                }, 1000);
            }
            crashBtn.classList.add('btn-disabled');
        }, 1000);
    };

    window.setDataAlgo = function(type) {
        mode = type;
        reset();
        const btnStd = document.getElementById('btn-data-std');
        const btnKyakz = document.getElementById('btn-data-kyakz');
        const codeStd = document.getElementById('code-data-std');
        const codeKyakz = document.getElementById('code-data-kyakz');

        const activeBtn = "px-4 py-1 text-xs font-bold rounded bg-green-600 text-white transition-all";
        const inactiveBtn = "px-4 py-1 text-xs font-bold rounded text-zinc-500 hover:text-white transition-all";
        
        if(type === 'standard') { 
            btnStd.className = "px-4 py-1 text-xs font-bold rounded bg-red-600 text-white transition-all"; btnKyakz.className = inactiveBtn; 
            codeStd.className = "code-active bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs overflow-hidden text-zinc-500 relative h-40";
            codeKyakz.className = "code-inactive bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs overflow-hidden text-zinc-300 relative h-40";
        } else { 
            btnStd.className = inactiveBtn; btnKyakz.className = activeBtn; 
            codeStd.className = "code-inactive bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs overflow-hidden text-zinc-500 relative h-40";
            codeKyakz.className = "code-active bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs overflow-hidden text-zinc-300 relative h-40";
        }
    };
})();