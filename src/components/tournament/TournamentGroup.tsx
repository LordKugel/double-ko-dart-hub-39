
import { Match as MatchType } from "@/types/tournament";
import { Match } from "./Match";

interface TournamentGroupProps {
  title: string;
  titleColor: string;
  matches: MatchType[];
  onScoreUpdate: (matchId: string, gameIndex: number, player1Won: boolean) => void;
}

export const TournamentGroup = ({
  title,
  titleColor,
  matches,
  onScoreUpdate
}: TournamentGroupProps) => {
  const rounds = Array.from(new Set(matches.map(m => m.round)));

  return (
    <div className="mb-12">
      <h2 className={`text-2xl font-bold mb-6 ${titleColor}`}>{title}</h2>
      {rounds.map(round => (
        <div key={round} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Runde {round}</h3>
          <div className="grid gap-6">
            {matches
              .filter(match => match.round === round)
              .map(match => (
                <Match
                  key={match.id}
                  match={match}
                  onScoreUpdate={onScoreUpdate}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
