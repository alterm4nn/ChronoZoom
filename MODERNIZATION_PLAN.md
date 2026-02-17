# ChronoZoom Modernization Plan

## 1. Code Review & Current State Analysis

Based on the exploration of the codebase, the current state of ChronoZoom is:

*   **Backend:**
    *   **Framework:** .NET Framework 4.5.
    *   **Architecture:** WCF Services (REST/JSON) via `IChronozoomSVC` and `System.ServiceModel.Web`.
    *   **Data Access:** Entity Framework 5 (EF5) using SQL Server / SQL Server Compact (`.sdf`).
    *   **Authentication:** Windows Identity Foundation (ACS/SAML) - heavily deprecated.
    *   **Configuration:** `Web.config` driven.

*   **Frontend:**
    *   **Framework:** jQuery 1.6.4, jQuery UI.
    *   **Language:** JavaScript (ES5).
    *   **Architecture:** Custom SPA (Single Page Application) logic heavily tied to the DOM.
    *   **Rendering:** HTML5 Canvas (Virtual Canvas logic in `virtual-canvas.js`).
    *   **Build:** None (manual references in `.html`/`.ashx` files).

*   **Infrastructure:**
    *   **Hosting:** Designed for IIS on Windows Server.
    *   **Database:** SQL Server Compact implies a file-based DB, which is not suitable for modern cloud-native deployments.

## 2. Modernization Suggestions

The goal is a "Big Bang" migration to a modern, cloud-native stack.

### 2.1 Backend: ASP.NET Core (.NET 10 / Latest)

We recommend a complete rewrite of the backend API layer while preserving the business logic and data models where possible.

*   **Framework:** .NET 10 (or latest stable, e.g., .NET 8/9).
*   **API Design:** Replace WCF Services with **ASP.NET Core Web API Controllers**.
    *   Migrate `IChronozoomSVC` methods to `[ApiController]`.
    *   Example: `[WebGet(UriTemplate = "/export/timeline/{id}")]` becomes `[HttpGet("export/timeline/{id}")]`.
*   **Data Access:** Migrate to **Entity Framework Core**.
    *   Port `Chronozoom.Entities` to .NET Standard / Core.
    *   Replace `ObjectContext` / `.edmx` (if present) or EF5 `DbContext` with EF Core `DbContext`.
    *   Use **SQL Server** (Azure SQL) or **PostgreSQL** for better container support.
*   **Authentication:** Replace ACS with **OpenID Connect / OAuth2** (e.g., Azure AD B2C, Auth0, or IdentityServer).
*   **Dependency Injection:** Use the built-in DI container in ASP.NET Core.

### 2.2 Frontend: React + TypeScript

The frontend requires a significant modernization to improve maintainability and performance.

*   **Framework:** **React** (v18+) for component-based UI.
*   **Language:** **TypeScript** for type safety, essential for complex logic like the Virtual Canvas.
*   **Build Tool:** **Vite** for fast development and optimized production builds.
*   **State Management:** **React Context** or **Zustand** / **Redux Toolkit** for managing global state (user session, current timeline, etc.).
*   **Canvas Logic:**
    *   The core "Deep Zoom" logic (`virtual-canvas.js`) should be refactored into a TypeScript class or a custom React Hook (`useVirtualCanvas`).
    *   Consider wrapping the canvas interaction in a React component (`<VirtualCanvas />`) that exposes props for data and events.
    *   UI Overlays (timelines, exhibits) can be rendered as HTML elements on top of the canvas or drawn directly on the canvas depending on performance needs.

### 2.3 Infrastructure & DevOps

*   **Containerization:** Fully dockerize the application.
    *   `Dockerfile.backend`: Multi-stage build for the .NET API.
    *   `Dockerfile.frontend`: Multi-stage build (Node build -> Nginx alpine image).
*   **Orchestration:** `docker-compose.yml` for local development (orchestrating API, Frontend, and SQL Server container).
*   **CI/CD:** GitHub Actions or Azure DevOps pipelines to build and push images to a container registry.

