
import { Match, Machine } from "@/types/tournament";
import { cn } from "@/lib/utils";
import { Star, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

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
  onScoreUpdate
}: MachineOverviewProps) => {
  
  const handleToggleFavorite = (machine: Machine) => {
    onUpdateMachine({
      ...machine,
      isFavorite: !machine.isFavorite
    });
  };

  const handleToggleOutOfOrder = (machine: Machine) => {
    onUpdateMachine({
      ...machine,
      isOutOfOrder: !machine.isOutOfOrder,
      currentMatchId: machine.isOutOfOrder ? machine.currentMatchId : null
    });
  };

  // Diese Funktion kümmert sich um die Aktualisierung des Matchstandes
  const handleScoreUpdate = (matchId: string, gameIndex: number, player1Won: boolean) => {
    if (onScoreUpdate) {
      onScoreUpdate(matchId, gameIndex, player1Won);
    }
  };

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
            const machineId = index + 1;
            const machine = machines.find(m => m.id === machineId) || {
              id: machineId,
              quality: 3,
              isFavorite: false,
              isOutOfOrder: false,
              currentMatchId: null
            };
            const match = getMatchForMachine ? getMatchForMachine(machineId) : null;
            const canDropMatches = !machine.isOutOfOrder && !machine.currentMatchId;
            
            return (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200",
                  machine.isOutOfOrder 
                    ? "bg-[#2A1721] border-red-900/30" 
                    : machine.currentMatchId 
                      ? "bg-[#221F26] border-[#403E43]"
                      : machine.isFavorite 
                        ? "bg-[#22291F] border-yellow-700/30"
                        : "bg-[#1A1721]/50 border-dashed border-[#403E43]/50",
                )}
              >
                {machine.currentMatchId && match ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        Automat {index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
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
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{machine.isFavorite ? 'Favorit entfernen' : 'Als Favorit markieren'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
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
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{machine.isOutOfOrder ? 'Verfügbar' : 'Außer Betrieb'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#0FA0CE]/20 text-[#0FA0CE]">
                          Aktiv
                        </span>
                      </div>
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

                      {/* Spielergebnisse */}
                      <div className="mt-2 flex justify-center gap-2">
                        {match.scores.map((score, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <button
                              className={cn(
                                "w-6 h-6 rounded text-xs mb-1",
                                score.player1Won 
                                  ? "bg-[#0FA0CE] text-white" 
                                  : score.player2Won
                                    ? "bg-red-500 text-white"
                                    : "bg-[#2A2631] border border-[#403E43]"
                              )}
                              onClick={() => match.completed ? null : handleScoreUpdate(match.id, idx, true)}
                              disabled={match.completed}
                            >
                              {score.player1Won ? 'W' : score.player2Won ? 'L' : '-'}
                            </button>
                            <button
                              className={cn(
                                "w-6 h-6 rounded text-xs",
                                score.player2Won 
                                  ? "bg-[#0FA0CE] text-white" 
                                  : score.player1Won
                                    ? "bg-red-500 text-white"
                                    : "bg-[#2A2631] border border-[#403E43]"
                              )}
                              onClick={() => match.completed ? null : handleScoreUpdate(match.id, idx, false)}
                              disabled={match.completed}
                            >
                              {score.player2Won ? 'W' : score.player1Won ? 'L' : '-'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {canConfirmMatch && canConfirmMatch(machineId) && onConfirmMatch && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-green-600 border-green-800 hover:bg-green-900/20 hover:text-green-400 mt-2"
                        onClick={() => onConfirmMatch(machineId)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ergebnis bestätigen
                      </Button>
                    )}
                    
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="w-full text-red-500 mt-1 text-xs"
                      onClick={() => onAssignMatch(machineId, null)}
                    >
                      Match entfernen
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[150px] text-gray-400">
                    <div className="flex justify-between w-full mb-2">
                      <span className="text-sm">Automat {machineId}</span>
                      <div className="flex items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
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
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{machine.isFavorite ? 'Favorit entfernen' : 'Als Favorit markieren'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
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
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{machine.isOutOfOrder ? 'Verfügbar' : 'Außer Betrieb'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    {machine.isOutOfOrder ? (
                      <div className="text-red-500 mt-4">Außer Betrieb</div>
                    ) : (
                      <>
                        <div className="text-xs mb-4">Verfügbar</div>
                        <select
                          className="w-full p-2 bg-[#2A2631] border border-[#403E43] rounded text-white text-sm"
                          value=""
                          onChange={(e) => onAssignMatch(machineId, e.target.value || null)}
                          disabled={machine.isOutOfOrder}
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
