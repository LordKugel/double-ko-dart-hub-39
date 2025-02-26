
import { toast } from "@/components/ui/use-toast";
import { generateRandomPlayers } from "@/utils/playerGenerator";
import { Player } from "@/types/tournament";

export const usePlayerManagement = (
  isStarted: boolean,
  setTournament: (value: any) => void
) => {
  const generatePlayers = (count?: number) => {
    if (isStarted) {
      toast({
        title: "Turnier bereits gestartet",
        description: "Es können keine neuen Spieler generiert werden",
        variant: "destructive"
      });
      return;
    }
    
    const players = generateRandomPlayers(count);
    setTournament(prev => ({
      ...prev,
      players,
      matches: []
    }));
    
    toast({
      title: "Spieler generiert",
      description: `${players.length} zufällige Spieler wurden generiert`
    });
  };

  return { generatePlayers };
};
