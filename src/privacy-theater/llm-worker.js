// Runs the model off the main thread so the stage keeps animating while it thinks.
import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm'

const handler = new WebWorkerMLCEngineHandler()
self.onmessage = msg => handler.onmessage(msg)

// The page can't see this worker's network requests, so report them on a side channel kept
// separate from the engine's own messages. Times are absolute so both sides can compare.
const net = new BroadcastChannel('pt-net')
new PerformanceObserver(list => {
  net.postMessage(list.getEntries().map(e => ({ at: performance.timeOrigin + e.startTime, bytes: e.transferSize || 0 })))
}).observe({ type: 'resource', buffered: true })
