
export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  team?: string;
  winPercentage: number;
  group?: "Premium" | "Professional";
  eliminated?: boolean;
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
}

export interface Tournament {
  id: string;
  name: string;
  players: Player[];
  matches: Match[];
  started: boolean;
  completed: boolean;
  currentRound: number;
}
