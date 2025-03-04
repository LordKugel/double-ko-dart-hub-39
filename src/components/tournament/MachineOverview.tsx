
import { Match, Machine } from "@/types/tournament";
import { MachineHeader } from "./machine/MachineHeader";
import { MachineCard } from "./machine/MachineCard";

interface MachineOverviewProps {
  activeMatches: Match[];
  maxMachines?: number;
  machines: Machine[];
  availableMatches: Match[];
  onUpdateMachine: (machine: Machine) => void;
  onAssignMatch: (machineId: number, matchId: string | null) => void;
  onConfirmMatch?: (machineId: number) => void;
  getMatchForMachine?: (machineId: number) => Match | null;
  canConfirmMatch?: (machineId: number) => boolean;
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
  onIncreaseMaxMachines?: () => void;
  onDecreaseMaxMachines?: () => void;
}

export const MachineOverview = ({ 
  activeMatches, 
  maxMachines = 3, 
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
}: MachineOverviewProps) => {
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1721] border-t border-[#403E43] p-4 z-50"
         style={{ height: "35vh" }}>
      <div className="container mx-auto">
        <MachineHeader 
          maxMachines={maxMachines}
          activeMatchesCount={activeMatches.length}
          onDecreaseMaxMachines={onDecreaseMaxMachines}
          onIncreaseMaxMachines={onIncreaseMaxMachines}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: maxMachines }).map((_, index) => {
            const machineId = index + 1;
            const machine = machines.find(m => m.id === machineId) || {
              id: machineId,
              quality: 3,
              isFavorite: false,
              isOutOfOrder: false,
              currentMatchId: null
            };
            const match = getMatchForMachine ? getMatchForMachine(machineId) : null;
            
            return (
              <MachineCard
                key={index}
                machine={machine}
                machineIndex={index}
                match={match}
                availableMatches={availableMatches}
                onUpdateMachine={onUpdateMachine}
                onAssignMatch={onAssignMatch}
                onConfirmMatch={onConfirmMatch}
                canConfirmMatch={canConfirmMatch ? canConfirmMatch(machineId) : false}
                onScoreUpdate={onScoreUpdate}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
