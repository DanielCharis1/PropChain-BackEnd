# PropChain Backend

> 🏠 **Decentralized Real Estate Infrastructure** | Backend API for blockchain-powered property transactions

PropChain Backend is a production-grade server-side infrastructure that enables the tokenization and trading of real estate assets through blockchain technology. Our API provides the core services needed to build decentralized real estate platforms, including smart contract integration, secure transaction processing, and comprehensive property management capabilities.

Built with enterprise-grade technologies, this backend serves as the foundation for Web3 real estate applications, enabling developers to create platforms where physical properties can be represented as digital assets and traded seamlessly using cryptocurrency.

## 🚀 Features

### Core Capabilities

- **🏠 Asset Tokenization**: Transform physical real estate properties into tradable NFTs with legal compliance
- **💰 Crypto Transaction Processing**: Secure, multi-chain cryptocurrency payment processing
- **🔗 Smart Contract Integration**: Pre-built contracts for property ownership, transfers, and escrow
- **📊 Property Management APIs**: Complete CRUD operations for real estate listings and metadata
- **🔐 Web3 Authentication**: Wallet-based user authentication with role-based access control
- **💾 Enterprise Data Storage**: Scalable PostgreSQL database with migration support

### Advanced Features

- **🌐 Multi-Chain Support**: Ethereum, Polygon, and BSC network compatibility
- **📈 Real-Time Analytics**: Property valuation trends and market insights
- **🔍 Search & Discovery**: Advanced filtering and geospatial property search
- **📱 Mobile-Ready API**: RESTful endpoints optimized for mobile applications
- **🛡️ Security First**: Built-in rate limiting, input validation, and audit logging

## 👥 Target Audience

This backend is designed for:

- **Real Estate Tech Companies** building blockchain-based property platforms
- **Property Investment Firms** seeking fractional ownership solutions
- **Blockchain Developers** creating DeFi real estate applications
- **Real Estate Agencies** modernizing their transaction infrastructure
- **FinTech Startups** integrating real estate into their crypto ecosystems

