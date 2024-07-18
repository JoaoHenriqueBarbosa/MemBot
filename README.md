# AI Journal: Your Personal Thought Curator 🧠✨

Welcome to AI Journal! 🚀

AI Journal is your digital companion that listens, organizes, and provides insights into your daily thoughts. Write your entries freely, and our intelligent system will categorize and analyze them automatically. Track your finances 💰, monitor your health 🧘‍♀️, nurture relationships 💖, or simply capture your day.

AI Journal also offers insights and suggestions for improvement while keeping your data secure and private.

Ready to embark on a journey of self-discovery? Let AI Journal guide you! 🌟

🌐 [Português](README.ptBR.md)

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Project](#running-the-project)
7. [Project Structure](#project-structure)
8. [API Endpoints](#api-endpoints)
9. [Contributing](#contributing)
10. [Troubleshooting](#troubleshooting)
11. [Project Philosophy](#project-philosophy)
12. [License](#license)

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
- AI Backend: Ollama (for local AI processing)
- AI Model: Gemma2 by default, configurable in `packages/private/.env`
- Containerization: Docker

While the project implements many features from scratch (see [Project Philosophy](#project-philosophy)), it also leverages well-designed tools and libraries to enhance development efficiency and maintain best practices:

### Frontend Libraries

- TanStack's React Query: For efficient data fetching and state management
- i18next: For internationalization
- shadcn/ui: For UI components, implementing Tailwind CSS, Radix UI, Recharts, and more

### Backend Libraries

- pg: For PostgreSQL database interactions
- Ollama: For interfacing with the local AI model
- jsonwebtoken: For JWT-based authentication

These libraries were chosen for their reliability, performance, and alignment with our project goals. They complement our from-scratch approach by providing robust solutions for specific functionalities, allowing us to focus on building custom features where it matters most.

## Prerequisites

Before you begin, ensure you have the following installed:

- Docker
- Bun (JavaScript runtime and package manager)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/JoaoHenriqueBarbosa/AI-Journal.git
   cd AI-Journal
   ```

2. Install project dependencies:
   ```
   bun i
   ```

## Configuration

1. Create two `.env` files:

   a. In the `packages/private` directory, create a `.env` file for the backend:

   ```
   PORT=3000
   HOST=localhost
   MODEL_NAME=gemma2
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ai_jrnl
   DB_USER=myuser
   DB_PASSWORD=mypassword
   DEFAULT_LANGUAGE=en
   JWT_SECRET=your_jwt_secret_here
   FRONTEND_URL=http://localhost:5173

   # Optional environment variables:
   # GOOGLE_AI_API_KEY=your-google-api-key  # Only needed if not using Ollama
   # OLLAMA_HOST=ollama  # Only needed if Ollama is in Docker Compose or on another PC
   # MAIL_HOST=your-mail-host
   # MAIL_PORT=587
   # MAIL_USER=your-mail-user
   # MAIL_PASSWORD=your-mail-password
   ```

   b. In the `packages/public` directory, create a `.env` file for the frontend:

   ```
   VITE_API_PROTOCOL=http
   VITE_API_URL=localhost:3000
   ```

   Note: The protocol and URL in the frontend are separated to allow for easier configuration once the WebSocket connection is implemented in the same backend server.

2. Adjust the `docker-compose.yml` file if you need to change any default settings for the PostgreSQL container.

## Running the Project

1. Start the PostgreSQL database container:

   ```
   docker-compose up -d
   ```

2. Start the Ollama container:

   - For systems with GPU support:
     ```
     docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
     ```
   - For systems without GPU support:
     ```
     docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
     ```

3. Run the project:

   ```
   bun dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to access the application.

## Project Structure

```
ai-journal/
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

For more detailed API documentation, refer to the API documentation file (if available) or the source code in the `packages/server/api/` directory.

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

As a proof of concept, this project demonstrates the core functionality of an AI journal application. However, there are many areas where it could be expanded and improved. Some potential enhancements include:

- [ ] Implementation of LangChain for improved AI chat flow and decision-making
- [ ] Enhanced AI interaction to request additional information when needed
- [x] User authentication and session management
- [x] Email verification for new user registrations
- [ ] Deployment strategy and implementation
- [ ] Automated testing suite
- [ ] AI-generated reports based on user data
- [ ] Integration with external models:
  - [ ] OpenAI's GPT
  - [ ] Anthropic's Claude
  - [x] Google's Gemini
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
