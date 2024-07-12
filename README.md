# AI Journal

This project is a web application that allows users to type journal entries that will be automatically categorized and stored in a database.

## Prerequisites

- Docker
- Bun

## Installing project dependencies:

```bash
bun i
```

## Running the project:

```bash
bun dev
```

But before running the project, you need to start two Docker containers: a PostgreSQL database and an Ollama container.

## Starting the containers

### Starting the PostgreSQL Database

To start a PostgreSQL container, run the following command in the root directory of the project:

```sh
docker-compose up -d
```

### Starting Ollama

There is more than one way to have Ollama running on your machine. The first option is using Docker. The second option is [installing Ollama manually](https://ollama.com/download).

If you prefer to use Docker, follow the instructions below.

If your system supports GPUs, you can use the first option.

```sh
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

Otherwise, use the second option.

```sh
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

## Verification

After running the above commands, you can verify if the containers are running using:

```sh
docker ps
```

This will display a list of running containers and their respective mapped ports.

## Stopping the containers

To stop and remove the containers, run the following commands:

```sh
docker stop my_postgres_db ollama
docker rm my_postgres_db ollama
```

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