
import { Player, Match as MatchType } from "../types/tournament";

export const createInitialMatches = (players: Player[]): MatchType[] => {
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
  const matches: MatchType[] = [];
  
  for (let i = 0; i < shuffledPlayers.length; i += 2) {
    if (i + 1 < shuffledPlayers.length) {
      matches.push({
        id: `match-${i/2}`,
        player1: { ...shuffledPlayers[i], losses: 0, eliminated: false, bracket: "winners" },
        player2: { ...shuffledPlayers[i + 1], losses: 0, eliminated: false, bracket: "winners" },
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
  winners: Player[], 
  losers: Player[], 
  round: number, 
  currentBracket: "winners" | "losers"
): MatchType[] => {
  const matches: MatchType[] = [];
  const players = currentBracket === "winners" ? winners : losers;

  for (let i = 0; i < players.length; i += 2) {
    if (i + 1 < players.length) {
      matches.push({
        id: `match-${currentBracket}-${round}-${i/2}`,
        player1: players[i],
        player2: players[i + 1],
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round,
        bracket: currentBracket,
        matchNumber: i/2 + 1
      });
    }
  }
  return matches;
};

export const calculateWinPercentage = (matches: MatchType[], playerId: string): number => {
  // Filtere nur die abgeschlossenen Matches des Spielers
  const completedMatches = matches.filter(m => 
    (m.player1.id === playerId || m.player2.id === playerId) &&
    m.scores.some(s => s.player1Won !== null || s.player2Won !== null)
  );
  
  if (completedMatches.length === 0) return 0;
  
  let totalGamesPlayed = 0;
  let gamesWon = 0;
  
  completedMatches.forEach(match => {
    const isPlayer1 = match.player1.id === playerId;
    
    match.scores.forEach(score => {
      if (score.player1Won === null && score.player2Won === null) return;
      
      totalGamesPlayed++;
      if (isPlayer1 && score.player1Won) {
        gamesWon++;
      } else if (!isPlayer1 && score.player2Won) {
        gamesWon++;
      }
    });
  });
  
  console.log(`Player ${playerId} - Games played: ${totalGamesPlayed}, Games won: ${gamesWon}`);
  return (gamesWon / totalGamesPlayed) * 100;
};
