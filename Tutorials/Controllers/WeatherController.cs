using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Tutorials.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<WeatherController> _logger;
    private readonly string _apiKey = "b06f7aeeae13ab893ca5409afa2ca384"; // In production, this should be in configuration
    private readonly string _baseUrl = "http://api.openweathermap.org/data/2.5";

    public WeatherController(HttpClient httpClient, ILogger<WeatherController> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetWeather([FromQuery] string location)
    {
        try
        {
            if (string.IsNullOrEmpty(location))
            {
                return BadRequest(new { message = "Location parameter is required" });
            }

            var url = $"{_baseUrl}/weather?q={location}&appid={_apiKey}";
            
            var response = await _httpClient.GetAsync(url);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var weatherData = JsonSerializer.Deserialize<object>(content);
                
                _logger.LogInformation("Successfully retrieved weather data for location: {Location}", location);
                
                return Ok(weatherData);
            }
            else
            {
                _logger.LogWarning("Failed to retrieve weather data for location: {Location}. Status: {StatusCode}", 
                    location, response.StatusCode);
                
                return NotFound(new { message = $"Error retrieving data for location={location}" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving weather data for location: {Location}", location);
            return StatusCode(500, new { message = $"Error retrieving data for location={location}" });
        }
    }
}
