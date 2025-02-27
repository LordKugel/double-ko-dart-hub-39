
import { useDrop } from 'react-dnd';
import { Machine, Match } from "@/types/tournament";
import { Button } from "../ui/button";
import { Star, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";

interface DroppableMachineCardProps {
  machine: Machine;
  onToggleFavorite: (machine: Machine) => void;
  onToggleOutOfOrder: (machine: Machine) => void;
  onQualityChange: (machine: Machine, quality: 1 | 2 | 3) => void;
  onAssignMatch: (machineId: number, matchId: string | null) => void;
  onConfirmMatch?: (machineId: number) => void;
  availableMatches: Match[];
  currentMatch?: Match | null;
  canConfirm?: boolean;
}

export const DroppableMachineCard = ({
  machine,
  onToggleFavorite,
  onToggleOutOfOrder,
  onQualityChange,
  onAssignMatch,
  onConfirmMatch,
  availableMatches,
  currentMatch,
  canConfirm = false
}: DroppableMachineCardProps) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'MATCH',
    drop: (item: { matchId: string }) => {
      console.log("Match dropped on machine", machine.id, item.matchId);
      onAssignMatch(machine.id, item.matchId);
      
      // Erfolgstoast hier hinzufügen
      toast({
        title: "Match zugewiesen",
        description: `Match wurde erfolgreich Automat ${machine.id} zugewiesen`
      });
      
      return { machineId: machine.id };
    },
    canDrop: () => !machine.isOutOfOrder && !machine.currentMatchId,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={cn(
        "p-3 rounded-lg border transition-all duration-200",
        machine.isOutOfOrder 
          ? "bg-red-50 border-red-200" 
          : machine.currentMatchId 
            ? "bg-blue-50 border-blue-300"
            : machine.isFavorite 
              ? "bg-yellow-50 border-yellow-200"
              : "bg-white border-gray-200",
        canDrop && "border-dashed border-green-500 bg-green-50",
        isOver && canDrop && "bg-green-100 border-green-600 shadow-md",
        "w-[75%]"
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm">Automat {machine.id}</h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(machine)}
            className={cn(
              "hover:text-yellow-500 p-1",
              machine.isFavorite && "text-yellow-500"
            )}
          >
            <Star className={cn(
              "h-3 w-3",
              machine.isFavorite && "fill-current"
            )} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleOutOfOrder(machine)}
            className={cn(
              "hover:text-red-500 p-1",
              machine.isOutOfOrder && "text-red-500"
            )}
          >
            <AlertTriangle className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => onQualityChange(machine, (index + 1) as 1 | 2 | 3)}
            className={cn(
              "p-1",
              index < machine.quality ? "text-yellow-500" : "text-gray-300"
            )}
          >
            <Star className={cn(
              "h-3 w-3",
              index < machine.quality && "fill-current"
            )} />
          </Button>
        ))}
      </div>

      {!machine.isOutOfOrder && (
        <div className="space-y-2">
          {machine.currentMatchId ? (
            <div className="bg-blue-100 p-2 rounded border border-blue-300 text-sm">
              <div className="font-bold text-blue-800 mb-1">Aktuelles Match:</div>
              {currentMatch ? (
                <div>
                  <div className="font-medium">{currentMatch.player1.firstName} vs {currentMatch.player2.firstName}</div>
                  <div className="text-xs text-gray-600 mt-1">Match ID: {machine.currentMatchId}</div>
                </div>
              ) : (
                <div className="text-red-500">Match nicht gefunden!</div>
              )}
              
              {canConfirm && onConfirmMatch && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-green-600 border-green-200 hover:bg-green-50 mt-2"
                  onClick={() => onConfirmMatch(machine.id)}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ergebnis bestätigen
                </Button>
              )}
              
              <Button 
                size="sm"
                variant="ghost"
                className="w-full text-red-500 mt-1 text-xs"
                onClick={() => onAssignMatch(machine.id, null)}
              >
                Match entfernen
              </Button>
            </div>
          ) : (
            <>
              <select
                className="w-full p-1 text-sm rounded border border-gray-200"
                value=""
                onChange={(e) => onAssignMatch(machine.id, e.target.value || null)}
                disabled={machine.isOutOfOrder}
              >
                <option value="">Kein Match</option>
                {availableMatches.map((match) => (
                  <option key={match.id} value={match.id}>
                    {match.player1.firstName} vs {match.player2.firstName}
                  </option>
                ))}
              </select>
              
              {canDrop && (
                <div className="text-xs text-center mt-2 text-green-600 font-bold animate-pulse">
                  {isOver ? "Match hier ablegen" : "Match hierher ziehen"}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
