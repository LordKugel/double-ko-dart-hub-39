
import { MachineOverview } from "./MachineOverview";
import { Match } from "@/types/tournament";

interface MachineManagementProps {
  started: boolean;
  activeMatches: Match[];
  numberOfMachines: number;
  machines: any[];
  availableMatches: Match[];
  onUpdateMachine: (machine: any) => void;
  onAssignMatch: (machineId: number, matchId: string | null) => void;
  onConfirmMatch: (machineId: number) => void;
  getMatchForMachine: (machineId: number) => Match | null;
  canConfirmMatch: (machineId: number) => boolean;
  onScoreUpdate: (matchId: string, gameIndex: number, player1Won: boolean) => void;
  onIncreaseMaxMachines: () => void;
  onDecreaseMaxMachines: () => void;
}

export const MachineManagement = ({
  started,
  activeMatches,
  numberOfMachines,
  machines,
  availableMatches,
  onUpdateMachine,
  onAssignMatch,
  onConfirmMatch,
  getMatchForMachine,
  canConfirmMatch,
  onScoreUpdate,
  onIncreaseMaxMachines,
  onDecreaseMaxMachines
}: MachineManagementProps) => {
  if (!started) {
    return null;
  }

  return (
    <MachineOverview 
      activeMatches={activeMatches}
      maxMachines={numberOfMachines || 3}
      machines={machines}
      availableMatches={availableMatches}
      onUpdateMachine={onUpdateMachine}
      onAssignMatch={onAssignMatch}
      onConfirmMatch={onConfirmMatch}
      getMatchForMachine={getMatchForMachine}
      canConfirmMatch={canConfirmMatch}
      onScoreUpdate={onScoreUpdate}
      onIncreaseMaxMachines={onIncreaseMaxMachines}
      onDecreaseMaxMachines={onDecreaseMaxMachines}
    />
  );
};
