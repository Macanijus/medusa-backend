const express = require("express");
const adminPlugin = require("@medusajs/admin");
const { GracefulShutdownServer } = require("medusa-core-utils");

const loaders = require("@medusajs/medusa/dist/loaders/index").default;

(async () => {
  async function start() {
    const app = express();
    const directory = process.cwd();

    try {
      const { container } = await loaders({
        directory,
        expressApp: app,
      });
      const configModule = container.resolve("configModule");
      const port = process.env.PORT ?? configModule.projectConfig.port ?? 9000;

      app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
      });

      const server = GracefulShutdownServer.create(
        app.listen(port, (err) => {
          if (err) {
            return;
          }
          console.log(`Server is ready on port: ${port}`);
        })
      );

      // Handle graceful shutdown
      const gracefulShutDown = () => {
        server
          .shutdown()
          .then(() => {
            console.info("Gracefully stopping the server.");
            process.exit(0);
          })
          .catch((e) => {
            console.error("Error received when shutting down the server.", e);
            process.exit(1);
          });
      };
      process.on("SIGTERM", gracefulShutDown);
      process.on("SIGINT", gracefulShutDown);
    } catch (err) {
      console.error("Error starting server", err);
      process.exit(1);
    }
  }

  await start();
})();
