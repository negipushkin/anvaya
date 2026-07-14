# Adding a story

1. Copy `stories/story.template.json` to `stories/<story-id>.json`.
2. Assign a unique ID such as `pancha-002` and keep every chapter ID in the form `<story-id>-c01`, `<story-id>-c02`, and so on.
3. Add the exact narration in `chapters[].text`.
4. Place each chapter image at the path named by `chapters[].image.src`. The app shows the image first and the chapter text immediately below it.
5. Add an accessible description in `chapters[].image.alt`.
6. Add pre-rendered narration audio when it is ready; the `audio` block is optional while a story is in draft.
7. Complete the Parent Card and at least one optional mission.
8. Set `status` to `in_review`, then `published` only after editorial review.

`story.schema.json` is the contract for all story JSON files. It locks the eight-value taxonomy, the parent-card requirements, and the chapter text/image structure.
