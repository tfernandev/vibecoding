using AiDev.Backend.Data;
using AiDev.Backend.Middleware;
using AiDev.Backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Infrastructure Services
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Tenant Context
builder.Services.AddScoped<TenantContext>();
builder.Services.AddMemoryCache();

// 3. AI Service (Gemini Integration)
builder.Services.AddHttpClient<IGeminiService, GeminiService>();
builder.Services.AddScoped<IGeminiService, GeminiService>();

// 4. CORS to allow Frontend calls
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.SetIsOriginAllowed(origin => 
        {
            var uri = new Uri(origin);
            return uri.Host == "localhost" || 
                   uri.Host.EndsWith(".vercel.app") || 
                   uri.Host.EndsWith(".onrender.com");
        })
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

// 5. Configure Pipeline
app.UseHttpsRedirection();

// Early in the pipeline: Multi-Tenancy resolution
app.UseMiddleware<TenantResolverMiddleware>();

// Enable CORS before other middleware
app.UseCors("Frontend");

// Automate Database Migrations (Senior Architectural Move)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try {
        db.Database.Migrate();
        Console.WriteLine("✅ Supabase/PostgreSQL Migrations applied successfully.");
    } catch (Exception ex) {
        Console.WriteLine($"⚠️ Migration failed (check connection string): {ex.Message}");
    }
}

app.UseAuthorization();

app.MapControllers();

app.Run();
