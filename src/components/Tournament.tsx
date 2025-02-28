
import { TournamentControls } from "./tournament/TournamentControls";
import { PlayersList } from "./tournament/PlayersList";
import { MatchesTable } from "./tournament/MatchesTable";
import { TournamentBracket } from "./tournament/TournamentBracket";
import { MachineOverview } from "./tournament/MachineOverview";
import { useTournament } from "@/hooks/useTournament";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "./ui/use-toast";
import { TooltipProvider } from "./ui/tooltip";
import { WinnerAnnouncement } from "./tournament/WinnerAnnouncement";
import { BracketSidebar } from "./tournament/BracketSidebar";
import { PlayerCountControls } from "./tournament/PlayerCountControls";

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

  const winner = tournament?.completed ? tournament.players.find(p => !p.eliminated) : null;

  // Nur Matches der aktuellen Runde, die nicht zugewiesen oder gestartet sind
  const availableMatches = tournament?.matches?.filter(match => 
    match.round === tournament.currentRound && 
    !match.completed &&
    (!match.machineNumber || match.machineNumber === null)
  ) || [];

  const winnersMatches = availableMatches.filter(match => match.bracket === "winners");
  const losersMatches = availableMatches.filter(match => match.bracket === "losers");
  const finalMatches = availableMatches.filter(match => match.bracket === "final");

  // Liste aller Spieler in laufenden oder anstehenden Matches dieser Runde
  const allPlayersInCurrentRound = tournament.matches
    .filter(match => match.round === tournament.currentRound)
    .flatMap(match => [match.player1.id, match.player2.id]);

  // Spieler, die aktuell einem Automaten zugewiesen sind (also in einem laufenden Match)
  const playersInActiveMatches = tournament.matches
    .filter(match => 
      match.round === tournament.currentRound && 
      !match.completed && 
      match.machineNumber !== null
    )
    .flatMap(match => [match.player1.id, match.player2.id]);

  // Spieler mit Freilos in dieser Runde
  const byePlayers = tournament.players.filter(player => 
    player.hasBye && !player.eliminated
  );

  // Aktive Spieler aus dem Winnerbracket, die nicht in einem laufenden Match sind und kein Freilos haben
  const activeWinnerPlayers = tournament.players.filter(player => 
    !player.eliminated && 
    player.bracket === "winners" && 
    !playersInActiveMatches.includes(player.id) &&
    !allPlayersInCurrentRound.includes(player.id) &&
    !player.hasBye
  );

  // Aktive Spieler aus dem Loserbracket, die nicht in einem laufenden Match sind
  const activeLoserPlayers = tournament.players.filter(player => 
    !player.eliminated && 
    player.bracket === "losers" && 
    !playersInActiveMatches.includes(player.id) &&
    !allPlayersInCurrentRound.includes(player.id)
  );

  // Ausgeschiedene Spieler
  const eliminatedPlayers = tournament.players.filter(p => p.eliminated);

  // Matches, die aktuell einem Automaten zugewiesen sind
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

  const handleExportData = () => {
    // Öffne Excel-Export in neuem Fenster/Tab
    exportTournamentData(true);
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

  return (
    <TooltipProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="container mx-auto p-4 max-w-7xl animate-fade-in pb-[400px] bg-[#0A0F1A]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Dart Tournament</h1>
            
            <div className="flex items-center space-x-4">
              {!tournament.started && (
                <PlayerCountControls 
                  onGeneratePlayers={generatePlayers}
                  onResetTournament={resetTournament}
                />
              )}
            </div>
          </div>
          
          {winner && <WinnerAnnouncement winner={winner} />}
          
          <TournamentControls
            onGeneratePlayers={generatePlayers}
            onStartTournament={startTournament}
            onExportData={handleExportData}
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
              matches={tournament.matches}
              title="Alle Spieler"
            />
          ) : (
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {/* Seitenleiste für Winner/Loser/Freilos - jetzt als separate Komponente */}
              <BracketSidebar 
                byePlayers={byePlayers}
                activeWinnerPlayers={activeWinnerPlayers}
                activeLoserPlayers={activeLoserPlayers}
                eliminatedPlayers={eliminatedPlayers}
                winnersMatches={winnersMatches}
                losersMatches={losersMatches}
                finalMatches={finalMatches}
              />
              
              {/* Turnierbaum (nimmt den restlichen Platz ein) */}
              <div className="flex-1">
                <TournamentBracket 
                  matches={tournament.matches}
                  currentRound={tournament.currentRound}
                  onMatchClick={handleMatchClick}
                  machines={tournament.machines}
                  onAssignMatch={assignMatchToMachine}
                  hideScoreControls={true}
                />
              </div>
            </div>
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
