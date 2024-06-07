import CardList from './CardList.vue'
import SearchBar from './SearchBar.vue'
import Audio from './Audio.vue'
import Footer from './Footer.vue'
import SongList from './SongList.vue'
export default {
  install(app) {
    app.component('CardList', CardList)
    app.component('SearchBar', SearchBar)
    app.component('Footer', Footer)
    app.component('Audio', Audio)
    app.component('SongList', SongList)
  }
}
