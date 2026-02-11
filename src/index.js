import { app } from "./app.js";
import connectMongoDB from "./config/db/index.js";
import logger from "./logger/logger.winston.js";


import { PORT } from "./config/env.js";
const port = PORT;

// create a TCP server listening that port 
app.listen(port, async() => {
    await connectMongoDB();
    logger.info(`🚀 Authentication service running at http://localhost:${port} 🚀`)
})