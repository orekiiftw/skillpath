# Skillpath courses section

A Framer code component that renders the courses section of the Skillpath
landing page. It fetches live course data and the viewer's country code,
then renders a responsive grid of course cards.

## Files

- `SkillpathCourses.tsx` — the Framer code component. Renders the four
  states (loading, error, empty, success), the course grid, and embeds its
  own styles as a `<style>` block so Framer needs no separate CSS file.
- `api.ts` — the two fetch functions. All network code lives here.
- `price.ts` — turns paise and cents into formatted prices. All currency
  math lives here.

## Adding it to Framer

1. Create a free Framer project.
2. Open the Code tab in the Assets panel, create **three** new code files,
   and paste each file with the same filenames so the imports work:
   `api.ts`, `price.ts`, `SkillpathCourses.tsx`. The styles are embedded
   inside the component, so no `.css` file is needed (Framer cannot create
   plain CSS files).
3. On the canvas, insert a Code Component and pick `SkillpathCourses`.
4. Select it to see the two property controls: Section title and Accent color.

## The four states

- Loading: six shimmering skeleton cards.
- Error: a friendly panel with a Try again button. The API fails roughly
  1 in 3 requests with a 404 or 500.
- Empty: a friendly panel with a Try again button.
- Success: the grid of course cards.

## Decisions

- If the country call fails but courses load, cards show both currencies
  (`₹1,999.00 / $39.99`) with a short note. Showing one possibly-wrong
  currency felt worse than showing both.
- The extra card field is `mainCategory`, shown as a chip above the name.
- Skeleton loaders and a retry button are included because "nothing
  happens while loading" is listed as an instant fail.
- Search, sort by price and the refundable badge are planned next.

## Testing the states

The API is live and flaky on purpose, so refreshing the preview shows
loading, success and error naturally. To force a state, temporarily edit
`api.ts`:

- Point `COURSES_URL` at a nonsense path to see the error state.
- Replace `return response.json()` in `fetchCourses` with `return []` to
  see the empty state.

## Local preview and checks (not part of the Framer project)

One `package.json` at the root covers all local tooling. The three
submission files are `SkillpathCourses.tsx`, `api.ts` and `price.ts`.
Everything else at the root is for previewing and checking
the component before pasting it into Framer.

```sh
npm install
npm run dev          browser preview at http://localhost:5173
npm run typecheck    strict TypeScript check
```

`framer-stub.ts` stands in for the `framer` import locally, since
`addPropertyControls` and `ControlType` only exist inside Framer.
`types.d.ts` declares the `framer` module for TypeScript.

## Hero and footer

These are built with native Framer layers, not code. Hero: headline text,
one subheadline, one Button. Footer: three text links and a copyright line.
