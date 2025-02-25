
import { Match, Player } from "../types/tournament";

export const createInitialMatches = (players: Player[]): Match[] => {
  const matches: Match[] = [];
  for (let i = 0; i < players.length; i += 2) {
    if (i + 1 < players.length) {
      matches.push({
        id: `match-${i/2 + 1}`,
        player1: players[i],
        player2: players[i + 1],
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round: 1,
        bracket: "winners",
        matchNumber: i/2 + 1
      });
    }
  }
  return matches;
};

export const createNextRoundMatches = (
  players: Player[],
  previousMatches: Match[],
  round: number,
  bracket: "winners" | "losers"
): Match[] => {
  const matches: Match[] = [];
  for (let i = 0; i < players.length; i += 2) {
    if (i + 1 < players.length) {
      matches.push({
        id: `match-${bracket}-${round}-${i/2 + 1}`,
        player1: players[i],
        player2: players[i + 1],
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round,
        bracket,
        matchNumber: i/2 + 1
      });
    }
  }
  return matches;
};

export const calculateWinPercentage = (matches: Match[], playerId: string): number => {
  const playerMatches = matches.filter(
    match => (match.player1.id === playerId || match.player2.id === playerId) && match.completed
  );
  
  if (playerMatches.length === 0) return 0;

  const wins = playerMatches.reduce((acc, match) => {
    const isPlayer1 = match.player1.id === playerId;
    const playerWins = match.scores.filter(score => 
      isPlayer1 ? score.player1Won : score.player2Won
    ).length;
    return acc + playerWins;
  }, 0);

  const totalGames = playerMatches.reduce((acc, match) => 
    acc + match.scores.filter(score => score.player1Won !== null).length, 0
  );

  return totalGames > 0 ? (wins / totalGames) * 100 : 0;
};
