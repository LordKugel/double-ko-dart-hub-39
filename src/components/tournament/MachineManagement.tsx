
import { Machine, Match } from "@/types/tournament";
import { DroppableMachineCard } from "./DroppableMachineCard";

interface MachineManagementProps {
  machines: Machine[];
  onUpdateMachine: (machine: Machine) => void;
  onAssignMatch: (machineId: number, matchId: string | null) => void;
  onConfirmMatch?: (machineId: number) => void;
  getMatchForMachine?: (machineId: number) => Match | null;
  canConfirmMatch?: (machineId: number) => boolean;
  availableMatches: Match[];
}

export const MachineManagement = ({
  machines,
  onUpdateMachine,
  onAssignMatch,
  onConfirmMatch,
  getMatchForMachine,
  canConfirmMatch,
  availableMatches
}: MachineManagementProps) => {
  const handleQualityChange = (machine: Machine, newQuality: 1 | 2 | 3) => {
    onUpdateMachine({
      ...machine,
      quality: newQuality
    });
    // Toast entfernt
  };

  const handleToggleFavorite = (machine: Machine) => {
    onUpdateMachine({
      ...machine,
      isFavorite: !machine.isFavorite
    });
    // Toast entfernt
  };

  const handleToggleOutOfOrder = (machine: Machine) => {
    onUpdateMachine({
      ...machine,
      isOutOfOrder: !machine.isOutOfOrder,
      currentMatchId: null
    });
    // Toast entfernt
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {machines.map((machine) => (
        <DroppableMachineCard
          key={machine.id}
          machine={machine}
          onToggleFavorite={handleToggleFavorite}
          onToggleOutOfOrder={handleToggleOutOfOrder}
          onQualityChange={handleQualityChange}
          onAssignMatch={onAssignMatch}
          onConfirmMatch={onConfirmMatch}
          availableMatches={availableMatches}
          currentMatch={getMatchForMachine ? getMatchForMachine(machine.id) : null}
          canConfirm={canConfirmMatch ? canConfirmMatch(machine.id) : false}
        />
      ))}
    </div>
  );
};
