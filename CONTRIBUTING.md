# Contributing to PropChain Backend

> 🏠 **Building the Future of Real Estate on Blockchain**  
> Thank you for your interest in contributing to PropChain Backend!

We welcome contributions from the community! This guide will help you get started with contributing to our Web3 real estate infrastructure.

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** v18+ (LTS recommended)
- **PostgreSQL** v14+
- **Redis** (for caching)
- **Git** version control
- **Rust** toolchain (for smart contract compilation)
- Basic understanding of **TypeScript**, **NestJS**, and **Web3**

### Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/MettaChain/PropChain-BackEnd.git
   cd PropChain-BackEnd
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   # Configure your local environment variables
   ```

4. **Database Setup**

   ```bash
   createdb propchain_dev
   npm run migrate
   npm run seed  # Optional: seed with test data
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

## 📋 How to Contribute

### 🐛 Reporting Bugs

- Use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include detailed reproduction steps
- Provide environment details (OS, Node.js version, etc.)
- Add relevant logs or error messages

### 💡 Suggesting Features

- Use the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md)
- Describe the problem you're trying to solve
- Explain the proposed solution
- Consider alternative approaches

### 🔧 Code Contributions

#### 1. Create an Issue

- Search existing issues to avoid duplicates
- Create a new issue describing your proposed changes
- Wait for maintainer approval before starting work

#### 2. Set Up Your Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

#### 3. Development Guidelines

##### Code Style

- Follow **ESLint** and **Prettier** configurations
- Use **TypeScript** strict mode
- Write **descriptive commit messages**
- Keep functions small and focused

##### Code Structure

```
src/
├── controllers/     # API route handlers
├── services/        # Business logic
├── models/          # Database models
├── middleware/      # Express middleware
├── utils/           # Helper functions
├── config/          # Configuration
└── types/           # TypeScript definitions
```

##### Best Practices

- **Error Handling**: Use proper HTTP status codes and error responses
- **Validation**: Validate all input data using DTOs
- **Security**: Sanitize inputs and implement proper authentication
- **Testing**: Write tests for all new features
- **Documentation**: Update API docs for new endpoints

#### 4. Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

**Testing Requirements:**

- Unit tests for all new functions
- Integration tests for API endpoints
- E2E tests for critical user flows
- Minimum 80% code coverage

#### 5. Smart Contract Contributions

For smart contract changes:

```bash
# Compile contracts
npm run compile:contracts

# Test contracts
npm run test:contracts

# Deploy to testnet
npm run deploy:testnet
```

**Contract Guidelines:**

- Follow **Solidity** or **Rust** best practices
- Include comprehensive test coverage
- Add inline documentation
- Consider gas optimization

#### 6. Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

feat(auth): add Web3 wallet authentication
fix(api): resolve property listing pagination bug
docs(readme): update installation instructions
test(contracts): add ERC721 tokenization tests
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build process or dependency changes

#### 7. Pull Request Process

1. **Update Documentation**
   - API documentation for new endpoints
   - README if needed
   - Code comments for complex logic

2. **Run Full Test Suite**

   ```bash
   npm run test:all
   npm run lint
   npm run build
   ```

3. **Create Pull Request**
   - Use descriptive title and description
   - Link to related issues
   - Include screenshots for UI changes
   - Add testing instructions

4. **PR Template**

   ```markdown
   ## Description

   Brief description of changes

   ## Type of Change

   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing

   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed

   ## Checklist

   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] Tests added/updated
   ```

## 🏗️ Development Workflow

### Branch Strategy

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: New feature development
- **`fix/*`**: Bug fixes
- **`hotfix/*`**: Critical production fixes

### Code Review Process

1. **Automated Checks**
   - ESLint validation
   - Type checking
   - Test coverage
   - Build verification

2. **Manual Review**
   - Code quality and architecture
   - Security considerations
   - Performance implications
   - Documentation completeness

3. **Approval Requirements**
   - At least one maintainer approval
   - All automated checks must pass
   - No merge conflicts

## 📚 Development Resources

### Documentation

- [API Documentation](./docs/api.md)
- [Architecture Guide](./docs/architecture.md)
- [Smart Contract Docs](./docs/contracts.md)
- [Deployment Guide](./docs/deployment.md)

### Tools & Extensions

- **VS Code Extensions**:
  - TypeScript Hero
  - ESLint
  - Prettier
  - GitLens
  - Thunder Client (API testing)

### Learning Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Ethereum Development Guide](https://ethereum.org/en/developers/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read our [Code of Conduct](./CODE_OF_CONDUCT.md).

### Communication Channels

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and ideas
- **Discord**: For real-time collaboration (coming soon)

### Getting Help

- Check existing issues and documentation
- Ask questions in GitHub Discussions
- Reach out to maintainers for guidance

## 🏆 Recognition

### Contributors

We value all contributions! Contributors will be:

- Listed in our README
- Mentioned in release notes
- Invited to our contributor Discord channel
- Eligible for contributor rewards (future program)

### Types of Contributions We Value

- **Code**: Features, bug fixes, performance improvements
- **Documentation**: API docs, tutorials, guides
- **Testing**: Test cases, bug reports, quality assurance
- **Design**: UI/UX improvements, graphics
- **Community**: Support, feedback, evangelism

## 📋 Release Process

### Version Management

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. **Pre-Release**
   - All tests passing
   - Documentation updated
   - CHANGELOG.md updated
   - Version number bumped

2. **Release**
   - Create release tag
   - Generate release notes
   - Deploy to production
   - Update documentation

3. **Post-Release**
   - Monitor for issues
   - Community announcement
   - Update project boards

## 🛠️ Troubleshooting

### Common Issues

**Database Connection Errors**

```bash
# Check PostgreSQL status
pg_ctl status

# Reset database
npm run db:reset
```

**Smart Contract Compilation**

```bash
# Clear cache
npm run clean
npm run compile:contracts
```

**Test Failures**

```bash
# Clear Jest cache
npm run test:clear

# Update snapshots
npm run test:update-snapshots
```

### Getting Help

1. Check the [Troubleshooting Guide](./docs/troubleshooting.md)
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Tag maintainers for urgent issues

---

## 🎉 Thank You!

Your contributions help make PropChain Backend better for everyone. Whether you're fixing a bug, adding a feature, or improving documentation, your efforts are greatly appreciated!

**Ready to contribute?** 🚀

1. Find an issue that interests you
2. Fork the repository
3. Create your feature branch
4. Make your changes
5. Submit a pull request

We look forward to working with you! 🤝

---

<div align="center">

**Made with ❤️ by the PropChain Community**

[⭐ Star this repo](https://github.com/MettaChain/PropChain-BackEnd) | [🐛 Report Issues](https://github.com/MettaChain/PropChain-BackEnd/issues) | [💬 Join Discussion](https://github.com/MettaChain/PropChain-BackEnd/discussions)

</div>
