
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
        countdownStarted: false,
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
        countdownStarted: false,
        round,
        bracket,
        matchNumber: i/2 + 1
      });
    }
  }
  return matches;
};

export const calculateWinPercentage = (matches: Match[], playerId: string): number => {
  let totalWins = 0;
  let totalGames = 0;

  matches.forEach(match => {
    const isPlayer1 = match.player1.id === playerId;
    const isPlayer2 = match.player2.id === playerId;

    if (!isPlayer1 && !isPlayer2) return;

    match.scores.forEach(score => {
      if (score.player1Won === null) return;

      if (isPlayer1 && score.player1Won) totalWins++;
      if (isPlayer2 && score.player2Won) totalWins++;
      totalGames++;
    });
  });

  if (totalGames === 0) return 0;
  return (totalWins / totalGames) * 100;
};
