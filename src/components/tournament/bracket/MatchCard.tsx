
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
  hideScoreControls = false
}: MatchCardProps) => {
  const player1Score = match.scores.filter(s => s.player1Won).length;
  const player2Score = match.scores.filter(s => s.player2Won).length;

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
        return "bg-[#1c1018] border-red-900/30 hover:border-red-500";
      case "final":
        return "bg-[#1e173a] border-[#8B5CF6]/30 hover:border-[#8B5CF6]";
      default:
        return "bg-gray-800 border-gray-700";
    }
  };

  // Filtere verfügbare Automaten (nicht belegt und nicht außer Betrieb)
  const availableMachines = machines.filter(m => !m.isOutOfOrder && !m.currentMatchId);

  const cardContent = (
    <div 
      className={cn(
        "relative border rounded p-2 transition-colors",
        getBracketColors(),
        isCurrentRound && "ring-1 ring-blue-500",
        "text-sm w-[180px]"  // Breitere Karte für bessere Darstellung
      )}
    >
      <PlayerInfo
        player={match.player1}
        score={player1Score}
        isWinner={player1Score > player2Score}
        isCurrentRound={isCurrentRound}
        scores={match.scores}
        isPlayer1={true}
        onScoreUpdate={handleScoreUpdate}
        completed={match.completed}
        showScoreControls={!hideScoreControls && !match.machineNumber}
      />
      <div className="my-1 border-t border-gray-700" />
      <PlayerInfo
        player={match.player2}
        score={player2Score}
        isWinner={player2Score > player1Score}
        isCurrentRound={isCurrentRound}
        scores={match.scores}
        isPlayer1={false}
        onScoreUpdate={handleScoreUpdate}
        completed={match.completed}
        showScoreControls={!hideScoreControls && !match.machineNumber}
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
      <ContextMenuContent className="w-56 bg-[#1A2133] border-gray-700 text-white">
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
