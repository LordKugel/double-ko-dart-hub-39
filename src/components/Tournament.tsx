import { useState } from "react";
import { Player, Match as MatchType, Tournament as TournamentType } from "../types/tournament";
import { generateRandomPlayers } from "@/utils/playerGenerator";
import { toast } from "@/components/ui/use-toast";
import { TournamentControls } from "./tournament/TournamentControls";
import { PlayersList } from "./tournament/PlayersList";
import { MatchesTable } from "./tournament/MatchesTable";
import { TournamentGroup } from "./tournament/TournamentGroup";

const createInitialMatches = (players: Player[]): MatchType[] => {
  const premiumPlayers = players.filter(p => p.group === "Premium");
  const professionalPlayers = players.filter(p => p.group === "Professional");
  
  const shuffledPremium = [...premiumPlayers].sort(() => Math.random() - 0.5);
  const shuffledProfessional = [...professionalPlayers].sort(() => Math.random() - 0.5);
  
  const matches: MatchType[] = [];
  
  for (let i = 0; i < shuffledPremium.length; i += 2) {
    if (i + 1 < shuffledPremium.length) {
      matches.push({
        id: `match-premium-${i/2}`,
        player1: shuffledPremium[i],
        player2: shuffledPremium[i + 1],
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round: 1
      });
    }
  }
  
  for (let i = 0; i < shuffledProfessional.length; i += 2) {
    if (i + 1 < shuffledProfessional.length) {
      matches.push({
        id: `match-prof-${i/2}`,
        player1: shuffledProfessional[i],
        player2: shuffledProfessional[i + 1],
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round: 1
      });
    }
  }

  const totalRounds = Math.ceil(Math.log2(Math.max(premiumPlayers.length, professionalPlayers.length)));
  let premiumMatchesInRound = Math.floor(premiumPlayers.length / 4);
  let professionalMatchesInRound = Math.floor(professionalPlayers.length / 4);

  for (let round = 2; round <= totalRounds; round++) {
    for (let i = 0; i < premiumMatchesInRound; i++) {
      matches.push({
        id: `match-premium-r${round}-${i}`,
        player1: { id: "tbd", firstName: "TBD", lastName: "", winPercentage: 0 },
        player2: { id: "tbd", firstName: "TBD", lastName: "", winPercentage: 0 },
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round: round
      });
    }
    
    for (let i = 0; i < professionalMatchesInRound; i++) {
      matches.push({
        id: `match-prof-r${round}-${i}`,
        player1: { id: "tbd", firstName: "TBD", lastName: "", winPercentage: 0 },
        player2: { id: "tbd", firstName: "TBD", lastName: "", winPercentage: 0 },
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round: round
      });
    }
    
    premiumMatchesInRound = Math.floor(premiumMatchesInRound / 2);
    professionalMatchesInRound = Math.floor(professionalMatchesInRound / 2);
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
    currentRound: 0
  });

  const generatePlayers = () => {
    if (tournament.started) {
      toast({
        title: "Tournament already started",
        description: "Cannot generate new players after tournament has started",
        variant: "destructive"
      });
      return;
    }
    
    const players = generateRandomPlayers(20);
    setTournament(prev => ({
      ...prev,
      players,
      matches: []
    }));
    
    toast({
      title: "Players Generated",
      description: "20 random players have been generated"
    });
  };

  const startTournament = () => {
    if (tournament.players.length < 2) {
      toast({
        title: "Not enough players",
        description: "Please generate players first",
        variant: "destructive"
      });
      return;
    }

    const matches = createInitialMatches(tournament.players);
    setTournament(prev => ({
      ...prev,
      started: true,
      matches,
      currentRound: 1
    }));

    toast({
      title: "Tournament Started",
      description: "First round matches have been generated"
    });
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

      const gamesPlayed = match.scores.filter(s => s.player1Won !== null).length;
      if (gamesPlayed === 3) {
        match.completed = true;

        const player1Wins = match.scores.filter(s => s.player1Won).length;
        const winner = player1Wins > 1 ? match.player1 : match.player2;
        
        const nextRoundMatches = newMatches.filter(m => 
          m.round === match.round + 1 && 
          m.player1.id === "tbd" && 
          (matchId.includes("premium") === m.id.includes("premium"))
        );
        
        if (nextRoundMatches.length > 0) {
          const nextMatch = nextRoundMatches[0];
          if (nextMatch.player1.id === "tbd") {
            nextMatch.player1 = winner;
          } else {
            nextMatch.player2 = winner;
          }
        }
      }

      newMatches[matchIndex] = match;
      
      return {
        ...prev,
        matches: newMatches
      };
    });
  };

  const premiumMatches = tournament.matches.filter(m => m.id.includes("premium"));
  const professionalMatches = tournament.matches.filter(m => m.id.includes("prof"));

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

      {tournament.started && (
        <>
          <TournamentGroup
            title="Premium Gruppe"
            titleColor="text-purple-600"
            matches={premiumMatches}
            onScoreUpdate={handleScoreUpdate}
          />

          <TournamentGroup
            title="Professional Gruppe"
            titleColor="text-blue-600"
            matches={professionalMatches}
            onScoreUpdate={handleScoreUpdate}
          />
        </>
      )}

      {!tournament.started && (
        <PlayersList players={tournament.players} />
      )}

      <MatchesTable matches={tournament.matches} />
    </div>
  );
};
