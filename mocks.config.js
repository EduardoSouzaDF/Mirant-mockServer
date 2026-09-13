// Configuração do Mocks Server (v3)
const fs = require("fs");
const path = require("path");

// Carrega o .env da raiz do projeto (mini-loader, sem dependência de dotenv).
try {
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    for (const linha of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const linhaTrim = linha.trim();
      if (!linhaTrim || linhaTrim.startsWith("#")) {
        continue;
      }
      const indice = linhaTrim.indexOf("=");
      if (indice === -1) {
        continue;
      }
      const chave = linhaTrim.slice(0, indice).trim();
      const valor = linhaTrim.slice(indice + 1).trim();
      if (!(chave in process.env)) {
        process.env[chave] = valor;
      }
    }
  }
} catch (erro) {
  // Sem .env — segue com defaults.
}

// O delay das respostas vem do env MOCK_DELAY_SECONDS (em SEGUNDOS)
// e é convertido para milissegundos — aplica-se a todas as rotas.
const delaySeconds = Number(process.env.MOCK_DELAY_SECONDS ?? 0);

module.exports = {
  log: "info",
  server: {
    port: 3100,
    host: "0.0.0.0",
  },
  mock: {
    routes: {
      delay: Number.isFinite(delaySeconds) && delaySeconds > 0
        ? Math.round(delaySeconds * 1000)
        : 0,
    },
    collections: {
      selected: "base",
    },
  },
};
