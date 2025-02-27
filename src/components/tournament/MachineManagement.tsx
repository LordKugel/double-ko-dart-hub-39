
import { Machine, Match } from "@/types/tournament";
import { toast } from "../ui/use-toast";
import { DroppableMachineCard } from "./DroppableMachineCard";

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
        <DroppableMachineCard
          key={machine.id}
          machine={machine}
          onToggleFavorite={handleToggleFavorite}
          onToggleOutOfOrder={handleToggleOutOfOrder}
          onQualityChange={handleQualityChange}
          onAssignMatch={onAssignMatch}
          availableMatches={availableMatches}
        />
      ))}
    </div>
  );
};
