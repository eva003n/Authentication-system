import express from "express";


const app = express();

// tell express to use ejs as the templetae engine
app.set("view engine", "ejs")
// parse json data
app.use(express.json())
// handle form data
app.use(express.urlencoded({extended: true}));
// handle static files
app.use(express.static("public"))

// optional: specify views folder (default = ./views) but express does it automatically
import path from "path"
import { fileURLToPath } from "url";

const __fileName = fileURLToPath(import.meta.url)
const __dirName = path.dirname(__fileName)

app.set("views", path.resolve(__dirName, "./views") )


/*---- Auth system's api endpoints ---- */
import authRouter from "./Routes/auth.routes.js"

app.use("/api/v1/auth", authRouter)

export {
    app
}