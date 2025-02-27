
import React, { useEffect, useRef } from 'react';
import { Match as MatchType } from "@/types/tournament";

interface TournamentBracketProps {
  matches: MatchType[];
  currentRound: number;
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
  onMatchClick?: (matchId: string) => void;
}

export const TournamentBracket = ({ 
  matches, 
  currentRound, 
  onScoreUpdate, 
  onMatchClick 
}: TournamentBracketProps) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <img 
        src="/lovable-uploads/40e54dfc-cb50-4653-b1d2-5e7d44143d1b.png" 
        alt="Tournament Bracket" 
        className="max-w-full max-h-[600px] object-contain"
      />
    </div>
  );
};
