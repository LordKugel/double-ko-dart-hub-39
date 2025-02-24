
export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  team?: string;
  winPercentage: number;
  losses: number; // Anzahl der Niederlagen
  eliminated: boolean;
  bracket: "winners" | "losers" | null;
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
  round: number;
  bracket: "winners" | "losers" | "final";
  matchNumber: number; // Zur Identifizierung der Position im Bracket
}

export interface Tournament {
  id: string;
  name: string;
  players: Player[];
  matches: Match[];
  started: boolean;
  completed: boolean;
  currentRound: number;
  winnersBracketMatches: Match[];
  losersBracketMatches: Match[];
  finalMatches: Match[];
}
