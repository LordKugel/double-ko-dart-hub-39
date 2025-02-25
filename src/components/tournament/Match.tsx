
import { Match as MatchType } from "../../types/tournament";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MatchProps {
  match: MatchType;
  onScoreUpdate: (matchId: string, gameIndex: number, player1Won: boolean) => void;
}

export const Match = ({ match, onScoreUpdate }: MatchProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isMatchComplete(match) && !match.completed && !match.countdownStarted) {
      setCountdown(10);
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(timer);
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
    if (won === null) return "bg-gray-300";
    return won ? "bg-green-500 text-white" : "bg-red-500 text-white";
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-fade-in relative">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{match.player1.firstName} {match.player1.lastName}</div>
        <div className="text-sm text-gray-500">{match.player1.team}</div>
      </div>
      
      <div className="flex justify-center gap-2 my-2">
        {match.scores.map((score, index) => (
          <div key={index} className="flex flex-col gap-1">
            <button
              onClick={() => !match.completed && onScoreUpdate(match.id, index, true)}
              disabled={match.completed}
              className={cn(
                "w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center",
                getButtonStyle(score.player1Won)
              )}
            >
              {getButtonContent(score.player1Won)}
            </button>
            <button
              onClick={() => !match.completed && onScoreUpdate(match.id, index, false)}
              disabled={match.completed}
              className={cn(
                "w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center",
                getButtonStyle(score.player2Won)
              )}
            >
              {getButtonContent(score.player2Won)}
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="font-medium">{match.player2.firstName} {match.player2.lastName}</div>
        <div className="text-sm text-gray-500">{match.player2.team}</div>
      </div>

      {getMatchStatus() && (
        <div className={cn(
          "mt-2 text-center text-xl font-bold italic p-2 rounded",
          countdown ? "bg-yellow-100 text-yellow-800" : "text-gray-500"
        )}>
          {getMatchStatus()}
        </div>
      )}
    </div>
  );
};
