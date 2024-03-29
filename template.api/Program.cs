using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using NSwag;
using NSwag.Generation.Processors.Security;
using template.api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApiDocument(document =>
{
    document.Title = "BudgetAPI";
    document.Version = "v1";
    document.AddSecurity("Bearer", Enumerable.Empty<string>(), new OpenApiSecurityScheme
    {
        Type = OpenApiSecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        BearerFormat = "JWT",
        Name = "Authorization",
        Description = "Type into the textbox: Bearer {your JWT token}."
    });

    document.OperationProcessors.Add(
        new AspNetCoreOperationSecurityScopeProcessor("Bearer"));
});

builder.Services.AddCors();

builder.Services.AddControllers();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    var audience = builder.Configuration["Passage:Audience"];
    var authority = builder.Configuration["Passage:Authority"];
    options.Authority = authority;
    options.Audience = audience;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateAudience = true,
        ValidateIssuerSigningKey = true
    };
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOptions<SinglePageAppConfig>().Bind(builder.Configuration.GetSection("spa")).ValidateDataAnnotations();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(settings =>
    {
        settings.SwaggerRoutes.Add(new NSwag.AspNetCore.SwaggerUiRoute(name: "FitnessAPI", url: "/swagger/v1/swagger.json"));
    });
}

app.UseHttpsRedirection();
app.UseRouting();


app.UseCors(policy =>
{
    var origin = app.Configuration.GetSection("Passage").GetValue<string>("Audience");
    if (string.IsNullOrEmpty(origin)) throw new InvalidOperationException("Passage:Audience cannot be null");
    policy.WithOrigins(origin)
        .AllowAnyHeader()
        .AllowCredentials()
        .AllowAnyMethod();
});



app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.AddSinglePageAppStaticFiles();


app.Run();