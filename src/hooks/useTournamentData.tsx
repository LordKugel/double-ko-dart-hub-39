
import { Match, Player } from "@/types/tournament";
import { useMemo } from "react";

export const useTournamentData = (tournament: any) => {
  // Verfügbare Matches filtern
  const availableMatches = useMemo(() => {
    return tournament?.matches?.filter(match => 
      match.round === tournament.currentRound && 
      !match.completed &&
      (!match.machineNumber || match.machineNumber === null)
    ) || [];
  }, [tournament?.matches, tournament?.currentRound]);

  // Matches nach Bracket aufteilen
  const winnersMatches = useMemo(() => {
    return availableMatches.filter(match => match.bracket === "winners");
  }, [availableMatches]);
  
  const losersMatches = useMemo(() => {
    return availableMatches.filter(match => match.bracket === "losers");
  }, [availableMatches]);
  
  const finalMatches = useMemo(() => {
    return availableMatches.filter(match => match.bracket === "final");
  }, [availableMatches]);

  // Spieler filtern
  const playersInActiveUnfinishedMatches = useMemo(() => {
    return tournament.matches
      .filter(match => 
        match.round === tournament.currentRound && 
        !match.completed
      )
      .flatMap(match => [match.player1.id, match.player2.id]);
  }, [tournament.matches, tournament.currentRound]);

  const eliminatedPlayers = useMemo(() => {
    return tournament.players
      .filter(p => p.eliminated === true && p.bracket === null);
  }, [tournament.players]);

  const activeWinnerPlayers = useMemo(() => {
    return tournament.players.filter(player => 
      !player.eliminated && 
      player.bracket === "winners" && 
      !playersInActiveUnfinishedMatches.includes(player.id) &&
      !player.hasBye
    );
  }, [tournament.players, playersInActiveUnfinishedMatches]);

  const activeLoserPlayers = useMemo(() => {
    return tournament.players.filter(player => 
      !player.eliminated && 
      player.bracket === "losers" && 
      !playersInActiveUnfinishedMatches.includes(player.id)
    );
  }, [tournament.players, playersInActiveUnfinishedMatches]);

  const byePlayers = useMemo(() => {
    return tournament.players.filter(player => 
      player.hasBye && !player.eliminated
    );
  }, [tournament.players]);

  const activeMatches = useMemo(() => {
    return tournament?.matches?.filter(match => 
      match.round === tournament.currentRound && 
      !match.completed &&
      match.machineNumber !== null &&
      match.machineNumber !== undefined
    ) || [];
  }, [tournament?.matches, tournament?.currentRound]);

  return {
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
  };
};
