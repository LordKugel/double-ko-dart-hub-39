
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx";
import { Match } from "@/types/tournament";

interface TournamentControlsProps {
  onGeneratePlayers: () => void;
  onStartTournament: () => void;
  isStarted: boolean;
  hasPlayers: boolean;
  matches: Match[];
}

export const TournamentControls = ({
  onGeneratePlayers,
  onStartTournament,
  isStarted,
  hasPlayers,
  matches
}: TournamentControlsProps) => {
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
        disabled={isStarted || !hasPlayers}
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
  );
};
