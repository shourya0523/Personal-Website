// Runs the model off the main thread so the page stays smooth while it thinks.
import { WebWorkerMLCEngineHandler } from 'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.86/+esm'

const handler = new WebWorkerMLCEngineHandler()
self.onmessage = msg => handler.onmessage(msg)

// The page can't see this worker's network requests, so report them on a side channel
// (kept separate from the engine's own messages). Times are absolute so both sides compare.
const net = new BroadcastChannel('pt-net')
new PerformanceObserver(list => {
  net.postMessage(list.getEntries().map(e => ({ name: e.name, at: performance.timeOrigin + e.startTime, bytes: e.transferSize || 0 })))
}).observe({ type: 'resource', buffered: true })
