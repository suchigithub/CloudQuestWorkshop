/* ==========================================================
 * Cloud Quest – Microsoft Azure Workshop
 * .NET 8 Minimal API Backend
 * 
 * This serves two purposes:
 *   1. API endpoints (e.g., registration)
 *   2. Hosts the React SPA in production (from wwwroot/)
 * ========================================================== */

using System.Collections.Concurrent;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- Service Configuration ---

// Application Insights telemetry (auto-detects connection string from Azure)
builder.Services.AddApplicationInsightsTelemetry();

// Entity Framework Core with SQL Server
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=(localdb)\\mssqllocaldb;Database=CloudQuestDB;Trusted_Connection=True;";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDev", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// --- Middleware Pipeline ---
app.UseCors("AllowReactDev");

// Serve the React SPA from wwwroot in production
app.UseDefaultFiles();
app.UseStaticFiles();

// --- Ensure database is created ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// --- In-Memory Stores (for metrics only) ---
var requestMetrics = new RequestMetrics();

// --- Request Logging Middleware ---
app.Use(async (context, next) =>
{
    var sw = Stopwatch.StartNew();
    requestMetrics.TotalRequests++;

    try
    {
        await next();
        sw.Stop();

        var statusCode = context.Response.StatusCode;
        requestMetrics.TrackRequest(context.Request.Path, statusCode, sw.ElapsedMilliseconds);

        if (statusCode >= 400 && statusCode < 500) requestMetrics.ClientErrors++;
        if (statusCode >= 500) requestMetrics.ServerErrors++;
    }
    catch (Exception)
    {
        sw.Stop();
        requestMetrics.ServerErrors++;
        requestMetrics.TotalRequests++;
        throw;
    }
});

// --- API Endpoints ---

// Health check endpoint for Azure monitoring
app.MapGet("/api/health", () => Results.Ok(new
{
    status = "healthy",
    service = "CloudQuest Workshop API",
    timestamp = DateTime.UtcNow,
    uptime = (DateTime.UtcNow - requestMetrics.StartTime).ToString(@"d\.hh\:mm\:ss"),
    environment = builder.Environment.EnvironmentName
}));

// Workshop details endpoint
app.MapGet("/api/workshop", () => Results.Ok(new
{
    title = "Cloud Quest – Microsoft Azure Workshop",
    organizer = "Alliance University School of Advanced Computing",
    association = "Microsoft Azure Developer Community",
    date = "March 14, 2026",
    time = "10:00 AM – 01:00 PM",
    venue = "LT-517, LC-2",
    speaker = new
    {
        name = "Ms. Suchitra Nayak",
        role = "Technical Project Manager – Microsoft Engagement",
        company = "Tech Mahindra"
    },
    agenda = new[]
    {
        new { time = "10:00 – 11:00 AM", topic = "Introduction to Cloud Native Architecture & Azure Fundamentals" },
        new { time = "11:00 – 12:00 PM", topic = "Fundamentals of UI Design, Security & App Deployment Basics" },
        new { time = "12:00 – 01:00 PM", topic = "UI Development, App Deployment & End-to-End Monitoring" }
    }
}));

// Registration endpoint – stores user in SQL database
app.MapPost("/api/register", async (RegistrationRequest request, AppDbContext db) =>
{
    // Validate required fields
    if (string.IsNullOrWhiteSpace(request.Name) ||
        string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.Password) ||
        string.IsNullOrWhiteSpace(request.Institution))
    {
        return Results.BadRequest(new { error = "All fields including password are required." });
    }

    if (!new EmailAddressAttribute().IsValid(request.Email))
    {
        return Results.BadRequest(new { error = "Invalid email format." });
    }

    // Strong password validation
    if (request.Password.Length < 8)
        return Results.BadRequest(new { error = "Password must be at least 8 characters." });
    if (!Regex.IsMatch(request.Password, @"[A-Z]"))
        return Results.BadRequest(new { error = "Password must contain at least one uppercase letter." });
    if (!Regex.IsMatch(request.Password, @"[a-z]"))
        return Results.BadRequest(new { error = "Password must contain at least one lowercase letter." });
    if (!Regex.IsMatch(request.Password, @"[0-9]"))
        return Results.BadRequest(new { error = "Password must contain at least one number." });
    if (!Regex.IsMatch(request.Password, @"[^a-zA-Z0-9]"))
        return Results.BadRequest(new { error = "Password must contain at least one special character." });

    // Check for duplicate email
    if (await db.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower()))
    {
        return Results.BadRequest(new { error = "This email is already registered." });
    }

    // Hash the password before storing
    var passwordHash = Convert.ToBase64String(
        SHA256.HashData(Encoding.UTF8.GetBytes(request.Password)));

    var user = new UserEntity
    {
        Name = request.Name,
        Email = request.Email.ToLower(),
        Institution = request.Institution,
        PasswordHash = passwordHash,
        RegisteredAt = DateTime.UtcNow
    };

    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        message = "Registration successful! You can now log in.",
        registrant = new
        {
            user.Name,
            user.Email,
            user.Institution,
            registeredAt = user.RegisteredAt
        }
    });
});

