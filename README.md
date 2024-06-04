# Projeto ai-jrnl

Instalação do projeto:

```bash
bun install
```

# Projeto Docker com PostgreSQL e Ollama

Este projeto configura dois contêineres Docker: um banco de dados PostgreSQL e um contêiner Ollama com suporte a GPUs.

## Pré-requisitos

- Docker instalado na sua máquina.

## Iniciando os contêineres

### Iniciar PostgreSQL

Para iniciar um contêiner PostgreSQL, execute o seguinte comando:

```sh
docker run -d \
  --name my_postgres_db \
  -e POSTGRES_DB=mydatabase \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -p 5432:5432 \
  -v db_data:/var/lib/postgresql/data \
  -v $(pwd)/init.sql:/docker-entrypoint-initdb.d/init.sql \
  postgres:latest
```

### Iniciar Ollama

Se o seu sistema tiver suporte a GPUs, você pode usar a primeira opção.

```sh
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

Caso contrário, use a segunda opção.

```sh
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

## Verificação

Após executar os comandos acima, você pode verificar se os contêineres estão em execução usando:

```sh
docker ps
```

Isso exibirá uma lista dos contêineres em execução e suas respectivas portas mapeadas.

## Finalizando os contêineres

Para parar e remover os contêineres, execute os seguintes comandos:

```sh
docker stop my_postgres_db ollama
docker rm my_postgres_db ollama
```

## Notas

- Certifique-se de que o arquivo `init.sql` esteja no diretório atual de onde você está executando o comando `docker run` para o PostgreSQL.
- O volume `ollama` é utilizado para armazenar dados persistentes do contêiner Ollama. Você pode verificar o conteúdo deste volume conforme necessário.