## 🛠️ Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18+ (LTS recommended) - [Download](https://nodejs.org/)
- **npm** v9+ or **yarn** v3+ package manager
- **PostgreSQL** v14+ - [Download](https://www.postgresql.org/download/)
- **Redis** v6+ - [Download](https://redis.io/download) (for caching and session management)
- **Git** v2.30+ - [Download](https://git-scm.com/)
- **Docker** & **Docker Compose** (optional, for containerized setup)

Check your environment:

```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher
psql --version  # Should be PostgreSQL 14.0 or higher
```

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/MettaChain/PropChain-BackEnd.git
cd PropChain-BackEnd
```

#### 2. Install Dependencies

```bash
# Using npm (recommended)
npm install

# Or using yarn
yarn install
```

#### 3. Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env

# Edit configuration (use your preferred editor)
nano .env
# or
code .env
```

**Required Environment Variables:**

- `DATABASE_URL` - PostgreSQL connection string (e.g., `postgresql://user:pass@localhost:5432/propchain`)
- `JWT_SECRET` - Secret key for JWT signing (generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens (different from JWT_SECRET)
- `ENCRYPTION_KEY` - 32-character encryption key for sensitive data
- `REDIS_URL` - Redis connection string (e.g., `redis://localhost:6379`)
- `NODE_ENV` - Environment (development/staging/production)

**Optional but Recommended:**

- `LOG_LEVEL` - Logging verbosity (debug/info/warn/error)
- `CORS_ORIGIN` - CORS allowed origins (default: '\*')
- `PORT` - Server port (default: 3000)
- `MAX_LOGIN_ATTEMPTS` - Max failed login attempts (default: 5)
- `LOGIN_ATTEMPT_WINDOW` - Time window for rate limiting in seconds (default: 600)

#### 4. Set Up Database

```bash
# Create PostgreSQL database
createdb propchain

# Or using psql if createdb is not in PATH
psql -U postgres -c "CREATE DATABASE propchain;"

# Run migrations
npm run migrate

# (Optional) Seed database with sample data
npm run db:seed
```

Verify database connection:

```bash
npm run health  # Should return 200 OK
```

#### 5. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000` with:

- **API endpoints** at `http://localhost:3000/api/*`
- **Swagger documentation** at `http://localhost:3000/api`
- **Health check** at `http://localhost:3000/health`

### Docker Setup (Optional)

For a containerized development environment:

```bash
# Build Docker image
docker build -t propchain-backend:latest .

# Start with Docker Compose
docker-compose up

# Or run containers individually
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/propchain \
  -e NODE_ENV=development \
  propchain-backend:latest
```

## 🚀 Deployment & Operations

### Development Environment

```bash
npm run dev          # Start development server with hot reload
npm run start:dev    # Start with debug logging
npm run test:watch   # Run tests in watch mode
```

Watch mode will automatically restart the server when you make changes to TypeScript files.

### Production Deployment

```bash
# Build for production
npm run build        # Compile TypeScript to JavaScript

# Start production server
npm start

# Verify service health
npm run health       # Should return 200 OK
```

**Production Checklist:**

- [ ] Set `NODE_ENV=production`
- [ ] Use strong, randomly-generated JWT secrets
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Configure database backups
- [ ] Set up monitoring and alerting
- [ ] Configure rate limiting appropriately
- [ ] Review security headers configuration

### Testing & Quality

```bash
npm test                    # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:integration   # Run integration tests
npm run test:e2e          # Run end-to-end tests
npm run test:coverage     # Generate coverage report
npm run lint              # Check code style
npm run format            # Auto-format code
```

### Database Management

```bash
# Migrations
npm run migrate            # Run pending migrations
npm run migrate:deploy     # Deploy migrations (production)
npm run migrate:reset      # Reset database (⚠️ deletes all data)

# Database tools
npm run db:seed           # Seed with sample data
npm run db:studio         # Open Prisma Studio UI
npm run db:backup         # Backup database (runs scripts/backup.sh)

# Verification
npm run health            # Health check
```

## 📖 API Usage Examples

### Authentication

#### Register New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Response:

```json
{
  "message": "User registered successfully. Please check your email for verification."
}
```

#### Login with Email/Password

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx123...",
    "email": "user@example.com",
    "isVerified": false
  }
}
```

#### Web3 Wallet Login

```bash
curl -X POST http://localhost:3000/api/auth/web3-login \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc59e4e7aa6cA6",
    "signature": "0xabcdef..."
  }'
```

### Using Access Token

All protected endpoints require an authorization header:

```bash
curl -X GET http://localhost:3000/api/properties \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Property Management

#### Create Property

```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Luxury Apartment in Manhattan",
    "description": "Beautiful 3-bedroom apartment with stunning city views",
    "address": {
      "street": "123 Fifth Avenue",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "type": "APARTMENT",
    "price": 2500000,
    "bedrooms": 3,
    "bathrooms": 2.5,
    "areaSqFt": 2500,
    "status": "AVAILABLE"
  }'
```

#### Search Properties with Filters

```bash
# Find 2-3 bedroom apartments under $500k in New York with pagination
curl -X GET "http://localhost:3000/api/properties?minBedrooms=2&maxBedrooms=3&type=APARTMENT&maxPrice=500000&city=New%20York&page=1&limit=20&sortBy=price&sortOrder=asc" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Find Nearby Properties

```bash
# Find properties within 5km of coordinates (40.7128, -74.0060)
curl -X GET "http://localhost:3000/api/properties/search/nearby?latitude=40.7128&longitude=-74.0060&radiusKm=5" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Token Management

#### Refresh Access Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

#### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔐 Security & Authentication

### Token Expiration

- **Access Token**: 15 minutes (configurable via `JWT_EXPIRES_IN`)
- **Refresh Token**: 7 days (configurable via `JWT_REFRESH_EXPIRES_IN`)

### Rate Limiting

- **Login Attempts**: 5 attempts per 10 minutes per email/wallet
- **API Requests**: Configurable via `THROTTLE_LIMIT` and `THROTTLE_TTL`

### Password Requirements

Passwords must contain:

- At least 8 characters
- One uppercase letter (A-Z)
- One lowercase letter (a-z)
- One number (0-9)
- One special character (!@#$%^&\*)

### Best Practices

1. **Always use HTTPS** in production
2. **Keep secrets secure** - never commit `.env` files
3. **Rotate keys** regularly
4. **Monitor logs** for suspicious activity
5. **Use strong passwords** - encourage users to use password managers
6. **Enable email verification** to prevent account takeover
7. **Implement 2FA** for admin accounts

## 🐛 Troubleshooting

### Database Connection Issues

**Error**: `ECONNREFUSED - connection refused on 127.0.0.1:5432`

**Solutions**:

```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# On macOS with Homebrew
brew services start postgresql

# On Linux
sudo systemctl start postgresql

# Check DATABASE_URL is correct in .env
```

### Redis Connection Errors

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:6379`

**Solutions**:

```bash
# Start Redis server
redis-server

# Or check if Redis is running
redis-cli ping  # Should return PONG
```

### Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### TypeScript Compilation Errors

```bash
# Clear cache and rebuild
rm -rf dist/
npm run build

# Check TypeScript configuration
npx tsc --noEmit
```

### JWT Token Errors

**Error**: `UnauthorizedException: Invalid token`

**Solutions**:

- Ensure token is included in `Authorization: Bearer <token>` header
- Check token hasn't expired
- Verify `JWT_SECRET` matches on server
- Try refreshing token with refresh endpoint

## 🌐 Network Configuration

### Supported Blockchains

- **Ethereum** (Mainnet, Sepolia Testnet)
- **Polygon** (Mainnet, Mumbai Testnet)
- **Binance Smart Chain** (Mainnet, Testnet)
- **Local Development** (Hardhat Network)

### Environment Configuration

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/propchain

# Blockchain
BLOCKCHAIN_NETWORK=sepolia
RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_here

# Security
JWT_SECRET=your_jwt_secret_key
API_KEY=your_api_key

# Services
REDIS_URL=redis://localhost:6379
WEB3_STORAGE_TOKEN=your_web3_storage_token
```

## 📚 Documentation & Resources

### API Documentation

- **[📖 API Reference](./docs/api.md)** - Complete REST API documentation with examples
- **[🔗 Smart Contracts](./docs/contracts.md)** - Contract interfaces and integration guides
- **[🚀 Deployment Guide](./docs/deployment.md)** - Production deployment best practices
- **[🏗️ Architecture](./docs/architecture.md)** - System design and technical architecture

### Repository Structure

```
PropChain-BackEnd/
├── 📁 src/
│   ├── 📁 controllers/     # API route handlers and request processing
│   ├── 📁 services/        # Business logic and external service integrations
│   ├── 📁 models/          # Database models and schemas (Prisma)
│   ├── 📁 middleware/      # Authentication, validation, and error handling
│   ├── 📁 utils/           # Helper functions and utilities
│   ├── 📁 config/          # Configuration management
│   └── 📁 types/           # TypeScript type definitions
├── 📁 contracts/           # Smart contracts (Rust/Solidity)
├── 📁 migrations/          # Database migration files
├── 📁 tests/              # Unit, integration, and E2E tests
├── 📁 docs/               # Comprehensive documentation
├── 📁 scripts/            # Build, deployment, and utility scripts
├── 📁 .github/            # CI/CD workflows and issue templates
└── 📁 docker/             # Docker configuration files
```

### Contributing

- **[🤝 Contributing Guide](./CONTRIBUTING.md)** - How to contribute effectively
- **[📋 Code of Conduct](./CODE_OF_CONDUCT.md)** - Community guidelines and standards
- **[🐛 Issue Templates](./.github/ISSUE_TEMPLATE/)** - Standardized issue reporting
- **[💡 Feature Requests](./.github/ISSUE_TEMPLATE/feature_request.md)** - Feature proposal template

### Additional Resources

- **[🌐 Frontend Application](https://github.com/MettaChain/PropChain-FrontEnd)** - Client-side React/Next.js application
- **[🔒 Security Audits](./audits/)** - Third-party security audit reports
- **[📊 Performance Metrics](./docs/performance.md)** - Benchmarks and optimization guides
- **[🎓 Tutorials](./docs/tutorials/)** - Step-by-step integration tutorials

## � Code Examples & Complex Operations

### Complete Authentication Flow

This example shows a complete authentication workflow from registration to authenticated API calls:

```javascript
// 1. Register New User
const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'developer@example.com',
    password: 'SecurePass123!',
    firstName: 'Jane',
    lastName: 'Developer',
  }),
});
// User receives verification email

// 2. Login with email/password
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'developer@example.com',
    password: 'SecurePass123!',
  }),
});
const { access_token, refresh_token, user } = await loginResponse.json();
console.log('Login successful for:', user.email);

// 3. Use access token for API requests
const propertiesResponse = await fetch('http://localhost:3000/api/properties?limit=10', {
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
});
const properties = await propertiesResponse.json();

// 4. Refresh token when expired
const refreshResponse = await fetch('http://localhost:3000/api/auth/refresh-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken: refresh_token }),
});
const newTokens = await refreshResponse.json();
console.log('Token refreshed successfully');

// 5. Logout
const logoutResponse = await fetch('http://localhost:3000/api/auth/logout', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${newTokens.access_token}`,
  },
});
console.log('Logged out successfully');
```

### Advanced Property Search

Complex property filtering with multiple criteria:

```javascript
// Search for luxury properties with advanced filters
const searchParams = new URLSearchParams({
  // Pagination
  page: 1,
  limit: 20,

  // Text search
  search: 'luxury penthouse',

  // Property filters
  type: 'APARTMENT',
  status: 'AVAILABLE',

  // Price range
  minPrice: 1000000,
  maxPrice: 5000000,

  // Size filters
  minBedrooms: 3,
  maxBedrooms: 5,

  // Location
  city: 'Manhattan',
  country: 'USA',

  // Sorting
  sortBy: 'price',
  sortOrder: 'desc',
});

