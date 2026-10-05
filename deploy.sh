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

echo "=== Deploying networker-team-website ==="

if [ "${SKIP_PULL:-0}" != "1" ]; then
	echo "--- Pulling ---"
	git pull origin "$(git branch --show-current)"
fi

echo "--- Building ---"
docker compose build

echo "--- Starting ---"
docker compose up -d --remove-orphans

echo "--- Waiting for web to respond ---"
for _ in $(seq 1 10); do
	if docker compose exec -T web wget -qO- http://localhost/ > /dev/null 2>&1; then
		echo "web: responding"
		break
	fi
	sleep 2
done

docker compose ps
