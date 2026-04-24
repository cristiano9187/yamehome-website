import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Reservation } from "../types";

/**
 * S'abonne en temps réel à la collection public_calendar sur Firestore.
 * Appelle le callback à chaque changement (ajout, modification, suppression).
 * Retourne la fonction de désabonnement à appeler au démontage du composant.
 */
export const subscribeToReservations = (
  callback: (reservations: Reservation[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const q = query(
    collection(db, "public_calendar"),
    where("type", "in", ["reservation", "blocked"])
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const reservations: Reservation[] = snapshot.docs
        .map((doc): Reservation | null => {
          const data = doc.data();
          // Le champ "id" dans Firestore correspond au propertyId du site
          if (!data.id || !data.start || !data.end) return null;

          const startDate: string = data.start;
          let endDate: string = data.end;

          // Les blocages manuels ont start == end (ex: "2026-05-07" / "2026-05-07").
          // Toute la logique du site utilise une fin exclusive (d < resEnd).
          // On avance end d'un jour pour que le jour bloqué soit bien marqué.
          if (startDate === endDate) {
            const [y, m, d] = endDate.split('-').map(Number);
            const next = new Date(y, m - 1, d + 1);
            const pad = (n: number) => String(n).padStart(2, '0');
            endDate = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;
          }

          return {
            id: doc.id,
            propertyId: data.id,
            startDate,
            endDate,
            status: "confirmed",
            guestName: data.client ?? undefined,
          };
        })
        .filter((r): r is Reservation => r !== null);

      callback(reservations);
    },
    (error) => {
      console.error("Erreur Firestore onSnapshot:", error);
      onError?.(error);
    }
  );

  return unsubscribe;
};
