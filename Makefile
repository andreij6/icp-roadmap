.PHONY: dev build deploy-local deploy-mainnet test

dev:
	dfx start --background

build:
	dfx build
	cd src/frontend && npm run build

deploy-local:
	dfx deploy

deploy-mainnet:
	dfx deploy --network ic

test:
	cargo test --all
