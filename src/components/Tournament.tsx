import { TournamentControls } from "./tournament/TournamentControls";
import { PlayersList } from "./tournament/PlayersList";
import { TournamentBracket } from "./tournament/TournamentBracket";
import { MachineOverview } from "./tournament/MachineOverview";
import { useTournament } from "@/hooks/useTournament";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TooltipProvider } from "./ui/tooltip";
import { WinnerAnnouncement } from "./tournament/WinnerAnnouncement";
import { BracketSidebar } from "./tournament/BracketSidebar";
import { PlayerCountControls } from "./tournament/PlayerCountControls";
import * as XLSX from 'xlsx';
import { Button } from "./ui/button";
import { Player } from "@/types/tournament";

export const Tournament = () => {
  const { 
    tournament, 
    handleScoreUpdate, 
    generatePlayers, 
    startTournament, 
    updateNumberOfMachines,
    updateMachine,
    assignMatchToMachine,
    confirmMatchResult,
    resetTournament,
    setTournament
  } = useTournament();

  const winner = tournament?.completed ? tournament.players.find(p => !p.eliminated) : null;

  const availableMatches = tournament?.matches?.filter(match => 
    match.round === tournament.currentRound && 
    !match.completed &&
    (!match.machineNumber || match.machineNumber === null)
  ) || [];

  const winnersMatches = availableMatches.filter(match => match.bracket === "winners");
  const losersMatches = availableMatches.filter(match => match.bracket === "losers");
  const finalMatches = availableMatches.filter(match => match.bracket === "final");

  const playersInActiveUnfinishedMatches = tournament.matches
    .filter(match => 
      match.round === tournament.currentRound && 
      !match.completed
    )
    .flatMap(match => [match.player1.id, match.player2.id]);

  const eliminatedPlayers = tournament.players
    .filter(p => p.eliminated === true && p.bracket === null);

  const activeWinnerPlayers = tournament.players.filter(player => 
    !player.eliminated && 
    player.bracket === "winners" && 
    !playersInActiveUnfinishedMatches.includes(player.id) &&
    !player.hasBye
  );

  const activeLoserPlayers = tournament.players.filter(player => 
    !player.eliminated && 
    player.bracket === "losers" && 
    !playersInActiveUnfinishedMatches.includes(player.id)
  );

  const byePlayers = tournament.players.filter(player => 
    player.hasBye && !player.eliminated
  );

  const activeMatches = tournament?.matches?.filter(match => 
    match.round === tournament.currentRound && 
    !match.completed &&
    match.machineNumber !== null &&
    match.machineNumber !== undefined
  ) || [];

  const handleMatchClick = (matchId: string) => {
    const favoriteMachine = tournament.machines.find(machine => 
      machine.isFavorite && !machine.isOutOfOrder && !machine.currentMatchId
    );
    
    const availableMachine = favoriteMachine || tournament.machines.find(machine => 
      !machine.isOutOfOrder && !machine.currentMatchId
    );

    if (availableMachine) {
      assignMatchToMachine(availableMachine.id, matchId);
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
    
    const player1Wins = match.scores.filter(s => s.player1Won).length;
    const player2Wins = match.scores.filter(s => s.player2Won).length;
    return player1Wins + player2Wins === 3;
  };

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

  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        const players = jsonData.map((row, index) => {
          const player: Player = {
            id: `imported-${index}`,
            firstName: row.firstName || row.Vorname || "",
            lastName: row.lastName || row.Nachname || "",
            team: row.team || row.Team || "",
            winPercentage: 0,
            losses: 0,
            eliminated: false,
            bracket: "winners",
            hasBye: false
          };
          return player;
        });

        if (players.length > 0) {
          setTournament(prev => ({
            ...prev,
            players,
            matches: []
          }));
        }
      } catch (error) {
        console.error("Fehler beim Importieren der Excel-Datei:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <TooltipProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="container mx-auto p-4 max-w-7xl animate-fade-in pb-[400px] bg-[#0A0F1A]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Dart Tournament</h1>
            
            <div className="flex items-center space-x-4">
              {!tournament.started && (
                <>
                  <PlayerCountControls 
                    onGeneratePlayers={generatePlayers}
                    onResetTournament={resetTournament}
                  />
                  
                  <div className="relative">
                    <Button variant="outline" className="bg-green-700 hover:bg-green-800">
                      Excel importieren
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImportExcel}
                      />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {winner && <WinnerAnnouncement winner={winner} />}
          
          <TournamentControls
            onGeneratePlayers={generatePlayers}
            onStartTournament={startTournament}
            isStarted={tournament.started}
            hasPlayers={tournament.players.length > 0}
            matches={tournament.matches}
            currentRound={tournament.currentRound}
            roundStarted={tournament.roundStarted}
            onResetTournament={tournament.started ? resetTournament : undefined}
          />

          {!tournament.started ? (
            <PlayersList 
              players={tournament.players}
              matches={tournament.matches}
              title="Alle Spieler"
            />
          ) : (
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <BracketSidebar 
                byePlayers={byePlayers}
                activeWinnerPlayers={activeWinnerPlayers}
                activeLoserPlayers={activeLoserPlayers}
                eliminatedPlayers={eliminatedPlayers}
                winnersMatches={winnersMatches}
                losersMatches={losersMatches}
                finalMatches={finalMatches}
              />
              
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
