
import { Match } from "@/types/tournament";

// Hilfsfunktionen für die MatchCard-Komponente
export const getScores = (match: Match) => {
  const player1Score = match.scores.filter(s => s.player1Won).length;
  const player2Score = match.scores.filter(s => s.player2Won).length;
  
  // Bestimmen des Gewinner-Status
  const player1IsWinner = match.completed && player1Score > player2Score;
  const player2IsWinner = match.completed && player2Score > player2Score;

  return {
    player1Score,
    player2Score,
    player1IsWinner,
    player2IsWinner
  };
};

// Bestimmt die Farben basierend auf dem Bracket
export const getBracketColors = (bracket: Match["bracket"]) => {
  switch(bracket) {
    case "winners":
      return "bg-[#0e1627] border-[#0FA0CE]/30 hover:border-[#0FA0CE]";
    case "losers":
      return "bg-[#1c1917] border-yellow-900/30 hover:border-yellow-500";
    case "final":
      return "bg-[#1e173a] border-[#8B5CF6]/30 hover:border-[#8B5CF6]";
    default:
      return "bg-gray-800 border-gray-700";
  }
};
