import app from "./app.js";
import env from "./config/env.js";
import { testConnection } from "./config/database.js";

const startServer = async () => {
  try {
    if (env.nodeEnv === "production") {
      if (env.isUsingDefaultJwtSecret) {
        throw new Error("JWT_SECRET deve ser configurado para ambiente de producao.");
      }

      if (env.isUsingDefaultAuthCredentials) {
        throw new Error("AUTH_USERNAME e AUTH_PASSWORD nao podem usar valores padrao em producao.");
      }
    }

    if (env.isUsingDefaultJwtSecret) {
      // eslint-disable-next-line no-console
      console.warn("JWT_SECRET padrao em uso. Configure JWT_SECRET em backend-node/.env.");
    }

    if (env.isUsingDefaultAuthCredentials) {
      // eslint-disable-next-line no-console
      console.warn(
        "Credenciais padrao em uso (AUTH_USERNAME/AUTH_PASSWORD). Configure backend-node/.env."
      );
    }

    await testConnection();

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Node API de pacientes ativa na porta ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Falha ao iniciar API Node:", error.message);
    process.exit(1);
  }
};

startServer();
