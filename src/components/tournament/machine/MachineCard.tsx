
import { Machine, Match } from "@/types/tournament";
import { cn } from "@/lib/utils";
import { MachineControls } from "./MachineControls";
import { ActiveMatch } from "./ActiveMatch";
import { EmptyMachine } from "./EmptyMachine";

interface MachineCardProps {
  machine: Machine;
  machineIndex: number;
  match: Match | null;
  availableMatches: Match[];
  onUpdateMachine: (machine: Machine) => void;
  onAssignMatch: (machineId: number, matchId: string | null) => void;
  onConfirmMatch?: (machineId: number) => void;
  canConfirmMatch?: boolean;
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
}

export const MachineCard = ({
  machine,
  machineIndex,
  match,
  availableMatches,
  onUpdateMachine,
  onAssignMatch,
  onConfirmMatch,
  canConfirmMatch = false,
  onScoreUpdate
}: MachineCardProps) => {
  const handleToggleFavorite = () => {
    onUpdateMachine({
      ...machine,
      isFavorite: !machine.isFavorite
    });
  };

  const handleToggleOutOfOrder = () => {
    onUpdateMachine({
      ...machine,
      isOutOfOrder: !machine.isOutOfOrder,
      currentMatchId: machine.isOutOfOrder ? machine.currentMatchId : null
    });
  };

  // Bestimmt die Rahmenfarbe basierend auf dem Match-Bracket
  const getMachineBorderColor = (match: Match | null) => {
    if (!match) return "border-[#403E43]/50";
    
    switch(match.bracket) {
      case "winners":
        return "border-[#0FA0CE]";
      case "losers":
        return "border-[#FFD700]";
      case "final":
        return "border-[#8B5CF6]";
      default:
        return "border-[#403E43]";
    }
  };

  return (
    <div
      className={cn(
        "p-3 rounded-lg border transition-all duration-200",
        machine.isOutOfOrder 
          ? "bg-[#2A1721] border-red-900/30" 
          : machine.currentMatchId 
            ? "bg-[#221F26]" 
            : machine.isFavorite 
              ? "bg-[#22291F] border-yellow-700/30"
              : "bg-[#1A1721]/50 border-dashed border-[#403E43]/50",
        // Bracket-basierte Rahmenfarbe für zugewiesene Matches
        machine.currentMatchId && getMachineBorderColor(match)
      )}
      style={{ height: "200px", overflow: 'auto' }}
    >
      {machine.currentMatchId && match ? (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">
              Automat {machineIndex + 1}
              {machine.isFavorite && " ★"}
            </span>
            <div className="flex items-center gap-1">
              <MachineControls 
                machine={machine}
                onToggleFavorite={handleToggleFavorite}
                onToggleOutOfOrder={handleToggleOutOfOrder}
              />
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full bg-opacity-20",
                match.bracket === "winners" 
                  ? "bg-[#0FA0CE]/20 text-[#0FA0CE]" 
                  : match.bracket === "losers" 
                    ? "bg-[#FFD700]/20 text-[#FFD700]"
                    : "bg-[#8B5CF6]/20 text-[#8B5CF6]"
              )}>
                Aktiv
              </span>
            </div>
          </div>
          
          <ActiveMatch 
            match={match}
            onAssignMatch={onAssignMatch}
            onScoreUpdate={onScoreUpdate}
            onConfirmMatch={() => onConfirmMatch?.(machine.id)}
            canConfirm={canConfirmMatch}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <div className="flex justify-between w-full mb-2">
            <span className="text-sm">Automat {machine.id}
              {machine.isFavorite && " ★"}
            </span>
            <MachineControls 
              machine={machine}
              onToggleFavorite={handleToggleFavorite}
              onToggleOutOfOrder={handleToggleOutOfOrder}
            />
          </div>
          
          <EmptyMachine 
            machineId={machine.id}
            isOutOfOrder={machine.isOutOfOrder}
            onAssignMatch={onAssignMatch}
            availableMatches={availableMatches}
          />
        </div>
      )}
    </div>
  );
};
