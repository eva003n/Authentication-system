import { app } from "./app.js";



import { PORT } from "./config/env.js";
const port = PORT;

// create a TCP server listening that port 
app.listen(port, () => {
    console.log(`🚀 Authentication service running at http;//localhost:${port} 🚀`)
})