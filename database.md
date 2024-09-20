# fixtures

```
    id: int
    referee: string
    timezone: string
    date: date
    "timestamp": <int>, 
    "status_long": <string>,
    "status_short": <string>,
    "status_elapsed": <int|null>,
    "league_id": int
    "home_team_id": int
    "away_team_id": int
    "home_goals": int|null
    "away_goals": int|null
    "home_odds": float
    "away_odds": float
    "draw_odds": float
```

# teams


```
    id: int
    name: string
    logo: string
    winner: bool|null
```


# leagues


```
    id: int
    name: string
    country: string
    logo: string
    flag: string
    season: int
    round: string
```


