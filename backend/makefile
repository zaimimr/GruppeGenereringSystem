fresh:
	./gradlew build

run:
	./gradlew run

format:
	./gradlew ktlinFormat
	
docker:
	make fresh
	docker build -t gen-g .
	docker run -m512M --cpus 2 -it -p 8000:8000 --rm gen-g 

deploy:
	make fresh
	heroku login -i
	heroku container:push web -a gen-g
	heroku container:release web -a gen-g