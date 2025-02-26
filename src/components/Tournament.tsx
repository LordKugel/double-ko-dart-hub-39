
import { TournamentControls } from "./tournament/TournamentControls";
import { PlayersList } from "./tournament/PlayersList";
import { MatchesTable } from "./tournament/MatchesTable";
import { TournamentBracket } from "./tournament/TournamentBracket";
import { MachineOverview } from "./tournament/MachineOverview";
import { useTournament } from "@/hooks/useTournament";
import { useState } from "react";

export const Tournament = () => {
  const { tournament, handleScoreUpdate, generatePlayers, startTournament, exportTournamentData } = useTournament();
  const [showMatchesTable, setShowMatchesTable] = useState(false);

  const winner = tournament.completed ? tournament.players.find(p => !p.eliminated) : null;

  // Aktive Matches sind solche, die in der aktuellen Runde sind und mindestens einen Punkt haben
  const activeMatches = tournament.matches.filter(match => 
    match.round === tournament.currentRound && 
    !match.completed &&
    match.scores.some(score => score.player1Won !== null || score.player2Won !== null)
  );

  return (
    <div className="container mx-auto p-4 max-w-7xl animate-fade-in pb-[400px]">
      <h1 className="text-3xl font-bold text-center mb-8">Dart Tournament</h1>
      
      {winner && (
        <div className="mb-12 text-center animate-fade-in bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 p-8 rounded-xl border border-yellow-200 shadow-lg">
          <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            🏆 Turniersieger 🏆
          </h2>
          <div className="text-3xl font-bold text-yellow-700">
            {winner.firstName} {winner.lastName}
          </div>
          {winner.team && (
            <div className="text-xl text-yellow-600 mt-2">
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
        onToggleMatchesTable={() => setShowMatchesTable(!showMatchesTable)}
        showMatchesTable={showMatchesTable}
      />

      {!tournament.started ? (
        <PlayersList 
          players={tournament.players}
          title="Alle Spieler"
        />
      ) : (
        <>
          <TournamentBracket 
            matches={tournament.matches}
            currentRound={tournament.currentRound}
            onScoreUpdate={handleScoreUpdate}
          />

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Ausgeschiedene Spieler</h2>
            <PlayersList 
              players={tournament.players.filter(p => p.eliminated)}
              title="Eliminierte Spieler"
            />
          </div>
        </>
      )}

      {showMatchesTable && <MatchesTable matches={tournament.matches} />}
      
      {tournament.started && (
        <MachineOverview 
          activeMatches={activeMatches}
          maxMachines={3}
        />
      )}
    </div>
  );
};
