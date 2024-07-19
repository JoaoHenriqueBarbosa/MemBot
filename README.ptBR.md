# MemBot: Seu Curador Pessoal de Pensamentos 🧠✨

<p align="center">
  <img src="https://github.com/JoaoHenriqueBarbosa/MemBot/blob/main/packages/public/public/logo-membot-svg.svg" />
</p>

Bem-vindo ao MemBot! 🚀

MemBot é seu companheiro digital que escuta, organiza e fornece insights sobre seus pensamentos diários. Escreva suas entradas livremente, e nosso sistema inteligente irá categorizá-las e analisá-las automaticamente. Acompanhe suas finanças 💰, monitore sua saúde 🧘‍♀️, cultive relacionamentos 💖 ou simplesmente registre seu dia.

O MemBot também oferece insights e sugestões para melhorias, mantendo seus dados seguros e privados.

Pronto para embarcar em uma jornada de autodescoberta? Deixe o MemBot te guiar! 🌟

🌐 [English](README.md)

## Índice

1. [Recursos](#recursos)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Pré-requisitos](#pré-requisitos)
4. [Instalação](#instalação)
5. [Configuração](#configuração)
6. [Executando o Projeto](#executando-o-projeto)
7. [Estrutura do Projeto](#estrutura-do-projeto)
8. [Endpoints da API](#endpoints-da-api)
9. [Contribuindo](#contribuindo)
10. [Resolução de Problemas](#resolucao-de-problemas)
11. [Filosofia do Projeto](#filosofia-do-projeto)
12. [Licença](#licenca)

## Recursos

- Interface amigável para escrever entradas no diário
- Categorização automática das entradas usando IA
- Armazenamento seguro das entradas em um banco de dados PostgreSQL
- Suporte a múltiplos idiomas (Inglês e Português Brasileiro)
- Design responsivo para uso em desktop e dispositivos móveis

## Tecnologias Utilizadas

- Frontend: React, TypeScript, Vite, Tailwind CSS e shadcn/ui
- Backend: Bun, WebSocket (Nativo), REST API (Do Zero)
- Banco de Dados: PostgreSQL
- Backend de IA: Ollama (para processamento de IA local)
- Modelo de IA: Gemma2 por padrão, configurável em `packages/private/.env`
- Containerização: Docker

Enquanto o projeto implementa muitas funcionalidades do zero (veja [Filosofia do Projeto](#filosofia-do-projeto)), também utiliza algumas ferramentas e bibliotecas bem projetadas para melhorar a eficiência do desenvolvimento e manter as melhores práticas:

### Bibliotecas de Frontend

- TanStack's React Query: Para busca eficiente de dados e gerenciamento de estado
- i18next: Para internacionalização
- shadcn/ui: Para componentes de UI, que implementa Tailwind CSS, Radix UI, Recharts e mais

### Bibliotecas de Backend

- pg: Para interações com o banco de dados PostgreSQL
- Ollama: Para interface com o modelo de IA local
- jsonwebtoken: Para autenticação baseada em JWT

Essas bibliotecas foram escolhidas por sua confiabilidade, desempenho e alinhamento com os objetivos do nosso projeto. Elas complementam a abordagem "do zero" ao fornecer soluções robustas para funcionalidades específicas, permitindo concentrar-se em construir recursos personalizados onde mais importa.

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes itens instalados:

- Docker
- Bun (Ambiente de execução e gerenciador de pacotes JavaScript)

## Instalação

1. Clone o repositório:

   ```
   git clone https://github.com/JoaoHenriqueBarbosa/AI-Journal.git
   cd AI-Journal
   ```

2. Instale as dependências do projeto:
   ```
   bun i
   ```

## Configuração

1. Crie dois arquivos `.env`:

   a. No diretório `packages/private`, crie um arquivo `.env` para o backend:

   ```
   PORT=3000
   HOST=localhost
   MODEL_NAME=gemma2
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ai_jrnl
   DB_USER=meu_usuario
   DB_PASSWORD=minha_senha
   DEFAULT_LANGUAGE=en
   JWT_SECRET=seu_segredo_jwt_aqui
   FRONTEND_URL=http://localhost:5173

   # Variáveis de ambiente opcionais:
   # GOOGLE_AI_API_KEY=sua-chave-api-google  # Necessária apenas se não estiver usando Ollama
   # OLLAMA_HOST=ollama  # Necessária apenas se o Ollama estiver no Docker Compose ou em outro PC
   # MAIL_HOST=seu-host-de-email
   # MAIL_PORT=587
   # MAIL_USER=seu-usuario-de-email
   # MAIL_PASSWORD=sua-senha-de-email
   ```

   b. No diretório `packages/public`, crie um arquivo `.env` para o frontend:

   ```
   VITE_API_PROTOCOL=http
   VITE_API_URL=localhost:3000
   ```

   Nota: O protocolo e a URL no frontend estão separados para facilitar a configuração uma vez que a conexão WebSocket seja implementada no mesmo servidor backend.

2. Ajuste o arquivo `docker-compose.yml` se precisar alterar alguma configuração padrão do contêiner PostgreSQL.

## Executando o Projeto

1. Inicie o contêiner do banco de dados PostgreSQL:

   ```
   docker-compose up -d
   ```

2. Inicie o contêiner do Ollama:

   - Para sistemas com suporte a GPU:
     ```
     docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
     ```
   - Para sistemas sem suporte a GPU:
     ```
     docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
     ```

3. Execute o projeto:

   ```
   bun dev
   ```

4. Abra seu navegador e acesse `http://localhost:3000` para acessar a aplicação.

## Estrutura do Projeto

```
ai-journal/
├── packages/
│   ├── client/          # Aplicação frontend React
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── locales/
│   │   └── ...
│   └── server/          # Aplicação backend Node.js
│       ├── api/
│       ├── db/
│       ├── handlers/
│       └── utils/
├── docker-compose.yml
├── init.sql
└── README.md
```

## Endpoints da API

- `/api/financial`: Obter entradas financeiras
- `/api/financial/income`: Obter renda total
- `/api/financial/expense`: Obter despesas totais
- `/api/financial/balance`: Obter saldo atual
- `/api/general`: Obter entradas gerais
- `/api/health-wellbeing`: Obter entradas de saúde e bem-estar
- `/api/health-wellbeing/exercise-time`: Obter tempo total de exercício
- `/api/health-wellbeing/emotion-intensity`: Obter intensidade média de emoção
- `/api/relationships`: Obter entradas de relacionamentos
- `/api/relationships/total-interactions`: Obter total de interações
- `/api/relationships/most-frequent-person`: Obter pessoa mais frequentemente interagida

Para uma documentação mais detalhada da API, consulte o arquivo de documentação da API (se disponível) ou o código-fonte no diretório `packages/server/api/`.

## Contribuindo

1. Faça um fork do repositório
2. Crie sua branch de funcionalidade (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas alterações (`git commit -m 'Adicionar alguma AmazingFeature'`)
4. Envie para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Resolução de Problemas

- Se você encontrar problemas ao executar o comando `docker-compose up -d` e identificar que o problema está relacionado ao arquivo `init.sql`, certifique-se de que o arquivo `init.sql` possui permissões de execução. Caso contrário, execute o seguinte comando:

  Linux e macOS:

  ```sh
  chmod +x init.sql
  ```

  Windows:

  ```sh
  icacls init.sql /grant Everyone:F
  ```

- Se estiver com problemas para se conectar ao banco de dados, verifique se o contêiner PostgreSQL está em execução e se as variáveis de ambiente no seu arquivo `.env` correspondem às configurações no `docker-compose.yml`.

- Para problemas relacionados ao Ollama, verifique se o contêiner do Ollama está sendo executado corretamente e se a porta 11434 está acessível.

## Tarefas Pendentes

Como prova de conceito, este projeto demonstra a funcionalidade central de uma aplicação de diário com IA. No entanto, há muitas áreas onde ele pode ser expandido e melhorado. Algumas melhorias potenciais incluem:

- [ ] Implementação do LangChain para melhorar o fluxo de conversa e tomada de decisões da IA
- [ ] Interação aprimorada da IA para solicitar informações adicionais quando necessário
- [x] Autenticação de usuário e gerenciamento de sessão
- [x] Verificação de e-mail para novos registros de usuários
- [ ] Estratégia e implementação de deployment
- [ ] Suite de testes automatizados
- [ ] Relatórios gerados pela IA com base nos dados do usuário
- [ ] Suporte a outros modelos de IA:
  - [ ] GPT da OpenAI
  - [ ] Claude da Anthropic
  - [x] Gemini do Google
- [ ] Preferências e configurações personalizáveis do usuário
- [ ] Funcionalidade de redefinição de senha
- [ ] Autenticação de múltiplos fatores

Sinta-se à vontade para contribuir para este projeto (veja [Contribuindo](#contribuindo)) implementando alguma dessas funcionalidades ou sugerindo novas.

## Filosofia do Projeto

Este projeto foi implementado em grande parte do zero ou usando APIs nativas, não porque seja a abordagem mais fácil ou eficiente, mas como uma prova de conceito. O objetivo foi demonstrar que uma aplicação complexa pode ser construída sem depender fortemente de bibliotecas ou frameworks de terceiros, mantendo ao mesmo tempo um nível razoável de simplicidade e manutenibilidade.

Aspectos chave dessa filosofia incluem:

1. **Dependências Mínimas**: Ao utilizar APIs nativas e implementar funcionalidades do zero, eu reduzi as dependências externas, o que pode resultar em uma base de código mais estável e controlável.

2. **Oportunidade de Aprendizado**: Construir componentes desde o início proporciona um entendimento mais profundo de como as coisas funcionam internamente, o que é inestimável para desenvolvedores que desejam aprimorar suas habilidades.

3. **Customização**: Com uma abordagem do zero, cada aspecto da aplicação pode ser adaptado às necessidades específicas, sem ser limitado pelas restrições de bibliotecas de terceiros.

4. **Desempenho**: Em alguns casos, implementações personalizadas podem ser otimizadas para o caso de uso específico, potencialmente resultando em melhor desempenho.

5. **Prova de Conceito**: Este projeto serve como uma demonstração de que aplicações complexas podem ser construídas com dependências externas mínimas, desafiando a ideia de que o desenvolvimento web moderno sempre requer uma infinidade de frameworks e bibliotecas.

Embora essa abordagem possa não ser adequada para todos os projetos, especialmente aqueles com prazos apertados ou requisitos específicos da indústria, ela destaca as possibilidades e benefícios de uma filosofia de desenvolvimento mais prática e a partir do zero.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
