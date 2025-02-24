
import { Match as MatchType } from "../../types/tournament";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MatchProps {
  match: MatchType;
  onScoreUpdate: (matchId: string, gameIndex: number, player1Won: boolean) => void;
}

export const Match = ({ match, onScoreUpdate }: MatchProps) => {
  const [isVisible, setIsVisible] = useState(true);

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

  const getButtonStyle = (won: boolean | null) => {
    if (won === null) return "bg-gray-300";
    return won ? "bg-green-500 text-white" : "bg-red-500 text-white";
  };

  const getButtonContent = (won: boolean | null) => {
    if (won === null) return "-";
    return won ? "✓" : "×";
  };

  // Prüfen, ob das Match bereits entschieden ist
  const player1Wins = match.scores.filter(s => s.player1Won).length;
  const player2Wins = match.scores.filter(s => s.player2Won).length;
  const isMatchDecided = player1Wins === 2 || player2Wins === 2;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{match.player1.firstName} {match.player1.lastName}</div>
        <div className="text-sm text-gray-500">{match.player1.team}</div>
      </div>
      
      <div className="flex justify-center gap-2 my-2">
        {match.scores.map((score, index) => {
          // Wenn das Match bereits entschieden ist und dieses Spiel noch nicht gespielt wurde,
          // deaktivieren wir die Buttons
          const isGameDisabled = isMatchDecided && score.player1Won === null;
          
          return (
            <div key={index} className="flex flex-col gap-1">
              <button
                onClick={() => !match.completed && !isGameDisabled && onScoreUpdate(match.id, index, true)}
                disabled={match.completed || isGameDisabled}
                className={cn(
                  "w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center",
                  isGameDisabled ? "bg-gray-200 cursor-not-allowed" : getButtonStyle(score.player1Won)
                )}
              >
                {getButtonContent(score.player1Won)}
              </button>
              <button
                onClick={() => !match.completed && !isGameDisabled && onScoreUpdate(match.id, index, false)}
                disabled={match.completed || isGameDisabled}
                className={cn(
                  "w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center",
                  isGameDisabled ? "bg-gray-200 cursor-not-allowed" : getButtonStyle(score.player2Won)
                )}
              >
                {getButtonContent(score.player2Won)}
              </button>
            </div>
          );
        })}
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
      
      {isMatchDecided && !match.completed && (
        <div className="mt-2 text-center text-sm text-orange-500">
          Match entschieden - weitere Spiele deaktiviert
        </div>
      )}
    </div>
  );
};
