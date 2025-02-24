
import { useState } from "react";
import { Player, Match as MatchType, Tournament as TournamentType } from "../types/tournament";
import { generateRandomPlayers } from "@/utils/playerGenerator";
import { toast } from "@/components/ui/use-toast";
import { TournamentControls } from "./tournament/TournamentControls";
import { PlayersList } from "./tournament/PlayersList";
import { MatchesTable } from "./tournament/MatchesTable";
import { Match } from "./tournament/Match";
import { TournamentBracket } from "./tournament/TournamentBracket";

const createInitialMatches = (players: Player[]): MatchType[] => {
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
  const matches: MatchType[] = [];
  
  // Erste Runde Matches erstellen
  for (let i = 0; i < shuffledPlayers.length; i += 2) {
    if (i + 1 < shuffledPlayers.length) {
      matches.push({
        id: `match-${i/2}`,
        player1: { ...shuffledPlayers[i], losses: 0, eliminated: false, bracket: "winners" },
        player2: { ...shuffledPlayers[i + 1], losses: 0, eliminated: false, bracket: "winners" },
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round: 1,
        bracket: "winners",
        matchNumber: i/2 + 1
      });
    }
  }
  
  return matches;
};

const createNextRoundMatches = (
  winners: Player[], 
  losers: Player[], 
  round: number, 
  currentBracket: "winners" | "losers"
): MatchType[] => {
  const matches: MatchType[] = [];
  const players = currentBracket === "winners" ? winners : losers;

  for (let i = 0; i < players.length; i += 2) {
    if (i + 1 < players.length) {
      matches.push({
        id: `match-${currentBracket}-${round}-${i/2}`,
        player1: players[i],
        player2: players[i + 1],
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round,
        bracket: currentBracket,
        matchNumber: i/2 + 1
      });
    }
  }
  return matches;
};

