# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy only the project file to restore dependencies (for caching)
COPY ["backend/AiDev.Backend/AiDev.Backend.csproj", "backend/AiDev.Backend/"]
RUN dotnet restore "backend/AiDev.Backend/AiDev.Backend.csproj"

# Copy the rest of the code
COPY . .
WORKDIR "/src/backend/AiDev.Backend"

# Build and Publish
RUN dotnet build "AiDev.Backend.csproj" -c Release -o /app/build
RUN dotnet publish "AiDev.Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "AiDev.Backend.dll"]
