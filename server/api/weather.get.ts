import { z } from 'zod'

const querySchema = z.object({
  city: z.string().min(1),
  units: z.enum(['metric', 'imperial']).default('metric'),
  provider: z.enum(['open-meteo', 'openweathermap', 'weatherapi']).default('open-meteo'),
  apiKey: z.string().default(''),
})

export interface WeatherData {
  city: string
  temp: number
  tempMin: number
  tempMax: number
  humidity: number
  windCurrent: number
  windMin: number
  windMax: number
  code: number
  hourly: { hour: string; temp: number; code: number }[]
  units: 'metric' | 'imperial'
}

async function fetchOpenMeteo(city: string, units: 'metric' | 'imperial'): Promise<WeatherData> {
  const geoRes = await $fetch<{ results?: { latitude: number; longitude: number; name: string }[] }>(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
  )
  if (!geoRes.results?.length) throw createError({ statusCode: 404, message: 'City not found' })
  const { latitude, longitude, name } = geoRes.results[0]
  const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius'

  const res = await $fetch<{
    current: { temperature_2m: number; weathercode: number; windspeed_10m: number; relativehumidity_2m: number }
    daily: { temperature_2m_min: number[]; temperature_2m_max: number[]; windspeed_10m_min?: number[]; windspeed_10m_max: number[] }
    hourly: { time: string[]; temperature_2m: number[]; weathercode: number[]; windspeed_10m: number[] }
  }>(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}`
    + `&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m`
    + `&daily=temperature_2m_min,temperature_2m_max,windspeed_10m_max`
    + `&hourly=temperature_2m,weathercode,windspeed_10m`
    + `&temperature_unit=${tempUnit}&wind_speed_unit=${units === 'imperial' ? 'mph' : 'kmh'}`
    + `&timezone=auto&forecast_days=1`,
  )

  const now = new Date()
  const currentHourIndex = res.hourly.time.findIndex(t => new Date(t) >= now)
  const startIdx = currentHourIndex < 0 ? 0 : currentHourIndex
  const hourly = res.hourly.time.slice(startIdx, startIdx + 6).map((t, i) => ({
    hour: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(res.hourly.temperature_2m[startIdx + i]),
    code: res.hourly.weathercode[startIdx + i],
  }))

  const winds = res.hourly.windspeed_10m
  return {
    city: name,
    temp: Math.round(res.current.temperature_2m),
    tempMin: Math.round(res.daily.temperature_2m_min[0]),
    tempMax: Math.round(res.daily.temperature_2m_max[0]),
    humidity: res.current.relativehumidity_2m,
    windCurrent: Math.round(res.current.windspeed_10m),
    windMin: Math.round(Math.min(...winds)),
    windMax: Math.round(res.daily.windspeed_10m_max[0]),
    code: res.current.weathercode,
    hourly,
    units,
  }
}

async function fetchOpenWeatherMap(city: string, units: 'metric' | 'imperial', apiKey: string): Promise<WeatherData> {
  if (!apiKey) throw createError({ statusCode: 400, message: 'API key required for OpenWeatherMap' })

  const [current, forecast] = await Promise.all([
    $fetch<{ main: { temp: number; temp_min: number; temp_max: number; humidity: number }; wind: { speed: number }; weather: { id: number }[]; name: string }>(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`,
    ),
    $fetch<{ list: { dt: number; main: { temp: number }; weather: { id: number }[]; wind: { speed: number } }[] }>(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}&cnt=6`,
    ),
  ])

  const winds = forecast.list.map(f => f.wind.speed)
  const hourly = forecast.list.slice(0, 6).map(f => ({
    hour: new Date(f.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(f.main.temp),
    code: f.weather[0].id,
  }))

  return {
    city: current.name,
    temp: Math.round(current.main.temp),
    tempMin: Math.round(current.main.temp_min),
    tempMax: Math.round(current.main.temp_max),
    humidity: current.main.humidity,
    windCurrent: Math.round(current.wind.speed),
    windMin: Math.round(Math.min(...winds)),
    windMax: Math.round(Math.max(...winds)),
    code: current.weather[0].id,
    hourly,
    units,
  }
}

async function fetchWeatherApi(city: string, units: 'metric' | 'imperial', apiKey: string): Promise<WeatherData> {
  if (!apiKey) throw createError({ statusCode: 400, message: 'API key required for WeatherAPI' })

  const res = await $fetch<{
    location: { name: string }
    current: { temp_c: number; temp_f: number; wind_kph: number; wind_mph: number; humidity: number; condition: { code: number } }
    forecast: { forecastday: [{ day: { mintemp_c: number; mintemp_f: number; maxtemp_c: number; maxtemp_f: number; maxwind_kph: number; maxwind_mph: number }; hour: { time: string; temp_c: number; temp_f: number; condition: { code: number } }[] }] }
  }>(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=1&hourly=1`,
  )

  const isImperial = units === 'imperial'
  const day = res.forecast.forecastday[0].day
  const now = new Date()
  const hours = res.forecast.forecastday[0].hour
    .filter(h => new Date(h.time) >= now)
    .slice(0, 6)
    .map(h => ({
      hour: new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(isImperial ? h.temp_f : h.temp_c),
      code: h.condition.code,
    }))

  return {
    city: res.location.name,
    temp: Math.round(isImperial ? res.current.temp_f : res.current.temp_c),
    tempMin: Math.round(isImperial ? day.mintemp_f : day.mintemp_c),
    tempMax: Math.round(isImperial ? day.maxtemp_f : day.maxtemp_c),
    humidity: res.current.humidity,
    windCurrent: Math.round(isImperial ? res.current.wind_mph : res.current.wind_kph),
    windMin: 0,
    windMax: Math.round(isImperial ? day.maxwind_mph : day.maxwind_kph),
    code: res.current.condition.code,
    hourly: hours,
    units,
  }
}

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)
  if (query.provider === 'openweathermap') return fetchOpenWeatherMap(query.city, query.units, query.apiKey)
  if (query.provider === 'weatherapi') return fetchWeatherApi(query.city, query.units, query.apiKey)
  return fetchOpenMeteo(query.city, query.units)
})
