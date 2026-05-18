# AI Translator

A translation tool powered by Large Language Models (LLMs) via Ollama or DeepSeek. It uses a monorepo architecture with a React frontend and a Node.js backend.

## Features

- **Real-time Streaming**: Translations are streamed via WebSockets for immediate feedback.
- **Contextual Awareness**: Provides explanations and usage notes alongside translations.
- **Translation Modes**: Supports `Standard`, `Formal`, `Informal`, and `Technical` styles.
- **Rich Output**: Includes alternatives, usage examples, and formality indicators.
- **Practice Mode**: A dedicated mode for practicing sentences and vocabulary.
- **History & Topics**: Save translations and organize them by topic.
- **Multiple Providers**: Supports Ollama and DeepSeek with hot-swappable configuration.
- **Dual Configuration**: Provider, model, and host can be configured via `.env` file or directly from the UI settings panel. API key can be set via `.env` or saved through the UI (stored in an httpOnly cookie).

## Tech Stack

### Monorepo

- **Turborepo**: Build system and task runner.
- **TypeScript**: Shared types across the entire stack.
- **Shared Packages**: Common configurations, prompt templates, and types.

### Frontend (`apps/web`)

- **React 18** + **Vite**
- **Tailwind CSS**: Styling
- **TanStack Query**: Server state management
- **Zustand**: Client state management
- **FSD (Feature-Sliced Design)**: Architectural methodology

### Backend (`apps/api`)

- **Node.js** + **Express**
- **ws (WebSocket)**: For streaming LLM responses
- **OpenAI SDK** / **Ollama SDK**: LLM provider integration
- **Zod**: Schema validation
- **Structured logging**: Server-side logging for WebSocket events and errors

## Prerequisites

- **Node.js** (v20+)
- **pnpm** (v9+)
- **Ollama** (optional): Must be installed and running locally if using Ollama provider.
- **Model**: e.g. `llama3.2` for Ollama, `deepseek-chat` for DeepSeek.

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd ai-translator
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure provider** (choose one):

   **Option A — via `.env` file:**
   Create a `.env` file in the root or `apps/api`:

   ```env
   # Frontend
   VITE_API_URL=http://localhost:3001

   # Provider configuration (backend reads from root .env)
   PROVIDER=ollama                    # ollama | deepseek
   PROVIDER_MODEL=llama3.2           # e.g. llama3.2, deepseek-chat
   PROVIDER_HOST=http://localhost:11434
   PROVIDER_API_KEY=sk-...           # required only for DeepSeek
   ```

   > **Note**: Client-side settings (from the UI) take precedence over `.env` values. If a model is set in the UI, it will be used instead of `PROVIDER_MODEL`.

4. **Run the development server**:

   ```bash
   pnpm dev
   ```

   _This starts the API on port 3001 and the Web app on port 3000._

## Project Structure

### Monorepo Layout

- `apps/api`: Express server with WebSocket handlers and LLM provider integration.
- `apps/web`: React application following FSD principles.
- `packages/config`: Shared TS and build tool configurations.
- `packages/prompts`: LLM prompt templates.
- `packages/shared-types`: Common TypeScript interfaces.

## License

MIT
