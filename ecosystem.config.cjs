module.exports = {
  apps: [
    {
      name: "reelix-backend",
      script: "./backend/index.js",
      instances: "max", // Auto-scales to match CPU core count
      exec_mode: "cluster", // PM2 internal load balancer mode
      watch: false,
      max_memory_restart: "500M", // Auto restart worker if memory exceeds 500MB
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
  ],
};
