
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
        "p-3 rounded-lg border",
        machine.isOutOfOrder 
          ? "bg-red-50 border-red-200" 
          : machine.isFavorite 
            ? "bg-yellow-50 border-yellow-200"
            : "bg-white border-gray-200",
        canDrop && "border-dashed border-green-500",
        isOver && canDrop && "bg-green-50 border-green-500",
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
          <select
            className="w-full p-1 text-sm rounded border border-gray-200"
            value={machine.currentMatchId || ""}
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
          
          {canConfirm && currentMatch && onConfirmMatch && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => onConfirmMatch(machine.id)}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Ergebnis bestätigen
            </Button>
          )}
        </div>
      )}
      
      {canDrop && (
        <div className="text-xs text-center mt-2 text-green-600 font-bold">
          {isOver ? "Match hier ablegen" : "Match hierher ziehen"}
        </div>
      )}
    </div>
  );
};
