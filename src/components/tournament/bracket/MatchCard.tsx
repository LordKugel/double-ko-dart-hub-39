
import { Match as MatchType, Machine } from "@/types/tournament";
import { cn } from "@/lib/utils";
import { PlayerInfo } from "./PlayerInfo";
import { MatchCardSimplified } from "./MatchCardSimplified";
import { MatchCardContextMenu } from "./MatchCardContextMenu";
import { getScores } from "./MatchCardUtils";

interface MatchCardProps {
  match: MatchType;
  isCurrentRound: boolean;
  verticalPosition: number;
  previousMatches: MatchType[];
  onMatchClick?: (matchId: string) => void;
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
  machines?: Machine[];
  onAssignMatch?: (machineId: number, matchId: string) => void;
  hideScoreControls?: boolean;
  simplifiedView?: boolean;
}

export const MatchCard = ({ 
  match, 
  isCurrentRound, 
  verticalPosition,
  previousMatches,
  onMatchClick,
  onScoreUpdate,
  machines = [],
  onAssignMatch,
  hideScoreControls = false,
  simplifiedView = false
}: MatchCardProps) => {
  // Vereinfachte Darstellung für frühere oder zukünftige Runden
  if (simplifiedView) {
    return (
      <MatchCardSimplified 
        match={match}
        isCurrentRound={isCurrentRound}
        onMatchClick={onMatchClick}
      />
    );
  }

  const { player1Score, player2Score, player1IsWinner, player2IsWinner } = getScores(match);
  
  const handleScoreUpdate = (index: number, player1Won: boolean) => {
    // Wenn die Steuerelemente ausgeblendet werden sollen oder das Match einem Automaten zugewiesen ist,
    // erlauben wir keine Aktualisierung der Punktzahl über diese Komponente
    if (hideScoreControls || match.machineNumber) return;
    onScoreUpdate?.(match.id, index, player1Won);
  };

  const handleClick = () => {
    if (onMatchClick && isCurrentRound && !match.completed && !match.machineNumber) {
      onMatchClick(match.id);
    }
  };

  // Bestimme die Farben basierend auf dem Bracket
  const getBracketColors = () => {
    switch(match.bracket) {
      case "winners":
        return "border-[#0FA0CE]";
      case "losers":
        return "border-[#FFD700]";
      case "final":
        return "border-[#8B5CF6]";
      default:
        return "border-gray-700";
    }
  };

  const getBracketBackgroundColors = () => {
    switch(match.bracket) {
      case "winners":
        return "bg-[#0e1627]";
      case "losers":
        return "bg-[#1c1917]";
      case "final":
        return "bg-[#1e173a]";
      default:
        return "bg-gray-800";
    }
  };

  // Normale vollständige Darstellung
  const cardContent = (
    <div 
      className={cn(
        "relative border rounded p-2 transition-colors cursor-pointer",
        getBracketBackgroundColors(),
        getBracketColors(),
        isCurrentRound && "ring-1 ring-blue-500",
        "text-xs w-full"
      )}
      onClick={handleClick}
    >
      <PlayerInfo
        player={match.player1}
        score={player1Score}
        isWinner={player1IsWinner}
        isCurrentRound={isCurrentRound}
        scores={match.scores}
        isPlayer1={true}
        onScoreUpdate={handleScoreUpdate}
        completed={match.completed}
        showScoreControls={!hideScoreControls && !match.machineNumber}
        isMatchCompleted={match.completed}
        isFinalWinner={player1IsWinner}
      />
      <div className="my-1 border-t border-gray-700" />
      <PlayerInfo
        player={match.player2}
        score={player2Score}
        isWinner={player2IsWinner}
        isCurrentRound={isCurrentRound}
        scores={match.scores}
        isPlayer1={false}
        onScoreUpdate={handleScoreUpdate}
        completed={match.completed}
        showScoreControls={!hideScoreControls && !match.machineNumber}
        isMatchCompleted={match.completed}
        isFinalWinner={player2IsWinner}
      />
      {match.completed && (
        <div className="mt-1 text-xs text-gray-500 text-center">
          Spiel beendet
        </div>
      )}
      {match.machineNumber && !match.completed && (
        <div className="mt-1 text-xs text-blue-500 text-center">
          Automat {match.machineNumber}
        </div>
      )}
    </div>
  );

  return (
    <MatchCardContextMenu
      match={match}
      isCurrentRound={isCurrentRound}
      machines={machines}
      onAssignMatch={onAssignMatch}
    >
      {cardContent}
    </MatchCardContextMenu>
  );
};
