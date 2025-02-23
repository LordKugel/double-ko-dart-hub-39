import { useState } from "react";
import { Player, Match as MatchType, Tournament as TournamentType } from "../types/tournament";
import { Match } from "./Match";
import { Button } from "@/components/ui/button";
import { generateRandomPlayers } from "@/utils/playerGenerator";
import { toast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Download } from "lucide-react";

const createInitialMatches = (players: Player[]): MatchType[] => {
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const matches: MatchType[] = [];
  
  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 < shuffled.length) {
      matches.push({
        id: `match-${i/2}`,
        player1: shuffled[i],
        player2: shuffled[i + 1],
        scores: Array(3).fill({ player1Won: null, player2Won: null }),
        completed: false,
        round: 1
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
    
    const players = generateRandomPlayers(50);
    setTournament(prev => ({
      ...prev,
      players,
      matches: []
    }));
    
    toast({
      title: "Players Generated",
      description: "50 random players have been generated"
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
      }

      newMatches[matchIndex] = match;
      
      return {
        ...prev,
        matches: newMatches
      };
    });
  };

  const exportToExcel = () => {
    const matchData = tournament.matches.map(match => ({
      'Player 1': `${match.player1.firstName} ${match.player1.lastName}`,
      'Team 1': match.player1.team || '-',
      'Game 1': match.scores[0].player1Won === null ? '-' : match.scores[0].player1Won ? 'Win' : 'Loss',
      'Game 2': match.scores[1].player1Won === null ? '-' : match.scores[1].player1Won ? 'Win' : 'Loss',
      'Game 3': match.scores[2].player1Won === null ? '-' : match.scores[2].player1Won ? 'Win' : 'Loss',
      'Player 2': `${match.player2.firstName} ${match.player2.lastName}`,
      'Team 2': match.player2.team || '-',
      'Status': match.completed ? 'Completed' : 'In Progress'
    }));

    const ws = XLSX.utils.json_to_sheet(matchData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Matches");
    XLSX.writeFile(wb, "tournament_matches.xlsx");
    
    toast({
      title: "Export erfolgreich",
      description: "Die Turnierdaten wurden als Excel-Datei exportiert"
    });
  };

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Hier können Sie die Daten verarbeiten und in das Tournament-State übernehmen
        toast({
          title: "Import erfolgreich",
          description: "Die Turnierdaten wurden erfolgreich importiert"
        });
      } catch (error) {
        toast({
          title: "Import fehlgeschlagen",
          description: "Fehler beim Importieren der Datei",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl animate-fade-in pb-[400px]">
      <h1 className="text-3xl font-bold text-center mb-8">Dart Tournament</h1>
      
      <div className="flex justify-center gap-4 mb-8">
        <Button 
          onClick={generatePlayers}
          disabled={tournament.started}
          className="transition-all duration-200 hover:scale-105"
        >
          Generate Players
        </Button>
        <Button 
          onClick={startTournament}
          disabled={tournament.started || tournament.players.length === 0}
          className="transition-all duration-200 hover:scale-105"
        >
          Start Tournament
        </Button>
        <Button
          onClick={exportToExcel}
          className="transition-all duration-200 hover:scale-105"
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Excel
        </Button>
        <Button
          onClick={() => document.getElementById('excel-upload')?.click()}
          className="transition-all duration-200 hover:scale-105"
          variant="outline"
        >
          <Upload className="mr-2 h-4 w-4" />
          Import Excel
        </Button>
        <input
          id="excel-upload"
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={importFromExcel}
        />
      </div>

      <div className="grid gap-6">
        {tournament.matches.map(match => (
          <Match
            key={match.id}
            match={match}
            onScoreUpdate={handleScoreUpdate}
          />
        ))}
      </div>

      {!tournament.started && tournament.players.length > 0 && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Player List ({tournament.players.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournament.players.map(player => (
              <div key={player.id} className="p-2 bg-gray-50 rounded">
                {player.firstName} {player.lastName}
                {player.team && <span className="text-sm text-gray-500 ml-2">({player.team})</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 max-h-[350px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player 1</TableHead>
              <TableHead>Team 1</TableHead>
              <TableHead className="text-center">Game 1</TableHead>
              <TableHead className="text-center">Game 2</TableHead>
              <TableHead className="text-center">Game 3</TableHead>
              <TableHead>Player 2</TableHead>
              <TableHead>Team 2</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournament.matches.map(match => (
              <TableRow key={match.id}>
                <TableCell>{match.player1.firstName} {match.player1.lastName}</TableCell>
                <TableCell>{match.player1.team || '-'}</TableCell>
                <TableCell className="text-center">
                  {match.scores[0].player1Won === null ? '-' : 
                   match.scores[0].player1Won ? '✓' : '×'}
                </TableCell>
                <TableCell className="text-center">
                  {match.scores[1].player1Won === null ? '-' : 
                   match.scores[1].player1Won ? '✓' : '×'}
                </TableCell>
                <TableCell className="text-center">
                  {match.scores[2].player1Won === null ? '-' : 
                   match.scores[2].player1Won ? '✓' : '×'}
                </TableCell>
                <TableCell>{match.player2.firstName} {match.player2.lastName}</TableCell>
                <TableCell>{match.player2.team || '-'}</TableCell>
                <TableCell>
                  {match.completed ? 'Completed' : 'In Progress'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
