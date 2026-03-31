# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["AiDev.Backend.csproj", "."]
RUN dotnet restore "./AiDev.Backend.csproj"

# Copy everything else and build app
COPY . .
WORKDIR "/src/."
RUN dotnet build "AiDev.Backend.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "AiDev.Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .
# Default Render port is 8080 or it can be configured, but .NET 8+ defaults to 8080 or 5000 depending on env
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "AiDev.Backend.dll"]
