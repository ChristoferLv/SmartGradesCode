# Use OpenJDK 21 base image (non-Alpine)
FROM openjdk:21

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file into the container
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar
COPY ./src/main/resources/keystore.p12 /app/keystore.p12



# Expose the HTTPS port
EXPOSE 8443

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
