using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace template.api;

public class SinglePageAppConfig
{
    /// <summary>
    ///     the path to the SPA files
    /// </summary>
    [Required]
    public string WebRootPath { get; set; } = "wwwroot";
}

public class FallbackController : Controller
{
    private readonly SinglePageAppConfig _spaConfigs;

    public FallbackController(IOptions<SinglePageAppConfig> options)
    {
        _spaConfigs = options.Value;
    }
    public ActionResult Index()
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
            _spaConfigs.WebRootPath!, "index.html"), "text/HTML");
    }
}