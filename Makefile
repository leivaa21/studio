.PHONY: build start stop

build:
	docker compose -f docker-compose.yml build

start:
	docker compose -f docker-compose.yml up

stop:
	docker compose down
