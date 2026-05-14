import { dotenvLoad } from "dotenv-mono";
dotenvLoad();

export const config = {
  port: process.env.PORT || 3001,
  ollama: {
    model: process.env.OLLAMA_MODEL,
    host: process.env.OLLAMA_HOST || "http://localhost:11434",
    apiKey: process.env.OLLAMA_API_KEY,
  },
};
