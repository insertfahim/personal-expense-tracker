# Contributing to Personal Expense Tracker

Thank you for considering contributing to the Personal Expense Tracker! This document provides guidelines for contributing to this project.

## Code of Conduct

This project adheres to a code of conduct that promotes a welcoming and inclusive environment for all contributors.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in the GitHub Issues
2. If not, create a new issue with:
    - Clear title and description
    - Steps to reproduce (for bugs)
    - Expected vs actual behavior
    - Screenshots if applicable
    - Environment details (OS, Node.js version, etc.)

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/personal-expense-tracker.git`
3. Install dependencies:

    ```bash
    # Backend
    cd backend && npm install

    # Frontend
    cd ../frontend && npm install
    ```

4. Set up environment variables (see README.md)
5. Start development servers:

    ```bash
    # Backend (in backend directory)
    npm run dev

    # Frontend (in frontend directory)
    npm run dev
    ```

### Making Changes

1. Create a new branch from `main`:

    ```bash
    git checkout -b feature/your-feature-name
    # or
    git checkout -b fix/your-bug-fix
    ```

2. Make your changes following the coding standards:

    - Use TypeScript for new frontend code
    - Follow existing code style and patterns
    - Add proper error handling
    - Include input validation where needed

3. Test your changes:

    ```bash
    # Frontend
    npm run test
    npm run lint

    # Backend
    npm run test
    npm run lint
    ```

4. Commit your changes using conventional commits:
    ```bash
    git commit -m "feat: add expense filtering by date range"
    git commit -m "fix: resolve authentication token expiry issue"
    git commit -m "docs: update API documentation"
    ```

### Commit Message Format

We use conventional commits for clear and consistent commit messages:

-   `feat:` New features
-   `fix:` Bug fixes
-   `docs:` Documentation changes
-   `style:` Code style changes (formatting, etc.)
-   `refactor:` Code refactoring
-   `test:` Adding or updating tests
-   `chore:` Maintenance tasks

### Pull Request Process

1. Ensure your branch is up to date with main:

    ```bash
    git checkout main
    git pull origin main
    git checkout your-branch
    git rebase main
    ```

2. Push your changes:

    ```bash
    git push origin your-branch
    ```

3. Create a Pull Request with:

    - Clear title describing the change
    - Detailed description of what was changed and why
    - Link to any related issues
    - Screenshots for UI changes

4. Ensure all checks pass:
    - Tests must pass
    - Code must follow linting rules
    - No merge conflicts

### Code Style Guidelines

#### Frontend (TypeScript/React)

-   Use functional components with hooks
-   Implement proper TypeScript types
-   Follow React best practices
-   Use meaningful component and variable names
-   Add proper error handling
-   Use async/await for API calls

#### Backend (Node.js/Express)

-   Use proper error handling middleware
-   Implement input validation
-   Follow RESTful API conventions
-   Use meaningful function and variable names
-   Add proper logging
-   Handle edge cases

#### General

-   Write clear, self-documenting code
-   Add comments for complex logic
-   Keep functions focused and small
-   Use consistent naming conventions
-   Follow DRY (Don't Repeat Yourself) principles

### Feature Requests

For new features:

1. Open an issue to discuss the feature
2. Explain the use case and benefits
3. Consider backward compatibility
4. Discuss implementation approach

### Testing

-   Write unit tests for new functions
-   Test API endpoints thoroughly
-   Test UI components and user flows
-   Ensure mobile responsiveness
-   Test with different data scenarios

### Documentation

When adding features:

-   Update README.md if needed
-   Add API documentation for new endpoints
-   Update type definitions
-   Add code comments for complex logic

### Getting Help

If you need help:

-   Check existing issues and discussions
-   Read the documentation
-   Look at similar implementations in the codebase
-   Ask questions in issue comments

## Recognition

Contributors will be recognized in the project documentation and release notes.

Thank you for contributing to making this project better!
