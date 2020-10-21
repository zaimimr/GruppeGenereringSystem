format:
	./gradlew ktlinFormat
	
fresh:
	make format
	./gradlew build

clean:
	./gradlew clean build

run:
	./gradlew run

auto:
	./gradlew -t installDist

test:
	./gradlew test

docker:
	make fresh
	docker build -t gen-g .
	docker run -m512M --cpus 2 -it -p 8000:8000 --rm gen-g 

deploy:
	make clean
	heroku login -i
	heroku container:push web -a gen-g
	heroku container:release web -a gen-g