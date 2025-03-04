
import { TournamentControls } from "./tournament/TournamentControls";
import { TournamentBracket } from "./tournament/TournamentBracket";
import { MachineManagement } from "./tournament/MachineManagement";
import { useTournament } from "@/hooks/useTournament";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TooltipProvider } from "./ui/tooltip";
import { WinnerAnnouncement } from "./tournament/WinnerAnnouncement";
import { TournamentHeader } from "./tournament/TournamentHeader";
import { TournamentContent } from "./tournament/TournamentContent";
import { useTournamentData } from "@/hooks/useTournamentData";
import { useTournamentMatches } from "@/hooks/useTournamentMatches";

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

  const {
    availableMatches,
    winnersMatches,
    losersMatches,
    finalMatches,
    eliminatedPlayers,
    activeWinnerPlayers,
    activeLoserPlayers,
    byePlayers,
    activeMatches,
    playersInActiveUnfinishedMatches
  } = useTournamentData(tournament);

  const {
    getMatchForMachine,
    canConfirmMatch,
    handleMatchClick
  } = useTournamentMatches(tournament, assignMatchToMachine);

  const winner = tournament?.completed ? tournament.players.find(p => !p.eliminated) : null;

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
          <TournamentHeader
            started={tournament.started}
            players={tournament.players}
            onGeneratePlayers={generatePlayers}
            onResetTournament={resetTournament}
            setTournament={setTournament}
          />
          
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

          <TournamentContent
            started={tournament.started}
            players={tournament.players}
            matches={tournament.matches}
            currentRound={tournament.currentRound}
            winnersMatches={winnersMatches}
            losersMatches={losersMatches}
            finalMatches={finalMatches}
            activeWinnerPlayers={activeWinnerPlayers}
            activeLoserPlayers={activeLoserPlayers}
            byePlayers={byePlayers}
            eliminatedPlayers={eliminatedPlayers}
            machines={tournament.machines}
            onMatchClick={handleMatchClick}
            onAssignMatch={assignMatchToMachine}
          />
          
          <MachineManagement
            started={tournament.started}
            activeMatches={activeMatches}
            numberOfMachines={tournament.numberOfMachines}
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
        </div>
      </DndProvider>
    </TooltipProvider>
  );
};
