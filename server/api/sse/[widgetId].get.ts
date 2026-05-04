import { useIngestEmitter } from '../../utils/ingest-emitter'

export default defineEventHandler(async (event) => {
  const widgetId = getRouterParam(event, 'widgetId')!

  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')

  const emitter = useIngestEmitter()

  return new ReadableStream({
    start(controller) {
      const handler = (payload: unknown) => {
        controller.enqueue(`data: ${JSON.stringify(payload)}\n\n`)
      }
      emitter.on(`widget:${widgetId}`, handler)
      event.node.req.on('close', () => {
        emitter.off(`widget:${widgetId}`, handler)
        controller.close()
      })
    },
  })
})
