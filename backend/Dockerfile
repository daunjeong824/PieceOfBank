FROM amazoncorretto:17
WORKDIR /app
COPY build/libs/pob-0.0.1-SNAPSHOT.jar app.jar
RUN mkdir resources
ENTRYPOINT ["java","-jar","app.jar"]