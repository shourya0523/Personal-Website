// Act IV's demo: a small language model running entirely on the visitor's device.
// WebLLM is only fetched when the visitor asks for it, so the page itself stays light.

const MODELS = { f16: 'Qwen3.5-0.8B-q4f16_1-MLC', f32: 'Qwen3.5-0.8B-q4f32_1-MLC' }
const MAX_POLICY = 6000

const POLICY_SYSTEM = `You read privacy policies for ordinary people. Look for four things in the policy the user gives you:
1. Training: user data or conversations used to train or improve AI models.
2. Retention: how long data is kept.
3. Human review: people reading user content.
4. Sharing: data shared with or sold to others.
For each of the four, write the label, a colon, then quote the matching sentence from the policy word for word. If nothing matches, write "not mentioned". Write nothing else.`

const SAMPLE = `Example Chat Privacy Notice (a made-up sample for testing)

We collect the messages you send, the files you upload, and information about your device and how you use the service. We may use your conversations to develop and improve our services, including to train new models, unless you turn off "Help Improve Example Chat" in Settings. This setting is on by default for personal accounts. If the setting is on, we may keep your conversations for up to three years; otherwise we delete them within 30 days. Business accounts are never used for model training. To keep the service safe, trained reviewers may read a small sample of conversations. We share information with service providers who help us run the service, and we may share de-identified data with research partners. We do not sell your personal information.`

// The full op-ed the show is adapted from. The page itself is short on purpose, so the model
// answers from the essay. (The six-company list is left out, as on the page.)
const OPED = `Privacy Theater: You Never Agreed to This. By Shourya Yadav.

Open a website, any website, and before you can even find the "Reject All" button, it already knows your zip code, device type, internet provider, and a lot more. Stitched together, this is enough data to tell you apart from almost everyone else online. When I opened Kuber Mehta's project, I didn't set a cookie, it read me back to myself in under two seconds, and it did all of it without storing a single cookie. Mehta's warning is that "the site you visit after this one can do all of it too, and won't tell you."

The cookie banner is the stage set of self-managed privacy, a polite little box that asks for your consent on one narrow question while the real collection happens backstage. According to a 2023 Pew Research Center survey, 56% of Americans say they always, almost always or often click "agree" without reading privacy policies, and 61% doubt that anything they do will make much difference. That resignation is the theater working exactly as designed, since a choice that feels pointless is a choice people stop making.

What's changed now is the way companies use your data, which has grown far hungrier than any ad network ever was. The same Pew survey found that 70% of Americans who have heard of AI have little to no trust in companies to use it responsibly. In October 2025, researchers at Stanford reviewed the privacy policies of six major American AI developers and found that all six use people's chat conversations to train their models by default, with some keeping that data indefinitely and some letting human reviewers read transcripts.

Where an opt-out exists, it tends to look familiar. When one major lab updated its terms in 2025, users saw a large "Accept" button with a much smaller training toggle beneath it, already switched on, and conversations from anyone who left it on can now be kept for up to five years.

Tristan Buckmaster, a mathematician at NYU, had been using OpenAI's coding tool to work through unpublished research, and when OpenAI announced that its AI had solved the famous Navier-Stokes problem, a claim mathematicians are still examining, he asked whether the model had seen the drafts he kept in those sessions. OpenAI responded that its researchers "did not see any of their work through any means until they released it publicly," and added: "While unlikely, we cannot rule out that de-identified data derived from their usage of our products helped improve our models." Once your ideas enter a cloud model, even the company running it cannot fully trace where they go.

Real protection doesn't end at self-management. It has to be built into the software we use and written into the laws that govern it, so privacy is the default long before anyone goes looking for a toggle. If you are not paying for the AI you use with your data, you are probably paying with it. The same update that switched that toggle on for everyday users left business, enterprise and API customers untouched. Privacy is already for sale, and the companies that can afford it are buying. Everyone else pays with their conversations.

Three forces keep it that way. Money: data has become the fuel for training AI, and every conversation makes the next model a little sharper. Law: the US still has no comprehensive federal privacy law, only a patchwork of 24 state laws, and of the 49 federal proposals Congress has seen, only two narrow ones have passed. Design: a pre-switched toggle and a giant "Accept" button do exactly what they were built to do.

At M3 and SNAP Life Sciences, the author worked with pharmaceutical and financial data where everything was valuable and proprietary, and with limited startup resources found creative ways to run privacy-first, local AI. A model running on your own hardware keeps your sharpest ideas and most sensitive information where they belong, so the savings and the privacy arrive together. He is co-organizing HACK1984, a 24-hour, privacy-first hackathon in Boston on Nov 7–8, 2026.

To be sure, user data does make models better, and free tools have bills to pay. Regardless, the burden of protecting that data belongs with the companies collecting it, so training should stay off by default for everyone, the same protection enterprise customers already enjoy.

What you can do: turn off chat training in every AI tool you use; turn on Global Privacy Control in your browser; keep sensitive work on a local model such as this one, or free apps like Ollama and LM Studio; and tell your representatives you want a federal privacy law. AI companies should leave training off unless a user opts in, as Stanford's researchers recommend. Congress should pass a federal privacy law that sets a floor for every state and lets them build higher. Builders should treat local, privacy-first AI as the default.

Who do you trust with your most sensitive data?`

