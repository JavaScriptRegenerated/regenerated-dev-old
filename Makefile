include .envrc

dev:
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) npm start
	
deploy:
	CF_ACCOUNT_ID=$(CF_ACCOUNT_ID) wrangler publish
