// Dummy NBA 3-Point data for development
export interface PlayerStats {
  id: string;
  name: string;
  team: string;
  position: string;
  season: string;
  gamesPlayed: number;
  threePtAttempts: number;
  threePtMade: number;
  threePtPercentage: number;
}

export interface TeamStats {
  id: string;
  name: string;
  season: string;
  threePtAttempts: number;
  threePtMade: number;
  threePtPercentage: number;
}

export const seasons = [
  "2023-24", "2022-23", "2021-22", "2020-21", "2019-20", 
  "2018-19", "2017-18", "2016-17", "2015-16", "2014-15"
];

export const teams = [
  "Golden State Warriors", "Boston Celtics", "Los Angeles Lakers", 
  "Milwaukee Bucks", "Phoenix Suns", "Miami Heat", "Philadelphia 76ers",
  "Denver Nuggets", "Brooklyn Nets", "Dallas Mavericks"
];

export const positions = ["PG", "SG", "SF", "PF", "C"];

// Sample player data
export const playerStats: PlayerStats[] = [
  {
    id: "curry-stephen",
    name: "Stephen Curry",
    team: "Golden State Warriors",
    position: "PG",
    season: "2023-24",
    gamesPlayed: 74,
    threePtAttempts: 894,
    threePtMade: 357,
    threePtPercentage: 40.0
  },
  {
    id: "tatum-jayson",
    name: "Jayson Tatum",
    team: "Boston Celtics",
    position: "SF",
    season: "2023-24",
    gamesPlayed: 74,
    threePtAttempts: 786,
    threePtMade: 279,
    threePtPercentage: 35.5
  },
  {
    id: "lillard-damian",
    name: "Damian Lillard",
    team: "Milwaukee Bucks",
    position: "PG",
    season: "2023-24",
    gamesPlayed: 73,
    threePtAttempts: 756,
    threePtMade: 279,
    threePtPercentage: 36.9
  },
  {
    id: "edwards-anthony",
    name: "Anthony Edwards",
    team: "Minnesota Timberwolves",
    position: "SG",
    season: "2023-24",
    gamesPlayed: 79,
    threePtAttempts: 684,
    threePtMade: 252,
    threePtPercentage: 36.8
  },
  {
    id: "curry-stephen-22",
    name: "Stephen Curry",
    team: "Golden State Warriors",
    position: "PG",
    season: "2022-23",
    gamesPlayed: 56,
    threePtAttempts: 653,
    threePtMade: 273,
    threePtPercentage: 41.8
  }
];

// Sample team data
export const teamStats: TeamStats[] = [
  {
    id: "warriors-2024",
    name: "Golden State Warriors",
    season: "2023-24",
    threePtAttempts: 3387,
    threePtMade: 1264,
    threePtPercentage: 37.3
  },
  {
    id: "celtics-2024",
    name: "Boston Celtics",
    season: "2023-24",
    threePtAttempts: 3395,
    threePtMade: 1340,
    threePtPercentage: 39.5
  },
  {
    id: "bucks-2024",
    name: "Milwaukee Bucks",
    season: "2023-24",
    threePtAttempts: 2890,
    threePtMade: 1054,
    threePtPercentage: 36.5
  }
];

// Historical revolution timeline events
export const timelineEvents = [
  {
    year: 1979,
    title: "3-Point Line Introduced",
    description: "NBA adopts the 3-point line at 23'9\" from the basket"
  },
  {
    year: 1994,
    title: "Line Moved Closer",
    description: "3-point line shortened to 22' to increase scoring"
  },
  {
    year: 1997,
    title: "Line Moved Back",
    description: "3-point line returned to original 23'9\" distance"
  },
  {
    year: 2009,
    title: "Analytics Revolution Begins",
    description: "Teams start emphasizing 3-point shots over mid-range"
  },
  {
    year: 2015,
    title: "Golden State Championship",
    description: "Warriors win title with revolutionary 3-point heavy offense"
  },
  {
    year: 2018,
    title: "Volume Explosion",
    description: "NBA teams attempt over 29 three-pointers per game on average"
  }
];