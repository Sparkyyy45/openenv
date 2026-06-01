import json
import os
from datetime import datetime

# Fix api-fastapi-postgres-redis
path_api = "kits/api-fastapi-postgres-redis/kit.json"
with open(path_api, "r") as f:
    kit_api = json.load(f)

kit_api["tags"] = ["fastapi", "python", "postgres", "redis", "api"]
kit_api["repo"] = "https://github.com/Sparkyyy45/openenv"
kit_api["template_path"] = "kits/api-fastapi-postgres-redis/template"
kit_api["verified"] = True
kit_api["last_verified"] = "2026-06-01T00:00:00Z"
kit_api["tech"] = {
    "framework": "FastAPI",
    "database": "PostgreSQL",
    "cache": "Redis"
}

with open(path_api, "w") as f:
    json.dump(kit_api, f, indent=2)

# Fix saas-nextjs-supabase-stripe
path_saas = "kits/saas-nextjs-supabase-stripe/kit.json"
with open(path_saas, "r") as f:
    kit_saas = json.load(f)

kit_saas["tags"] = ["nextjs", "saas", "supabase", "stripe", "react", "tailwind"]
kit_saas["repo"] = "https://github.com/Sparkyyy45/openenv"
kit_saas["template_path"] = "kits/saas-nextjs-supabase-stripe/template"
kit_saas["verified"] = True
kit_saas["last_verified"] = "2026-06-01T00:00:00Z"
kit_saas["tech"] = {
    "framework": "Next.js 14",
    "auth": "Supabase",
    "payments": "Stripe"
}

with open(path_saas, "w") as f:
    json.dump(kit_saas, f, indent=2)


# Rebuild registry.json
root_registry_path = "registry.json"
cli_registry_path = "packages/cli/registry.json"

kits = []
kits_dir = "kits"

for item in os.listdir(kits_dir):
    kit_path = os.path.join(kits_dir, item, "kit.json")
    if os.path.exists(kit_path):
        with open(kit_path, "r") as f:
            kits.append(json.load(f))

with open(root_registry_path, "w") as f:
    json.dump(kits, f, indent=2)

with open(cli_registry_path, "w") as f:
    json.dump(kits, f, indent=2)

print("Kits fixed and registries updated.")
