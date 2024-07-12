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
11. [License](#license)

## Features

- User-friendly interface for writing journal entries
- Automatic categorization of entries using AI
- Secure storage of entries in a PostgreSQL database
- Multi-language support (English and Brazilian Portuguese)
- Responsive design for desktop and mobile use

## Technologies Used

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express.js, TypeScript
- Database: PostgreSQL
- AI Model: Ollama (for local AI processing)
- Containerization: Docker

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

1. Create a `.env` file in the root directory and add the following environment variables:
   ```
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=your_db_name
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   ```

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

- `POST /api/journal-entry`: Submit a new journal entry
- `GET /api/entries`: Retrieve all journal entries
- `GET /api/entries/:category`: Retrieve entries by category
- `PUT /api/entries/:id`: Update a specific entry
- `DELETE /api/entries/:id`: Delete a specific entry

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
