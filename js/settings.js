(() => {
    const get = id => document.getElementById(id)
    const sfxSlider = get('setting-sfx')
    const musicSlider = get('setting-music')
    const crtSlider = get('setting-crt')
    const themeButtons = document.querySelectorAll('.theme-btn')
    const scanline = document.querySelector('.scanline')

    if (!sfxSlider || !musicSlider || !crtSlider) return

    const updateSfx = (val) => {
        const floatVal = parseFloat(val)
        window.setSfxVolume(floatVal)
        get('sfx-display').innerText = `${Math.round(floatVal * 100)}%`
        localStorage.setItem('kyakz_vol_sfx', floatVal)
    }

    const updateMusic = (val) => {
        const floatVal = parseFloat(val)
        window.setMusicVolume(floatVal)
        get('music-display').innerText = `${Math.round(floatVal * 100)}%`
        localStorage.setItem('kyakz_vol_music', floatVal)
    }

    const updateCRT = (val) => {
        const floatVal = parseFloat(val)
        if (scanline) {
            scanline.style.opacity = floatVal
            scanline.style.backgroundSize = `100% ${Math.max(2, floatVal * 8)}px`
        }
        get('crt-display').innerText = `${Math.round(floatVal * 100)}%`
        localStorage.setItem('kyakz_crt', floatVal)
    }

    sfxSlider.oninput = e => updateSfx(e.target.value)
    musicSlider.oninput = e => updateMusic(e.target.value)
    crtSlider.oninput = e => updateCRT(e.target.value)

    themeButtons.forEach(btn => {
        btn.onclick = () => {
            const theme = btn.dataset.theme
            window.setTheme(theme)
            themeButtons.forEach(b => b.classList.remove('border-accent', 'text-accent'))
            btn.classList.add('border-accent', 'text-accent')
        }
    })

    const loadState = () => {
        const savedSfx = localStorage.getItem('kyakz_vol_sfx')
        const savedMusic = localStorage.getItem('kyakz_vol_music')
        const savedCrt = localStorage.getItem('kyakz_crt')
        const savedTheme = localStorage.getItem('kyakz_theme')

        if (savedSfx !== null) {
            sfxSlider.value = savedSfx
            updateSfx(savedSfx)
        }

        if (savedMusic !== null) {
            musicSlider.value = savedMusic
            updateMusic(savedMusic)
        }
        
        if (savedCrt !== null) {
            crtSlider.value = savedCrt
            updateCRT(savedCrt)
        }

        if (savedTheme) {
            const activeBtn = document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`)
            activeBtn?.classList.add('border-accent', 'text-accent')
        }
    }

    setTimeout(loadState, 100)
})()