
import { Button } from "../ui/button";
import { PlayerCountControls } from "./PlayerCountControls";
import { Player } from "@/types/tournament";
import * as XLSX from 'xlsx';

interface TournamentHeaderProps {
  started: boolean;
  players: Player[];
  onGeneratePlayers: (count?: number) => void;
  onResetTournament: () => void;
  setTournament: (value: any) => void;
}

export const TournamentHeader = ({
  started,
  players,
  onGeneratePlayers,
  onResetTournament,
  setTournament
}: TournamentHeaderProps) => {
  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        const players = jsonData.map((row, index) => {
          const player: Player = {
            id: `imported-${index}`,
            firstName: row.firstName || row.Vorname || "",
            lastName: row.lastName || row.Nachname || "",
            team: row.team || row.Team || "",
            winPercentage: 0,
            losses: 0,
            eliminated: false,
            bracket: "winners",
            hasBye: false
          };
          return player;
        });

        if (players.length > 0) {
          setTournament(prev => ({
            ...prev,
            players,
            matches: []
          }));
        }
      } catch (error) {
        console.error("Fehler beim Importieren der Excel-Datei:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-white">Dart Tournament</h1>
      
      <div className="flex items-center space-x-4">
        {!started && (
          <>
            <PlayerCountControls 
              onGeneratePlayers={onGeneratePlayers}
              onResetTournament={onResetTournament}
            />
            
            <div className="relative">
              <Button variant="outline" className="bg-green-700 hover:bg-green-800">
                Excel importieren
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImportExcel}
                />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
