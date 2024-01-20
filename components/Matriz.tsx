import React from "react";
import Tile, { TileProps } from "./Tile";


type MatrizProps = {
  tiles: TileProps[];
};

const Matriz: React.FC<MatrizProps> = ({ tiles }) => {
  return (
    <div className="Matriz">
      {tiles.map((tile, i) => (
        <Tile key={i} {...tile} />
      ))}
    </div>
  );
};

export default Matriz;