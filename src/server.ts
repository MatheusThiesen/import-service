import "dotenv/config";
import { App } from "./app";
import { Portal } from "./portal";

const portal = new Portal();
portal.execute();
const app = new App();
app.execute();
