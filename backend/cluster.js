import cluster from "node:cluster";
import os from "node:os";
import process from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Number of worker processes to spawn (defaults to CPU core count or WORKERS env)
const numCPUs = process.env.WORKERS ? parseInt(process.env.WORKERS, 10) : Math.max(1, os.cpus().length);

if (cluster.isPrimary) {
  console.log(`=======================================================`);
  console.log(`🚀 Reelix Master Cluster Manager PID ${process.pid} is running`);
  console.log(`⚡ Spawning ${numCPUs} worker processes across CPU cores...`);
  console.log(`=======================================================`);

  // Fork worker processes
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker process death and auto-heal
  cluster.on("exit", (worker, code, signal) => {
    console.warn(
      `⚠️ Worker PID ${worker.process.pid} died (code: ${code}, signal: ${signal}). Spawning replacement...`
    );
    cluster.fork();
  });

  cluster.on("online", (worker) => {
    console.log(`✅ Worker PID ${worker.process.pid} online & receiving load-balanced traffic`);
  });
} else {
  // Workers import and execute main backend Express app
  import("./index.js").catch((err) => {
    console.error(`❌ Worker PID ${process.pid} failed to start:`, err);
    process.exit(1);
  });
}
