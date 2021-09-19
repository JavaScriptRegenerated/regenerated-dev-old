include .envrc

install: package-lock.json
	npm ci

dev: install
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) npm start
	
production:
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) wrangler publish

staging: clean
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) wrangler publish --env staging

preview: clean
	wrangler preview --watch

logs_production:
	wrangler tail

logs_staging:
	wrangler tail --env staging

clean:
	rm -rf dist/ worker/
