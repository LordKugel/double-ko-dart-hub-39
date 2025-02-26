
import { Match } from "@/types/tournament";
import { cn } from "@/lib/utils";

interface MachineOverviewProps {
  activeMatches: Match[];
  maxMachines?: number;
}

export const MachineOverview = ({ activeMatches, maxMachines = 3 }: MachineOverviewProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1721] border-t border-[#403E43] p-4 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-[#0FA0CE]">Aktive Automaten</h3>
          <span className="text-xs text-gray-400">
            {activeMatches.length} / {maxMachines} belegt
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: maxMachines }).map((_, index) => {
            const match = activeMatches[index];
            return (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border",
                  match
                    ? "bg-[#221F26] border-[#403E43]"
                    : "bg-[#1A1721]/50 border-dashed border-[#403E43]/50"
                )}
              >
                {match ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        Automat {index + 1}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#0FA0CE]/20 text-[#0FA0CE]">
                        Aktiv
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white">
                          {match.player1.firstName} {match.player1.lastName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[#403E43]">
                          {match.scores.filter(s => s.player1Won).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white">
                          {match.player2.firstName} {match.player2.lastName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[#403E43]">
                          {match.scores.filter(s => s.player2Won).length}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[88px] text-gray-400">
                    <span className="text-sm">Automat {index + 1}</span>
                    <span className="text-xs">Verfügbar</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
