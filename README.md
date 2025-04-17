# 📚 Sistema de Gerenciamento Escolar

Sistema completo para gestão de matrículas, turmas e avaliações em uma escola de inglês.  
Projeto pessoal desenvolvido com o objetivo de praticar e aprofundar conhecimentos em **Spring Boot** e **ReactJS**.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: ReactJS + React Bootstrap  
- **Backend**: Java com Spring Boot  
- **Banco de Dados**: PostgreSQL (via JPA)  
- **Segurança**: Autenticação baseada em JWT  
- **Comunicação**: API RESTful com requisições HTTP  
- **Containers**: Docker e Docker Compose

---

## 🧩 Funcionalidades

- 📌 Cadastro e matrícula de alunos
- 🏫 Gerenciamento de turmas
- 🔁 Atribuição de alunos a turmas específicas
- 📝 Emissão de boletins com múltiplos níveis de avaliação por competência
- ✅ Registro de presença e cálculo automático da frequência no fim do semestre
- 📄 Geração de certificados para os alunos
- 🔐 Controle de acesso com três níveis de permissão:
  - **Aluno**: acesso aos próprios boletins e certificados
  - **Professor**: lançamento de notas e chamadas
  - **Diretor**: gerenciamento geral do sistema (alunos, turmas, professores)

---

## 🧱 Arquitetura e Estrutura

O projeto segue uma **arquitetura em camadas**, com as seguintes responsabilidades organizadas por entidade:

- `Entity`: representa os modelos de dados (JPA)
- `Repository`: camada de acesso a dados
- `Service`: regras de negócio
- `Mapper`: conversão entre entidades e DTOs

---

## 🛠️ Execução e Desenvolvimento

- Projeto configurado para rodar com **Docker Compose**, facilitando a inicialização do banco de dados e da aplicação
- Scripts prontos para rodar o frontend e backend localmente:
  - Frontend: `npm start`
  - Backend: `./mvnw spring-boot:run`
- Suporte a múltiplos períodos letivos
- Utilização de DTOs para transporte seguro de dados entre cliente e servidor
