export async function currentWeather() {
  const url = process.env.WEATHER_NOW_API_URL;
  const res = await fetch(url);
  const data = await res.json();

  const current = data.current;
  const time = new Date(current.time * 1000);

  return {
    time: time.toLocaleString("en-US", { weekday: "long", hour: "2-digit", minute: "2-digit" }),
    temperature: `${current.temperature_2m} °C`,
    apparentTemperature: `${current.apparent_temperature} °C`,
    humidity: `${current.relative_humidity_2m} %`,
    precipitation: `${current.precipitation} mm`,
    windSpeed: `${current.wind_speed_10m} km/h`
  };
}

export async function dailyWeatherFor7Days() {
  const url = process.env.WEATHER_WEEK_API_URL;
  const res = await fetch(url);
  const data = await res.json();

  const today = new Date();
  const annotatedDaily = data.daily.time.map((t, i) => {
    const date = new Date(t * 1000);
    let label;
    if (i === 0) label = "today";
    else if (i === 1) label = "tomorrow";
    else label = date.toLocaleDateString("en-US", { weekday: "long" });

    return {
      label,
      maxTemp: `${data.daily.temperature_2m_max[i]} °C`,
      minTemp: `${data.daily.temperature_2m_min[i]} °C`,
      precipitationProbability: `${data.daily.precipitation_probability_max[i]} %`,
      windSpeedMax: `${data.daily.wind_speed_10m_max[i]} km/h`,
      uvIndexMax: data.daily.uv_index_max[i],
      weatherCode: data.daily.weather_code[i],
      sunrise: new Date(data.daily.sunrise[i] * 1000).toLocaleTimeString("en-US"),
      sunset: new Date(data.daily.sunset[i] * 1000).toLocaleTimeString("en-US"),
      daylightDuration: `${Math.round(data.daily.daylight_duration[i] / 3600)} h`
    };
  });

  return annotatedDaily;
}
