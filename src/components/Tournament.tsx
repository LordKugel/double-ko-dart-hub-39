
import { TournamentControls } from "./tournament/TournamentControls";
import { PlayersList } from "./tournament/PlayersList";
import { MatchesTable } from "./tournament/MatchesTable";
import { TournamentBracket } from "./tournament/TournamentBracket";
import { MachineOverview } from "./tournament/MachineOverview";
import { useTournament } from "@/hooks/useTournament";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CurrentMatchCards } from "./tournament/CurrentMatchCards";
import { Plus, Minus, RefreshCw } from "lucide-react";
import { MarqueeText } from "./tournament/MarqueeText";
import { toast } from "./ui/use-toast";
import { TooltipProvider } from "./ui/tooltip";

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
  const [playerCount, setPlayerCount] = useState<number>(8);

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
    // Erst Favoriten-Automaten durchsuchen, dann die anderen
    const favoriteMachine = tournament.machines.find(machine => 
      machine.isFavorite && !machine.isOutOfOrder && !machine.currentMatchId
    );
    
    // Wenn kein Favorit verfügbar ist, suche nach einem anderen freien Automaten
    const availableMachine = favoriteMachine || tournament.machines.find(machine => 
      !machine.isOutOfOrder && !machine.currentMatchId
    );

    if (availableMachine) {
      assignMatchToMachine(availableMachine.id, matchId);
      toast({
        title: "Match zugewiesen",
        description: `Match wurde ${favoriteMachine ? "Favoriten-" : ""}Automat ${availableMachine.id} zugewiesen`
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
    const match = tournament.matches.find(m => 
      m.machineNumber === machineId && !m.completed
    );
    
    if (match) {
      return match;
    }
    
    return null;
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

  const handleIncreaseMachines = () => {
    if (tournament.numberOfMachines < 10) {
      updateNumberOfMachines(tournament.numberOfMachines + 1);
    }
  };

  const handleDecreaseMachines = () => {
    if (tournament.numberOfMachines > 1) {
      updateNumberOfMachines(tournament.numberOfMachines - 1);
    }
  };

  const handleGeneratePlayers = () => {
    generatePlayers(playerCount);
  };

  return (
    <TooltipProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="container mx-auto p-4 max-w-7xl animate-fade-in pb-[400px] bg-[#0A0F1A]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Dart Tournament</h1>
            
            <div className="flex items-center space-x-4">
              {!tournament.started && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="2"
                    max="16"
                    value={playerCount}
                    onChange={(e) => setPlayerCount(Number(e.target.value))}
                    className="w-16 h-8 bg-[#1A2133] border-blue-900/50 text-white text-sm"
                  />
                  <Button 
                    onClick={handleGeneratePlayers}
                    className="h-8 text-xs"
                    variant="outline"
                  >
                    Generate Players
                  </Button>
                </div>
              )}
              
              <Button
                onClick={resetTournament}
                variant="outline"
                className="h-8 text-xs flex items-center gap-1 text-red-500 hover:bg-red-900/20 hover:text-red-400 border-red-800"
              >
                <RefreshCw className="h-3 w-3" />
                Turnier zurücksetzen
              </Button>
            </div>
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
              <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-8">
                <div className="col-span-1 md:col-span-2 bg-[#0e1627] p-4 rounded-lg border border-[#0FA0CE]/30">
                  <h2 className="text-xl font-bold mb-4 text-[#0FA0CE]">Winner's Bracket</h2>
                  <CurrentMatchCards
                    matches={winnersMatches}
                    title={`Runde ${tournament.currentRound}`}
                    onScoreUpdate={handleScoreUpdate}
                    onMatchClick={handleMatchClick}
                  />
                </div>
                
                <div className="col-span-1 md:col-span-3">
                  <TournamentBracket 
                    matches={tournament.matches}
                    currentRound={tournament.currentRound}
                    onMatchClick={handleMatchClick}
                    machines={tournament.machines}
                    onAssignMatch={assignMatchToMachine}
                    hideScoreControls={true}
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2 bg-[#1c1018] p-4 rounded-lg border border-red-900/30">
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
              machines={tournament.machines}
              availableMatches={availableMatches}
              onUpdateMachine={updateMachine}
              onAssignMatch={assignMatchToMachine}
              onConfirmMatch={confirmMatchResult}
              getMatchForMachine={getMatchForMachine}
              canConfirmMatch={canConfirmMatch}
              onScoreUpdate={handleScoreUpdate}
              onIncreaseMaxMachines={handleIncreaseMachines}
              onDecreaseMaxMachines={handleDecreaseMachines}
            />
          )}
        </div>
      </DndProvider>
    </TooltipProvider>
  );
};
