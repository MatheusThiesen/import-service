import "dotenv/config";
import { App } from "./app";
import { Portal } from "./portal";

const app = new App();
app.execute();
const portal = new Portal();
portal.execute();
