include .envrc

install: package-lock.json
	npm ci

latest:
	git pull -r
	git push
	$(MAKE) sha.dev.js sha.js

dev: install
	@CLOUDFLARE_ACCOUNT_ID=$(CLOUDFLARE_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) npm start
	
production: sha.js
	@CLOUDFLARE_ACCOUNT_ID=$(CLOUDFLARE_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) npx wrangler publish

staging: clean sha.js
	@CLOUDFLARE_ACCOUNT_ID=$(CLOUDFLARE_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) npx wrangler publish --env staging

preview: clean sha.js
	@CLOUDFLARE_ACCOUNT_ID=$(CLOUDFLARE_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) npx wrangler preview --watch

logs_production:
	@CLOUDFLARE_ACCOUNT_ID=$(CLOUDFLARE_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) npx wrangler tail

logs_staging:
	@CLOUDFLARE_ACCOUNT_ID=$(CLOUDFLARE_ACCOUNT_ID) CF_ZONE_ID=$(CF_ZONE_ID) npx wrangler tail --env staging

clean:
	@rm -rf dist/ worker/

s3_ls:
	@AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) aws s3 ls

s3_ls_collected:
	@AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) aws s3 ls collected-workspaces/sha256/

s3_ls_markdown:
	@AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) aws s3 ls collected-workspaces/sha256/text/markdown/

s3_ls_javascript:
	@AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) aws s3 ls collected-workspaces/sha256/application/javascript/

define sha256_file
	$(shell shasum -a 256 $(1) | cut -f1 -d " ")
endef

AWS_ENV := AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY)
FILES := pages/machines.client.js pages/machines.md pages/parsing.md
FILE := pages/machines.client.js
DIGEST_HEX := $(call sha256_file,$(FILE))
MIME_TYPE := application/javascript

s3_plan_put:
	@echo $(foreach file,$(FILES),"$(file) => $(strip $(call sha256_file,$(file)))\n")
	# @echo "$(FILE) => $(MIME_TYPE)/$(call sha256_file,$(FILE))"

s3_put: s3_plan_put
	@$(AWS_ENV) aws s3 cp pages/machines.client.js s3://collected-workspaces/sha256/application/javascript/$(strip $(call sha256_file,pages/machines.client.js)) --acl public-read
	@$(AWS_ENV) aws s3 cp pages/machines.md s3://collected-workspaces/sha256/text/markdown/$(strip $(call sha256_file,pages/machines.md)) --acl public-read

tmp/$(DIGEST_HEX): $(FILE)
	@AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) aws s3 cp $(FILE) s3://collected-workspaces/sha256/$(MIME_TYPE)/$(DIGEST_HEX) --acl public-read
	@touch tmp/$(DIGEST_HEX)

.PHONY: sha.dev.js
sha.dev.js: s3_put
	@echo "export const devSHAs = { 'pages/machines.client.js': '$(strip $(call sha256_file,pages/machines.client.js))', 'pages/machines.md': '$(strip $(call sha256_file,pages/machines.md))' }" > sha.dev.js

REGENERATED_DEV_SHA := $(firstword $(shell git ls-remote https://github.com/JavaScriptRegenerated/regenerated.dev --symref HEAD))
YIELDMACHINE_SHA := $(firstword $(shell git ls-remote https://github.com/JavaScriptRegenerated/yieldmachine --symref HEAD))
tmp/sha/$(REGENERATED_DEV_SHA) tmp/sha/$(YIELDMACHINE_SHA):
	@mkdir -p tmp/sha
	@touch $@
	@echo "Latest SHA: $(notdir $@)"

sha.js: tmp/sha/$(REGENERATED_DEV_SHA) tmp/sha/$(YIELDMACHINE_SHA)
	@echo "export const sha = '$(REGENERATED_DEV_SHA)'; export const yieldmachineSha = '$(YIELDMACHINE_SHA)';" > sha.js

tmp/pages-txt/parsing.txt:
	@mkdir -p tmp/pages-txt
	@cp pages/parsing.md tmp/pages-txt/parsing.txt
