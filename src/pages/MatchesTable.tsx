
import { MatchesTable } from "@/components/tournament/MatchesTable";
import { useTournament } from "@/hooks/useTournament";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function MatchesTablePage() {
  const { tournament } = useTournament();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 max-w-7xl animate-fade-in pb-20 bg-[#0A0F1A]">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zum Turnier
        </Button>
        <h1 className="text-3xl font-bold text-white">Alle Matches</h1>
      </div>
      
      <MatchesTable matches={tournament.matches} />
    </div>
  );
}
