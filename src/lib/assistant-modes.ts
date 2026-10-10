// Shared between the browser and the /api/chat server route.
// Only IDs and UI copy live here; system prompts stay server-side in
// src/server/prompts.ts.

export const MODES = ['chat', 'study', 'writing'] as const
export type Mode = (typeof MODES)[number]

export interface Task {
  id: string
  label: string
  description: string
  placeholder: string
  /** Extra fields rendered in the composer for this task. */
  options?: Array<{ name: string; label: string; choices: string[] }>
}

export const STUDY_TASKS = [
  {
    id: 'explain',
    label: 'Explain a topic',
    description: 'Clear explanations with analogies, pitched at your level.',
    placeholder: 'e.g. How does photosynthesis turn light into chemical energy?',
    options: [
      {
        name: 'level',
        label: 'Level',
        choices: ['Middle school', 'High school', 'University', 'Expert'],
      },
    ],
  },
  {
    id: 'notes',
    label: 'Revision notes',
    description: 'Condensed, skimmable notes with key terms and summaries.',
    placeholder: 'Paste your lesson text or name a topic, e.g. "The French Revolution"',
  },
  {
    id: 'quiz',
    label: 'Quiz me',
    description: 'Practice questions with an answer key at the end.',
    placeholder: 'Topic for the quiz, e.g. "Cell biology – organelles"',
    options: [
      { name: 'questions', label: 'Questions', choices: ['5', '10', '15'] },
      {
        name: 'style',
        label: 'Format',
        choices: ['Multiple choice', 'Short answer', 'True / false', 'Mixed'],
      },
    ],
  },
  {
    id: 'solve',
    label: 'Step-by-step solution',
    description: 'Worked solutions that show every step and why.',
    placeholder: 'e.g. Solve 2x² − 7x + 3 = 0',
  },
] as const satisfies ReadonlyArray<Task>

export const WRITING_TASKS = [
  {
    id: 'essay',
    label: 'Essay',
    description: 'Structured essays with a clear thesis and flow.',
    placeholder: 'Essay topic or prompt, e.g. "The impact of social media on teenagers"',
    options: [
      { name: 'length', label: 'Length', choices: ['~300 words', '~600 words', '~1000 words'] },
      { name: 'tone', label: 'Tone', choices: ['Academic', 'Persuasive', 'Narrative', 'Neutral'] },
    ],
  },
  {
    id: 'email',
    label: 'Email',
    description: 'Polished emails for any situation, ready to send.',
    placeholder: 'Who is it for and what do you need? e.g. "Ask my manager for Friday off"',
    options: [
      { name: 'tone', label: 'Tone', choices: ['Professional', 'Friendly', 'Formal', 'Apologetic'] },
    ],
  },
  {
    id: 'grammar',
    label: 'Grammar fix',
    description: 'Corrected text plus a short list of what changed.',
    placeholder: 'Paste the text you want corrected…',
  },
  {
    id: 'translate',
    label: 'Translate',
    description: 'Natural translations that keep meaning and tone.',
    placeholder: 'Paste the text to translate…',
    options: [
      {
        name: 'language',
        label: 'Into',
        choices: [
          'English',
          'Spanish',
          'French',
          'German',
          'Hindi',
          'Urdu',
          'Arabic',
          'Chinese (Simplified)',
          'Japanese',
          'Portuguese',
        ],
      },
    ],
  },
] as const satisfies ReadonlyArray<Task>

export const TASKS_BY_MODE: Record<Mode, ReadonlyArray<Task>> = {
  chat: [],
  study: STUDY_TASKS,
  writing: WRITING_TASKS,
}

export const MAX_MESSAGE_CHARS = 8000
export const MAX_MESSAGES = 60
