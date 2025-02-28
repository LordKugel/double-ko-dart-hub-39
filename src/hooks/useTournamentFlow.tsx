
import { toast } from "@/components/ui/use-toast";
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
        toast({
          title: "Nicht genug Spieler",
          description: "Bitte generieren Sie zuerst Spieler",
          variant: "destructive"
        });
        return;
      }

      // Zufällig mischen der Spielerliste
      const shuffledPlayers = [...tournament.players]
        .sort(() => Math.random() - 0.5)
        .map(player => ({
          ...player,
          bracket: "winners" as const,
          losses: 0,
          eliminated: false
        }));

      let initialMatches: MatchType[] = [];
      let byePlayer: Player | null = null;

      // Wenn die Anzahl ungerade ist, wähle einen zufälligen Spieler für Freilos
      if (shuffledPlayers.length % 2 !== 0) {
        const byePlayerIndex = Math.floor(Math.random() * shuffledPlayers.length);
        byePlayer = {
          ...shuffledPlayers[byePlayerIndex],
          hasBye: true  // Markieren des Freilos-Spielers
        };
        
        // Entferne den Freilos-Spieler aus der Liste für Paarungen
        const matchPlayers = [
          ...shuffledPlayers.slice(0, byePlayerIndex),
          ...shuffledPlayers.slice(byePlayerIndex + 1)
        ];
        
        initialMatches = createInitialMatches(matchPlayers);
        
        // Benachrichtigung für den Freilos-Spieler
        toast({
          title: "Freilos",
          description: `${byePlayer.firstName} ${byePlayer.lastName} hat ein Freilos und kommt automatisch in die nächste Runde.`,
          duration: 5000,
        });
      } else {
        initialMatches = createInitialMatches(shuffledPlayers);
      }
      
      setTournament(prev => ({
        ...prev,
        started: true,
        players: shuffledPlayers,
        matches: initialMatches,
        currentRound: 1,
        roundStarted: true,
        winnersBracketMatches: initialMatches,
        losersBracketMatches: [],
        finalMatches: [],
        byePlayer: byePlayer
      }));

      toast({
        title: "Turnier gestartet",
        description: "Die erste Runde wurde gestartet"
      });
    } else {
      // Prüfe, ob die aktuelle Runde abgeschlossen ist
      if (!isRoundComplete(tournament.matches, tournament.currentRound)) {
        toast({
          title: "Runde nicht abgeschlossen",
          description: "Bitte spielen Sie erst alle Matches der aktuellen Runde zu Ende",
          variant: "destructive"
        });
        return;
      }

      // Prüfe, ob noch Timer laufen
      const currentRoundMatches = tournament.matches.filter(m => m.round === tournament.currentRound);
      const hasRunningTimers = currentRoundMatches.some(m => m.countdownStarted && !m.completed);
      
      if (hasRunningTimers) {
        toast({
          title: "Timer noch aktiv",
          description: "Bitte warten Sie, bis alle Timer der aktuellen Runde abgelaufen sind",
          variant: "destructive"
        });
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
        
        toast({
          title: "Freilos-Spieler",
          description: `${tournament.byePlayer.firstName} ${tournament.byePlayer.lastName} tritt in Runde 2 an.`,
          duration: 3000,
        });
      }

      const nextRoundMatches = createNextRound(
        tournament.currentRound + 1,
        updatedPlayers,
        tournament.matches
      );

      if (nextRoundMatches.length === 0) {
        toast({
          title: "Turnier beendet",
          description: "Alle Runden wurden gespielt",
          variant: "default"
        });
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

      toast({
        title: "Neue Runde gestartet",
        description: `Runde ${tournament.currentRound + 1} wurde gestartet`
      });
    }
  };

  return { startTournament };
};
