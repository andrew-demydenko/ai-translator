console.log(process.env);

export const config = {
  port: process.env.PORT || 3001,
  ollama: {
    model: process.env.OLLAMA_MODEL,
    host: process.env.OLLAMA_HOST || "http://localhost:11434",
  },
};
