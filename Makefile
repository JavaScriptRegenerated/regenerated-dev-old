include .envrc

dev:
	npm ci
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) npm start
	
deploy:
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) wrangler publish
