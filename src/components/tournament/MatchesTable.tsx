
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Match } from "@/types/tournament";

interface MatchesTableProps {
  matches: Match[];
}

export const MatchesTable = ({ matches }: MatchesTableProps) => {
  return (
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
          {matches.map(match => (
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
  );
};
