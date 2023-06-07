# Hookage

Hookage makes it easy to run git hooks

<img src="../../img/hookage-commit.gif">

Add it to your repository with:

```
npx create-hookage@latest
```

## The problem

To ensure high code quality, you use automated testing, linting, and other tools.

Automated checks on the CI server are helpful, but have you ever pushed code and have your pipeline fail because of some small formatting error?

Wouldn't it be good if you could also run the same checks locally without manual effort before pushing code changes?

## The solution

Git has a built-in hook system that allows you to run custom scripts on pre-commit, pre-push, and other events.

This project provides a simplified way to configure and run these hooks. It is built to make configuration as easy as possible, while also adding some neat features.

- With a simple syntax you can run tasks in parallel or sequentially.
- A beautiful CLI makes it easy to see what is happening.

## Configuration

In package.json, define your hooks:

```
  "hookage": {
    "pre-commit": [
      "npm run affected:lint",
      "npm run affected:format"
    ],
    "pre-push": [
      "npm run affected:test"
    ]
  }
```

This will run `npm run affected:lint` and then `npm run affected:format` just before the changes are commited to git.

It will run `npm run affected:test` just before changes are pushed.
