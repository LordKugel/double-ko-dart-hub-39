
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
import { CurrentMatchCards } from "./tournament/CurrentMatchCards";
import { Cog, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { MarqueeText } from "./tournament/MarqueeText";
import { toast } from "./ui/use-toast";

export const Tournament = () => {
  const { 
    tournament, 
    handleScoreUpdate, 
    generatePlayers, 
    startTournament, 
    exportTournamentData, 
    updateNumberOfMachines,
    updateMachine,
    assignMatchToMachine,
    confirmMatchResult,
    resetTournament
  } = useTournament();

  const [showMatchesTable, setShowMatchesTable] = useState(false);
  const [showMachineManagement, setShowMachineManagement] = useState(false);
  const [editingMachines, setEditingMachines] = useState(false);
  const [tempMachines, setTempMachines] = useState(tournament?.numberOfMachines || 3);

  const winner = tournament?.completed ? tournament.players.find(p => !p.eliminated) : null;

  const availableMatches = tournament?.matches?.filter(match => 
    match.round === tournament.currentRound && 
    !match.completed &&
    (!match.machineNumber || match.machineNumber === null)
  ) || [];

  const winnersMatches = availableMatches.filter(match => match.bracket === "winners");
  const losersMatches = availableMatches.filter(match => match.bracket === "losers");
  const finalMatches = availableMatches.filter(match => match.bracket === "final");

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
      toast({
        title: "Match zugewiesen",
        description: `Match wurde automatisch Automat ${availableMachine.id} zugewiesen`
      });
    } else {
      toast({
        title: "Kein Automat verfügbar",
        description: "Es gibt aktuell keinen freien Automaten",
        variant: "destructive"
      });
    }
  };

  const getMatchForMachine = (machineId: number) => {
    return tournament.matches.find(m => 
      m.machineNumber === machineId && !m.completed
    ) || null;
  };

  const canConfirmMatch = (machineId: number) => {
    const match = getMatchForMachine(machineId);
    if (!match) return false;
    
    // Prüfen, ob alle 3 Spiele gespielt wurden
    const player1Wins = match.scores.filter(s => s.player1Won).length;
    const player2Wins = match.scores.filter(s => s.player2Won).length;
    return player1Wins + player2Wins === 3;
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
      <div className="container mx-auto p-4 max-w-7xl animate-fade-in pb-[400px] bg-[#0A0F1A]">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Dart Tournament</h1>
        
        <div className="flex justify-center gap-4 mb-4">
          <Button
            onClick={resetTournament}
            variant="outline"
            className="flex items-center gap-2 text-red-500 hover:bg-red-900/20 hover:text-red-400 border-red-800"
          >
            <RefreshCw className="h-4 w-4" />
            Turnier zurücksetzen
          </Button>
        </div>
        
        {winner && (
          <div className="mb-12 text-center animate-fade-in bg-gradient-to-r from-yellow-900/30 via-yellow-800/40 to-yellow-900/30 p-8 rounded-xl border border-yellow-700 shadow-lg">
            <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              🏆 Turniersieger 🏆
            </h2>
            <div className="text-3xl font-bold text-yellow-400">
              {winner.firstName} {winner.lastName}
            </div>
            {winner.team && (
              <div className="text-xl text-yellow-300 mt-2">
                Team: {winner.team}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center gap-4 mb-4">
          <Button
            onClick={() => setShowMachineManagement(!showMachineManagement)}
            variant="outline"
            className="mb-4 flex items-center gap-2 border-blue-700 text-blue-400 hover:bg-blue-900/20"
          >
            <Cog className="h-4 w-4" />
            Automaten-Verwaltung {tournament.numberOfMachines || 3}
            {showMachineManagement ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {showMachineManagement && (
          <div className="mb-4 p-4 bg-[#121824] rounded-lg border border-blue-900/50 animate-fade-in">
            <div className="flex justify-center gap-4 mb-4">
              {editingMachines ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={tempMachines}
                    onChange={(e) => setTempMachines(Number(e.target.value))}
                    className="w-20 bg-[#1A2133] border-blue-900/50 text-white"
                  />
                  <Button onClick={handleMachineNumberUpdate} variant="outline" className="border-blue-700 text-blue-400">
                    Speichern
                  </Button>
                  <Button onClick={() => setEditingMachines(false)} variant="ghost" className="text-gray-400">
                    Abbrechen
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setEditingMachines(true)}
                  variant="outline"
                  className="border-blue-700 text-blue-400"
                >
                  Automaten Anzahl: {tournament.numberOfMachines || 3}
                </Button>
              )}
            </div>
            
            <MachineManagement
              machines={tournament.machines}
              onUpdateMachine={updateMachine}
              onAssignMatch={assignMatchToMachine}
              onConfirmMatch={confirmMatchResult}
              getMatchForMachine={getMatchForMachine}
              canConfirmMatch={canConfirmMatch}
              availableMatches={availableMatches}
            />
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

        {tournament.started && tournament.players.filter(p => p.eliminated).length > 0 && (
          <div className="my-4">
            <MarqueeText>
              Ausgeschiedene Spieler: {tournament.players.filter(p => p.eliminated).map(p => `${p.firstName} ${p.lastName}`).join(' • ')}
            </MarqueeText>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="col-span-1 bg-[#0e1627] p-4 rounded-lg border border-[#0FA0CE]/30">
                <h2 className="text-xl font-bold mb-4 text-[#0FA0CE]">Winner's Bracket</h2>
                <CurrentMatchCards
                  matches={winnersMatches}
                  title={`Runde ${tournament.currentRound}`}
                  onScoreUpdate={handleScoreUpdate}
                  onMatchClick={handleMatchClick}
                />
              </div>
              
              <div className="col-span-1 md:col-span-1">
                <TournamentBracket 
                  matches={tournament.matches}
                  currentRound={tournament.currentRound}
                  onScoreUpdate={handleScoreUpdate}
                  onMatchClick={handleMatchClick}
                />
              </div>
              
              <div className="col-span-1 bg-[#1c1018] p-4 rounded-lg border border-red-900/30">
                <h2 className="text-xl font-bold mb-4 text-red-500">Loser's Bracket</h2>
                <CurrentMatchCards
                  matches={losersMatches}
                  title={`Runde ${tournament.currentRound}`}
                  onScoreUpdate={handleScoreUpdate}
                  onMatchClick={handleMatchClick}
                />
                
                {finalMatches.length > 0 && (
                  <div className="mt-8 bg-[#1e173a] p-4 rounded-lg border border-[#8B5CF6]/30">
                    <h2 className="text-xl font-bold mb-4 text-[#8B5CF6]">Finale</h2>
                    <CurrentMatchCards
                      matches={finalMatches}
                      title="Finale"
                      onScoreUpdate={handleScoreUpdate}
                      onMatchClick={handleMatchClick}
                    />
                  </div>
                )}
              </div>
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
