import { createApp } from "../../lib/guide-mini-vue.esm.js";
import { App } from "./App.js";

// vue3
const rootContainer = document.getElementById("app");
createApp(App).mount(rootContainer);