export const Tournament = () => {
  const [tournament, setTournament] = useState<TournamentType>({
    id: "1",
    name: "Dart Tournament",
    players: [],
    matches: [],
    started: false,
    completed: false,
    currentRound: 0,
    winnersBracketMatches: [],
    losersBracketMatches: [],
    finalMatches: []
  });

  const calculateWinPercentage = (playerId: string): number => {
    const playerMatches = tournament.matches.filter(m => 
      (m.player1.id === playerId || m.player2.id === playerId) && m.completed
    );
    
    if (playerMatches.length === 0) return 0;
    
    const wonMatches = playerMatches.filter(m => {
      const player1Wins = m.scores.filter(s => s.player1Won).length;
      if (m.player1.id === playerId) return player1Wins > 1;
      if (m.player2.id === playerId) return player1Wins < 2;
      return false;
    }).length;
    
    return (wonMatches / playerMatches.length) * 100;
  };

  const handleScoreUpdate = (matchId: string, gameIndex: number, player1Won: boolean) => {
    setTournament(prev => {
      const matchIndex = prev.matches.findIndex(m => m.id === matchId);
      if (matchIndex === -1) return prev;

      const newMatches = [...prev.matches];
      const match = { ...newMatches[matchIndex] };
      
      match.scores[gameIndex] = {
        player1Won: player1Won,
        player2Won: !player1Won
      };

      const player1Wins = match.scores.filter(s => s.player1Won).length;
      const player2Wins = match.scores.filter(s => s.player2Won).length;

      if (player1Wins === 2 || player2Wins === 2) {
        match.completed = true;
        const winner = player1Wins > player2Wins ? match.player1 : match.player2;
        const loser = player1Wins > player2Wins ? match.player2 : match.player1;
        
        // Update Spieler-Statistiken
        winner.winPercentage = calculateWinPercentage(winner.id);
        loser.winPercentage = calculateWinPercentage(loser.id);
        loser.losses += 1;

        if (loser.losses >= 2) {
          loser.eliminated = true;
        }

        // Move loser to losers bracket if it's their first loss
        if (loser.losses === 1 && match.bracket === "winners") {
          loser.bracket = "losers";
        }

        // Handle completed round
        const currentBracketMatches = newMatches.filter(m => 
          m.round === match.round && m.bracket === match.bracket
        );
        
        if (currentBracketMatches.every(m => m.completed)) {
          const winners = currentBracketMatches
            .map(m => {
              const wins1 = m.scores.filter(s => s.player1Won).length;
              return wins1 > 1 ? m.player1 : m.player2;
            })
            .filter(player => !player.eliminated);

          const losers = currentBracketMatches
            .map(m => {
              const wins1 = m.scores.filter(s => s.player1Won).length;
              return wins1 > 1 ? m.player2 : m.player1;
            })
            .filter(player => !player.eliminated);

          // Create next round matches for both brackets
          if (winners.length > 1) {
            const nextWinnersMatches = createNextRoundMatches(
              winners,
              [],
              match.round + 1,
              "winners"
            );
            newMatches.push(...nextWinnersMatches);
          }

          if (losers.length > 1 && match.bracket === "winners") {
            const nextLosersMatches = createNextRoundMatches(
              losers,
              [],
              match.round,
              "losers"
            );
            newMatches.push(...nextLosersMatches);
          }

          // Check for final matches
          if (winners.length === 1 && match.bracket === "winners") {
            // Create final match
            const finalMatch: MatchType = {
              id: `final-1`,
              player1: winners[0],
              player2: { 
                id: "tbd", 
                firstName: "TBD", 
                lastName: "", 
                winPercentage: 0, 
                losses: 0, 
                eliminated: false, 
                bracket: "losers" 
              },
              scores: Array(3).fill({ player1Won: null, player2Won: null }),
              completed: false,
              round: match.round + 1,
              bracket: "final",
              matchNumber: 1
            };
            newMatches.push(finalMatch);
          }
        }
      }

      newMatches[matchIndex] = match;
      
      return {
        ...prev,
        matches: newMatches,
        winnersBracketMatches: newMatches.filter(m => m.bracket === "winners"),
        losersBracketMatches: newMatches.filter(m => m.bracket === "losers"),
        finalMatches: newMatches.filter(m => m.bracket === "final")
      };
    });
  };

  const generatePlayers = () => {
    if (tournament.started) {
      toast({
        title: "Turnier bereits gestartet",
        description: "Es können keine neuen Spieler generiert werden",
        variant: "destructive"
      });
      return;
    }
    
    const players = generateRandomPlayers(8); // Für Double Elimination ist 8 eine gute Anzahl
    setTournament(prev => ({
      ...prev,
      players,
      matches: []
    }));
    
    toast({
      title: "Spieler generiert",
      description: "8 zufällige Spieler wurden generiert"
    });
  };

  const startTournament = () => {
    if (tournament.players.length < 2) {
      toast({
        title: "Nicht genug Spieler",
        description: "Bitte generieren Sie zuerst Spieler",
        variant: "destructive"
      });
      return;
    }

    const initialMatches = createInitialMatches(tournament.players);
    setTournament(prev => ({
      ...prev,
      started: true,
      matches: initialMatches,
      currentRound: 1,
      winnersBracketMatches: initialMatches
    }));

    toast({
      title: "Turnier gestartet",
      description: "Die ersten Runden wurden generiert"
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl animate-fade-in pb-[400px]">
      <h1 className="text-3xl font-bold text-center mb-8">Dart Tournament</h1>
      
      <TournamentControls
        onGeneratePlayers={generatePlayers}
        onStartTournament={startTournament}
        isStarted={tournament.started}
        hasPlayers={tournament.players.length > 0}
        matches={tournament.matches}
      />

      {!tournament.started ? (
        <PlayersList players={tournament.players} />
      ) : (
        <div className="mt-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Winner's Bracket</h2>
              {tournament.winnersBracketMatches.map(match => (
                <Match
                  key={match.id}
                  match={match}
                  onScoreUpdate={handleScoreUpdate}
                />
              ))}
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">Loser's Bracket</h2>
              {tournament.losersBracketMatches.map(match => (
                <Match
                  key={match.id}
                  match={match}
                  onScoreUpdate={handleScoreUpdate}
                />
              ))}
            </div>
          </div>

          {tournament.finalMatches.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Finals</h2>
              {tournament.finalMatches.map(match => (
                <Match
                  key={match.id}
                  match={match}
                  onScoreUpdate={handleScoreUpdate}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <MatchesTable matches={tournament.matches} />
    </div>
  );
};
