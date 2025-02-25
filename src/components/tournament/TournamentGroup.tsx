
import { Match } from "./Match";
import { Match as MatchType } from "@/types/tournament";

interface TournamentGroupProps {
  matches: MatchType[];
  title: string;
  onScoreUpdate: (matchId: string, gameIndex: number, player1Won: boolean) => void;
  onMatchComplete: (matchId: string) => void;
}

export const TournamentGroup = ({ matches, title, onScoreUpdate, onMatchComplete }: TournamentGroupProps) => {
  if (matches.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="space-y-4">
        {matches.map((match) => (
          <Match
            key={match.id}
            match={match}
            onScoreUpdate={onScoreUpdate}
            onMatchComplete={onMatchComplete}
          />
        ))}
      </div>
    </div>
  );
};
