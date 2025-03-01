
import { Match as MatchType, Machine } from "@/types/tournament";
import { cn } from "@/lib/utils";
import { PlayerInfo } from "./PlayerInfo";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { toast } from "@/components/ui/use-toast";

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
  const player1Score = match.scores.filter(s => s.player1Won).length;
  const player2Score = match.scores.filter(s => s.player2Won).length;
  
  // Bestimmen des Gewinner-Status
  const player1IsWinner = match.completed && player1Score > player2Score;
  const player2IsWinner = match.completed && player2Score > player1Score;

  const handleScoreUpdate = (index: number, player1Won: boolean) => {
    // Wenn die Steuerelemente ausgeblendet werden sollen oder das Match einem Automaten zugewiesen ist,
    // erlauben wir keine Aktualisierung der Punktzahl über diese Komponente
    if (hideScoreControls || match.machineNumber) return;
    onScoreUpdate?.(match.id, index, player1Won);
  };

  const handleAssignToMachine = (machineId: number) => {
    if (onAssignMatch) {
      onAssignMatch(machineId, match.id);
      toast({
        title: "Match zugewiesen",
        description: `Match wurde Automat ${machineId} zugewiesen`
      });
    }
  };

  // Bestimme die Farben basierend auf dem Bracket
  const getBracketColors = () => {
    switch(match.bracket) {
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

  // Filtere verfügbare Automaten (nicht belegt und nicht außer Betrieb)
  const availableMachines = machines.filter(m => !m.isOutOfOrder && !m.currentMatchId);

  const handleClick = () => {
    if (onMatchClick && isCurrentRound && !match.completed && !match.machineNumber) {
      onMatchClick(match.id);
    }
  };

  // Vereinfachte Darstellung für frühere oder zukünftige Runden - nur Spielername und Team
  if (simplifiedView) {
    return (
      <div 
        className={cn(
          "relative border rounded p-2 transition-colors cursor-pointer",
          getBracketColors(),
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
              match.player1.bracket === "losers" ? "text-[#FEF7CD]" : 
              match.player1.eliminated ? "text-red-500" : // Rot für eliminierte Spieler
              player2IsWinner ? "text-gray-400" : "text-white"
            )}>
              {match.player1.firstName} {match.player1.lastName}
              {match.player1.hasBye && " (Freilos)"}
            </span>
            {match.player1.team && (
              <span className={cn(
                "text-[10px]",
                match.player1.hasBye ? "text-green-400/70" : // Freilos-Team auch grün
                player1IsWinner ? "text-[#0FA0CE]/70" :
                match.player1.bracket === "losers" ? "text-[#FEF7CD]/70" :
                match.player1.eliminated ? "text-red-500/70" :
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
              match.player2.bracket === "losers" ? "text-[#FEF7CD]" : 
              match.player2.eliminated ? "text-red-500" : // Rot für eliminierte Spieler
              player1IsWinner ? "text-gray-400" : "text-white"
            )}>
              {match.player2.firstName} {match.player2.lastName}
              {match.player2.hasBye && " (Freilos)"}
            </span>
            {match.player2.team && (
              <span className={cn(
                "text-[10px]",
                match.player2.hasBye ? "text-green-400/70" : // Freilos-Team auch grün
                player2IsWinner ? "text-[#0FA0CE]/70" :
                match.player2.bracket === "losers" ? "text-[#FEF7CD]/70" :
                match.player2.eliminated ? "text-red-500/70" :
                "text-gray-400"
              )}>
                {match.player2.team}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Normale vollständige Darstellung
  const cardContent = (
    <div 
      className={cn(
        "relative border rounded p-2 transition-colors cursor-pointer",
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

  // Wenn das Match nicht spielbar ist (abgeschlossen oder bereits zugewiesen),
  // oder wenn keine Automaten verfügbar sind, gib einfach die Karte zurück
  if (match.completed || match.machineNumber || !isCurrentRound || availableMachines.length === 0 || !onAssignMatch) {
    return cardContent;
  }

  // Ansonsten wickle die Karte in ein Kontextmenü ein
  return (
    <ContextMenu>
      <ContextMenuTrigger>{cardContent}</ContextMenuTrigger>
      <ContextMenuContent className="z-50 w-56 bg-[#1A2133] border-gray-700 text-white">
        <div className="px-2 py-1.5 text-xs font-semibold text-gray-300">
          Match zuweisen
        </div>
        {availableMachines.map((machine) => (
          <ContextMenuItem 
            key={machine.id}
            onClick={() => handleAssignToMachine(machine.id)}
            className="cursor-pointer hover:bg-[#2A3143] focus:bg-[#2A3143]"
          >
            Automat {machine.id}
            {machine.isFavorite && " ⭐"}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};
