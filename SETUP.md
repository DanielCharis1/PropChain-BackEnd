# PropChain Backend Setup Guide

This guide will help you set up the PropChain Backend development environment from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18+ (LTS recommended)
- **npm** or **yarn** package manager
- **PostgreSQL** v14+
- **Redis** v6+
- **Git** version control
- **Docker** & **Docker Compose** (optional, for containerized setup)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/MettaChain/PropChain-BackEnd.git
cd PropChain-BackEnd
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration

```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

**Required Environment Variables:**

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `ENCRYPTION_KEY` - 32-character encryption key
- `RPC_URL` - Blockchain RPC endpoint

### 4. Database Setup

```bash
# Create database
createdb propchain

# Run database migrations
npm run migrate

# Generate Prisma client
npm run db:generate

# (Optional) Seed with test data
npm run db:seed
```

### 5. Start Development Server

```bash
# Start in development mode with hot reload
npm run start:dev

# Or with debug logging
npm run start:debug
```

The API will be available at `http://localhost:3000` with interactive Swagger docs at `http://localhost:3000/api/docs`.

## Docker Setup (Recommended)

### Using Docker Compose

```bash
# Start all services (database, redis, api)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Individual Services

```bash
# Start only database
docker-compose up -d postgres redis

# Start API with local development
npm run start:dev
```

## Development Workflow

### Code Quality

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint -- --fix

# Format code
npm run format

# Type checking
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Generate coverage report
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

### Database Operations

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npm run db:reset

# View database in browser
npm run db:studio

# Generate Prisma client
npm run db:generate
```

## Project Structure

```
src/
├── common/           # Shared utilities and middleware
│   ├── filters/      # Exception filters
│   ├── interceptors/ # Response interceptors
│   ├── logger/      # Winston logging
│   └── decorators/  # Custom decorators
├── config/          # Configuration management
├── database/        # Database models and services
├── health/          # Health check endpoints
├── modules/         # Business logic modules
│   ├── auth/        # Authentication
│   ├── users/       # User management
│   ├── properties/  # Property management
│   ├── transactions/ # Transaction handling
│   └── blockchain/  # Blockchain integration
├── app.module.ts    # Root module
└── main.ts          # Application entry point
```

## Environment Variables

### Application Configuration

- `NODE_ENV` - Environment (development/staging/production)
- `PORT` - Server port (default: 3000)
- `API_PREFIX` - API route prefix (default: api)
- `CORS_ORIGIN` - Allowed CORS origins

### Database

- `DATABASE_URL` - PostgreSQL connection string

### Redis

- `REDIS_HOST` - Redis server host
- `REDIS_PORT` - Redis server port
- `REDIS_PASSWORD` - Redis password (if required)

### Security

- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT token expiration
- `ENCRYPTION_KEY` - Data encryption key

### Blockchain

- `BLOCKCHAIN_NETWORK` - Blockchain network (sepolia/mainnet)
- `RPC_URL` - Blockchain RPC endpoint
- `PRIVATE_KEY` - Private key for transactions (development only)

## API Documentation

Once the server is running, visit:

- **Swagger UI**: `http://localhost:3000/api/docs`
- **Health Check**: `http://localhost:3000/api/health`
- **Configuration**: `http://localhost:3000/api/configuration`

## Troubleshooting

### Common Issues

**Database Connection Error**

```bash
# Check PostgreSQL status
pg_ctl status

# Reset database
npm run db:reset
```

**Redis Connection Error**

```bash
# Check Redis status
redis-cli ping

# Restart Redis
docker-compose restart redis
```

**Module Not Found Errors**

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Port Already in Use**

```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)
```

### Getting Help

- Check the [GitHub Issues](https://github.com/MettaChain/PropChain-BackEnd/issues)
- Review the [API Documentation](http://localhost:3000/api/docs)
- Join our [Discord Community](https://discord.gg/propchain)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please read our [Contributing Guide](./CONTRIBUTING.md) for detailed guidelines.

## Production Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production database and Redis
3. Set secure JWT secrets and encryption keys
4. Configure proper CORS origins
5. Set up SSL certificates

### Docker Deployment

```bash
# Build production image
docker build -t propchain-backend .

# Run with production configuration
docker run -d \
  --name propchain-api \
  -p 3000:3000 \
  --env-file .env.production \
  propchain-backend
```

### Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -l app=propchain-backend
```

## Security Considerations

- Never commit `.env` files or secrets
- Use strong, unique JWT secrets
- Enable rate limiting in production
- Use HTTPS in production
- Regularly update dependencies
- Implement proper input validation
- Use environment-specific configurations

## Performance Optimization

- Enable Redis caching for frequently accessed data
- Use database connection pooling
- Implement proper indexing
- Monitor application metrics
- Use CDN for static assets
- Optimize database queries

## Monitoring and Logging

- Application logs are stored in `logs/` directory
- Use structured logging for better monitoring
- Set up external monitoring (Prometheus/Grafana)
- Configure error tracking (Sentry)
- Monitor database performance

---

**Happy coding! 🚀**

For additional support, reach out to the PropChain team at support@propchain.io
