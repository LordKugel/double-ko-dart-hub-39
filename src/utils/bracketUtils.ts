
import { Match, Player } from "../types/tournament";

export const processWinnersBracket = (players: Player[], round: number): Match[] => {
  const matches: Match[] = [];
  const activePlayers = players.filter(p => !p.eliminated && p.bracket === "winners");
  
  for (let i = 0; i < activePlayers.length; i += 2) {
    if (i + 1 < activePlayers.length) {
      matches.push({
        id: `winners-${round}-${i/2}`,
        player1: activePlayers[i],
        player2: activePlayers[i + 1],
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        countdownStarted: false,
        round,
        bracket: "winners",
        matchNumber: i/2 + 1
      });
    }
  }
  
  return matches;
};

export const processLosersBracket = (players: Player[], round: number): Match[] => {
  const matches: Match[] = [];
  const activePlayers = players.filter(p => !p.eliminated && p.bracket === "losers");
  
  for (let i = 0; i < activePlayers.length; i += 2) {
    if (i + 1 < activePlayers.length) {
      matches.push({
        id: `losers-${round}-${i/2}`,
        player1: activePlayers[i],
        player2: activePlayers[i + 1],
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        countdownStarted: false,
        round,
        bracket: "losers",
        matchNumber: i/2 + 1
      });
    }
  }
  
  return matches;
};

export const createFinalMatch = (winner1: Player, winner2: Player, round: number): Match => {
  return {
    id: `final-${round}`,
    player1: winner1,
    player2: { ...winner2, bracket: "losers" },
    scores: Array(3).fill({ player1Won: null, player2Won: null }),
    completed: false,
    countdownStarted: false,
    round,
    bracket: "final",
    matchNumber: 1
  };
};
