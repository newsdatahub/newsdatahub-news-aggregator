# Contributing to News Aggregator

Thank you for your interest in contributing to this project! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project follows a standard code of conduct. Please be respectful and constructive in all interactions.

## How to Contribute

There are many ways to contribute:

- **Report bugs** - Use GitHub Issues to report bugs
- **Suggest features** - Use GitHub Issues for feature requests
- **Improve documentation** - Fix typos, clarify instructions, add examples
- **Submit code** - Fix bugs or implement features via Pull Requests

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Docker (optional, for containerized development)

### Local Development

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/newsdatahub-news-aggregator.git
   cd newsdatahub-news-aggregator
   ```

2. **Set up backend**

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   npm install
   npm run dev
   ```

3. **Set up frontend** (in a new terminal)

   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your configuration
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:80
   - Backend: http://localhost:3001

### Docker Development

```bash
docker compose up
# Access at http://localhost
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types - use proper types or `unknown`
- Export types alongside implementation

### React/Frontend

- Use functional components with hooks
- Prefer custom hooks for reusable logic
- Use meaningful component and variable names
- Keep components small and focused
- Use CSS variables for theming

### Backend

- Use async/await over callbacks
- Handle errors properly - don't swallow errors
- Use logging instead of console.log
- Validate inputs
- Add comments for complex logic

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in objects/arrays
- Run type checks before committing: `npm run type-check`

## Commit Guidelines

We follow conventional commit format:

```
<type>(<scope>): <subject>

<body>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no logic change)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

### Examples

```bash
feat(filters): add country filter component
fix(cache): correct TTL calculation for historical news
docs(readme): update installation instructions
refactor(api): simplify query builder logic
```

### Commit Message Guidelines

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- First line should be 50 characters or less
- Reference issues in commit body when applicable

## Pull Request Process

### Before Submitting

1. **Create a feature branch**

   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**
   - Follow coding standards
   - Add tests if applicable
   - Update documentation if needed

3. **Test your changes**

   ```bash
   # Backend
   cd backend
   npm run type-check
   npm run build

   # Frontend
   cd frontend
   npm run type-check
   npm run build
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**

   ```bash
   git push origin feat/your-feature-name
   ```

### Submitting a Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template with:
   - Clear description of changes
   - Related issue number (if applicable)
   - Screenshots (for UI changes)
   - Testing steps
5. Submit the PR

### PR Review Process

- Maintainers will review your PR
- Address any feedback or requested changes
- Once approved, maintainers will merge your PR
- Your contribution will be credited in the commit history

### PR Guidelines

- Keep PRs focused - one feature/fix per PR
- Update documentation for user-facing changes
- Add tests for new functionality (when tests are implemented)
- Ensure all checks pass
- Keep PR size reasonable (< 500 lines preferred)

## Questions?

If you have questions, feel free to:

- Open a GitHub Issue
- Email: support@newsdatahub.com
- Check existing issues/PRs for similar questions

## Attribution

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to make this project better!
