import React from "react";

export enum TileStatus {
  CHECKED = "checked",
  SUGGESTED = "suggested",
  FREE = "free"
}

export type TileProps = {
  status: TileStatus;
  onClick: () => void;
  opacity?: number;
};

const Tile: React.FC<TileProps> = ({ status, onClick, opacity = 1 }) => {
  return (
    <div
      className={`Tile ${status}`}
      onClick={onClick}
      role="button"
      aria-pressed={status === TileStatus.CHECKED}
      style={{ opacity }}
    ></div>
  );
};

export default Tile;
