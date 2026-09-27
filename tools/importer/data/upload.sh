#!/bin/bash
# Uploads the generated sheets to Document Authoring (/de/data/<name>.json) and previews them.
# Usage: tools/importer/data/upload.sh [compare-models mybmw-flyout dealer-services]
# Auth: the DA/admin token is injected by the environment (else add -H "Authorization: Bearer $TOKEN").
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd)
ORG=moved-permanently
SITE=bmw
NAMES=("$@")
[ ${#NAMES[@]} -eq 0 ] && NAMES=(compare-models mybmw-flyout dealer-services)
for name in "${NAMES[@]}"; do
  file="$HERE/$name.json"
  echo "== $name"
  curl -sS -o /dev/null -w "DA source: %{http_code}\n" -X POST \
    -F "data=@$file;type=application/json" \
    "https://admin.da.live/source/$ORG/$SITE/de/data/$name.json"
  curl -sS -o /dev/null -w "preview:   %{http_code}\n" -X POST \
    "https://admin.hlx.page/preview/$ORG/$SITE/main/de/data/$name.json"
  curl -sS -o /dev/null -w "aem.page:  %{http_code}\n" \
    "https://main--$SITE--$ORG.aem.page/de/data/$name.json"
done
