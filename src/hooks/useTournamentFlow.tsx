
import { Match as MatchType, Player, Tournament as TournamentType } from "@/types/tournament";
import { createInitialMatches, createNextRoundMatches } from "@/utils/tournamentUtils";
import { isRoundComplete } from "@/utils/matchUtils";
import { createFinalMatch } from "@/utils/bracketUtils";

export const useTournamentFlow = (tournament: TournamentType, setTournament: (value: any) => void) => {
  const createNextRound = (currentRound: number, players: Player[], allMatches: MatchType[]) => {
    const winnersPlayers = players.filter(p => p.bracket === "winners" && !p.eliminated);
    const losersPlayers = players.filter(p => p.bracket === "losers" && !p.eliminated);

    let newMatches: MatchType[] = [];

    if (winnersPlayers.length === 1 && losersPlayers.length === 1) {
      const finalMatch = createFinalMatch(winnersPlayers[0], losersPlayers[0], currentRound);
      newMatches = [finalMatch];
      return newMatches;
    }

    // Create matches for each bracket
    if (winnersPlayers.length >= 2) {
      const winnerMatches = createNextRoundMatches(
        winnersPlayers,
        [],
        currentRound,
        "winners"
      );
      newMatches = [...newMatches, ...winnerMatches];
    }

    if (losersPlayers.length >= 2) {
      const loserMatches = createNextRoundMatches(
        losersPlayers,
        [],
        currentRound,
        "losers"
      );
      newMatches = [...newMatches, ...loserMatches];
    }

    return newMatches;
  };

  const startTournament = () => {
    if (!tournament.started) {
      if (tournament.players.length < 2) {
        // Toast entfernt
        return;
      }

      // Zufällig mischen der Spielerliste
      const shuffledPlayers = [...tournament.players]
        .sort(() => Math.random() - 0.5)
        .map(player => ({
          ...player,
          bracket: "winners" as const,
          losses: 0,
          eliminated: false,
          hasBye: false // Reset any existing bye status
        }));

      let initialMatches: MatchType[] = [];
      let byePlayer: Player | null = null;

      // Wenn die Anzahl ungerade ist, wähle einen zufälligen Spieler für Freilos
      if (shuffledPlayers.length % 2 !== 0) {
        const byePlayerIndex = Math.floor(Math.random() * shuffledPlayers.length);
        byePlayer = {
          ...shuffledPlayers[byePlayerIndex],
          hasBye: true,  // Markieren des Freilos-Spielers
          bracket: "winners" // Stelle sicher, dass der Freilos-Spieler im Winner-Bracket ist
        };
        
        // Entferne den Freilos-Spieler aus der Liste für Paarungen
        const matchPlayers = [
          ...shuffledPlayers.slice(0, byePlayerIndex),
          ...shuffledPlayers.slice(byePlayerIndex + 1)
        ];
        
        initialMatches = createInitialMatches(matchPlayers);
        
        // Toast für Freilos entfernt
      } else {
        initialMatches = createInitialMatches(shuffledPlayers);
      }
      
      // Aktualisiere die Spielerliste, um den Freilos-Spieler einzuschließen
      const updatedPlayers = byePlayer 
        ? [...shuffledPlayers.filter(p => p.id !== byePlayer.id), byePlayer]
        : shuffledPlayers;
      
      setTournament(prev => ({
        ...prev,
        started: true,
        players: updatedPlayers,
        matches: initialMatches,
        currentRound: 1,
        roundStarted: true,
        winnersBracketMatches: initialMatches,
        losersBracketMatches: [],
        finalMatches: [],
        byePlayer: byePlayer
      }));

      // Toast entfernt
    } else {
      // Prüfe, ob die aktuelle Runde abgeschlossen ist
      if (!isRoundComplete(tournament.matches, tournament.currentRound)) {
        // Toast entfernt
        return;
      }

      // Prüfe, ob noch Timer laufen
      const currentRoundMatches = tournament.matches.filter(m => m.round === tournament.currentRound);
      const hasRunningTimers = currentRoundMatches.some(m => m.countdownStarted && !m.completed);
      
      if (hasRunningTimers) {
        // Toast entfernt
        return;
      }

      // Wenn in Runde 1 ein Freilos vorhanden war, füge diesen Spieler für Runde 2 hinzu
      let updatedPlayers = [...tournament.players];
      if (tournament.currentRound === 1 && tournament.byePlayer) {
        updatedPlayers = updatedPlayers.map(player => 
          player.id === tournament.byePlayer?.id 
            ? { ...player, hasBye: false } // Entferne Freilos-Markierung
            : player
        );
        
        // Toast für Freilos-Spieler entfernt
      }

      const nextRoundMatches = createNextRound(
        tournament.currentRound + 1,
        updatedPlayers,
        tournament.matches
      );

      if (nextRoundMatches.length === 0) {
        // Toast entfernt
        return;
      }

      setTournament(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        roundStarted: true,
        players: updatedPlayers,
        matches: [...prev.matches, ...nextRoundMatches],
        winnersBracketMatches: nextRoundMatches.filter(m => m.bracket === "winners"),
        losersBracketMatches: nextRoundMatches.filter(m => m.bracket === "losers"),
        finalMatches: nextRoundMatches.filter(m => m.bracket === "final"),
        byePlayer: null // Entferne Freilos-Information nach Runde 1
      }));

      // Toast entfernt
    }
  };

  return { startTournament };
};
