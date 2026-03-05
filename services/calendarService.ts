// This service handles fetching calendar availability from Google Sheets CSV.

import { Reservation } from '../types';

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0FgqsoKCrcg2BYdPl4THeXfkGCBT5EuYiAOdeVtx7XtwKZC3lXZnIyFxBtDiJ1V3a0s_QJPE-4m23/pub?gid=594250808&single=true&output=csv";

export const fetchAllReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error('Failed to fetch reservations');
    
    const text = await response.text();
    const rows = text.split('\n').slice(1); // Skip header row
    
    return rows
      .map((row, index): Reservation | null => {
        const cols = row.split(',');
        if (cols.length < 3) return null;
        
        const propertyId = cols[0]?.trim();
        const startDate = cols[1]?.trim();
        const endDate = cols[2]?.trim();
        
        if (!propertyId || !startDate || !endDate) return null;

        return {
          id: `res-${index}`,
          propertyId,
          startDate,
          endDate,
          status: 'confirmed',
          guestName: 'Client'
        };
      })
      .filter((r): r is Reservation => r !== null);
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    return [];
  }
};
