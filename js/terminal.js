(function() {
    const input = document.getElementById('cmd-input')
    const output = document.getElementById('console-output')
    const validThemes = ['kyakz', 'matrix', 'cyberpunk', 'gold', 'ocean']

    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
    let konamiIndex = 0

    if (!input) return

    const log = (text, color = 'text-zinc-300', allowHtml = false) => {
        const div = document.createElement('div')
        div.className = color
        allowHtml ? (div.innerHTML = text) : (div.textContent = text)
        output.appendChild(div)
        output.scrollTop = output.scrollHeight
    }

    const activateOverclock = () => {
        log('WARNING: SYSTEM OVERCLOCK INITIATED', 'text-red-500 font-bold animate-pulse')
        log('LIMITERS REMOVED.', 'text-red-500')
        window.setTheme('overclock')
        
        document.body.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both'
        setTimeout(() => { document.body.style.animation = '' }, 500)
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++
            if (konamiIndex === konamiCode.length) {
                activateOverclock()
                konamiIndex = 0
            }
        } else {
            konamiIndex = 0
        }
    })

    const commands = {
        help: () => {
            log('Available Commands:', 'text-white font-bold underline')
            log('  about     - System info', 'text-zinc-400')
            log('  contact   - Socials & Links', 'text-zinc-400')
            log('  clear     - Clear terminal', 'text-zinc-400')
            log('  theme     - List themes', 'text-zinc-400')
            log('  sudo      - Admin tools', 'text-zinc-400')
        },
        theme: (arg) => {
            if (!arg) {
                log('Available Themes: kyakz, matrix, cyberpunk, gold, ocean', 'text-zinc-300')
                log('Usage: theme [name]', 'text-zinc-500')
                return
            }
            if (validThemes.includes(arg)) {
                window.setTheme(arg)
                log(`Theme switched to: ${arg}`, 'text-accent')
            } else {
                log(`Error: Theme '${arg}' not found.`, 'text-red-500 font-bold')
                log('Available Themes: kyakz, matrix, cyberpunk, gold, ocean', 'text-zinc-500')
            }
        },
        contact: () => {
            log('Social Uplink Established:', 'text-white font-bold mb-1')
            log('Discord: <span class="text-white">oy9c</span>', 'text-zinc-400', true)
            log('Twitter: <a href="https://x.com/xKyakz" target="_blank" class="text-blue-400 hover:text-white underline">@xkyakz</a>', 'text-zinc-400', true)
            log('Roblox:  <a href="https://www.roblox.com/users/19782752/profile" target="_blank" class="text-red-400 hover:text-white underline">xkyakzz</a>', 'text-zinc-400', true)
        },
        sudo: () => log('ACCESS DENIED. SYSTEM LOCKED.', 'text-red-600 font-bold'),
        clear: () => output.innerHTML = '',
        about: () => log('Kyakz.OS v6.3.0 - Built for Roblox High Performance.', 'text-accent')
    }

    input.addEventListener('keydown', ({ key, target }) => {
        if (key !== 'Enter') return
        
        const raw = target.value.trim().toLowerCase()
        const [cmd, ...args] = raw.split(' ')
        target.value = ''

        log(`root@kyakz:~$ ${raw}`, 'text-accent')

        if (cmd === '') return
        if (commands[cmd]) {
            commands[cmd](args[0])
        } else {
            log(`Command not found: ${cmd}`, 'text-red-500')
        }
    })
})()