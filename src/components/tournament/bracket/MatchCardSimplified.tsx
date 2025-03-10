
import { Match } from "@/types/tournament";
import { cn } from "@/lib/utils";
import { getBracketColors } from "./MatchCardUtils";

interface MatchCardSimplifiedProps {
  match: Match;
  isCurrentRound: boolean;
  onMatchClick?: (matchId: string) => void;
}

export const MatchCardSimplified = ({ 
  match, 
  isCurrentRound,
  onMatchClick
}: MatchCardSimplifiedProps) => {
  const player1IsWinner = match.completed && 
    match.scores.filter(s => s.player1Won).length > match.scores.filter(s => s.player2Won).length;
  const player2IsWinner = match.completed && 
    match.scores.filter(s => s.player2Won).length > match.scores.filter(s => s.player1Won).length;

  // Verwenden der gemeinsamen getBracketColors Funktion aus MatchCardUtils
  const bracketColors = getBracketColors(match.bracket);

  // Farbe für die Automaten-Anzeige
  const getMachineColor = () => {
    switch(match.bracket) {
      case "winners":
        return "text-[#0FA0CE]";
      case "losers":
        return "text-[#FFD700]";
      case "final":
        return "text-[#8B5CF6]";
      default:
        return "text-blue-500";
    }
  };

  const handleClick = () => {
    if (onMatchClick && isCurrentRound && !match.completed && !match.machineNumber) {
      onMatchClick(match.id);
    }
  };

  return (
    <div 
      className={cn(
        "relative border rounded p-2 transition-colors cursor-pointer",
        bracketColors,
        isCurrentRound && "ring-1 ring-blue-500",
        "text-xs w-full"
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span className={cn(
            "text-xs font-medium",
            match.player1.hasBye ? "text-green-400" : // Freilos-Spieler immer grün
            player1IsWinner ? "text-[#0FA0CE]" : 
            match.player1.bracket === "losers" ? "text-[#FFD700]" : 
            match.player1.eliminated ? "text-red-500" : // Rot für eliminierte Spieler
            match.player1.bracket === "winners" ? "text-[#0FA0CE]" : // Blau für Winner-Bracket
            "text-white"
          )}>
            {match.player1.firstName} {match.player1.lastName}
            {match.player1.hasBye && " (Freilos)"}
          </span>
          {match.player1.team && (
            <span className={cn(
              "text-[10px]",
              match.player1.hasBye ? "text-green-400/70" : // Freilos-Team auch grün
              player1IsWinner ? "text-[#0FA0CE]/70" :
              match.player1.bracket === "losers" ? "text-[#FFD700]/70" :
              match.player1.eliminated ? "text-red-500/70" :
              match.player1.bracket === "winners" ? "text-[#0FA0CE]/70" : // Blau für Winner-Bracket Teams
              "text-gray-400"
            )}>
              {match.player1.team}
            </span>
          )}
        </div>
        
        <div className="border-t border-gray-700 my-1" />
        
        <div className="flex justify-between items-center">
          <span className={cn(
            "text-xs font-medium",
            match.player2.hasBye ? "text-green-400" : // Freilos-Spieler immer grün
            player2IsWinner ? "text-[#0FA0CE]" : 
            match.player2.bracket === "losers" ? "text-[#FFD700]" : 
            match.player2.eliminated ? "text-red-500" : // Rot für eliminierte Spieler
            match.player2.bracket === "winners" ? "text-[#0FA0CE]" : // Blau für Winner-Bracket
            "text-white"
          )}>
            {match.player2.firstName} {match.player2.lastName}
            {match.player2.hasBye && " (Freilos)"}
          </span>
          {match.player2.team && (
            <span className={cn(
              "text-[10px]",
              match.player2.hasBye ? "text-green-400/70" : // Freilos-Team auch grün
              player2IsWinner ? "text-[#0FA0CE]/70" :
              match.player2.bracket === "losers" ? "text-[#FFD700]/70" :
              match.player2.eliminated ? "text-red-500/70" :
              match.player2.bracket === "winners" ? "text-[#0FA0CE]/70" : // Blau für Winner-Bracket Teams
              "text-gray-400"
            )}>
              {match.player2.team}
            </span>
          )}
        </div>
      </div>
      
      {match.machineNumber && !match.completed && (
        <div className={cn("mt-1 text-xs text-center", getMachineColor())}>
          Automat {match.machineNumber}
        </div>
      )}
      
      {match.completed && (
        <div className="mt-1 text-xs text-center text-gray-500">
          Spiel beendet
        </div>
      )}
    </div>
  );
};
