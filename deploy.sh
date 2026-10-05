#!/usr/bin/env bash
#
# Deploy / update the Networker team site on the Hetzner box (same box as
# the CRM, separate compose project).
#
#   bash deploy.sh              # pull, build, restart
#   SKIP_PULL=1 bash deploy.sh  # deploy what is already checked out
#
set -euo pipefail

DEPLOY_DIR="${DEPLOY_DIR:-/opt/networker-team-website}"
cd "$DEPLOY_DIR"

if [ ! -f .env ]; then
	echo "No .env at ${DEPLOY_DIR}/.env -- copy .env.example and fill it in."
	exit 1
fi

echo "=== Deploying networker-team-website ==="

if [ "${SKIP_PULL:-0}" != "1" ]; then
	echo "--- Pulling ---"
	git pull origin "$(git branch --show-current)"
fi

echo "--- Building ---"
docker compose --env-file .env build

echo "--- Starting ---"
docker compose --env-file .env up -d --remove-orphans

# Checked from inside the container so nothing else on the host can answer,
# and the body must be our page, not just any 200.
echo "--- Waiting for web to respond ---"
healthy=0
for _ in $(seq 1 20); do
	if docker compose --env-file .env exec -T web wget -qO- http://localhost:3000/ 2>/dev/null | grep -q NETWORKER; then
		healthy=1
		break
	fi
	sleep 3
done

docker compose --env-file .env ps

if [ "$healthy" != "1" ]; then
	echo "web: NOT responding -- check: docker compose --env-file .env logs web"
	exit 1
fi

cat <<-EOF

	=== Deploy complete ===
	Logs:    docker compose --env-file .env logs -f web
	Status:  docker compose --env-file .env ps
EOF
