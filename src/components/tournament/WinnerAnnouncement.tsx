
import { Player } from "@/types/tournament";

interface WinnerAnnouncementProps {
  winner: Player;
}

export const WinnerAnnouncement = ({ winner }: WinnerAnnouncementProps) => {
  return (
    <div className="mb-12 text-center animate-fade-in bg-gradient-to-r from-yellow-900/30 via-yellow-800/40 to-yellow-900/30 p-8 rounded-xl border border-yellow-700 shadow-lg">
      <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
        🏆 Turniersieger 🏆
      </h2>
      <div className="text-3xl font-bold text-yellow-400">
        {winner.firstName} {winner.lastName}
      </div>
      {winner.team && (
        <div className="text-xl text-yellow-300 mt-2">
          Team: {winner.team}
        </div>
      )}
    </div>
  );
};
