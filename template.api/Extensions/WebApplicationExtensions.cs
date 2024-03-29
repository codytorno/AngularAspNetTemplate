using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;

namespace template.api;

public static class WebApplicationExtensions
{
    public static WebApplication AddSinglePageAppStaticFiles(this WebApplication app)
    {
        var spaConfigs = app.Services.GetRequiredService<IOptions<SinglePageAppConfig>>();
        var newPath = Path.Combine(app.Environment.ContentRootPath, spaConfigs.Value.WebRootPath!);
        app.UseDefaultFiles(new DefaultFilesOptions()
        {
            FileProvider = new PhysicalFileProvider(newPath),
        });
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(newPath),
            RequestPath = ""
        });

        app.MapFallbackToController("Index", "Fallback");
        return app;
    }
}