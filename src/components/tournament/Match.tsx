
import { Match as MatchType } from "../../types/tournament";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MatchProps {
  match: MatchType;
  onScoreUpdate: (matchId: string, gameIndex: number, player1Won: boolean) => void;
}

export const Match = ({ match, onScoreUpdate }: MatchProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [selectedGame, setSelectedGame] = useState<{index: number, player1Won: boolean} | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isMatchComplete(match) && !match.completed && !match.countdownStarted) {
      setCountdown(10);
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(timer);
            setCountdown(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [match.scores, match.completed, match.countdownStarted]);

  if (!isVisible) return null;

  const isMatchComplete = (match: MatchType) => {
    return match.scores.every(score => score.player1Won !== null && score.player2Won !== null);
  };

  const getButtonStyle = (won: boolean | null) => {
    if (won === null) return "bg-gray-300 hover:bg-gray-400";
    return won ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white";
  };

  const getButtonContent = (won: boolean | null) => {
    if (won === null) return "-";
    return won ? "✓" : "×";
  };

  const getMatchStatus = () => {
    if (isMatchComplete(match) && !match.completed) {
      return countdown !== null ? `Änderungen noch ${countdown}s möglich` : "";
    }
    if (match.completed) {
      return "Match abgeschlossen";
    }
    return "";
  };

  const handleScoreUpdate = (gameIndex: number, player1Won: boolean) => {
    setSelectedGame({ index: gameIndex, player1Won });
  };

  const confirmScoreUpdate = () => {
    if (selectedGame) {
      onScoreUpdate(match.id, selectedGame.index, selectedGame.player1Won);
      setSelectedGame(null);
    }
  };

  const getPlayerStats = (player: typeof match.player1) => {
    const wins = match.scores.filter(s => 
      (player === match.player1 ? s.player1Won : s.player2Won) === true
    ).length;
    return `${wins} Siege`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-fade-in relative hover:shadow-lg transition-shadow">
      <TooltipProvider>
        <div className="flex items-center justify-between mb-2">
          <Tooltip>
            <TooltipTrigger>
              <div className="font-medium">{match.player1.firstName} {match.player1.lastName}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Team: {match.player1.team}</p>
              <p>{getPlayerStats(match.player1)}</p>
            </TooltipContent>
          </Tooltip>
          <div className="text-sm text-gray-500">{match.player1.team}</div>
        </div>
        
        <div className="flex justify-center gap-2 my-2">
          {match.scores.map((score, index) => (
            <AlertDialog key={index}>
              <AlertDialogTrigger asChild>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => !match.completed && handleScoreUpdate(index, true)}
                    disabled={match.completed}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center",
                      getButtonStyle(score.player1Won),
                      "animate-scale-in"
                    )}
                  >
                    {getButtonContent(score.player1Won)}
                  </button>
                  <button
                    onClick={() => !match.completed && handleScoreUpdate(index, false)}
                    disabled={match.completed}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center",
                      getButtonStyle(score.player2Won),
                      "animate-scale-in"
                    )}
                  >
                    {getButtonContent(score.player2Won)}
                  </button>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Ergebnis bestätigen</AlertDialogTitle>
                  <AlertDialogDescription>
                    Sind Sie sicher, dass Sie dieses Ergebnis speichern möchten?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setSelectedGame(null)}>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmScoreUpdate}>Bestätigen</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))}
        </div>

        <div className="flex items-center justify-between mt-2">
          <Tooltip>
            <TooltipTrigger>
              <div className="font-medium">{match.player2.firstName} {match.player2.lastName}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Team: {match.player2.team}</p>
              <p>{getPlayerStats(match.player2)}</p>
            </TooltipContent>
          </Tooltip>
          <div className="text-sm text-gray-500">{match.player2.team}</div>
        </div>

        {getMatchStatus() && (
          <div className={cn(
            "mt-2 text-center text-xl font-extrabold italic p-2 rounded animate-pulse",
            countdown !== null ? "bg-yellow-100 text-yellow-800" : "text-gray-500"
          )}>
            {getMatchStatus()}
          </div>
        )}
      </TooltipProvider>
    </div>
  );
};
