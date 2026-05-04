import { EventEmitter } from 'node:events'

class IngestEmitter extends EventEmitter {}

let _emitter: IngestEmitter | null = null

export function useIngestEmitter(): IngestEmitter {
  if (!_emitter) _emitter = new IngestEmitter()
  return _emitter
}
