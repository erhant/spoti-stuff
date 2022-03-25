# Resources

These are places that I took help from:

- Followed this [guide](https://blog.jarrodwatts.com/nextjs-eslint-prettier-husky) for code formatting & linting.
- Used [this](https://stackoverflow.com/a/64517088)
- [this](https://stackoverflow.com/questions/53715465/can-i-set-state-inside-a-useeffect-hook)
- [this](https://stackoverflow.com/a/66071205)
- [this](https://stackoverflow.com/a/51432223)
- [here](https://levelup.gitconnected.com/how-to-build-a-spotify-player-with-react-in-15-minutes-7e01991bc4b6) for some good reference.
- [this](https://learn.co/lessons/react-updating-state) for updating states.
- [Lorem Picsum](https://picsum.photos/) for placeholder images.

## Self-note

For some reason, doing

```jsx
let res;
res = await fetch("api...");
```

does not cause TypeScript errors, while

```jsx
let res = await fetch("api...");
```

does!
