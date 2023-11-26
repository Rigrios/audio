
import store from './store.js'
import { toMinAndSec } from './utils.js'


const app = {
    state: {
        audios: [],
        currentAudio: [],
        playOff: true,
    },
    init() {
        this.domElement()
        this.setInStore()
        this.eventPlayList()
        this.audioControler()
    },
    eventPlayList() {
        this.playList.addEventListener("click", ({ target }) => {
            // let {mp3} = this.state.currentAudio
            // let {playOff} = this.state
            // if (!playOff) {
            //     mp3.pause()
            //     this.state.playOff = true
            // }
            const { className } = target
            if (className !== "link") return
            const id = +target.dataset.id
            this.setCurrentAudio(id)
        })
    },
    audioControler() {
        const play = document.getElementById("play")
        const pause = document.getElementById("pause")
        const stop = document.getElementById("stop")
        const next = document.getElementById("next")
        const previos = document.getElementById("previos")
        
        play.addEventListener("click", () => {
            let {mp3} = this.state.currentAudio
            mp3.play()
            this.state.playOff = false
        })
        pause.addEventListener("click", () => {
            let {mp3} = this.state.currentAudio
            mp3.pause()
            this.state.playOff = true
        })
        stop.addEventListener("click", () => {
            let {mp3} = this.state.currentAudio
            mp3.pause()
            mp3.currentTime = 0
            this.state.playOff = true
        })

        next.addEventListener("click", () => {
            let {currentAudio} = this.state
            let {id} = currentAudio
            let track = document.querySelector(`[data-id="${id}"]`)
            let nextId = track.nextElementSibling?.dataset
            let firstId = this.playList.firstElementChild.dataset
            let itemId = nextId?.id || firstId?.id
            this.setCurrentAudio(itemId)
            this.playIn()
            
        })
        previos.addEventListener("click", () => {
            let {currentAudio} = this.state
            let {id} = currentAudio
            let track = document.querySelector(`[data-id="${id}"]`)
            let previousId = track.previousElementSibling?.dataset
            let lastId = this.playList.lastElementChild.dataset
            let itemId = previousId?.id || lastId?.id
            this.setCurrentAudio(itemId)
            this.playIn()
            
        })

    },
    mp3Pause() {
        let {currentAudio} = this.state
        let {mp3} = currentAudio
        if (!mp3) return
        mp3.pause()
        mp3.currentTime = 0
        this.state.playOff = true
    },
    setCurrentAudio(itemId) {
        const current = this.state.audios.find(el => +el.id === +itemId)
        this.mp3Pause()
        this.state.currentAudio = current
        this.playIn()
        this.state.playOff = true
        this.renderCurrentAudio(current)
        this.audioUpdate(current)
    },
    playIn() {
        let {currentAudio: {mp3}, playOff} = this.state
        if (!playOff) {
            mp3.pause()
        } else {
            mp3.play()
        }
        this.state.playOff = !playOff
    },
    audioUpdate({mp3, duration}) {
        let playOff = this.state
        const time = document.querySelector(".time")
        const progress = document.querySelector(".progress")
        mp3.addEventListener("timeupdate", function({target}) {
            let {currentTime} = target
            const width = currentTime * 100 / duration
            time.innerHTML = toMinAndSec(currentTime)
            progress.style.width = `${width}%`
        })
    },
    renderCurrentAudio(audio) {
        this.currentTrack.innerHTML = this.renderCurrentAudioHTML(audio)
    },
    renderCurrentAudioHTML(audio) {
        let {aftor, nameTrack, duration, ava} = audio
        return (
            `
            <div class="currentTrackBody">
                  <div class="info">
                <div class="currentAftor">${aftor} - ${nameTrack}</div>
                 <span class="time">${toMinAndSec(duration)}</span>
                <div class="progressBody">
                <div class="progress"></div>
                </div>
               </div>
            <div class="ava">
                <img src="${ava}" />
            </div>
          </div>
            `
        )
    },
    domElement() {
        this.playList = document.querySelector(".play-list__link")
        this.currentTrack = document.querySelector(".currentTrack")
    },
    setInStore() {
        store.guf.forEach(audio => {
            let mp3 = new Audio(`./audio/${audio.link}`)
            mp3.addEventListener("loadeddata", (event) => {
                const current = { ...audio, duration: mp3.duration, mp3 }
                this.state.audios.push(current)
                this.renderPlayList(current)
            })
        })
    },
    renderPlayList(audio) {
        this.playList.innerHTML += this.renderPlayListHTML(audio)
    },
    renderPlayListHTML(audio) {
        let { id, aftor, duration, nameTrack } = audio
        return (
            ` 
            <div data-id="${id}" class="link">
                ${aftor} - ${nameTrack}
                <div class="link__time">${toMinAndSec(duration)}</div>
            </div>
            `
        )
    }

}

app.init()
// console.log(app.state)

