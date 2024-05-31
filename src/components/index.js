import CardList from './CardList.vue'
import SearchBar from './SearchBar.vue'
export default {
  install(app) {
    app.component('CardList', CardList)
    app.component('SearchBar', SearchBar)
  }
}
