
import { Player } from "../types/tournament";

const firstNames = [
  "Max", "Tom", "Felix", "Lars", "Tim", "Jan", "Paul", "Lukas", "David", "Simon",
  "Anna", "Lisa"
];

const lastNames = [
  "Schmidt", "Müller", "Weber", "Wagner", "Becker", "Schulz", "Hoffmann", "Koch",
  "Richter", "Wolf", "Schröder", "Klein"
];

const teams = [
  "Red Dragons", "Blue Eagles", "Green Vipers", "Black Panthers",
  "Golden Lions", "Silver Wolves", "Bronze Bears", "Purple Phoenix"
];

export function generateRandomPlayers(count: number): Player[] {
  return Array.from({ length: count }, () => ({
    id: Math.random().toString(36).substr(2, 9),
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    team: Math.random() > 0.3 ? teams[Math.floor(Math.random() * teams.length)] : undefined,
    winPercentage: 0,
    losses: 0,
    eliminated: false,
    bracket: null
  }));
}
