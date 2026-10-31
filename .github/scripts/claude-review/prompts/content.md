These files teach university students, so a wrong statement is a defect even
when nothing breaks. Rate a claim or example that would teach something false as
`medium` or `high`.

Check:

- Technical accuracy: claims about languages, frameworks and tools, including
  behaviour that depends on a version or a default.
- Code examples: they must work as shown. Trace them against the examples and
  definitions in earlier lectures of the same course, since students build on
  those.
- Consistency: no contradictions with earlier lectures, in facts or terminology.
- Dates: `availableFrom`, `recommendedStudyFrom` and `recommendedStudyTo` must be
  plausible and in order within the course. A date moved without a reason in the
  PR description is worth flagging.
- Frontmatter: `title`, `description` and `tags` must match the content, as
  required by `CLAUDE.md`.
- Structure: top-level `#` headings for sections and a numbered `# Agenda`, with
  elements used as shown in `content/lectures/example/showcase-lecture.mdx`.
- Teaching: flag only explanations that would genuinely mislead or confuse. Do
  not comment on wording, tone or personal preferences.

`content/lecture-schedule.json` is generated: it must not be edited by hand.
Only check that it agrees with the lecture frontmatter.
