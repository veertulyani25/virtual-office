export const TILE_W = 80;
export const TILE_H = 40;

export interface IsoPoint {
  x: number;
  y: number;
}

export function isoProject(col: number, row: number): IsoPoint {
  return {
    x: (col - row) * (TILE_W / 2),
    y: (col + row) * (TILE_H / 2),
  };
}

export function zonePoly(col: number, row: number, spanW: number, spanD: number): string {
  const TW2 = TILE_W / 2;
  const TH2 = TILE_H / 2;
  const north = { x: (col - row) * TW2,                 y: (col + row) * TH2 - TH2 };
  const east  = { x: (col + spanW - row) * TW2,          y: (col + spanW + row - 1) * TH2 };
  const south = { x: (col + spanW - row - spanD) * TW2,  y: (col + spanW + row + spanD - 2) * TH2 + TH2 };
  const west  = { x: (col - row - spanD) * TW2,          y: (col + row + spanD - 1) * TH2 };
  return `${north.x},${north.y} ${east.x},${east.y} ${south.x},${south.y} ${west.x},${west.y}`;
}

export function deskTopPoly(cx: number, cy: number, w: number, h: number): string {
  const TW2 = w / 2;
  const TH2 = h / 2;
  return [
    `${cx},${cy - TH2}`,
    `${cx + TW2},${cy}`,
    `${cx},${cy + TH2}`,
    `${cx - TW2},${cy}`,
  ].join(' ');
}
