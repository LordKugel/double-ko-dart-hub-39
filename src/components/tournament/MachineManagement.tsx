
import { Machine, Match } from "@/types/tournament";
import { Button } from "../ui/button";
import { Star, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";

interface MachineManagementProps {
  machines: Machine[];
  onUpdateMachine: (machine: Machine) => void;
  onAssignMatch: (machineId: number, matchId: string | null) => void;
  availableMatches: Match[];
}

export const MachineManagement = ({
  machines,
  onUpdateMachine,
  onAssignMatch,
  availableMatches
}: MachineManagementProps) => {
  const handleQualityChange = (machine: Machine, newQuality: 1 | 2 | 3) => {
    onUpdateMachine({
      ...machine,
      quality: newQuality
    });
    toast({
      title: "Qualität aktualisiert",
      description: `Die Qualität von Automat ${machine.id} wurde auf ${newQuality} gesetzt`
    });
  };

  const handleToggleFavorite = (machine: Machine) => {
    onUpdateMachine({
      ...machine,
      isFavorite: !machine.isFavorite
    });
    toast({
      title: machine.isFavorite ? "Favorit entfernt" : "Als Favorit markiert",
      description: `Automat ${machine.id} wurde ${machine.isFavorite ? 'von den Favoriten entfernt' : 'als Favorit markiert'}`
    });
  };

  const handleToggleOutOfOrder = (machine: Machine) => {
    onUpdateMachine({
      ...machine,
      isOutOfOrder: !machine.isOutOfOrder,
      currentMatchId: null
    });
    toast({
      title: machine.isOutOfOrder ? "Automat verfügbar" : "Automat außer Betrieb",
      description: `Automat ${machine.id} wurde als ${machine.isOutOfOrder ? 'verfügbar' : 'außer Betrieb'} markiert`
    });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {machines.map((machine) => (
        <div
          key={machine.id}
          className={cn(
            "p-3 rounded-lg border",
            machine.isOutOfOrder 
              ? "bg-red-50 border-red-200" 
              : machine.isFavorite 
                ? "bg-yellow-50 border-yellow-200"
                : "bg-white border-gray-200",
            "w-[75%]"
          )}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm">Automat {machine.id}</h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleFavorite(machine)}
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
                onClick={() => handleToggleOutOfOrder(machine)}
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
                onClick={() => handleQualityChange(machine, (index + 1) as 1 | 2 | 3)}
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
          )}
        </div>
      ))}
    </div>
  );
};
