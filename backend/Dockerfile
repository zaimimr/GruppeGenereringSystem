FROM openjdk:14-ea-8-jdk-alpine3.10

ENV APPLICATION_USER ktor
RUN mkdir /backend
WORKDIR /backend
COPY . /backend/
RUN ./gradlew clean build