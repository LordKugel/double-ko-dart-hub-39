
import { Match as MatchType } from "../types/tournament";
import { cn } from "@/lib/utils";

interface MatchProps {
  match: MatchType;
  onScoreUpdate: (matchId: string, gameIndex: number, player1Won: boolean) => void;
}

export const Match = ({ match, onScoreUpdate }: MatchProps) => {
  const getButtonStyle = (won: boolean | null) => {
    if (won === null) return "bg-gray-300";
    return won ? "bg-green-500 text-white" : "bg-red-500 text-white";
  };

  const getButtonContent = (won: boolean | null) => {
    if (won === null) return "-";
    return won ? "✓" : "×";
  };

  if (match.player1.id === "tbd" || match.player2.id === "tbd") {
    return (
      <div className="bg-gray-100 rounded-lg shadow-md p-4 mb-4 animate-fade-in opacity-50">
        <div className="text-center text-gray-500">
          Waiting for players...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-fade-in">
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
