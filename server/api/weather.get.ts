import { z } from 'zod'

const querySchema = z.object({
  city: z.string().min(1),
  units: z.enum(['metric', 'imperial']).default('metric'),
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)

  const geoRes = await $fetch<{ results?: { latitude: number; longitude: number }[] }>(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.city)}&count=1`,
  )
  if (!geoRes.results?.length) throw createError({ statusCode: 404, message: 'City not found' })

  const { latitude, longitude } = geoRes.results[0]
  const tempUnit = query.units === 'imperial' ? 'fahrenheit' : 'celsius'

  const weather = await $fetch<{ current: { temperature_2m: number; weathercode: number } }>(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode&temperature_unit=${tempUnit}`,
  )

  return {
    temp: Math.round(weather.current.temperature_2m),
    code: weather.current.weathercode,
  }
})
