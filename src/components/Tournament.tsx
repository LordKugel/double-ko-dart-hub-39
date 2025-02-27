
import { TournamentControls } from "./tournament/TournamentControls";
import { PlayersList } from "./tournament/PlayersList";
import { MatchesTable } from "./tournament/MatchesTable";
import { TournamentBracket } from "./tournament/TournamentBracket";
import { MachineOverview } from "./tournament/MachineOverview";
import { MachineManagement } from "./tournament/MachineManagement";
import { useTournament } from "@/hooks/useTournament";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const Tournament = () => {
  const { 
    tournament, 
    handleScoreUpdate, 
    generatePlayers, 
    startTournament, 
    exportTournamentData, 
    updateNumberOfMachines,
    updateMachine,
    assignMatchToMachine
  } = useTournament();

  const [showMatchesTable, setShowMatchesTable] = useState(false);
  const [editingMachines, setEditingMachines] = useState(false);
  const [tempMachines, setTempMachines] = useState(tournament?.numberOfMachines || 3);

  const winner = tournament?.completed ? tournament.players.find(p => !p.eliminated) : null;

  const availableMatches = tournament?.matches?.filter(match => 
    match.round === tournament.currentRound && 
    !match.completed &&
    (!match.machineNumber || match.machineNumber === null)
  ) || [];

  const activeMatches = tournament?.matches?.filter(match => 
    match.round === tournament.currentRound && 
    !match.completed &&
    match.machineNumber !== null &&
    match.machineNumber !== undefined
  ) || [];

  const handleMatchClick = (matchId: string) => {
    const availableMachine = tournament.machines.find(machine => 
      !machine.isOutOfOrder && !machine.currentMatchId
    );

    if (availableMachine) {
      assignMatchToMachine(availableMachine.id, matchId);
    }
  };

  if (!tournament) {
    return <div>Lade Turnier...</div>;
  }

  const handleMachineNumberUpdate = () => {
    updateNumberOfMachines(tempMachines);
    setEditingMachines(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
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

        <div className="flex justify-center gap-4 mb-4">
          {editingMachines ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max="10"
                value={tempMachines}
                onChange={(e) => setTempMachines(Number(e.target.value))}
                className="w-20"
              />
              <Button onClick={handleMachineNumberUpdate} variant="outline">
                Speichern
              </Button>
              <Button onClick={() => setEditingMachines(false)} variant="ghost">
                Abbrechen
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setEditingMachines(true)}
              variant="outline"
              className="mb-4"
            >
              Automaten Anzahl: {tournament.numberOfMachines || 3}
            </Button>
          )}
        </div>
        
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

        {tournament.started && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Automaten-Verwaltung</h2>
            <MachineManagement
              machines={tournament.machines}
              onUpdateMachine={updateMachine}
              onAssignMatch={assignMatchToMachine}
              availableMatches={availableMatches}
            />
          </div>
        )}

        {!tournament.started ? (
          <PlayersList 
            players={tournament.players}
            matches={tournament.matches}
            title="Alle Spieler"
          />
        ) : (
          <>
            <TournamentBracket 
              matches={tournament.matches}
              currentRound={tournament.currentRound}
              onScoreUpdate={handleScoreUpdate}
              onMatchClick={handleMatchClick}
            />

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Ausgeschiedene Spieler</h2>
              <PlayersList 
                players={tournament.players.filter(p => p.eliminated)}
                matches={tournament.matches}
                title="Eliminierte Spieler"
              />
            </div>
          </>
        )}

        {showMatchesTable && <MatchesTable matches={tournament.matches} />}
        
        {tournament.started && (
          <MachineOverview 
            activeMatches={activeMatches}
            maxMachines={tournament.numberOfMachines || 3}
          />
        )}
      </div>
    </DndProvider>
  );
};
