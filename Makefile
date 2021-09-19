include .envrc

install: package-lock.json
	npm ci

dev: install
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) npm start
	
production:
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) wrangler publish
