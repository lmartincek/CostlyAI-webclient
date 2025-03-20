import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBaby,
  faBolt,
  faBus,
  faCarSide,
  faDumbbell,
  faFilm,
  faGraduationCap,
  faHeartPulse,
  faHouse,
  faPaw,
  faScrewdriverWrench,
  faShield,
  faShirt,
  faShoppingCart,
  faUtensils,
  faVolleyball,
  faWifi,
  faSquareXmark,
  faSquareCheck,
} from '@fortawesome/free-solid-svg-icons'
import { faAirbnb, faGoogle } from '@fortawesome/free-brands-svg-icons'
library.add(
  faHouse,
  faBus,
  faShoppingCart,
  faDumbbell,
  faScrewdriverWrench,
  faBolt,
  faHeartPulse,
  faFilm,
  faGraduationCap,
  faUtensils,
  faShield,
  faVolleyball,
  faBaby,
  faShirt,
  faPaw,
  faWifi,
  faCarSide,
  faAirbnb,
  faGoogle,
  faSquareXmark,
  faSquareCheck,
)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())

app.use(router)
app.mount('#app')
