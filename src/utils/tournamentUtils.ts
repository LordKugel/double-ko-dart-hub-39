
import { Match, Player } from "../types/tournament";

export const createInitialMatches = (players: Player[]): Match[] => {
  const matches: Match[] = [];
  // Wir nehmen bereits gemischte Spieler, paaren sie einfach
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
  
  // Zufällig mischen der Spieler für die nächste Runde
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < shuffledPlayers.length; i += 2) {
    if (i + 1 < shuffledPlayers.length) {
      matches.push({
        id: `match-${bracket}-${round}-${i/2 + 1}`,
        player1: shuffledPlayers[i],
        player2: shuffledPlayers[i + 1],
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

  // Alle Matches des Spielers sammeln, unabhängig vom completed Status
  const playerMatches = matches.filter(match => 
    match.player1.id === playerId || match.player2.id === playerId
  );

  playerMatches.forEach(match => {
    const isPlayer1 = match.player1.id === playerId;
    
    match.scores.forEach(score => {
      // Nur gespielte Spiele zählen
      if (score.player1Won === null) return;
      
      // Gewinne zählen
      if (isPlayer1) {
        if (score.player1Won) totalWins++;
      } else {
        if (score.player2Won) totalWins++;
      }
      
      // Gespielte Spiele zählen
      totalGames++;
    });
  });

  // Debug logs für bessere Nachvollziehbarkeit
  console.log(`Player ${playerId} stats:`, {
    totalWins,
    totalGames,
    matches: playerMatches.map(m => ({
      id: m.id,
      bracket: m.bracket,
      scores: m.scores,
      completed: m.completed
    }))
  });

  if (totalGames === 0) return 0;
  return (totalWins / totalGames) * 100;
};
