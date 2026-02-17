(() => {
    const canvas = document.getElementById('netCanvas')
    const slider = document.getElementById('pingSlider')
    const pingDisplay = document.getElementById('pingValue')
    
    if (!canvas) return

    let algorithm = 'standard'
    let tick = 0
    const history = []
    const target = { x: 0, y: 0, radius: 20 }
    const particles = []

    const loop = () => {
        if (typeof setupCanvas === 'undefined') return requestAnimationFrame(loop)

        const { ctx, width, height } = setupCanvas(canvas)
        tick++
        
        target.x = width / 2 + Math.sin(tick * 0.02) * (width * 0.35)
        target.y = height / 2 + Math.cos(tick * 0.03) * (height * 0.2)
        
        history.push({ x: target.x, y: target.y })
        if (history.length > 600) history.shift()

        const ping = parseInt(slider.value)
        pingDisplay.innerText = ping

        ctx.fillStyle = '#18181b'
        ctx.fillRect(0, 0, width, height)
        
        ctx.strokeStyle = '#27272a'
        ctx.beginPath()
        for (let i = 0; i < width; i += 40) { ctx.moveTo(i, 0); ctx.lineTo(i, height) }
        for (let i = 0; i < height; i += 40) { ctx.moveTo(0, i); ctx.lineTo(width, i) }
        ctx.stroke()

        const latencyFrames = Math.floor(ping / 16)
        const pastIndex = history.length - 1 - latencyFrames
        const renderedPos = history[Math.max(0, pastIndex)] || target

        if (algorithm === 'standard') {
            ctx.fillStyle = '#3f3f46'
            ctx.beginPath()
            ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2)
            ctx.fill()
        }

        ctx.shadowBlur = 15
        ctx.shadowColor = '#ef4444'
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(renderedPos.x, renderedPos.y, target.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i]
            p.life--
            ctx.fillStyle = p.color
            ctx.globalAlpha = p.life / 30
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
            ctx.fill()
            if (p.life <= 0) particles.splice(i, 1)
        }
        
        ctx.globalAlpha = 1
        requestAnimationFrame(loop)
    }

    canvas.onmousedown = (e) => {
        const rect = canvas.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const ping = parseInt(slider.value)
        
        const latencyFrames = Math.floor(ping / 16)
        const pastIndex = history.length - 1 - latencyFrames
        const checkPos = algorithm === 'standard' ? target : (history[Math.max(0, pastIndex)] || target)

        const hit = Math.hypot(mouseX - checkPos.x, mouseY - checkPos.y) < target.radius

        particles.push({
            x: mouseX, 
            y: mouseY, 
            color: hit ? '#22c55e' : '#71717a',
            radius: hit ? 10 : 4, 
            life: 30
        })
    }

    window.setAlgo = (type) => {
        algorithm = type
        const btnStd = document.getElementById('btn-algo-std')
        const btnKyakz = document.getElementById('btn-algo-kyakz')
        const codeStd = document.getElementById('code-net-std')
        const codeKyakz = document.getElementById('code-net-kyakz')

        const activeClass = "px-4 py-1 text-xs font-bold rounded bg-red-600 text-white transition-all"
        const inactiveClass = "px-4 py-1 text-xs font-bold rounded text-zinc-500 hover:text-white transition-all"
        
        const isStd = type === 'standard'
        
        btnStd.className = isStd ? activeClass : inactiveClass
        btnKyakz.className = isStd ? inactiveClass : activeClass
        
        codeStd.className = `code-${isStd ? 'active' : 'inactive'} bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs overflow-hidden relative h-40`
        codeKyakz.className = `code-${isStd ? 'inactive' : 'active'} bg-black/40 border border-zinc-800 p-4 rounded font-mono text-[10px] md:text-xs overflow-hidden relative h-40`
    }

    loop()
})()