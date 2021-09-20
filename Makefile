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
	wrangler preview --watch

logs_production:
	wrangler tail

logs_staging:
	wrangler tail --env staging

clean:
	rm -rf dist/ worker/

LATEST_SHA := $(firstword $(shell git ls-remote https://github.com/RoyalIcing/regenerated.dev --symref HEAD))
tmp/$(LATEST_SHA):
	@mkdir -p tmp
	@touch tmp/$(LATEST_SHA)
	@echo "Latest sha: $(LATEST_SHA)"

shaState.js: tmp/$(LATEST_SHA)
	@echo "export const sha = '$(LATEST_SHA)'" > shaState.js
