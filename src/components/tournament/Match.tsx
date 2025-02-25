
import { Match as MatchType } from "../../types/tournament";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check } from "lucide-react";

interface MatchProps {
  match: MatchType;
  onScoreUpdate: (matchId: string, gameIndex: number, player1Won: boolean) => void;
}

export const Match = ({ match, onScoreUpdate }: MatchProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isMatchComplete = (match: MatchType) => {
    return match.scores.every(score => score.player1Won !== null && score.player2Won !== null);
  };

  useEffect(() => {
    // Zeige Bestätigungsbutton wenn alle 3 Spiele gespielt sind
    if (isMatchComplete(match) && !match.completed && !match.countdownStarted) {
      setShowConfirmation(true);
    }
  }, [match.scores, match.completed, match.countdownStarted]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    // Starte Countdown nur wenn das Match bestätigt wurde
    if (match.countdownStarted) {
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
  }, [match.countdownStarted]);

  if (!isVisible) return null;

  const getButtonStyle = (won: boolean | null) => {
    if (won === null) return "bg-gray-300 hover:bg-gray-400";
    return won ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white";
  };

  const getButtonContent = (won: boolean | null) => {
    if (won === null) return "-";
    return won ? "✓" : "×";
  };

  const getMatchStatus = () => {
    if (match.countdownStarted && countdown !== null) {
      return `Änderungen noch ${countdown}s möglich`;
    }
    if (match.completed) {
      return "Match abgeschlossen";
    }
    return "";
  };

  const handleScoreUpdate = (gameIndex: number, player1Won: boolean) => {
    if (!match.completed) {
      onScoreUpdate(match.id, gameIndex, player1Won);
    }
  };

  const confirmMatchResult = () => {
    setShowConfirmation(false);
    // Trigger countdown start
    onScoreUpdate(match.id, 0, match.scores[0].player1Won!);
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
            <div key={index} className="flex flex-col gap-1">
              <button
                onClick={() => handleScoreUpdate(index, true)}
                disabled={match.completed || (match.countdownStarted && countdown === null)}
                className={cn(
                  "w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center",
                  getButtonStyle(score.player1Won),
                  "animate-scale-in"
                )}
              >
                {getButtonContent(score.player1Won)}
              </button>
              <button
                onClick={() => handleScoreUpdate(index, false)}
                disabled={match.completed || (match.countdownStarted && countdown === null)}
                className={cn(
                  "w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center",
                  getButtonStyle(score.player2Won),
                  "animate-scale-in"
                )}
              >
                {getButtonContent(score.player2Won)}
              </button>
            </div>
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

        {showConfirmation && !match.countdownStarted && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
                size="lg"
              >
                <Check className="mr-2 h-4 w-4" />
                Ergebnis bestätigen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ergebnis bestätigen</AlertDialogTitle>
                <AlertDialogDescription>
                  Sind Sie sicher, dass Sie dieses Ergebnis speichern möchten?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction onClick={confirmMatchResult}>Bestätigen</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

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
