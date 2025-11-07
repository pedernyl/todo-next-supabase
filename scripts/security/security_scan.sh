#!/usr/bin/env bash
# OWASP ZAP Security Scan for a local Next.js/Supabase app
# Usage: ./security-scan.sh [URL]
# Example: ./security-scan.sh http://localhost:3000

set -e

TARGET_URL=${1:-http://localhost:3000}
REPORT_NAME="zap-report.html"
ZAP_IMAGE="zaproxy/zap-stable:latest"

echo "🚀 Starting security scan against: $TARGET_URL"
echo "📦 Checking if OWASP ZAP Docker image is available..."

# Pull image if not found locally
if ! docker image inspect $ZAP_IMAGE > /dev/null 2>&1; then
  echo "⬇️ Pulling OWASP ZAP Docker image..."
  docker pull $ZAP_IMAGE
fi

echo "⚙️ Running OWASP ZAP baseline scan..."
docker run --rm \
  -v "$(pwd):/zap/wrk/:rw" \
  --network="host" \
  -t $ZAP_IMAGE zap-baseline.py \
  -t "$TARGET_URL" \
  -r "$REPORT_NAME" \
  -m 5 \
  -J zap-results.json \
  -I

echo ""
echo "✅ Scan completed successfully!"
echo "📄 HTML report saved at: $(pwd)/$REPORT_NAME"
echo "📊 JSON results saved at: $(pwd)/zap-results.json"
echo ""
echo "👉 Open the HTML report in your browser to review warnings and recommendations."
