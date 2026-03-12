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
using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- Service Configuration ---
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

// --- In-Memory User Store (workshop demo; use a database in production) ---
var registeredUsers = new ConcurrentDictionary<string, RegisteredUser>(StringComparer.OrdinalIgnoreCase);

// --- API Endpoints ---

// Health check endpoint for Azure monitoring
app.MapGet("/api/health", () => Results.Ok(new
{
    status = "healthy",
    service = "CloudQuest Workshop API",
    timestamp = DateTime.UtcNow
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

// Registration endpoint – stores user with hashed password
app.MapPost("/api/register", (RegistrationRequest request) =>
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

    if (request.Password.Length < 6)
    {
        return Results.BadRequest(new { error = "Password must be at least 6 characters." });
    }

    // Hash the password before storing
    var passwordHash = Convert.ToBase64String(
        SHA256.HashData(Encoding.UTF8.GetBytes(request.Password)));

    var user = new RegisteredUser(
        request.Name, request.Email, request.Institution,
        passwordHash, DateTime.UtcNow);

    if (!registeredUsers.TryAdd(request.Email, user))
    {
        return Results.BadRequest(new { error = "This email is already registered." });
    }

    return Results.Ok(new
    {
        message = "Registration successful! You can now log in.",
        registrant = new
        {
            request.Name,
            request.Email,
            request.Institution,
            registeredAt = DateTime.UtcNow
        }
    });
});

// Login endpoint – validates against registered users
app.MapPost("/api/login", (LoginRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new { error = "Email and password are required." });
    }

    if (!registeredUsers.TryGetValue(request.Email, out var user))
    {
        return Results.Json(new { error = "Invalid email or password." }, statusCode: 401);
    }

    var passwordHash = Convert.ToBase64String(
        SHA256.HashData(Encoding.UTF8.GetBytes(request.Password)));

    if (user.PasswordHash != passwordHash)
    {
        return Results.Json(new { error = "Invalid email or password." }, statusCode: 401);
    }

    return Results.Ok(new
    {
        message = "Login successful!",
        user = new { user.Name, user.Email, user.Institution }
    });
});

// SPA fallback – any unmatched route serves index.html
app.MapFallbackToFile("index.html");

app.Run();

// --- Models ---
public record RegistrationRequest(string Name, string Email, string Password, string Institution);
public record LoginRequest(string Email, string Password);
public record RegisteredUser(string Name, string Email, string Institution, string PasswordHash, DateTime RegisteredAt);
