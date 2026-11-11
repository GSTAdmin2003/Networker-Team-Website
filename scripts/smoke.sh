#!/usr/bin/env bash
#
# Smoke-test a running instance of the site.
#
#   bash scripts/smoke.sh http://127.0.0.1:3000 [expected-origin]
#
# expected-origin is what canonical URLs should start with (defaults to
# http://localhost:3000, the build-time fallback).
set -uo pipefail

BASE="${1:?usage: smoke.sh <base-url> [expected-origin]}"
ORIGIN="${2:-http://localhost:3000}"
fail=0

check() {
	local desc="$1" ok="$2"
	if [ "$ok" = "1" ]; then echo "ok   $desc"; else echo "FAIL $desc"; fail=1; fi
}

status() { curl -s -o /dev/null -w '%{http_code}' "$BASE$1"; }
location() { curl -s -o /dev/null -w '%{redirect_url}' "$BASE$1"; }

# path|lang|canonical  ("|" because the canonical URL itself contains ":")
for spec in "/|ka|$ORIGIN" "/en|en|$ORIGIN/en" "/ru|ru|$ORIGIN/ru" \
	"/privacy|ka|$ORIGIN/privacy" "/en/privacy|en|$ORIGIN/en/privacy" "/ru/privacy|ru|$ORIGIN/ru/privacy" \
	"/terms|ka|$ORIGIN/terms" "/en/terms|en|$ORIGIN/en/terms" "/ru/terms|ru|$ORIGIN/ru/terms"; do
	IFS="|" read -r path lang canonical <<<"$spec"
	body="$(curl -s "$BASE$path")"
	check "$path -> 200" "$([ "$(status "$path")" = 200 ] && echo 1)"
	check "$path html lang=$lang" "$(grep -q "<html lang=\"$lang\"" <<<"$body" && echo 1)"
	check "$path canonical $canonical" "$(grep -q "rel=\"canonical\" href=\"$canonical\"" <<<"$body" && echo 1)"
	check "$path has brand" "$(grep -q NETWORKER <<<"$body" && echo 1)"
done

check "/ka -> 308 /" "$([ "$(status /ka)" = 308 ] && [[ "$(location /ka)" == */ ]] && echo 1)"
check "/ka/privacy -> 308 /privacy" "$([ "$(status /ka/privacy)" = 308 ] && [[ "$(location /ka/privacy)" == */privacy ]] && echo 1)"
check "/en/privacy has company ID" "$(curl -s "$BASE/en/privacy" | grep -q 405813767 && echo 1)"
check "/index.html -> 308 /" "$([ "$(status /index.html)" = 308 ] && echo 1)"
check "/index_en.html -> 308 /en" "$([ "$(status /index_en.html)" = 308 ] && [[ "$(location /index_en.html)" == */en ]] && echo 1)"
check "/index_ru.html -> 308 /ru" "$([ "$(status /index_ru.html)" = 308 ] && [[ "$(location /index_ru.html)" == */ru ]] && echo 1)"
check "/xx -> 404" "$([ "$(status /xx)" = 404 ] && echo 1)"
check "/en/xx -> 404" "$([ "$(status /en/xx)" = 404 ] && echo 1)"
check "/images/logo-main.svg -> 200" "$([ "$(status /images/logo-main.svg)" = 200 ] && echo 1)"

css="$(curl -s "$BASE/en" | grep -oE '/_next/static/[^"]+\.css' | head -1)"
check "stylesheet $css -> 200" "$([ -n "$css" ] && [ "$(status "$css")" = 200 ] && echo 1)"

if [ "$fail" = 0 ]; then echo "SMOKE PASSED"; else echo "SMOKE FAILED"; fi
exit "$fail"
