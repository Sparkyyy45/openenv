# Contributing to openenv

Thanks for your interest in contributing to openenv! This guide will help you get started.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Submitting a Kit](#submitting-a-kit)
- [CLI Development](#cli-development)
- [Pull Request Process](#pull-request-process)
- [Commit Convention](#commit-convention)

---

## Code of Conduct

Be kind, be respectful. We're all here to build great starter kits.

---

## Ways to Contribute

| Type | Description |
|------|-------------|
| 🧰 **Submit a kit** | Create a new starter kit following the [kit spec](docs/kit-spec.md) |
| 🐛 **Report bugs** | Open an issue with reproduction steps |
| 🔧 **Fix bugs** | Submit a PR with a fix |
| 📝 **Improve docs** | Fix typos, add examples, clarify instructions |
| 💡 **Suggest features** | Open an issue with the "enhancement" label |
| ⭐ **Star the repo** | Help us grow the community |

---

## Development Setup

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- Docker Desktop (for testing kits)

### Clone and install

```bash
git clone https://github.com/openenv/openenv.git
cd openenv
npm install
```

### Run the CLI locally

```bash
# From the repo root
npm run dev

# Or directly
node packages/cli/src/index.js list
node packages/cli/src/index.js doctor
```

### Project structure

```
openenv/
├── packages/
│   └── cli/              # The openenv CLI (npm package)
│       ├── src/
│       │   ├── index.js          # Entry point
│       │   ├── commands/         # list, init, doctor
│       │   └── utils/            # logger, registry
│       ├── registry.json         # Bundled fallback registry
│       └── package.json
├── kits/                  # Starter kit templates
│   ├── saas-nextjs-supabase-stripe/
│   └── api-fastapi-postgres-redis/
├── docs/                  # Documentation
│   └── kit-spec.md
├── registry.json          # Master kit registry
└── package.json           # Monorepo root
```

---

## Submitting a Kit

The best way to contribute is to submit a new starter kit!

### 1. Read the spec

Read the [kit specification](docs/kit-spec.md) to understand the required structure.

### 2. Create your kit

```bash
mkdir -p kits/your-kit-name/template
```

Every kit needs these files:
- `kit.json` — Metadata
- `.env.example` — Environment variables
- `docker-compose.yml` — Local services
- `setup.sh` — Setup script
- `README.md` — Documentation
- `template/` — The application

### 3. Test locally

```bash
# Verify your kit works end-to-end
cd kits/your-kit-name
chmod +x setup.sh
./setup.sh

# Run the openenv doctor against it
node packages/cli/src/index.js doctor
```

### 4. Add to registry

Add your kit to `registry.json` (root) and `packages/cli/registry.json`.

### 5. Submit a PR

Open a Pull Request with your kit. Use the [kit submission template](.github/ISSUE_TEMPLATE/submit-kit.md) for guidance.

---

## CLI Development

### Adding a new command

1. Create `packages/cli/src/commands/your-command.js`
2. Register it in `packages/cli/src/index.js`
3. Follow the patterns in existing commands (use `chalk`, `ora`, `inquirer`)
4. Test with `node packages/cli/src/index.js your-command`

### Code style

- ES Modules (`import`/`export`)
- Use `chalk` for colored output
- Use `ora` for spinners
- Use `inquirer` for interactive prompts
- Use `boxen` for formatted output boxes

---

## Pull Request Process

1. **Fork** the repository
2. **Create a branch** from `main` (`git checkout -b feat/your-feature`)
3. **Make your changes** and test locally
4. **Commit** following the [commit convention](#commit-convention)
5. **Push** to your fork
6. **Open a PR** against `main`

### PR checklist

- [ ] Code follows existing patterns and style
- [ ] All existing tests still pass
- [ ] New kits follow the [kit spec](docs/kit-spec.md)
- [ ] Registry entries are in both `registry.json` files
- [ ] Documentation is updated if needed

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

### Types

| Type       | Description                         |
| ---------- | ----------------------------------- |
| `feat`     | New feature or kit                  |
| `fix`      | Bug fix                             |
| `docs`     | Documentation only                  |
| `chore`    | Maintenance, dependencies, CI       |
| `refactor` | Code change that doesn't fix/add    |
| `test`     | Adding or fixing tests              |

### Scopes

- `cli` — CLI package changes
- `kit/<name>` — Kit-specific changes
- `docs` — Documentation changes
- `ci` — CI/CD changes

### Examples

```
feat(kit/blog-astro-mdx): add new blog starter kit
fix(cli): handle offline registry fallback
docs: update contributing guide
chore(ci): add Node 22 to test matrix
```

---

## Questions?

Open a [Discussion](https://github.com/openenv/openenv/discussions) or reach out on [Twitter/X](https://x.com/openenv).

Thanks for contributing! 🙏
