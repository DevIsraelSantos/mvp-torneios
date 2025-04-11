# Contribuindo para o Projeto

Este guia fornece as instruções para contribuir com o projeto, garantindo que todas as alterações estejam organizadas e atendam aos padrões definidos.

---

## 🎯 Padrões de Commits

## 🎯 Padrões de Commits

Utilizamos o padrão **Conventional Commits** para manter as mensagens de commit consistentes e fáceis de entender. Siga as instruções abaixo ao criar suas mensagens de commit.

### **Estrutura do Commit**

Cada mensagem de commit deve seguir este formato:

```
<tipo>(escopo): <descrição>
```

#### **Campos**

- **tipo** _(obrigatório)_: Define o propósito da mudança. Exemplos:

  - `feat`: Adição de uma nova funcionalidade.
  - `fix`: Correção de bugs.
  - `docs`: Alterações em documentação.
  - `style`: Ajustes de formatação ou estilo de código (sem mudanças de lógica).
  - `refactor`: Refatoração de código.
  - `test`: Adição ou alteração de testes.
  - `chore`: Outras tarefas auxiliares (build, ferramentas, etc.).

- **escopo** _(opcional)_: Uma palavra para definir qual parte do projeto está sendo modificada. Deve ser uma palavra curta e descritiva, em minúsculas (ex: "auth", "api", "rewards", "missions").

- **descrição** _(obrigatória)_: Uma frase breve e clara descrevendo a mudança. Use verbos no **imperativo** e em **minúsculas** (ex: "add feature", "fix bug").

- **idioma** _(obrigatório)_: Todas as mensagens de commit devem ser escritas em **inglês**.

---

### **Regras de Validação**

Utilizamos o **Commitlint** para garantir que as mensagens de commit sigam as regras abaixo:

1. **Scopes Obrigatorio**: Utilize scope quando for uma alteração ou coisa nova.

   - ✅ Exemplo inválido: `feat(auth): add login functionality`
   - ❌ Exemplo válido: `feat: add login functionality`

2. **Scopes Opcional**: Não utilize escopo quando for uma atividade que não altera o core da aplicação.

   - ✅ Exemplo inválido: `docs: update README`
   - ❌ Exemplo válido: `docs(docs): update README`

3. **Descrição em letras minúsculas**:

   - ✅ Exemplo válido: `fix(auth): resolve login bug`
   - ❌ Exemplo inválido: `fix(auth): Resolve login bug`

4. **Não use ponto final na descrição**:

   - ✅ Exemplo válido: `docs: update README`
   - ❌ Exemplo inválido: `docs: update README.`

5. **Limite máximo de 72 caracteres no cabeçalho**:
   - ✅ Exemplo válido: `feat(auth): add password recovery feature`
   - ❌ Exemplo inválido: `feat(auth): add a new password recovery feature to the login page`

---

### **Exemplos de Commits**

- **Adicionando uma funcionalidade**:  
  `feat(settings): add user registration page`

- **Corrigindo um bug**:  
  `fix(auth): resolve issue with login redirection`

- **Alterações na documentação**:  
  `docs: add contributing guide`

---

### **Comandos Antes de Commitar**

1. **Testes locais**:

```bash
npm test
```

2. **Lint do código**:

```bash
npm run lint
```

3. **Validação da mensagem de commit**: O Commitlint será automaticamente executado no momento do commit.

Obrigado por contribuir para o projeto! 🚀
