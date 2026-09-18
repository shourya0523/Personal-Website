export const blogPosts = [
  {
    id: 'agentic-ai-use-guide',
    title: 'Please use agentic AI!!',
    excerpt: 'We are working for a real client. We need to build this product in a really short window, and do high quality work.',
    date: '2026-09-17',
    readTime: '12 min',
    tags: ['AI', 'Engineering', 'Mentoring'],
    accent: '#7c3aed',
    bodyMarkdown: `This is the AI use guide I give to engineers I am mentoring for a project.

We are working for a real client. We need to build this product in a really short window, and do high quality work. Software engineering has irreversibly changed through the advent of agentic AI, and you will use the skills you develop here wherever you work. If you have no experience with agentic development, I highly recommend sitting with me through a workshop.

## That Said:

There is a lot of research on code quality and cognitive impacts of GenAI use. We must still use it responsibly and with care if we are to create quality software.

To quote an MIT study - [*"LLM users consistently underperformed at neural, linguistic, and behavioral levels. These results raise concerns about the long-term educational implications of LLM reliance and underscore the need for deeper inquiry into AI's role in learning"*](https://www.media.mit.edu/publications/your-brain-on-chatgpt/)

## How do we do that? - Guidelines on AI Use

* **Plan, then execute** - Goes without saying. Throwing an LLM directly at a problem will never yield good results. Tools like Cursor, Claude, all come with a dedicated plan mode for this reason. *(/plan)*. The benefits of planning are two-fold:
  * Forces the LLM to deeply examine the codebase and analyse approaches
  * You're smarter than an LLM! I trust your judgement. Read the plan, discuss, analyze, and push back!
* **Subagents** - LLMs perform worse the more full their context window gets. There are multiple strategies to avoid this, including subagents, or breaking up a task into smaller workflows. Features can be large and complicated, and every line your agent writes makes it perform worse. Either specify the use of subagents when you create your plan, or break the task up yourself.
* **Context management** - Building on the last point - Agents forget. If you see a pattern of bugs, are opinionated about style or tech stack, documentation! [Claude.md](https://code.claude.com/docs/en/memory) or .cursorrules are great starting points. In fact, when we begin development, I will share an [agents.md](https://agents.md) file for us to all edit and use.
* **Skills** - Further on context management, there are ways to tailor your agent to your workflow. Building [skill.md](https://code.claude.com/docs/en/skills) files not only lets you save repeatable workflows, like testing, deployment, and debugging, but is also a great way to tailor your agentic workflow to your project.
* **Connectors** - Software engineering is more than writing code. It is deployment, integrations, smoke-testing, data engineering, and more. It is extremely token and time inefficient to connect to these external tools without using MCP servers, skills, and connectors. Always search Claude and Cursor marketplaces for external connectors you can use.
* **Token Efficiency** - Agents can be expensive! Understand what model you are using for your task. Cursors auto mode is a great default. For Claude, Fable 5.1 is a very rare use case. Use it for complex debugging, planning, or agent orchestration. Opus 5 is a expensive but powerful workhorse. Sonnet 5 should work for most of your subagents and one-off tasks.
* **Testing** - Lets be honest. We are in the era of long running agents. It is unrealistic to expect each one of you to review thousands of lines of code a week. However, an agent needs to know when its wrong. Always have a agent test and verify after completing a feature. Pay attention to *what* you are testing. *[types of tests](https://www.atlassian.com/continuous-delivery/software-testing/types-of-software-testing)*.

## There is so much more

Every developer picks up their own style and use cases for AI. Please experiment, learn, and be conscious of what you trust. All of you are talented, opinionated developers, so let your opinions reflect in your output. Good luck!`
  }
]

export const blogTags = ['All', ...new Set(blogPosts.flatMap(post => post.tags))]
