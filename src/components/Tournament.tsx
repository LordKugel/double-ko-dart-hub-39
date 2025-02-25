
import { TournamentControls } from "./tournament/TournamentControls";
import { PlayersList } from "./tournament/PlayersList";
import { MatchesTable } from "./tournament/MatchesTable";
import { Match } from "./tournament/Match";
import { useTournament } from "@/hooks/useTournament";

export const Tournament = () => {
  const { tournament, handleScoreUpdate, handleMatchComplete, generatePlayers, startTournament, exportTournamentData } = useTournament();

  const currentMatches = tournament.matches.filter(m => 
    !m.completed && 
    !tournament.winnersBracketMatches.some(wm => wm.id === m.id) &&
    !tournament.losersBracketMatches.some(lm => lm.id === m.id)
  );

  const winner = tournament.completed ? tournament.players.find(p => !p.eliminated) : null;

  return (
    <div className="container mx-auto p-4 max-w-7xl animate-fade-in pb-[400px]">
      <h1 className="text-3xl font-bold text-center mb-8">Dart Tournament</h1>
      
      {winner && (
        <div className="mb-12 text-center animate-fade-in">
          <h2 className="text-6xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 mb-4">
            🏆 Turniersieger 🏆
          </h2>
          <div className="text-4xl font-bold">
            {winner.firstName} {winner.lastName}
          </div>
          {winner.team && (
            <div className="text-2xl text-gray-600 mt-2">
              Team: {winner.team}
            </div>
          )}
        </div>
      )}
      
      <TournamentControls
        onGeneratePlayers={generatePlayers}
        onStartTournament={startTournament}
        onExportData={exportTournamentData}
        isStarted={tournament.started}
        hasPlayers={tournament.players.length > 0}
        matches={tournament.matches}
        currentRound={tournament.currentRound}
        roundStarted={tournament.roundStarted}
      />

      {!tournament.started ? (
        <PlayersList 
          players={tournament.players}
          title="Alle Spieler"
        />
      ) : (
        <div className="mt-8">
          <div className="flex justify-between relative space-x-4">
            <div className="w-1/6">
              <h2 className="text-xl font-bold mb-4">Winner's Bracket (Runde {tournament.currentRound})</h2>
              <PlayersList 
                players={tournament.players.filter(p => p.bracket === "winners")}
                title="Aktive Spieler"
              />
              {tournament.winnersBracketMatches
                .filter(m => !m.completed && m.round === tournament.currentRound)
                .map(match => (
                  <Match
                    key={match.id}
                    match={match}
                    onScoreUpdate={handleScoreUpdate}
                    onMatchComplete={handleMatchComplete}
                  />
              ))}
            </div>

            <div className="w-2/3">
              <h2 className="text-xl font-bold mb-4">Aktuelle Matches</h2>
              {currentMatches.map(match => (
                <Match
                  key={match.id}
                  match={match}
                  onScoreUpdate={handleScoreUpdate}
                  onMatchComplete={handleMatchComplete}
                />
              ))}
            </div>

            <div className="w-1/6">
              <h2 className="text-xl font-bold mb-4">Loser's Bracket (Runde {tournament.currentRound})</h2>
              <PlayersList 
                players={tournament.players.filter(p => p.bracket === "losers")}
                title="Aktive Spieler"
              />
              {tournament.losersBracketMatches
                .filter(m => !m.completed && m.round === tournament.currentRound)
                .map(match => (
                  <Match
                    key={match.id}
                    match={match}
                    onScoreUpdate={handleScoreUpdate}
                    onMatchComplete={handleMatchComplete}
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
                  onMatchComplete={handleMatchComplete}
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
