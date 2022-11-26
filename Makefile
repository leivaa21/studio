.PHONY: make-deps prod dev stop build-db build-prod build-dev build

build-db:
	docker compose -f docker-compose.db.yml build
build-prod:
	docker compose -f docker-compose.yml build
build-dev:
	docker compose -f docker-compose.dev.yml build

build:
	docker compose -f docker-compose.db.yml build
	docker compose -f docker-compose.dev.yml build
	docker compose -f docker-compose.yml build

dev:
	docker compose -f docker-compose.db.yml up -d
	docker compose -f docker-compose.dev.yml up

prod:
	docker compose -f docker-compose.db.yml up -d
	docker compose up

stop:
	docker compose down
