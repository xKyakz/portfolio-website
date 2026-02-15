// --- 2. TERMINAL LOGIC ---
(function() {
    const input = document.getElementById('cmd-input');
    const output = document.getElementById('console-output');
    
    if(!input) return;

    input.addEventListener('keydown', function(e) {
        if(e.key === 'Enter') {
            const cmd = this.value.trim().toLowerCase();
            this.value = '';
            log(`root@kyakz:~$ ${cmd}`, 'text-zinc-400');
            processCommand(cmd);
        }
    });

    function log(text, color = 'text-zinc-300') {
        const div = document.createElement('div');
        div.className = color;
        div.textContent = text;
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
    }

    function processCommand(cmd) {
        if(cmd === 'help') {
            log('Available commands:', 'text-yellow-400');
            log('  about     - System info');
            log('  contact   - Display email');
            log('  clear     - Clear terminal');
            log('  date      - System time');
            log('  rm -rf /  - Do not try this.');
        } 
        else if(cmd === 'clear') { output.innerHTML = ''; }
        else if(cmd === 'about') { log('Kyakz.OS v4.3.1 - Built for Roblox High Performance.', 'text-blue-400'); }
        else if(cmd === 'contact') { log('Email: kyakz.dev@proton.me', 'text-green-400'); }
        else if(cmd === 'date') { log(new Date().toString(), 'text-zinc-500'); }
        else if(cmd === 'sudo') { log('Permission denied: You are not Kyakz.', 'text-red-500'); }
        else if(cmd === 'rm -rf /') { 
            log('DELETING SYSTEM...', 'text-red-600 font-bold'); 
            setTimeout(() => log('Just kidding. But seriously, be careful.', 'text-zinc-400'), 1000);
        }
        else if(cmd === '') {}
        else { log(`Command not found: ${cmd}`, 'text-red-500'); }
    }
})();