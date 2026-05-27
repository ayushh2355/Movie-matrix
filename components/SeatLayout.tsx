import React, { useMemo } from "react";
import { Seat } from "./SeatGrid";
import SeatButton from "./SeatButton";


export interface Tier {
  name: string;
  price: number;
  badgeColor: string;
  rows: string[];
}

interface SeatLayoutProps {
  tiers: Tier[];
  groupedSeats: { [key: string]: Seat[] };
  selectedSeats: string[];
  toggleSeat: (seatId: string) => void;

  totalColumns: number;
  aisleIndices: number[]; 
}

export default function SeatLayout({ 
  tiers, 
  groupedSeats, 
  selectedSeats, 
  toggleSeat,
  totalColumns,
  aisleIndices
}: SeatLayoutProps) {
  
 
  const sortedGroupedSeats = useMemo(() => {
    const sorted: { [key: string]: Seat[] } = {};
    for (const rowKey in groupedSeats) {
      sorted[rowKey] = [...groupedSeats[rowKey]].sort((a, b) => a.col - b.col);
    }
    return sorted;
  }, [groupedSeats]);

  return (
    <div className="w-full max-w-md space-y-8 mb-6">
      
      {tiers.map((tier: Tier) => {

        const hasSeatsInTier = tier.rows.some((rowKey: string) => sortedGroupedSeats[rowKey]?.length > 0);
        
        if (!hasSeatsInTier) return null;
        
        return (
          <div key={tier.name} className="w-full">
            <div className="w-full py-1.5 px-4 mb-4 rounded-lg bg-linear-to-r from-slate-900 to-slate-900/40 border border-slate-800/70 flex items-center justify-between select-none">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${tier.badgeColor}`}>
                {tier.name}
              </span>
              <span className="text-[11px] font-bold text-slate-400">₹{tier.price} / seat</span>
            </div>

            <div className="space-y-3.5">
              {tier.rows.map((rowKey: string) => {
                const sortedSeats = sortedGroupedSeats[rowKey] || [];
                if (sortedSeats.length === 0) return null;
                
                return (
                  <div key={rowKey} className="flex items-center gap-4">
                    <div className="w-5 font-black text-slate-500 text-xs text-center select-none">{rowKey}</div>
                    
                  
                    <div 
                      className="flex-1 grid gap-1.5"
                      style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }}
                    >
                      {Array.from({ length: totalColumns }, (_, i) => i + 1).map((colIndex) => {
                        const isAisle = aisleIndices.includes(colIndex);
                        
                        if (isAisle) {
                          return <div key={`aisle-${rowKey}-${colIndex}`} className="w-full aspect-square pointer-events-none" />;
                        }
                        
                        const aislesBefore = aisleIndices.filter((a) => a < colIndex).length;
                        const seatCol = colIndex - aislesBefore;
                        
                        const seat = sortedSeats.find((s: Seat) => s.col === seatCol);
                        
                        if (!seat) {
                          return <div key={colIndex} className="w-full aspect-square opacity-0 pointer-events-none" />;
                        }
                        return (
                          <SeatButton 
                            key={seat.id} 
                            seat={seat} 
                            tier={tier} 
                            isSelected={selectedSeats.includes(seat.id)} 
                            onClick={() => toggleSeat(seat.id)} 
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}