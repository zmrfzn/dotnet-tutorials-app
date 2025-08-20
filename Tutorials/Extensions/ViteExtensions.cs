using Microsoft.AspNetCore.SpaServices;

namespace Tutorials.Extensions;

public static class ViteExtensions
{
    public static void UseViteDevelopmentServer(this ISpaBuilder spa, string npmScript)
    {
        spa.UseProxyToSpaDevelopmentServer(() =>
        {
            var serverUrl = "http://localhost:3000";
            return Task.FromResult(new Uri(serverUrl));
        });
    }
}
