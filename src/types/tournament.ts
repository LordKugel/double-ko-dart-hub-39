
export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  team?: string;
  winPercentage: number;
  losses: number;
  eliminated: boolean;
  bracket: "winners" | "losers" | null;
  matches: Match[]; // Neue Property für die Matches des Spielers
}

export interface Match {
  id: string;
  player1: Player;
  player2: Player;
  scores: Array<{
    player1Won: boolean | null;
    player2Won: boolean | null;
  }>;
  completed: boolean;
  countdownStarted: boolean;
  round: number;
  bracket: "winners" | "losers" | "final";
  matchNumber: number;
}

export interface Tournament {
  id: string;
  name: string;
  players: Player[];
  matches: Match[];
  started: boolean;
  completed: boolean;
  currentRound: number;
  roundStarted: boolean;
  winnersBracketMatches: Match[];
  losersBracketMatches: Match[];
  finalMatches: Match[];
}
