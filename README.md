# MemBot: Your Personal Thought Curator 🧠✨

<p align="center">
  <img src="https://github.com/JoaoHenriqueBarbosa/MemBot/blob/main/packages/public/public/logo-membot-svg.svg" />
</p>

Welcome to MemBot! 🚀

MemBot is your digital companion that listens, organizes, and provides insights into your daily thoughts. Write your entries freely, and our intelligent system will categorize and analyze them automatically. Track your finances 💰, monitor your health 🧘‍♀️, nurture relationships 💖, or simply capture your day.

MemBot also offers insights and suggestions for improvement while keeping your data secure and private.

Ready to embark on a journey of self-discovery? Let MemBot guide you! 🌟

🌐 [Português](README.ptBR.md)

## Table of Contents

1. [Demo](#demo)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Running the Project](#running-the-project)
8. [Project Structure](#project-structure)
9. [API Endpoints](#api-endpoints)
10. [Contributing](#contributing)
11. [Troubleshooting](#troubleshooting)
12. [Project Philosophy](#project-philosophy)
13. [License](#license)

## Demo

<p align="center">
  

https://github.com/user-attachments/assets/1eca611f-2807-43dc-98c4-b3bab9252230


</p>

If the video above didn't load, [click here](https://github.com/JoaoHenriqueBarbosa/MemBot/blob/main/packages/public/public/en.webm).

The demo showcases the main features of MemBot, including writing journal entries, viewing insights, and interacting with the AI model. The application is responsive and user-friendly, making it easy to use on both desktop and mobile devices.

Also you can play around with the [live demo](https://membot.vercel.app/). But remember, this is a project in development, so if you find any bugs, please report them opening a issue. Or if you have skills in programming, feel free to contribute to the project.

## Features

- User-friendly interface for writing journal entries
- Automatic categorization of entries using AI
- Secure storage of entries in a PostgreSQL database
- Multi-language support (English and Brazilian Portuguese)
- Responsive design for desktop and mobile use

## Technologies Used

- Frontend: React, TypeScript, Vite, Tailwind CSS, and shadcn/ui
- Backend: Bun, WebSocket (Native), REST API (From Scratch)
- Database: PostgreSQL
- AI Orchestration: LangChain + LangGraph (typed `StateGraph`, provider-agnostic)
- AI Providers: Google Gemini or Anthropic Claude (cloud) and Ollama (local) — switchable via one env var
- Structured output: Zod schemas (no hand-parsed JSON)
- Containerization: Docker

While the project implements many features from scratch (see [Project Philosophy](#project-philosophy)), it also leverages well-designed tools and libraries to enhance development efficiency and maintain best practices:

### Frontend Libraries

- TanStack's React Query: For efficient data fetching and state management
- i18next: For internationalization
- shadcn/ui: For UI components, implementing Tailwind CSS, Radix UI, Recharts, and more

### Backend Libraries

- LangGraph / LangChain: Orchestrates the journaling agent as a typed state graph
- Provider integrations: `@langchain/google-genai`, `@langchain/anthropic`, `@langchain/ollama`
- Zod: Schema-validated structured output for classification and entity extraction
- pg: For PostgreSQL database interactions
- Ollama: Local model runtime (optional, when using local models instead of a cloud provider)
- jsonwebtoken: For JWT-based authentication

These libraries were chosen for their reliability, performance, and alignment with our project goals. They complement our from-scratch approach by providing robust solutions for specific functionalities, allowing us to focus on building custom features where it matters most.

## AI Architecture

> **v2 refactor.** The AI core was rebuilt as a **LangGraph** state graph. The original
> README listed *"Implementation of LangChain"* as a TODO — this delivers it.

The reasoning layer is a typed `StateGraph`:

```
START ─▶ classify ─(category?)─▶ extract ─▶ persist ─▶ respond ─▶ END
             └────────────(none)───────────────────────▲
```

- **classify / extract** use `model.withStructuredOutput(zodSchema)`, so categories and
  entities are schema-validated instead of parsed out of free text.
- **persist** writes through the existing transactional Postgres helper.
- **respond** streams a natural reply over the WebSocket.
- Every node calls one `createChatModel()` factory returning a LangChain `BaseChatModel`,
  so **Google Gemini**, **Anthropic Claude**, and **Ollama** are a single code path —
  swap with `LLM_PROVIDER`. An Anthropic-compatible proxy works too via `ANTHROPIC_BASE_URL`.
- Conversation history is **per-connection** (keyed by socket), fixing a bug where a
  single global array was shared across all users.

Full design notes and the Phase-2 (tool-calling agent) roadmap: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Prerequisites

Before you begin, ensure you have the following installed:

- Docker
- Bun (JavaScript runtime and package manager)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/JoaoHenriqueBarbosa/MemBot.git
   cd MemBot
   ```

2. Install project dependencies:
   ```
   bun i
   ```

## Configuration

1. Create two `.env` files:

   a. In the `packages/private` directory, create a `.env` file for the backend:

   ```
   PORT=8081
   HOST=localhost
   JWT_SECRET=your_jwt_secret_here
   FRONTEND_URL=http://localhost:5173
   DEFAULT_LANGUAGE=en

   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ai_jrnl
   DB_USER=myuser
   DB_PASSWORD=mypassword

   # LLM provider: "google", "anthropic" or "ollama".
   # If unset, inferred: GOOGLE_AI_API_KEY => google,
   # else ANTHROPIC_API_KEY => anthropic, else ollama.
   LLM_PROVIDER=google

   # Google (cloud)
   GOOGLE_AI_API_KEY=your-google-api-key
   GOOGLE_MODEL=gemini-2.0-flash

   # Anthropic (cloud)
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ANTHROPIC_MODEL=claude-sonnet-4-6
   # Optional: point at an Anthropic-compatible proxy instead of the official API.
   # ANTHROPIC_BASE_URL=https://your-proxy.example.com

   # Ollama (local)
   MODEL_NAME=gemma2
   OLLAMA_HOST=http://localhost:11434

   # Optional mail (email verification):
   # MAIL_HOST=your-mail-host
   # MAIL_PORT=587
   # MAIL_USER=your-mail-user
   # MAIL_PASSWORD=your-mail-password
   ```

   A ready-to-copy template lives at `packages/private/.env.example`.

   b. In the `packages/public` directory, create a `.env` file for the frontend:

   ```
   VITE_API_PROTOCOL=http
   VITE_API_URL=localhost:8081
   ```

   Note: The protocol and URL in the frontend are separated to allow for easier configuration once the WebSocket connection is implemented in the same backend server.

2. Adjust the `docker-compose.yml` file if you need to change any default settings for the PostgreSQL container.

## Running the Project

1. Start the PostgreSQL database container, the frontend, and the backend:

   ```
   docker-compose up -d
   ```

2. Start the Ollama container (only if `LLM_PROVIDER=ollama` — skip it when using a cloud provider like Gemini or Claude):

   - For systems with GPU support:
     ```
     docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
     ```
   - For systems without GPU support:
     ```
     docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
     ```

3. Open your browser and navigate to `http://localhost:5173` to access the application.

## Project Structure

```
MemBot/
├── packages/
│   ├── client/          # Frontend React application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── locales/
│   │   └── ...
│   └── server/          # Backend Node.js application
│       ├── api/
│       ├── db/
│       ├── handlers/
│       └── utils/
├── docker-compose.yml
├── init.sql
└── README.md
```

## API Endpoints

- `/api/financial`: Get financial entries
- `/api/financial/income`: Get total income
- `/api/financial/expense`: Get total expenses
- `/api/financial/balance`: Get current balance
- `/api/general`: Get general entries
- `/api/health-wellbeing`: Get health and well-being entries
- `/api/health-wellbeing/exercise-time`: Get total exercise time
- `/api/health-wellbeing/emotion-intensity`: Get average emotion intensity
- `/api/relationships`: Get relationship entries
- `/api/relationships/total-interactions`: Get total interactions
- `/api/relationships/most-frequent-person`: Get most frequent person interacted with
- `/api/auth/register`: Register a new user
- `/api/auth/login`: Log in a user
- `/api/auth/verify-email`: Verify a user's email

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

- If you encounter issues running the `docker-compose up -d` command and identify that the problem is related to the `init.sql` file, ensure that the `init.sql` file has execution permissions. If not, run the following command:

  Linux and macOS:

  ```sh
  chmod +x init.sql
  ```

  Windows:

  ```sh
  icacls init.sql /grant Everyone:F
  ```

- If you're having trouble connecting to the database, make sure the PostgreSQL container is running and the environment variables in your `.env` file match the settings in `docker-compose.yml`.

- For issues related to Ollama, check if the Ollama container is running correctly and the port 11434 is accessible.

## TODO

As a proof of concept, this project demonstrates the core functionality of an MemBot application. However, there are many areas where it could be expanded and improved. Some potential enhancements include:

- [x] Implementation of LangChain / LangGraph for improved AI chat flow and decision-making
- [ ] Enhanced AI interaction to request additional information when needed (Phase 2: tool-calling agent — see docs/ARCHITECTURE.md)
- [x] User authentication and session management
- [x] Email verification for new user registrations
- [ ] Deployment strategy and implementation
- [ ] Automated testing suite
- [ ] AI-generated reports based on user data
- [~] Integration with external models (provider-agnostic via LangChain `BaseChatModel`):
  - [x] Google's Gemini
  - [x] Anthropic's Claude (also works with an Anthropic-compatible proxy)
  - [x] Ollama (local models: Gemma, Llama, etc.)
  - [ ] OpenAI's GPT (add `@langchain/openai` to the model factory)
- [ ] Customizable user preferences and settings
- [ ] Password reset functionality
- [ ] Multi-factor authentication

Please feel free to contribute to this project (see [Contributing](#contributing)) by implementing any of these features or suggesting new ones.

## Project Philosophy

This project was implemented largely from scratch or using native APIs, not because it's the easiest or most efficient approach, but as a proof of concept. The goal was to demonstrate that a complex application could be built without relying heavily on third-party libraries or frameworks, while still maintaining a reasonable level of simplicity and maintainability.

Key aspects of this philosophy include:

1. **Minimal Dependencies**: By using native APIs and implementing features from scratch, I aimed to reduce reliance on external dependencies, which can lead to a more stable and controllable codebase.

2. **Learning Opportunity**: Building components from the ground up provides a deeper understanding of how things work under the hood, which is invaluable for developers looking to enhance their skills.

3. **Customization**: With a from-scratch approach, every aspect of the application can be tailored to specific needs without being constrained by the limitations of third-party libraries.

4. **Performance**: In some cases, custom implementations can be optimized for the specific use case, potentially leading to better performance.

5. **Proof of Concept**: This project serves as a demonstration that complex applications can be built with minimal external dependencies, challenging the notion that modern web development always requires a multitude of frameworks and libraries.

While this approach may not be suitable for all projects, especially those with tight deadlines or specific industry requirements, it showcases the possibilities and benefits of a more hands-on, from-the-ground-up development philosophy.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
