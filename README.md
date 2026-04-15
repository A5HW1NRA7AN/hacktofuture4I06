# VoxBridge — Voice-Native AI Support Layer

> Real-time voice calls with AI agents that retrieve domain-specific documentation, execute live API calls via MCP tool calling, and respond with synthesized speech — all within a sub-800ms latency target.

---

## Team Ownership

| Developer | Directory | Responsibility |
|-----------|-----------|----------------|
| Person A  | `services/agent/` | FSM, LLM, RAG, TTS, MCP tool calling |
| Person B  | `services/webhook/` | Twilio integration, audio forwarding |
| Person C  | `services/knowledge/` | Qdrant, Elasticsearch, document ingestion |
| Person D  | `scripts/`, `infra/`, `tests/` | DevOps, Docker, CI/CD, integration tests |

---

## Architecture

```
Caller ──► Twilio ──► Node 2 (Webhook + WSS Proxy + Cloudflare)
                            │
                            ▼
                      Node 1 (LiveKit Agent + Ollama LLM + Deepgram STT + ElevenLabs TTS)
                            │
                            ▼
                      Node 3 (Elasticsearch 9.x + Qdrant 1.17.0)
```

### Node Structure

```
services/agent/         # Node 1 — Core AI processing
services/webhook/       # Node 2 — Telephony bridge (Windows 11 + WSL2)
services/knowledge/     # Node 3 — Retrieval & storage
infra/                  # Docker compose, Cloudflare config
scripts/                # Setup & verification scripts
docs/                   # Architecture documentation
tests/                  # Cross-service integration tests
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Telephony | Twilio Programmable Voice + Media Streams |
| Orchestration | LiveKit Agents SDK v0.13.x (Python) |
| Turn Detection | LiveKit Semantic Turn Detection |
| STT | Deepgram Nova-3 Streaming API |
| LLM | Llama 3.1 8B via Ollama v0.13+ (local) |
| TTS Primary | ElevenLabs Streaming API |
| TTS Fallback | Kokoro TTS (local GPU) |
| Vector DB | Qdrant 1.17.0 (self-hosted Docker) |
| Lexical Search | Elasticsearch 9.x (self-hosted Docker) |
| Tool Calling | Model Context Protocol (MCP) |
| Messaging | Apache Kafka 3.x (Docker) |
| Language | Python 3.11 |

---

## Project Setup

### Prerequisites

- **Node 1:** Ubuntu 22.04, 8-core CPU, 32 GB RAM, RTX 4090 (24 GB VRAM)
- **Node 2:** Windows 11 + WSL2, 4-core CPU, 8 GB RAM
- **Node 3:** Ubuntu 22.04, 8-core CPU, 16 GB RAM
- Docker 24.x installed on all nodes
- Python 3.11 on all nodes

### Step 1: Environment Variables

```bash
cp .env.example .env
# Fill in all API keys in .env
```

### Step 2: Start Node 3 (Knowledge Base) — First

```bash
cd infra
docker compose -f docker-compose.node3.yml up -d

# Setup Qdrant multi-tenant collection
cd ../services/knowledge
pip install -r requirements.txt
python setup_qdrant.py

# Ingest documents
python ingest_documents.py --tenant-id <TENANT> --docs-path <PATH_TO_DOCS>
```

### Step 3: Start Node 2 (Telephony Bridge) — Second

```bash
# Start Kafka
cd infra
docker compose -f docker-compose.kafka.yml up -d

# Start Cloudflare tunnel
cloudflared tunnel run voxbridge-tunnel

# Start webhook server
cd ../services/webhook
pip install -r requirements.txt
uvicorn webhook_server:app --port 8000 --host 0.0.0.0
```

Configure Twilio phone number webhook to: `https://<your-tunnel-subdomain>.trycloudflare.com/twilio/incoming`

### Step 4: Start Node 1 (Agent & LLM) — Last

```bash
# Setup Ollama
bash scripts/setup_ollama.sh

# Start agent
cd services/agent
pip install -r requirements.txt
source ../../.env
python agent_main.py dev
```

### Verify All Services

```bash
bash scripts/verify_env.sh
```

---

## Key Performance Targets

| Metric | Target |
|--------|--------|
| End-to-End Latency (P95) | < 800ms |
| LLM TTFT (P95) | < 600ms |
| Deepgram STT | < 300ms |
| Qdrant Retrieval | ~2ms |
| Word Error Rate | < 5% |
| RAG Groundedness | > 0.90 |
| First Call Resolution | > 85% |

---

## Testing

```bash
# FSM unit tests
cd services/agent
pytest test_fsm.py -v

# Webhook tests
cd services/webhook
pytest tests/ -v

# Integration tests
cd tests/
pytest test_integration.py -v

# Latency benchmarks
cd services/agent
python benchmark.py
```
