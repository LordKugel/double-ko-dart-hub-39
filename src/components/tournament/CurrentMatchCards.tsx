
import { Match as MatchType } from "@/types/tournament";
import { DraggableMatchCard } from "./bracket/DraggableMatchCard";

interface CurrentMatchCardsProps {
  matches: MatchType[];
  title: string;
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
  onMatchClick?: (matchId: string) => void;
}

export const CurrentMatchCards = ({
  matches,
  title,
  onScoreUpdate,
  onMatchClick
}: CurrentMatchCardsProps) => {
  if (matches.length === 0) {
    return (
      <div className="text-center p-4 text-gray-400">
        Keine aktiven Matches
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 text-center text-gray-400">{title}</h3>
      <div className="space-y-4">
        {matches.map((match, index) => (
          <DraggableMatchCard
            key={match.id}
            match={match}
            isCurrentRound={true}
            verticalPosition={0}
            previousMatches={[]}
            onScoreUpdate={onScoreUpdate}
            hideScoreControls={true} // Immer verstecken
            onMatchClick={onMatchClick}
          />
        ))}
      </div>
    </div>
  );
};
