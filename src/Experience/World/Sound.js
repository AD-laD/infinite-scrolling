export default class Sound {
    constructor({ src, volume = 1, loop = false }) {
        if (!src) {
            console.warn("Un chemin audio ('src') est requis pour créer un son.");
            return;
        }

        this.src = src; 
        if (!this.src){
            console.warn("Le chemin est invalide");
            return;
        }
        this.volume = volume; 
        this.loop = loop; 


        this.audio = new Audio(this.src);
        this.audio.volume = this.volume;
        this.audio.loop = this.loop;
    }


    play() {
        if (this.audio) {
            this.audio.currentTime = 0; 
            this.audio.play();
        }
    }


    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }

    setVolume(volume) {
        if (this.audio) {
            this.audio.volume = volume;
        }
    }

    setLoop(loop) {
        if (this.audio) {
            this.audio.loop = loop;
        }
    }

    setSource(src) {
        if (this.audio) {
            this.audio.src = src;
            this.audio.load(); 
        }
    }
}
