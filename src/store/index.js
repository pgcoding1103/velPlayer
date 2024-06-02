import { defineStore } from 'pinia'
import MusicAudio from '@/utils/audio'
import MODE from '../config/mode'
export const usePlayer = defineStore('player', {
  state: () => {
    return {
      audio: new MusicAudio([], MODE.loop)
    }
  },
  getters: {},
  actions: {
    playOne(id) {
      this.audio.playOne(id)
    },
    loop() {
      if (this.audio.mode == MODE.singleloop) {
        this.audio.switchMode(MODE.loop)
      } else {
        this.audio.switchMode(MODE.singleloop)
      }
    }
  }
})
