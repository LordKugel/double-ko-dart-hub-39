
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

  const handleExportData = () => {
    // Öffne Excel-Export in neuem Fenster/Tab
    exportTournamentData(true);
  }

  // Ausgeschiedene Spieler abrufen
  const eliminatedPlayers = tournament.players.filter(p => p.eliminated);

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
            onExportData={handleExportData}
            isStarted={tournament.started}
            hasPlayers={tournament.players.length > 0}
            matches={tournament.matches}
            currentRound={tournament.currentRound}
            roundStarted={tournament.roundStarted}
            onToggleMatchesTable={() => setShowMatchesTable(!showMatchesTable)}
            showMatchesTable={showMatchesTable}
          />

          {tournament.started && eliminatedPlayers.length > 0 && (
            <div className="my-4">
              <MarqueeText>
                Ausgeschiedene Spieler: {eliminatedPlayers.map(p => `${p.firstName} ${p.lastName}`).join(' • ')}
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
            <div className="flex flex-row gap-6 mb-8">
              {/* Seitenleiste für Winner/Loser/Freilos */}
              <div className="w-64 flex flex-col gap-6">
                {/* Winner's Bracket */}
                <div className="bg-[#0e1627] p-4 rounded-lg border border-[#0FA0CE]/30">
                  <h2 className="text-xl font-bold mb-4 text-[#0FA0CE]">Winner's Bracket</h2>
                  {tournament.byePlayer && (
                    <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg">
                      <h4 className="text-sm font-semibold text-green-400">Freilos Runde {tournament.currentRound + 1}</h4>
                      <div className="flex flex-col">
                        <span className="text-green-300">
                          {tournament.byePlayer.firstName} {tournament.byePlayer.lastName}
                        </span>
                        {tournament.byePlayer.team && (
                          <span className="text-xs text-green-400">
                            Team: {tournament.byePlayer.team}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {winnersMatches.length > 0 ? (
                    <div className="space-y-3">
                      {winnersMatches.map(match => (
                        <div 
                          key={match.id} 
                          className="p-2 bg-[#121824] rounded border border-[#0FA0CE]/20 hover:border-[#0FA0CE]/50 cursor-pointer"
                          onClick={() => handleMatchClick(match.id)}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-white">{match.player1.firstName} {match.player1.lastName}</span>
                              {match.player1.team && (
                                <span className="text-xs text-gray-400">{match.player1.team}</span>
                              )}
                            </div>
                            <div className="border-t border-gray-700 my-1" />
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-white">{match.player2.firstName} {match.player2.lastName}</span>
                              {match.player2.team && (
                                <span className="text-xs text-gray-400">{match.player2.team}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">Keine aktiven Matches</div>
                  )}
                </div>
                
                {/* Loser's Bracket */}
                <div className="bg-[#1c1018] p-4 rounded-lg border border-red-900/30">
                  <h2 className="text-xl font-bold mb-4 text-red-500">Loser's Bracket</h2>
                  {losersMatches.length > 0 ? (
                    <div className="space-y-3">
                      {losersMatches.map(match => (
                        <div 
                          key={match.id} 
                          className="p-2 bg-[#121824] rounded border border-red-900/20 hover:border-red-900/50 cursor-pointer"
                          onClick={() => handleMatchClick(match.id)}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-white">{match.player1.firstName} {match.player1.lastName}</span>
                              {match.player1.team && (
                                <span className="text-xs text-gray-400">{match.player1.team}</span>
                              )}
                            </div>
                            <div className="border-t border-gray-700 my-1" />
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-white">{match.player2.firstName} {match.player2.lastName}</span>
                              {match.player2.team && (
                                <span className="text-xs text-gray-400">{match.player2.team}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">Keine aktiven Matches</div>
                  )}
                </div>
                
                {/* Finale */}
                {finalMatches.length > 0 && (
                  <div className="bg-[#1e173a] p-4 rounded-lg border border-[#8B5CF6]/30">
                    <h2 className="text-xl font-bold mb-4 text-[#8B5CF6]">Finale</h2>
                    <div className="space-y-3">
                      {finalMatches.map(match => (
                        <div 
                          key={match.id} 
                          className="p-2 bg-[#121824] rounded border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 cursor-pointer"
                          onClick={() => handleMatchClick(match.id)}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-white">{match.player1.firstName} {match.player1.lastName}</span>
                              {match.player1.team && (
                                <span className="text-xs text-gray-400">{match.player1.team}</span>
                              )}
                            </div>
                            <div className="border-t border-gray-700 my-1" />
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-white">{match.player2.firstName} {match.player2.lastName}</span>
                              {match.player2.team && (
                                <span className="text-xs text-gray-400">{match.player2.team}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Ausgeschiedene Spieler */}
                {eliminatedPlayers.length > 0 && (
                  <div className="bg-[#1A1721] p-4 rounded-lg border border-gray-700">
                    <h2 className="text-lg font-bold mb-3 text-gray-400">Ausgeschieden</h2>
                    <div className="space-y-2">
                      {eliminatedPlayers.map(player => (
                        <div key={player.id} className="text-sm text-gray-400 flex justify-between">
                          <span>{player.firstName} {player.lastName}</span>
                          {player.team && <span className="text-xs">{player.team}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
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
