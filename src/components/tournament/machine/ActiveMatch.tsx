
import { Match } from "@/types/tournament";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveMatchProps {
  match: Match;
  onAssignMatch: (machineId: number, matchId: string | null) => void;
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
  onConfirmMatch?: () => void;
  canConfirm?: boolean;
}

export const ActiveMatch = ({
  match,
  onAssignMatch,
  onScoreUpdate,
  onConfirmMatch,
  canConfirm = false
}: ActiveMatchProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className={cn(
          "text-sm",
          match.player1.bracket === "winners" ? "text-[#0FA0CE]" :
          match.player1.bracket === "losers" ? "text-[#FFD700]" :
          "text-white"
        )}>
          {match.player1.firstName} {match.player1.lastName}
        </span>
        <span className="text-xs px-2 py-0.5 rounded bg-[#403E43]">
          {match.scores.filter(s => s.player1Won).length}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className={cn(
          "text-sm",
          match.player2.bracket === "winners" ? "text-[#0FA0CE]" :
          match.player2.bracket === "losers" ? "text-[#FFD700]" :
          "text-white"
        )}>
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
              onClick={() => match.completed ? null : onScoreUpdate?.(match.id, idx, true)}
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
              onClick={() => match.completed ? null : onScoreUpdate?.(match.id, idx, false)}
              disabled={match.completed}
            >
              {score.player2Won ? 'W' : score.player1Won ? 'L' : '-'}
            </button>
          </div>
        ))}
      </div>

      {canConfirm && onConfirmMatch && (
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full text-green-600 border-green-800 hover:bg-green-900/20 hover:text-green-400 mt-2"
          onClick={onConfirmMatch}
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Ergebnis bestätigen
        </Button>
      )}
      
      <Button 
        size="sm"
        variant="ghost"
        className="w-full text-red-500 mt-1 text-xs"
        onClick={() => onAssignMatch(match.machineNumber || 0, null)}
      >
        Match entfernen
      </Button>
    </div>
  );
};