const response = await fetch(`http://localhost:3000/api/properties?${searchParams}`, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const { properties, total, page, totalPages } = await response.json();
console.log(`Found ${total} properties, showing page ${page} of ${totalPages}`);
properties.forEach(prop => {
  console.log(`${prop.title}: $${prop.price.toLocaleString()}`);
});
```

### Geospatial Property Discovery

Find properties near a specific location:

```javascript
// User coordinates: New York (40.7128, -74.0060)
const nearbyResponse = await fetch(
  'http://localhost:3000/api/properties/search/nearby?' +
    new URLSearchParams({
      latitude: 40.7128,
      longitude: -74.006,
      radiusKm: 5, // Search within 5km
      page: 1,
      limit: 10,
    }),
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  },
);

const nearbyProperties = await nearbyResponse.json();
console.log(`Found ${nearbyProperties.length} properties within 5km`);
```

### Web3 Wallet Authentication

Authenticate using blockchain wallet:

```javascript
import { ethers } from 'ethers';

// Get user's wallet with MetaMask
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = provider.getSigner();
const walletAddress = await signer.getAddress();

// Create message to sign
const message = `Sign this message to login to PropChain at ${new Date().toISOString()}`;
const signature = await signer.signMessage(message);

// Login with Web3
const web3LoginResponse = await fetch('http://localhost:3000/api/auth/web3-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: walletAddress,
    signature: signature,
  }),
});

