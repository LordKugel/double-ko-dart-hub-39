
import { toast } from "@/components/ui/use-toast";
import { generateRandomPlayers } from "@/utils/playerGenerator";
import { Player } from "@/types/tournament";

export const usePlayerManagement = (
  isStarted: boolean,
  setTournament: (value: any) => void
) => {
  const generatePlayers = () => {
    if (isStarted) {
      toast({
        title: "Turnier bereits gestartet",
        description: "Es können keine neuen Spieler generiert werden",
        variant: "destructive"
      });
      return;
    }
    
    const players = generateRandomPlayers(8);
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

  return { generatePlayers };
};
