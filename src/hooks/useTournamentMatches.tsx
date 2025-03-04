
import { Match } from "@/types/tournament";

export const useTournamentMatches = (
  tournament: any,
  assignMatchToMachine: (machineId: number, matchId: string | null) => void
) => {
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

  return {
    getMatchForMachine,
    canConfirmMatch,
    handleMatchClick
  };
};
