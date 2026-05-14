# AI Translator

A translation tool powered by local Large Language Models (LLMs) via Ollama. It uses a monorepo architecture with a React frontend and a Node.js backend.

## Features

- **Real-time Streaming**: Translations are streamed via WebSockets for immediate feedback.
- **Contextual Awareness**: Provides explanations and usage notes alongside translations.
- **Translation Modes**: Supports `Standard`, `Formal`, `Informal`, and `Technical` styles.
- **Rich Output**: Includes alternatives, usage examples, and formality indicators.
- **Practice Mode**: A dedicated mode for practicing sentences and vocabulary.
- **History & Topics**: Save translations and organize them by topic.

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
- **Ollama SDK**: Local LLM integration
- **Zod**: Schema validation

## Prerequisites

- **Node.js** (v18+)
- **Ollama**: Must be installed and running locally.
- **Model**: `llama3` is recommended (configurable via `.env`).

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd ai-translator
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root or `apps/api`:

   ```env
   OLLAMA_MODEL=llama3
   OLLAMA_HOST=http://localhost:11434
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   _This starts the API on port 3001 and the Web app on port 3000._

## Project Structure

### Monorepo Layout

- `apps/api`: Express server with WebSocket handlers and Ollama integration.
- `apps/web`: React application following FSD principles.
- `packages/config`: Shared TS and build tool configurations.
- `packages/prompts`: LLM prompt templates.
- `packages/shared-types`: Common TypeScript interfaces.

## License

MIT
