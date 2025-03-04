
import { Match } from "@/types/tournament";

interface EmptyMachineProps {
  machineId: number;
  isOutOfOrder: boolean;
  onAssignMatch: (machineId: number, matchId: string | null) => void;
  availableMatches: Match[];
}

export const EmptyMachine = ({
  machineId,
  isOutOfOrder,
  onAssignMatch,
  availableMatches
}: EmptyMachineProps) => {
  return (
    <>
      {isOutOfOrder ? (
        <div className="text-red-500 mt-4">Außer Betrieb</div>
      ) : (
        <>
          <div className="text-xs mb-4">Verfügbar</div>
          <select
            className="w-full p-2 bg-[#2A2631] border border-[#403E43] rounded text-white text-sm"
            value=""
            onChange={(e) => onAssignMatch(machineId, e.target.value || null)}
            disabled={isOutOfOrder}
          >
            <option value="">Match zuweisen...</option>
            {availableMatches.map((match) => (
              <option key={match.id} value={match.id}>
                {match.player1.firstName} vs {match.player2.firstName}
              </option>
            ))}
          </select>
        </>
      )}
    </>
  );
};
