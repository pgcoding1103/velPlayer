import { getPlaylistSongs } from '../api/playlist'
import { getSongUrl } from '../api/song'
import MODE from '@/config/mode'
class MusicAudio {
  constructor(songlist, mode) {
    this.songlist = songlist
    this.mode = mode
    this.audio = new Audio()
    this.cover = ''
    this.index = 0
  }
  //   async play(index = 0) {
  //     if (this.mode == MODE.random) {
  //       index = Math.floor(Math.random() * this.songlist.length)
  //     }
  //     this.audio.src = await getSongUrl(this.songlist[index])
  //     this.index = index
  //     this.audio.play()
  //     this.audio.onended = () => this.autoPlayNext(this.mode)
  //   }
  //   playNext() {
  //     this.songlist.shift()
  //     if (this.songlist.length != 0) {
  //       this.play()
  //     }
  //   }
  //   autoPlayNext(mode) {
  //     switch (mode) {
  //       case MODE.singleloop:
  //         this.play(this.index)
  //         break
  //       case MODE.random:
  //         this.songlist.shift()
  //         if (this.songlist.length != 0) {
  //           this.play()
  //         }
  //         break
  //       case MODE.loop:
  //         if (this.index + 1 <= this.songlist.length - 1) {
  //           this.play(++this.index)
  //         } else {
  //           this.play(0)
  //         }
  //         break
  //       default:
  //         this.songlist.shift()
  //         if (this.songlist.length != 0) {
  //           this.play()
  //         }
  //         break
  //     }
  //   }
  //   switchMode(mode) {
  //     this.mode = mode
  //   }
  //   playOne(id) {
  //     this.songlist = [id]
  //     this.play()
  //   }
  //   async playAll(id, index = 0) {
  //     let songs = await getPlaylistSongs(id, index)
  //     songs = songs.map(song => song.id)
  //     this.songlist = songs
  //     this.play()
  //   }
}
export default MusicAudio
