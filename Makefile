.PHONY: install
INSTALL_DIRS := vlayer vlayer-react
install:
	@for dir in $(INSTALL_DIRS); do \
		echo "Installing dependencies in $$dir..."; \
		cd $$dir && bun install && cd - > /dev/null; \
	done

.PHONY: deploy-testnet
deploy-testnet:
	cd vlayer && bun run deploy:testnet
