
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MatchScoreProps {
  score: { player1Won: boolean | null; player2Won: boolean | null; };
  index: number;
  isPlayer1: boolean;
  onScoreUpdate: (index: number, player1Won: boolean) => void;
}

export const MatchScore = ({ score, index, isPlayer1, onScoreUpdate }: MatchScoreProps) => {
  const isWinner = isPlayer1 ? score.player1Won : score.player2Won;
  const isLoser = isPlayer1 ? score.player2Won : score.player1Won;

  return (
    <Button
      size="sm"
      variant={isWinner === null ? "outline" : isWinner ? "default" : "ghost"}
      className={cn(
        "w-6 h-6 p-0 text-xs",
        isWinner && "bg-[#0FA0CE] hover:bg-[#0FA0CE]/80",
        isWinner === false && "bg-red-500 hover:bg-red-600"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onScoreUpdate(index, isPlayer1);
      }}
    >
      {isWinner === null ? "-" : isWinner ? "W" : "L"}
    </Button>
  );
};
