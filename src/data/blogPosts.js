export const blogPosts = [
  {
    id: 'agentic-ai-use-guide',
    title: 'Agentic AI, the right way: the guide I give engineers I mentor',
    excerpt: 'How I ask mentees to use AI on real projects — not as autocomplete with vibes, but as a system of planning, context, skills, connectors, and verification.',
    date: '2026-09-17',
    readTime: '12 min',
    tags: ['AI', 'Engineering', 'Mentoring'],
    accent: '#7c3aed',
    body: [
      {
        heading: 'Why this exists',
        paragraphs: [
          'This is the AI use guide I give engineers I am mentoring on a project. Not a manifesto. A working agreement so we ship faster without outsourcing judgment.',
          'A recent MIT Media Lab study on LLM-assisted writing ("Your Brain on ChatGPT") found that people who leaned on an assistant across sessions showed weaker neural connectivity and weaker ownership of their own output than people who wrote unaided. Read it as a caution about cognitive offloading, not as "AI makes you dumb": https://www.media.mit.edu/publications/your-brain-on-chatgpt/ and the preprint: https://arxiv.org/pdf/2506.08872',
          'The point for us: if you skip the thinking layer, you get speed theater. If you keep the thinking layer and put AI behind it, you get leverage.'
        ]
      },
      {
        heading: 'Please use agentic AI',
        paragraphs: [
          'I want you using agentic AI — systems that plan, use tools, manage context, and verify — not one-shot chat that dumps a wall of code you cannot defend.',
          'That means: clear goals, scoped sub-tasks, persistent project memory, reusable skills, live connectors, and a bias toward testing what you just changed. Cursor, Claude Code, and similar agent harnesses are built for this loop. Treat them like junior teammates you still review.'
        ]
      },
      {
        heading: 'Start with a plan (and keep it visible)',
        paragraphs: [
          'Before you touch implementation, ask the agent for a plan. Force it to name assumptions, files it will touch, risks, and a definition of done.',
          'In Claude Code, kick off with /plan or an equivalent planning mode so the approach is reviewable before diffs land. Docs: https://code.claude.com/docs/en/features-overview',
          'In Cursor, use Plan / agent mode the same way: approve the approach, then let it execute. If the plan is vague, reject it. Vague plans create expensive thrash.'
        ]
      },
      {
        heading: 'Context is the product',
        paragraphs: [
          'Agents are only as good as what they can see. Put durable project truth in CLAUDE.md (or the equivalent always-on memory file). Keep it short: build/test commands, architecture invariants, "always do X" rules. Docs: https://code.claude.com/docs/en/memory',
          'If your repo already has AGENTS.md for other tools, point CLAUDE.md at it with an @AGENTS.md import so you are not maintaining two sources of truth.',
          'For long procedures, do not stuff CLAUDE.md. Move them into skills — on-demand playbooks that load only when relevant. Skills docs: https://code.claude.com/docs/en/skills',
          'Rule of thumb: facts and invariants → memory file. Multi-step recipes → skills. One-off chat paste → you are doing it wrong.'
        ]
      },
      {
        heading: 'Subagents, connectors, and token hygiene',
        paragraphs: [
          'Break work the way a strong tech lead would. Investigation, implementation, and verification can be separate agent passes with clean handoffs instead of one giant context window that slowly loses the plot.',
          'Wire connectors (MCP / integrations) for the systems you actually touch — GitHub, Linear, docs, browsers, databases — so the agent reads live state instead of guessing from stale paste.',
          'Be token-efficient on purpose. Prefer targeted file reads over dumping the repo. Prefer summarizing tool output over re-pasting it. Prefer small diffs over rewrite-the-world PRs. Context bloat is how agents get confidently wrong.'
        ]
      },
      {
        heading: 'Model choice: plan hard, execute cheap',
        paragraphs: [
          'Use the strongest reasoning model for planning, architecture, and ambiguous debugging. Use a faster mid-tier model for bounded execution once the plan is solid.',
          'My default split on Claude: Opus-class for planning and hard reasoning; Sonnet-class for implementation once the path is clear. Escalate back to the stronger model when the executor is thrashing, the bug is cross-cutting, or the plan itself looks wrong.',
          'Do not spend frontier tokens on "rename this prop" work. Do not spend cheap tokens on "redesign the auth boundary" work. Match model to the decision density of the step.'
        ]
      },
      {
        heading: 'Testing is part of the agent loop',
        paragraphs: [
          'An agent that cannot run tests is guessing. Make test commands obvious in project memory. Ask for red → green when fixing bugs. Ask for a focused regression when changing behavior.',
          'For UI, require screenshots or a short verification checklist. For APIs, require a curl or integration check. "Looks good to me" from an agent is not a test.',
          'If tests are missing for the area you touched, adding a minimal one is often higher leverage than another feature commit.'
        ]
      },
      {
        heading: 'What good looks like on this project',
        paragraphs: [
          'You open with a plan I can skim in two minutes.',
          'You update CLAUDE.md / skills when you learn something durable.',
          'You use connectors instead of hallucinating ticket or repo state.',
          'You keep diffs reviewable.',
          'You show evidence: tests, logs, screenshots, or a repro.',
          'You can explain every non-trivial change without the chat transcript open.'
        ]
      },
      {
        heading: 'What I will push back on',
        paragraphs: [
          'Blind accept of a giant diff.',
          'Shipping code you cannot narrate.',
          'Skipping plan mode because "it was a small change" (until it was not).',
          'Pasting secrets into prompts.',
          'Using AI to avoid reading the failing test.'
        ]
      },
      {
        heading: 'Bottom line',
        paragraphs: [
          'Agentic AI is a force multiplier for engineers who keep ownership. It is a liability for engineers who outsource understanding.',
          'Use the agents. Keep the judgment. Write it down so the next session starts smarter than this one.'
        ]
      }
    ]
  }
]

export const blogTags = ['All', ...new Set(blogPosts.flatMap(post => post.tags))]
