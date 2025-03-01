
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
  
  if (player1Wins + player2Wins === 3) { // Nur wenn alle 3 Spiele gespielt wurden
    const winner = player1Wins > player2Wins ? match.player1 : match.player2;
    const loser = player1Wins > player2Wins ? match.player2 : match.player1;
    
    // Entferne zuerst alle doppelten Matches mit der gleichen ID
    const uniqueMatches = matches.filter(m => m.id !== match.id);
    // Füge dann das aktuelle Match hinzu
    const updatedMatches = [...uniqueMatches, { ...match, completed: true }];
    
    return players.map(p => {
      if (p.id === loser.id) {
        const newLosses = p.losses + 1;
        
        // Ein verlorenes Spiel verschiebt den Spieler ins Loser-Bracket
        // Zwei verlorene Spiele führen zur Elimination
        const isEliminated = newLosses >= 2;
        const newBracket = isEliminated ? p.bracket : "losers";
        
        // Sammle alle Matches des Spielers
        const playerMatches = updatedMatches.filter(m => 
          m.player1.id === p.id || m.player2.id === p.id
        );
        
        return {
          ...p,
          losses: newLosses,
          eliminated: isEliminated,
          bracket: newBracket,
          winPercentage: calculateWinPercentage(updatedMatches, p.id),
          matches: playerMatches // Speichere die Matches des Spielers
        };
      }
      if (p.id === winner.id) {
        // Sammle alle Matches des Spielers
        const playerMatches = updatedMatches.filter(m => 
          m.player1.id === p.id || m.player2.id === p.id
        );
        
        // Der Winner behält sein Bracket bei
        return {
          ...p,
          winPercentage: calculateWinPercentage(updatedMatches, p.id),
          matches: playerMatches // Speichere die Matches des Spielers
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
