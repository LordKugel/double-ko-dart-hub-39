
import { TournamentControls } from "./tournament/TournamentControls";
import { PlayersList } from "./tournament/PlayersList";
import { MatchesTable } from "./tournament/MatchesTable";
import { Match } from "./tournament/Match";
import { useTournament } from "@/hooks/useTournament";

export const Tournament = () => {
  const { tournament, handleScoreUpdate, generatePlayers, startTournament } = useTournament();

  return (
    <div className="container mx-auto p-4 max-w-4xl animate-fade-in pb-[400px]">
      <h1 className="text-3xl font-bold text-center mb-8">Dart Tournament</h1>
      
      <TournamentControls
        onGeneratePlayers={generatePlayers}
        onStartTournament={startTournament}
        isStarted={tournament.started}
        hasPlayers={tournament.players.length > 0}
        matches={tournament.matches}
      />

      {!tournament.started ? (
        <PlayersList 
          players={tournament.players}
          title="Alle Spieler"
        />
      ) : (
        <div className="mt-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Winner's Bracket</h2>
              <PlayersList 
                players={tournament.players.filter(p => p.bracket === "winners")}
                title="Aktive Spieler"
              />
              {tournament.winnersBracketMatches.map(match => (
                <Match
                  key={match.id}
                  match={match}
                  onScoreUpdate={handleScoreUpdate}
                />
              ))}
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">Loser's Bracket</h2>
              <PlayersList 
                players={tournament.players.filter(p => p.bracket === "losers")}
                title="Aktive Spieler"
              />
              {tournament.losersBracketMatches.map(match => (
                <Match
                  key={match.id}
                  match={match}
                  onScoreUpdate={handleScoreUpdate}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Ausgeschiedene Spieler</h2>
            <PlayersList 
              players={tournament.players.filter(p => p.eliminated)}
              title="Eliminierte Spieler"
            />
          </div>

          {tournament.finalMatches.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Finals</h2>
              {tournament.finalMatches.map(match => (
                <Match
                  key={match.id}
                  match={match}
                  onScoreUpdate={handleScoreUpdate}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <MatchesTable matches={tournament.matches} />
    </div>
  );
};
