
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
  const handleQualityChange = (machine: Machine, newQuality: 1 | 2 | 3 | 4 | 5) => {
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
      currentMatchId: null // Reset current match if machine goes out of order
    });
    toast({
      title: machine.isOutOfOrder ? "Automat verfügbar" : "Automat außer Betrieb",
      description: `Automat ${machine.id} wurde als ${machine.isOutOfOrder ? 'verfügbar' : 'außer Betrieb'} markiert`
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {machines.map((machine) => (
        <div
          key={machine.id}
          className={cn(
            "p-4 rounded-lg border",
            machine.isOutOfOrder 
              ? "bg-red-50 border-red-200" 
              : machine.isFavorite 
                ? "bg-yellow-50 border-yellow-200"
                : "bg-white border-gray-200"
          )}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Automat {machine.id}</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleFavorite(machine)}
                className={cn(
                  "hover:text-yellow-500",
                  machine.isFavorite && "text-yellow-500"
                )}
              >
                <Star className={cn(
                  "h-4 w-4",
                  machine.isFavorite && "fill-current"
                )} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleOutOfOrder(machine)}
                className={cn(
                  "hover:text-red-500",
                  machine.isOutOfOrder && "text-red-500"
                )}
              >
                <AlertTriangle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handleQualityChange(machine, (index + 1) as 1 | 2 | 3 | 4 | 5)}
                className={cn(
                  "p-1",
                  index < machine.quality ? "text-yellow-500" : "text-gray-300"
                )}
              >
                <Star className={cn(
                  "h-4 w-4",
                  index < machine.quality && "fill-current"
                )} />
              </Button>
            ))}
          </div>

          {!machine.isOutOfOrder && (
            <div className="space-y-2">
              <select
                className="w-full p-2 rounded border border-gray-200"
                value={machine.currentMatchId || ""}
                onChange={(e) => onAssignMatch(machine.id, e.target.value || null)}
                disabled={machine.isOutOfOrder}
              >
                <option value="">Kein Match zugewiesen</option>
                {availableMatches.map((match) => (
                  <option key={match.id} value={match.id}>
                    {match.player1.firstName} vs {match.player2.firstName} (Runde {match.round})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