const { access_token } = await web3LoginResponse.json();
console.log('Web3 login successful');

// If this is first time: account auto-created
// Use access_token for all subsequent API requests
```

### Session Management

Monitor and control user sessions:

```javascript
// Get all active sessions
const sessionsResponse = await fetch('http://localhost:3000/api/auth/sessions', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const sessions = await sessionsResponse.json();
console.log(`Current user has ${sessions.length} active sessions`);
sessions.forEach((session, index) => {
  console.log(`Session ${index + 1}:`);
  console.log(`  - IP: ${session.ip}`);
  console.log(`  - User Agent: ${session.userAgent}`);
  console.log(`  - Created: ${session.createdAt}`);
  console.log(`  - Expires in: ${session.expiresIn}ms`);
});

// Logout from specific device
const sessionIdToKill = sessions[0].id; // First session
const logoutDeviceResponse = await fetch(`http://localhost:3000/api/auth/sessions/${sessionIdToKill}`, {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
console.log('Device logged out successfully');

// Logout from all devices
const logoutAllResponse = await fetch('http://localhost:3000/api/auth/sessions', {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
console.log('All sessions terminated');
```

### Backend Infrastructure

- **🚀 Framework**: NestJS (Node.js/TypeScript) - Enterprise-grade application framework
- **🗄️ Database**: PostgreSQL v14+ with Prisma ORM - Type-safe database access
- **🔍 Caching**: Redis - High-performance caching and session storage
- **📊 Message Queue**: Bull Queue - Background job processing

### Blockchain & Web3

- **⛓️ Networks**: Ethereum, Polygon, BSC - Multi-chain compatibility
- **🔗 Web3 Library**: ethers.js - Modern Ethereum JavaScript library
- **📝 Smart Contracts**: Solidity (EVM) + Rust (Solana) - Cross-platform contracts
- **🔐 Wallet Integration**: MetaMask, WalletConnect - Multi-wallet support

### Development & Operations

- **🧪 Testing**: Jest + Supertest - Comprehensive testing suite
- **📝 API Docs**: Swagger/OpenAPI 3.0 - Interactive API documentation
- **🐳 Containerization**: Docker + Docker Compose - Consistent deployments
- **🔄 CI/CD**: GitHub Actions - Automated testing and deployment
- **📊 Monitoring**: Prometheus + Grafana - Performance metrics and alerts

### Security & Compliance

- **🔐 Authentication**: JWT + Web3 signatures - Secure user verification
- **🛡️ Security**: Helmet, CORS, Rate Limiting - Production-grade security
- **📋 Validation**: class-validator - Request data validation
- **🔍 Auditing**: Comprehensive audit logging for compliance

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

## 🤝 Support & Community

### Get Help

- **🐛 Report Issues**: [GitHub Issues](https://github.com/MettaChain/PropChain-BackEnd/issues)
- **📧 Email Support**: support@propchain.io
- **📖 Documentation**: [docs.propchain.io](https://docs.propchain.io)

### Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) to get started.

**Quick contribution steps:**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

**⭐ Star this repository if it helped you!**

Made with ❤️ by the PropChain Team

</div>