export function initLab({ onState } = {}) {
  const $ = id => document.getElementById(id)
  let webllm = null, engine = null, modelId = null, readyAt = Infinity, busy = false
  const net = { requests: 0, bytes: 0 }
  const askSystem = () => `You answer questions about one op-ed, shown below. Use only what the op-ed says. Answer in one to three plain sentences, speaking to the reader as "you". If the op-ed does not answer the question, reply exactly: "The op-ed doesn't cover that."\n\nOP-ED:\n${OPED}`

  // Network counter: this page's requests plus the worker's, counted only after the model is ready.
  const countEntries = list => {
    let changed = false
    for (const e of list) if (e.at > readyAt) { net.requests++; net.bytes += e.bytes; changed = true }
    if (changed) renderNet()
  }
  const renderNet = () => {
    if (readyAt === Infinity) return
    const el = $('s-net')
    el.textContent = net.requests === 0 ? '0' : `${net.requests} (${(net.bytes / 1024).toFixed(1)} KB)`
    el.classList.toggle('hot', net.requests > 0)
  }
  new PerformanceObserver(l => countEntries(l.getEntries().map(e => ({ at: performance.timeOrigin + e.startTime, bytes: e.transferSize || 0 }))))
    .observe({ type: 'resource', buffered: true })
  new BroadcastChannel('pt-net').onmessage = ev => countEntries(ev.data)

  const warn = text => { $('lab-progress').textContent = text; $('lab-progress').classList.add('hot') }

  async function detect() {
    if (!('gpu' in navigator)) return null
    try {
      const adapter = await navigator.gpu.requestAdapter()
      if (!adapter) return null
      return adapter.features.has('shader-f16') ? MODELS.f16 : MODELS.f32
    } catch { return null }
  }

  async function lib() {
    webllm ??= await import('@mlc-ai/web-llm')
    return webllm
  }

  async function init() {
    modelId = await detect()
    if (!modelId) {
      $('s-gpu').textContent = 'not available'; $('s-gpu').classList.add('hot')
      warn('This browser can\'t run the model because it doesn\'t support WebGPU. A recent Chrome or Edge on a laptop works, as does Safari 26 or later.')
      return
    }
    $('s-gpu').textContent = modelId === MODELS.f16 ? 'yes' : 'yes (32-bit)'
    $('lab-load').disabled = false
  }

  async function load() {
    $('lab-load').disabled = true
    $('s-model').textContent = 'loading…'
    onState?.('loading')
    try {
      const { CreateWebWorkerMLCEngine } = await lib()
      engine = await CreateWebWorkerMLCEngine(new Worker(new URL('./llm-worker.js', import.meta.url), { type: 'module' }), modelId, {
        initProgressCallback: r => {
          $('lab-bar').style.width = `${Math.round(r.progress * 100)}%`
          $('lab-progress').textContent = r.text
        },
      })
    } catch (err) {
      $('s-model').textContent = 'failed'; $('s-model').classList.add('hot')
      warn(`The model didn't load: ${err.message || err}`)
      $('lab-load').disabled = false
      onState?.('idle')
      return
    }
    readyAt = performance.timeOrigin + performance.now()
    renderNet()
    $('s-model').textContent = 'ready'
    $('lab-progress').textContent = 'Ready. From here on, everything happens on this device. Watch the request counter.'
    $('lab-load').textContent = 'Loaded'
    $('lab-forget').disabled = false
    $('lab-ask').disabled = false; $('lab-check').disabled = false
    onState?.('ready')
  }

  async function run(system, user, out) {
    if (!engine || busy) return
    busy = true; $('lab-ask').disabled = true; $('lab-check').disabled = true
    out.textContent = ''
    onState?.('thinking')
    const t0 = performance.now()
    let tokens = 0, first = 0, text = ''
    try {
      const stream = await engine.chat.completions.create({
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        temperature: 0.2, max_tokens: 320, stream: true,
        extra_body: { enable_thinking: false },
      })
      for await (const chunk of stream) {
        const piece = chunk.choices[0]?.delta?.content || ''
        if (!piece) continue
        if (!tokens) first = performance.now()
        tokens++; text += piece
        out.textContent = text.replace(/<think>[\s\S]*?(<\/think>|$)/g, '').trimStart()
      }
      const secs = (performance.now() - (first || t0)) / 1000
      $('s-speed').textContent = tokens > 1 ? `${(tokens / secs).toFixed(1)} tokens/s` : '—'
    } catch (err) {
      out.textContent = `Something went wrong: ${err.message || err}`
    } finally {
      busy = false; $('lab-ask').disabled = false; $('lab-check').disabled = false
      onState?.('ready')
    }
  }

  async function forget() {
    if (!modelId) return
    $('lab-forget').disabled = true
    try {
      if (engine) { await engine.unload(); engine = null }
      const { deleteModelAllInfoInCache } = await lib()
      await deleteModelAllInfoInCache(modelId)
      readyAt = Infinity; net.requests = 0; net.bytes = 0
      $('s-net').textContent = '—'; $('s-net').classList.remove('hot')
      $('s-model').textContent = 'deleted'; $('s-speed').textContent = '—'
      $('lab-bar').style.width = '0'
      $('lab-progress').textContent = 'Deleted. The model is no longer stored in this browser.'
      $('lab-load').textContent = 'Download the model'; $('lab-load').disabled = false
      $('lab-ask').disabled = true; $('lab-check').disabled = true
      onState?.('idle')
    } catch (err) {
      warn(`Couldn't delete the model: ${err.message || err}`); $('lab-forget').disabled = false
    }
  }

  const ask = () => { const q = $('lab-q').value.trim(); if (q) run(askSystem(), q, $('out-ask')) }
  const check = () => { const p = $('lab-policy').value.trim(); if (p) run(POLICY_SYSTEM, `POLICY:\n${p.slice(0, MAX_POLICY)}`, $('out-policy')) }

  $('lab-load').onclick = load
  $('lab-forget').onclick = forget
  $('lab-ask').onclick = ask
  $('lab-q').onkeydown = e => { if (e.key === 'Enter') ask() }
  $('lab-suggest').onclick = e => { if (e.target.tagName === 'BUTTON') { $('lab-q').value = e.target.textContent; ask() } }
  $('lab-check').onclick = check
  $('lab-sample').onclick = () => { $('lab-policy').value = SAMPLE; $('lab-policy').dispatchEvent(new Event('input')) }
  $('lab-policy').oninput = () => {
    if ($('lab-policy').value.length > MAX_POLICY) $('lab-policy').value = $('lab-policy').value.slice(0, MAX_POLICY)
    $('lab-count').textContent = $('lab-policy').value.length.toLocaleString()
  }
  const tabs = [['tab-policy', 'panel-policy'], ['tab-ask', 'panel-ask']]
  for (const [tab, panel] of tabs) {
    $(tab).onclick = () => {
      for (const [t, p] of tabs) { $(t).setAttribute('aria-selected', String(t === tab)); $(p).hidden = p !== panel }
    }
  }

  return { init }
}
