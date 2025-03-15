import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faAirbnb, faGoogle } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faAirbnb, faGoogle)

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia());
app.mount("#app");
