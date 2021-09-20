include .envrc

install: package-lock.json
	npm ci

dev: install
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) npm start
	
production: shaState.js
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) wrangler publish

staging: clean shaState.js
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) wrangler publish --env staging

preview: clean shaState.js
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) wrangler preview --watch

logs_production:
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) wrangler tail

logs_staging:
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) wrangler tail --env staging

clean:
	rm -rf dist/ worker/

LATEST_SHA := $(firstword $(shell git ls-remote https://github.com/RoyalIcing/regenerated.dev --symref HEAD))
tmp/$(LATEST_SHA):
	@mkdir -p tmp
	@touch tmp/$(LATEST_SHA)
	@echo "Latest sha: $(LATEST_SHA)"

shaState.js: tmp/$(LATEST_SHA)
	@echo "export const sha = '$(LATEST_SHA)'" > shaState.js
