import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'

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
  faHashtag,
} from '@fortawesome/free-solid-svg-icons'
import { faAirbnb, faGoogle } from '@fortawesome/free-brands-svg-icons'
import { useAuthStore } from '@/stores/authStore.ts'
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
  faHashtag,
)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)

const pinia = createPinia()
app.use(pinia)

const authStore = useAuthStore()

const shouldRehydrate = localStorage.getItem('costly-remember-me')

const initializeApp = async () => {
  if (shouldRehydrate) {
    try {
      await authStore.rehydrate()
    } catch {}
  }
  app.use(router)
  app.mount('#app')
}

initializeApp().then()
