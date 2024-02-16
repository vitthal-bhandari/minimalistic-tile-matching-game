# Minimalist Tile Matching Game

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) available at the URL [hyway-assignment.vercel.app/](https://hyway-assignment.vercel.app/).

I have implemented a minimalist version of the tile-matching game to create a simple game for this assignment. In this game, you have 30 seconds to match pairs of the same tiles in a 4x4 grid. That's it. Those are the rules. 

## Scoring rules

You get 100 points for each pair correctly matched. If finished before timeout, you get 100x points for the remaining seconds. For example, if you finished 10 seconds early, your score would be 800 (for matching all 8 pairs correctly) + 100x10 (for the 10 seconds remaining) = 1800.

## Tech-stack

1. Next.JS - which is a React-based framework
2. Material UI - for UI components, layout, and icons
3. Redux - for managing scores in a global state

The project has been developed in TypeScript.

## How to run?

You can clone the repo and set it up at localhost:3000/ using 2 simple commands -
```
npm install
npm run dev
```

## Possible expansions
- Grid can be expanded from 4x4 to 8x8 or 16x16 with timed play for increasing difficulty
- User can be allowed to choose number of open tiles at any moment to relax the level of difficulty