// Login endpoint – validates against SQL database with account lockout
app.MapPost("/api/login", async (LoginRequest request, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new { error = "Email and password are required." });
    }

    var user = await db.Users.FirstOrDefaultAsync(
        u => u.Email.ToLower() == request.Email.ToLower());

    if (user == null)
    {
        return Results.Json(new { error = "Invalid email or password." }, statusCode: 401);
    }

    // Check account lockout (5 failed attempts = 15 min lockout)
    if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow)
    {
        var minutesLeft = (int)Math.Ceiling((user.LockoutEnd.Value - DateTime.UtcNow).TotalMinutes);
        return Results.Json(new
        {
            error = $"Account locked. Try again in {minutesLeft} minute(s).",
            lockedUntil = user.LockoutEnd,
            isLocked = true
        }, statusCode: 423);
    }

    // Reset lockout if expired
    if (user.LockoutEnd.HasValue && user.LockoutEnd <= DateTime.UtcNow)
    {
        user.FailedLoginAttempts = 0;
        user.LockoutEnd = null;
    }

    var passwordHash = Convert.ToBase64String(
        SHA256.HashData(Encoding.UTF8.GetBytes(request.Password)));

    if (user.PasswordHash != passwordHash)
    {
        user.FailedLoginAttempts++;
        var remaining = 5 - user.FailedLoginAttempts;

        if (user.FailedLoginAttempts >= 5)
        {
            user.LockoutEnd = DateTime.UtcNow.AddMinutes(15);
            await db.SaveChangesAsync();
            return Results.Json(new
            {
                error = "Account locked due to too many failed attempts. Try again in 15 minutes.",
                isLocked = true,
                lockedUntil = user.LockoutEnd
            }, statusCode: 423);
        }

        await db.SaveChangesAsync();
        return Results.Json(new
        {
            error = "Invalid email or password.",
            attemptsRemaining = remaining
        }, statusCode: 401);
    }

    // Successful login – reset failed attempts
    user.FailedLoginAttempts = 0;
    user.LockoutEnd = null;
    user.LastLoginAt = DateTime.UtcNow;
    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        message = "Login successful!",
        user = new { user.Name, user.Email, user.Institution }
    });
});

// SPA fallback – any unmatched route serves index.html
app.MapFallbackToFile("index.html");

// --- Monitoring Endpoints ---

// Dashboard metrics for the monitoring page
app.MapGet("/api/monitor", (AppDbContext db) => Results.Ok(new
{
    server = new
    {
        status = "healthy",
        uptime = (DateTime.UtcNow - requestMetrics.StartTime).ToString(@"d\.hh\:mm\:ss"),
        startTime = requestMetrics.StartTime,
        environment = builder.Environment.EnvironmentName
    },
    traffic = new
    {
        totalRequests = requestMetrics.TotalRequests,
        clientErrors = requestMetrics.ClientErrors,
        serverErrors = requestMetrics.ServerErrors,
        successRate = requestMetrics.TotalRequests > 0
            ? Math.Round((1.0 - (double)(requestMetrics.ClientErrors + requestMetrics.ServerErrors) / requestMetrics.TotalRequests) * 100, 1)
            : 100.0
    },
    registrations = new
    {
        totalUsers = db.Users.Count(),
        institutions = db.Users
            .GroupBy(u => u.Institution)
            .Select(g => new { name = g.Key, count = g.Count() })
            .OrderByDescending(x => x.count)
    },
    recentRequests = requestMetrics.GetRecentRequests(20),
    performance = new
    {
        avgResponseTimeMs = requestMetrics.GetAverageResponseTime(),
        maxResponseTimeMs = requestMetrics.GetMaxResponseTime()
    }
}));

// Request log endpoint
app.MapGet("/api/monitor/requests", (int? count) =>
    Results.Ok(requestMetrics.GetRecentRequests(count ?? 50)));

app.Run();

// --- Models ---
public record RegistrationRequest(string Name, string Email, string Password, string Institution);
public record LoginRequest(string Email, string Password);

// --- Database Entity ---
public class UserEntity
{
    [Key]
    public int Id { get; set; }
    
    [Required, MaxLength(100)]
    public string Name { get; set; } = "";
    
    [Required, MaxLength(254)]
    public string Email { get; set; } = "";
    
    [Required, MaxLength(200)]
    public string Institution { get; set; } = "";
    
    [Required]
    public string PasswordHash { get; set; } = "";
    
    public DateTime RegisteredAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public int FailedLoginAttempts { get; set; }
    public DateTime? LockoutEnd { get; set; }
}

// --- Database Context ---
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<UserEntity> Users => Set<UserEntity>();
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserEntity>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }
}

// --- Monitoring ---
public class RequestMetrics
{
    public DateTime StartTime { get; } = DateTime.UtcNow;
    public long TotalRequests;
    public long ClientErrors;
    public long ServerErrors;

    private readonly ConcurrentQueue<RequestLog> _recentRequests = new();
    private readonly ConcurrentQueue<long> _responseTimes = new();

    public void TrackRequest(string path, int statusCode, long durationMs)
    {
        _recentRequests.Enqueue(new RequestLog(path, statusCode, durationMs, DateTime.UtcNow));
        _responseTimes.Enqueue(durationMs);

        // Keep only last 200 entries
        while (_recentRequests.Count > 200) _recentRequests.TryDequeue(out _);
        while (_responseTimes.Count > 1000) _responseTimes.TryDequeue(out _);
    }

    public IEnumerable<RequestLog> GetRecentRequests(int count) =>
        _recentRequests.Reverse().Take(count);

    public double GetAverageResponseTime() =>
        _responseTimes.IsEmpty ? 0 : Math.Round(_responseTimes.Average(), 1);

    public long GetMaxResponseTime() =>
        _responseTimes.IsEmpty ? 0 : _responseTimes.Max();
}

public record RequestLog(string Path, int StatusCode, long DurationMs, DateTime Timestamp);
