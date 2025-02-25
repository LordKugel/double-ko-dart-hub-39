
import { Player, Match as MatchType } from "../types/tournament";
import { calculateWinPercentage } from "./tournamentUtils";

export const updateMatchScores = (
  match: MatchType,
  gameIndex: number,
  player1Won: boolean
): MatchType => {
  const updatedMatch = { ...match };
  updatedMatch.scores[gameIndex] = {
    player1Won: player1Won,
    player2Won: !player1Won
  };
  return updatedMatch;
};

export const updatePlayersAfterMatch = (
  match: MatchType,
  players: Player[],
  matches: MatchType[]
): Player[] => {
  const player1Wins = match.scores.filter(s => s.player1Won).length;
  const player2Wins = match.scores.filter(s => s.player2Won).length;
  
  if (player1Wins + player2Wins === 3) {
    const winner = player1Wins > player2Wins ? match.player1 : match.player2;
    const loser = player1Wins > player2Wins ? match.player2 : match.player1;
    
    return players.map(p => {
      if (p.id === loser.id) {
        const newLosses = p.losses + 1;
        const isEliminated = p.bracket === "losers" || newLosses >= 2;
        
        return {
          ...p,
          losses: newLosses,
          eliminated: isEliminated,
          bracket: newLosses >= 2 ? "losers" : p.bracket,
          winPercentage: calculateWinPercentage(matches, p.id)
        };
      }
      if (p.id === winner.id) {
        return {
          ...p,
          winPercentage: calculateWinPercentage(matches, p.id)
        };
      }
      return p;
    });
  }
  return players;
};

export const isMatchComplete = (match: MatchType): boolean => {
  return match.scores.every(score => score.player1Won !== null && score.player2Won !== null);
};

export const isRoundComplete = (matches: MatchType[], round: number): boolean => {
  const roundMatches = matches.filter(m => m.round === round);
  return roundMatches.every(match => isMatchComplete(match));
};
