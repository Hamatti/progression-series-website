# Turku Cardsports Pokemon TCG Progression Series website

## Add a new series

Add an entry to `_data/series.json` with

```json
{
  "name": "Set name (eg. Scarlet & Violet)",
  "id": "ID (must match scores filename without extension,  eg. svi)",
  "ongoing": true
}
```

Create a new scores file `_data/[id].score`.

## Add a new match

Add a new line to `_data/[id].score` file with format

```plain
player A:player B:player A's score:player B's score
```

## Development

Start a development server

```shell
npm run dev
```

## Deployment

This website is automatically deployed to [https://progression-series.hamatti.org/](https://progression-series.hamatti.org/) when new commits are submitted to `main` branch. Hence, it's enough to edit a score file and commit to trigger a new build.
