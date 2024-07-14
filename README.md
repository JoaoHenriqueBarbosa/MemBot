# AI Journal

This project is a web application that allows users to type journal entries that will be automatically categorized and stored in a database. It uses AI to analyze and categorize the entries, providing insights and organization to the user's thoughts and experiences.

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

Current features:
- User-friendly interface for writing journal entries
- Automatic categorization of entries using AI
- Secure storage of entries in a PostgreSQL database
- Multi-language support (English and Brazilian Portuguese)
- Responsive design for desktop and mobile use

Upcoming features and improvements:
- Implementation of LangChain for improved AI chat flow and decision-making
- Enhanced AI interaction to request additional information when needed
- User authentication and session management
- Deployment strategy and implementation
- Automated testing suite
- AI-generated reports based on user data
- Integration with external APIs for additional data sources (e.g., weather, news)
- Data visualization tools for better insights
- Customizable user preferences and settings
- Regular security audits and updates

## Technologies Used

- Frontend: React, TypeScript, Vite, Tailwind CSS and shadcn/ui
- Backend: Bun, WebSocket (Native), REST API (From Scratch)
- Database: PostgreSQL
- AI Backend: Ollama (for local AI processing)
- AI Model: Gemma2 by default, but can be changed in the `packages/server/.env` file
- Containerization: Docker

While the project aims to implement many features from scratch (see [Project Philosophy](#project-philosophy)), we also leverage some well-designed tools and libraries to enhance development efficiency and maintain best practices:

### Frontend Libraries
- TanStack's React Query: For efficient data fetching and state management
- i18next: For internationalization
- shadcn/ui: For UI components, that implments Tailwind CSS, Radix UI, Recharts, and more

### Backend Libraries
- pg: For PostgreSQL database interactions
- Ollama: For interfacing with the local AI model

These libraries were chosen for their reliability, performance, and alignment with our project goals. They complement our from-scratch approach by providing robust solutions for specific functionalities, allowing us to focus on building custom features where it matters most.

## Prerequisites

Before you begin, ensure you have the following installed:

- Docker
- Bun (JavaScript runtime and package manager)
- Node.js (v14 or later)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/ai-journal.git
   cd ai-journal
   ```

2. Install project dependencies:
   ```
   bun i
   ```

## Configuration

1. Create two `.env` files:

   a. In the `packages/server` directory, create a `.env` file for the backend:

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
   ```

   b. In the `packages/client` directory, create a `.env` file for the frontend:

   ```
   VITE_API_PROTOCOL=http
   VITE_API_URL=localhost:3000
   ```

   Note: The protocol and URL in the frontend are separated to allow for easier configuration one the WebSocket connection is implemented in the same backend server.

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

## Project Philosophy

This project was implemented largely from scratch or using native APIs, not because it's the easiest or most efficient approach, but as a proof of concept. The goal was to demonstrate that a complex application could be built without relying heavily on third-party libraries or frameworks, while still maintaining a reasonable level of simplicity and maintainability.

Key aspects of this philosophy include:

1. **Minimal Dependencies**: By using native APIs and implementing features from scratch, we reduce external dependencies, which can lead to a more stable and controllable codebase.

2. **Learning Opportunity**: Building components from the ground up provides a deeper understanding of how things work under the hood, which is invaluable for developers looking to enhance their skills.

3. **Customization**: With a from-scratch approach, every aspect of the application can be tailored to specific needs without being constrained by the limitations of third-party libraries.

4. **Performance**: In some cases, custom implementations can be optimized for the specific use case, potentially leading to better performance.

5. **Proof of Concept**: This project serves as a demonstration that complex applications can be built with minimal external dependencies, challenging the notion that modern web development always requires a multitude of frameworks and libraries.

While this approach may not be suitable for all projects, especially those with tight deadlines or specific industry requirements, it showcases the possibilities and benefits of a more hands-on, from-the-ground-up development philosophy.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
