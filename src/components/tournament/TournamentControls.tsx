
import { Button } from "@/components/ui/button";
import { Upload, Download, Table2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx";
import { Match } from "@/types/tournament";
import { useState } from "react";

interface TournamentControlsProps {
  onGeneratePlayers: () => void;
  onStartTournament: () => void;
  onExportData: () => void;
  isStarted: boolean;
  hasPlayers: boolean;
  matches: Match[];
  currentRound: number;
  roundStarted: boolean;
  onToggleMatchesTable: () => void;
  showMatchesTable: boolean;
}

export const TournamentControls = ({
  onGeneratePlayers,
  onStartTournament,
  onExportData,
  isStarted,
  hasPlayers,
  matches,
  currentRound,
  roundStarted,
  onToggleMatchesTable,
  showMatchesTable
}: TournamentControlsProps) => {
  const getButtonLabel = () => {
    if (!isStarted) return "Start Tournament";
    if (!roundStarted) return `Start Runde ${currentRound}`;
    return `Runde ${currentRound} läuft...`;
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Gruppiere Matches nach Runden
    const matchesByRound = matches.reduce((acc, match) => {
      if (!acc[match.round]) {
        acc[match.round] = [];
      }
      acc[match.round].push(match);
      return acc;
    }, {} as Record<number, Match[]>);

    // Erstelle für jede Runde ein eigenes Worksheet
    Object.entries(matchesByRound).forEach(([round, roundMatches]) => {
      const matchData = roundMatches.map(match => ({
        'Runde': round,
        'Bracket': match.bracket,
        'Player 1': `${match.player1.firstName} ${match.player1.lastName}`,
        'Team 1': match.player1.team || '-',
        'Game 1': match.scores[0].player1Won === null ? '-' : match.scores[0].player1Won ? 'Win' : 'Loss',
        'Game 2': match.scores[1].player1Won === null ? '-' : match.scores[1].player1Won ? 'Win' : 'Loss',
        'Game 3': match.scores[2].player1Won === null ? '-' : match.scores[2].player1Won ? 'Win' : 'Loss',
        'Player 2': `${match.player2.firstName} ${match.player2.lastName}`,
        'Team 2': match.player2.team || '-',
        'Status': match.completed ? 'Completed' : 'In Progress',
        'Match #': match.matchNumber
      }));

      const ws = XLSX.utils.json_to_sheet(matchData);
      XLSX.utils.book_append_sheet(wb, ws, `Runde ${round}`);
    });

    // Erstelle ein Übersichtsblatt
    const summaryData = matches.map(match => ({
      'Runde': match.round,
      'Bracket': match.bracket,
      'Match #': match.matchNumber,
      'Player 1': `${match.player1.firstName} ${match.player1.lastName}`,
      'Team 1': match.player1.team || '-',
      'Ergebnis': `${match.scores.filter(s => s.player1Won).length}:${match.scores.filter(s => s.player2Won).length}`,
      'Player 2': `${match.player2.firstName} ${match.player2.lastName}`,
      'Team 2': match.player2.team || '-',
      'Status': match.completed ? 'Completed' : 'In Progress'
    }));

    const ws = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws, "Übersicht");

    XLSX.writeFile(wb, `tournament_matches_bis_runde_${currentRound}.xlsx`);
    
    toast({
      title: "Export erfolgreich",
      description: "Die Turnierdaten wurden als Excel-Datei exportiert"
    });
  };

  const handleStartTournament = () => {
    if (isStarted && roundStarted) {
      // Wenn eine neue Runde startet, exportiere automatisch den aktuellen Stand
      exportToExcel();
    }
    onStartTournament();
  };

  return (
    <div className="flex justify-center gap-4 mb-8">
      <Button 
        onClick={onGeneratePlayers}
        disabled={isStarted}
        className="transition-all duration-200 hover:scale-105"
      >
        Generate Players
      </Button>
      <Button 
        onClick={handleStartTournament}
        disabled={(isStarted && roundStarted) || (!isStarted && !hasPlayers)}
        className="transition-all duration-200 hover:scale-105"
      >
        {getButtonLabel()}
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
        onClick={onExportData}
        className="transition-all duration-200 hover:scale-105"
        variant="outline"
      >
        <Download className="mr-2 h-4 w-4" />
        Export JSON
      </Button>
      <Button
        onClick={onToggleMatchesTable}
        className="transition-all duration-200 hover:scale-105"
        variant={showMatchesTable ? "default" : "outline"}
      >
        <Table2 className="mr-2 h-4 w-4" />
        {showMatchesTable ? "Tabelle ausblenden" : "Tabelle anzeigen"}
      </Button>
    </div>
  );
};
