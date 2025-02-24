
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
  
  const winner = player1Wins > player2Wins ? match.player1 : match.player2;
  const loser = player1Wins > player2Wins ? match.player2 : match.player1;
  
  return players.map(p => {
    if (p.id === loser.id) {
      const newLosses = p.losses + 1;
      return {
        ...p,
        losses: newLosses,
        eliminated: newLosses >= 2,
        bracket: newLosses === 1 ? "losers" : p.bracket,
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
};
