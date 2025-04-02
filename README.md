# Aplicação Web Modularizada

[Vídeo de demostração](https://drive.google.com/file/d/1v5pYmFWMH7bK9iZO5OAcNjEXPaXv0nS3/view?usp=sharing)
Aplicação web com arquitetura modularizada em containers Docker.

## Componentes

- **Frontend**: React
- **Backend**: GoLang (Gin)
- **Banco de Dados**: PostgreSQL
- **Servidor Web**: Nginx

## Funcionalidades

- Gestão de usuários (cadastro, autenticação, edição, exclusão)
- Gestão de produtos (CRUD completo)
- Upload de imagens (usuários e produtos)

## Executando a Aplicação

### Requisitos

- Docker e Docker Compose

### Passos

1. Clone o repositório
2. Execute:
   ```
   docker-compose up -d
   ```
3. Acesse: http://localhost

## Estrutura

```
src/
├── frontend/         # React
├── backend/          # GoLang (Gin)
├── nginx/            # Configurações Nginx
└── docker-compose.yml
```
