
import { Player, Match as MatchType } from "../types/tournament";
import { createNextRoundMatches } from "./tournamentUtils";

export const processWinnersBracket = (
  match: MatchType,
  winnerBracketMatches: MatchType[],
  updatedPlayers: Player[],
  allMatches: MatchType[]
): MatchType[] => {
  const results = winnerBracketMatches.reduce<{ winners: Player[]; losers: Player[] }>(
    (acc, m) => {
      const wins1 = m.scores.filter(s => s.player1Won).length;
      const winner = wins1 > 1 ? m.player1 : m.player2;
      const loser = wins1 > 1 ? m.player2 : m.player1;
      
      const updatedWinner = updatedPlayers.find(p => p.id === winner.id);
      const updatedLoser = updatedPlayers.find(p => p.id === loser.id);
      
      if (updatedWinner && !updatedWinner.eliminated) {
        acc.winners.push(updatedWinner);
      }
      if (updatedLoser && !updatedLoser.eliminated) {
        acc.losers.push(updatedLoser);
      }
      
      return acc;
    },
    { winners: [], losers: [] }
  );

  const newMatches: MatchType[] = [...allMatches];

  if (results.winners.length > 1) {
    const nextWinnersMatches = createNextRoundMatches(
      results.winners,
      [],
      match.round + 1,
      "winners"
    );
    newMatches.push(...nextWinnersMatches);
  }

  if (results.losers.length > 1) {
    const nextLosersMatches = createNextRoundMatches(
      results.losers,
      [],
      match.round,
      "losers"
    );
    newMatches.push(...nextLosersMatches);
    console.log('Generated Losers Matches:', nextLosersMatches);
  }

  if (results.winners.length === 1) {
    const finalMatch: MatchType = {
      id: `final-1`,
      player1: results.winners[0],
      player2: { 
        id: "tbd", 
        firstName: "TBD", 
        lastName: "", 
        winPercentage: 0, 
        losses: 0, 
        eliminated: false, 
        bracket: "losers" 
      },
      scores: Array(3).fill({ player1Won: null, player2Won: null }),
      completed: false,
      round: match.round + 1,
      bracket: "final",
      matchNumber: 1
    };
    newMatches.push(finalMatch);
  }

  return newMatches;
};

export const processLosersBracket = (
  match: MatchType,
  loserBracketMatches: MatchType[],
  updatedPlayers: Player[],
  allMatches: MatchType[]
): MatchType[] => {
  const loserResults = loserBracketMatches.reduce<Player[]>((acc, m) => {
    const wins1 = m.scores.filter(s => s.player1Won).length;
    const winner = wins1 > 1 ? m.player1 : m.player2;
    const updatedWinner = updatedPlayers.find(p => p.id === winner.id);
    
    if (updatedWinner && !updatedWinner.eliminated) {
      acc.push(updatedWinner);
    }
    
    return acc;
  }, []);

  const newMatches = [...allMatches];

  if (loserResults.length > 1) {
    const nextLosersMatches = createNextRoundMatches(
      loserResults,
      [],
      match.round + 1,
      "losers"
    );
    newMatches.push(...nextLosersMatches);
    console.log('Generated Next Losers Round:', nextLosersMatches);
  }

  return newMatches;
};
