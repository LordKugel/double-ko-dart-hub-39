
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx";
import { Match } from "@/types/tournament";

interface TournamentControlsProps {
  onGeneratePlayers: () => void;
  onStartTournament: () => void;
  onExportData: () => void;
  isStarted: boolean;
  hasPlayers: boolean;
  matches: Match[];
  currentRound: number;
  roundStarted: boolean;
}

export const TournamentControls = ({
  onGeneratePlayers,
  onStartTournament,
  onExportData,
  isStarted,
  hasPlayers,
  matches,
  currentRound,
  roundStarted
}: TournamentControlsProps) => {
  const getButtonLabel = () => {
    if (!isStarted) return "Start Tournament";
    if (!roundStarted) return `Start Runde ${currentRound}`;
    return `Runde ${currentRound} läuft...`;
  };

  const exportToExcel = () => {
    const matchData = matches.map(match => ({
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
        onClick={onStartTournament}
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
    </div>
  );
};
