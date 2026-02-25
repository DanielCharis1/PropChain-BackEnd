# Observability & Monitoring System

This module introduces advanced monitoring and observability for the PropChain-BackEnd, supporting production-grade operations and troubleshooting.

## Features
- **Distributed Tracing:** OpenTelemetry-based tracing with correlation ID propagation.
- **Metrics Collection:** Prometheus metrics for HTTP requests (latency, count, status).
- **Centralized Logging:** Winston-based structured logging, ready for aggregation.
- **Performance Monitoring:** Request duration histograms and counters.
- **Health Checks:** Existing endpoints for liveness, readiness, and dependency checks.
- **Extensible:** Ready for integration with Sentry (error tracking), Grafana/Kibana (dashboards), and anomaly detection tools.

## Usage
- All HTTP requests are traced and measured automatically.
- Metrics are exposed at `/metrics` (Prometheus scrape endpoint).
- Logs are structured and can be forwarded to ELK, Azure Monitor, or similar.
- Health endpoints remain at `/health`, `/health/detailed`, `/health/liveness`, `/health/readiness`.

## Next Steps
- Configure Winston transports for log aggregation.
- Integrate Sentry or similar for error tracking.
- Add Grafana/Kibana dashboard templates.
- Integrate anomaly detection and predictive monitoring as needed.

---

For questions or further enhancements, see the ObservabilityModule and related files in `src/observability/`.
