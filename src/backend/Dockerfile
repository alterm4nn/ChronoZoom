FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["ChronoZoom.Backend/ChronoZoom.Backend.csproj", "ChronoZoom.Backend/"]
RUN dotnet restore "ChronoZoom.Backend/ChronoZoom.Backend.csproj"
COPY . .
WORKDIR "/src/ChronoZoom.Backend"
RUN dotnet build "ChronoZoom.Backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ChronoZoom.Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ChronoZoom.Backend.dll"]
