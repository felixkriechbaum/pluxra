import { z } from 'zod'

const querySchema = z.object({
  city: z.string().min(1),
  units: z.enum(['metric', 'imperial']).default('metric'),
  provider: z.enum(['open-meteo', 'openweathermap', 'weatherapi']).default('open-meteo'),
  apiKey: z.string().default(''),
})

async function fetchOpenMeteo(city: string, units: 'metric' | 'imperial') {
  const geoRes = await $fetch<{ results?: { latitude: number; longitude: number }[] }>(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
  )
  if (!geoRes.results?.length) throw createError({ statusCode: 404, message: 'City not found' })
  const { latitude, longitude } = geoRes.results[0]
  const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius'
  const weather = await $fetch<{ current: { temperature_2m: number; weathercode: number; windspeed_10m: number; relativehumidity_2m: number } }>(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m&temperature_unit=${tempUnit}`,
  )
  return {
    temp: Math.round(weather.current.temperature_2m),
    code: weather.current.weathercode,
    wind: Math.round(weather.current.windspeed_10m),
    humidity: weather.current.relativehumidity_2m,
  }
}

async function fetchOpenWeatherMap(city: string, units: 'metric' | 'imperial', apiKey: string) {
  if (!apiKey) throw createError({ statusCode: 400, message: 'API key required for OpenWeatherMap' })
  const res = await $fetch<{ main: { temp: number; humidity: number }; wind: { speed: number }; weather: { id: number }[] }>(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`,
  )
  return {
    temp: Math.round(res.main.temp),
    code: res.weather[0].id,
    wind: Math.round(res.wind.speed),
    humidity: res.main.humidity,
  }
}

async function fetchWeatherApi(city: string, units: 'metric' | 'imperial', apiKey: string) {
  if (!apiKey) throw createError({ statusCode: 400, message: 'API key required for WeatherAPI' })
  const res = await $fetch<{ current: { temp_c: number; temp_f: number; wind_kph: number; wind_mph: number; humidity: number; condition: { code: number } } }>(
    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`,
  )
  return {
    temp: Math.round(units === 'imperial' ? res.current.temp_f : res.current.temp_c),
    code: res.current.condition.code,
    wind: Math.round(units === 'imperial' ? res.current.wind_mph : res.current.wind_kph),
    humidity: res.current.humidity,
  }
}

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)

  if (query.provider === 'openweathermap') return fetchOpenWeatherMap(query.city, query.units, query.apiKey)
  if (query.provider === 'weatherapi') return fetchWeatherApi(query.city, query.units, query.apiKey)
  return fetchOpenMeteo(query.city, query.units)
})
