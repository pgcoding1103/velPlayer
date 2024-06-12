import CardList from './CardList.vue'
import SearchBar from './SearchBar.vue'
import Audio from './Audio.vue'
import Header from './Header.vue'
import SongList from './SongList.vue'
import Description from './Description.vue'
import Aside from './Aside.vue'
import User from './User.vue'
export default {
  install(app) {
    app.component('CardList', CardList)
    app.component('SearchBar', SearchBar)
    app.component('Header', Header)
    app.component('Audio', Audio)
    app.component('SongList', SongList)
    app.component('Description', Description)
    app.component('Aside', Aside)
    app.component('User', User)
  }
}
