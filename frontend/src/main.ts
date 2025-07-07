import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./styles/main.css";
import "./styles/shared.css";
import "./styles/components.css";

const app = createApp(App);
app.use(router);
app.mount("#app");