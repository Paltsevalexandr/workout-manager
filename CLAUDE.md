@AGENTS.md

# Code style

- Always write code comments in English, even when the conversation is in Russian.

# Working agreement

- When the user asks a question ("how do I...", "why...", "is it possible...", "what if...", "should we...";
  in Russian: "как сделать", "почему", "можно ли", "а если", "стоит ли", "что лучше"),
  answer it and stop. Do not edit or create files, and do not run commands that change state
  (migrations, resets, installs, database writes). Reading files and read-only checks are fine
  when they are needed for a correct answer.
- Change code only when the user explicitly asks ("do it", "fix", "add", "make the change";
  in Russian: "делай", "исправь", "добавь", "примени", "измени").
  If a question implies a change, describe the change and ask before making it.
- Make edits one at a time with the Edit tool, so each diff can be reviewed in the editor.
  Don't batch unrelated edits or rewrite whole files.
- Never run migrations, database resets or other commands against the real database without
  explicit approval.