### 2.4 Hosting Alternatives (Non-Docker)

While Docker/Containerization provides excellent portability and consistency, there are other viable hosting strategies:

1.  **Azure App Service (PaaS):**
    *   **Pros:** Native support for .NET and Node.js (Frontend). Easiest to set up and scale. Built-in features like SSL, Auto-scaling, and Authentication. No need to manage container orchestration.
    *   **Cons:** Less portable than containers (vendor lock-in to Azure).
    *   **Verdict:** Strong contender if you are already in the Azure ecosystem and want minimal operational overhead.

2.  **IIS on Windows Server (VM/VPS):**
    *   **Pros:** Familiarity (matches current hosting model). Full control over the OS.
    *   **Cons:** "Pet vs. Cattle" problem (manual server maintenance). Harder to scale horizontally. Heavier resource usage.
    *   **Verdict:** Not recommended for a modernization project unless strict regulatory requirements demand specific OS configurations.

3.  **Serverless (Azure Functions / AWS Lambda):**
    *   **Pros:** Extreme scalability and cost-efficiency (pay-per-execution).
    *   **Cons:** Requires significant re-architecture of the backend (statelessness, cold starts). "Big Bang" migration to Serverless is very risky and complex for a legacy app.
    *   **Verdict:** Good for specific background tasks (e.g., search indexing), but likely too disruptive for the main API migration initially.

## 3. High-Level Execution Plan

### Phase 1: Setup & Initialization
1.  **Repo Structure:** Create a `src` directory with `backend` and `frontend` subdirectories.
2.  **Backend Init:** Initialize a new ASP.NET Core Web API solution (`dotnet new webapi`).
3.  **Frontend Init:** Initialize a new Vite + React + TypeScript project (`npm create vite@latest`).
4.  **Docker Setup:** Create initial `Dockerfile`s and `docker-compose.yml` to run the empty shells of both apps.

### Phase 2: Domain & Data Migration
1.  **Migrate Entities:** Copy `Chronozoom.Entities` classes to the new backend. Update namespaces and attributes (removing WCF specific attributes).
2.  **EF Core Setup:** Configure `ChronozoomContext` with EF Core. Set up connection strings and DI.
3.  **Database Migration:** Create initial EF Core migration to generate the schema. Verify against existing data.

### Phase 3: API Porting
1.  **Controller Migration:** Systematically port each ServiceContract from `IChronozoomSVC` to a Controller.
    *   *TimelinesController*, *ExhibitsController*, *ToursController*, *SearchController*.
2.  **Logic Porting:** Refactor business logic from the old `.svc.cs` files into Service classes (e.g., `TimelineService`, `SearchService`) and inject them into Controllers.
3.  **Testing:** Write Unit Tests (xUnit) and Integration Tests for the new API endpoints.

### Phase 4: Frontend Modernization
1.  **Canvas Wrapper:** Create the `<VirtualCanvas />` component. Port the critical coordinate system and zooming logic from `virtual-canvas.js` to TypeScript.
2.  **API Client:** Generate a typed API client (using Swagger/OpenAPI from the backend) to interact with the new .NET API.
3.  **UI Components:** Re-implement the "chrome" (menus, search bar, timeline navigation) using React components and a library like Tailwind CSS or Material UI.
4.  **Integration:** Connect the React frontend to the .NET backend.

### Phase 5: Polish & Deployment
1.  **Authentication:** Implement the OIDC auth flow.
2.  **Performance Tuning:** Optimize Canvas rendering and API response times (caching).
3.  **Final Docker Testing:** Ensure the entire stack spins up correctly with `docker-compose up`.

## 4. Proposed Architecture Diagram

```mermaid
graph TD
    Client[Browser (React SPA)]
    LB[Load Balancer / Nginx]
    API[ASP.NET Core Web API (.NET 10)]
    DB[(SQL Server / PostgreSQL)]

    Client -- HTTPS/JSON --> LB
    LB --> API
    API -- EF Core --> DB
```
