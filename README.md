# Facebook API Clone

## Configurações
```bash
# Biblioteca para conexão com banco de dados:
npm install @adonisjs/lucid

# Comando para configurar o banco de dados:
node ace configure @adonisjs/lucid

# Biblioteca de autenticação:
npm install @adonisjs/auth

# Comando para configurar o autenticador:
node ace configure @adonisjs/auth

# Validação de dados para autenticação:
node ace make:validator Auth/StoreValidator

# Criação do Controller de autenticação:
node ace make:controller Auth/Main -r
```
