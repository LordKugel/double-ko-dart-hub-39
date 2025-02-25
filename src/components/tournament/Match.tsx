
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
    if (isMatchComplete(match) && !match.completed) {
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
      if (timer) clearTimeout(timer);
    };
  }, [match.scores, match.completed]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (match.completed) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000); // 10 Sekunden
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [match.completed]);

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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-fade-in relative">
      {countdown !== null && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="text-white text-2xl font-bold">
            Änderungen möglich: {countdown}s
          </div>
        </div>
      )}
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

      {match.completed && (
        <div className="mt-2 text-center text-sm text-gray-500">
          Match completed
        </div>
      )}
    </div>
  );
};
