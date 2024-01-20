import Matriz from "@components/Matriz";
import { TileStatus } from "@components/Tile";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Buttons from "@components/Buttons";

export interface TileProps {
  status: TileStatus;
  onClick: () => void;
  opacity: number;
}
interface ChallengeSettings {
  maxClicks: number;
  gridSize: number;
  stepLimitDirection: number;
}
type RotatedTiles = TileProps[];

const Home: React.FC = () => {
  const [settings, setSettings] = useState<ChallengeSettings>({
    maxClicks: 4,
    gridSize: 8,
    stepLimitDirection: 2,
  });
  const [tiles, setTiles] = useState<TileProps[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);

  const isAdjacent = useCallback(
    (array1: number[], index2: number) => {
      const { gridSize, stepLimitDirection } = settings;
      const index1 = array1[array1.length - 1];
      const row1 = Math.floor(index1 / gridSize);
      const col1 = index1 % gridSize;
      const row2 = Math.floor(index2 / gridSize);
      const col2 = index2 % gridSize;
      const isAdjacentHorizontally =
        row1 === row2 && Math.abs(col1 - col2) === 1;
      const isAdjacentVertically = Math.abs(row1 - row2) === 1 && col1 === col2;
      if (array1.length < stepLimitDirection) {
        return isAdjacentHorizontally || isAdjacentVertically;
      }
      const isHorizontal = Math.abs(array1[0] - array1[1]) === 1;
      return isHorizontal ? isAdjacentHorizontally : isAdjacentVertically;
    },
    [settings]
  );

  const canAdd = useCallback(
    (tileArr: number[], indexB: number) =>
      tileArr.length === 0 ||
      (!tileArr.includes(indexB) &&
        isAdjacent(tileArr, indexB) &&
        tileArr.length < settings.maxClicks),
    [settings]
  );

  const updateTiles = useCallback(
    (index: number) => {
      setSelectedTiles((prevSelectedTiles) => {
        const newOpacity = prevSelectedTiles.length / settings.maxClicks;
        const updatedOpacity = newOpacity > 1 ? 1 : newOpacity;

        setTiles((currentTiles: TileProps[]) =>
          currentTiles.map((tile, tileIndex) => {
            const isSelected = prevSelectedTiles.includes(tileIndex);

            let opacity;

            if (isSelected) {
              opacity = tile?.status === TileStatus.CHECKED ? tile?.opacity || 0 : 1 - updatedOpacity;
            } else {
              opacity = tile?.status === TileStatus.FREE ? 1 : 0.8;
            }

            const status = isSelected
              ? TileStatus.CHECKED
              : canAdd(prevSelectedTiles, tileIndex)
                ? TileStatus.SUGGESTED
                : TileStatus.FREE;

            return {
              ...tile,
              status,
              opacity,
            };
          })
        );

        return canAdd(prevSelectedTiles, index)
          ? [...prevSelectedTiles, index]
          : [...prevSelectedTiles];
      });
    },
    [setSelectedTiles, setTiles, canAdd, settings.maxClicks]
  );

  const handleTileStatus = useCallback((index: number) => {
    if (selectedTiles.includes(index)) return TileStatus.CHECKED;
    if (isAdjacent(selectedTiles, index) && selectedTiles.length < settings.maxClicks) return TileStatus.SUGGESTED;
    return TileStatus.FREE;
  }, [selectedTiles, settings, isAdjacent]);

  useEffect(() => {
    setTiles((currentTiles) =>
      currentTiles.map((tile, tileIndex) => ({
        ...tile,
        status: handleTileStatus(tileIndex),
      }))
    );
  }, [selectedTiles, handleTileStatus]);

  useEffect(() => {
    const { gridSize } = settings;
    const initialTiles = Array.from(
      { length: gridSize * gridSize },
      (_, index) => ({
        status: TileStatus.FREE,
        onClick: () => updateTiles(index),
        opacity: 1,
      })
    );

    setTiles(initialTiles);
  }, [settings]);

  const onRotateLeft = useCallback(() => {
    setTiles((currentTiles) => {
      if (selectedTiles.length === 0) {
        return currentTiles;
      }

      const referenceIndex = selectedTiles[0];
      const referenceRow = Math.floor(referenceIndex / settings.gridSize);
      const referenceCol = referenceIndex % settings.gridSize;

      const rotatedTiles: RotatedTiles = Array.from(
        { length: settings.gridSize * settings.gridSize },
        (_, index) => ({ ...currentTiles[index] || { status: TileStatus.FREE, opacity: 1, onClick: () => updateTiles(index) } })
      );

      for (let row = 0; row < settings.gridSize; row++) {
        for (let col = 0; col < settings.gridSize; col++) {
          const currentIndex = row * settings.gridSize + col;
          const newRow = referenceRow - (col - referenceCol);
          const newCol = referenceCol + (row - referenceRow);
          const newIndex = newRow * settings.gridSize + newCol;

          if (currentTiles[currentIndex]) {
            rotatedTiles[newIndex] = { ...currentTiles[currentIndex] };
          }
        }
      }

      const mirroredTiles: RotatedTiles = Array.from(
        { length: settings.gridSize * settings.gridSize },
        (_, index) => rotatedTiles[(index % settings.gridSize) * settings.gridSize + (settings.gridSize - Math.floor(index / settings.gridSize) - 1)]
      );

      const updatedSelectedTiles = selectedTiles.map((index) => {
        const row = Math.floor(index / settings.gridSize);
        const col = index % settings.gridSize;
        const newRow = referenceRow - (col - referenceCol);
        const newCol = referenceCol + (row - referenceRow);
        return newRow * settings.gridSize + newCol;
      });

      setSelectedTiles(updatedSelectedTiles);

      mirroredTiles.forEach((tile, index) => {
        if (tile) {
          const { status, opacity } = tile;
          setTiles((currentTiles) => {
            const updatedTiles = [...currentTiles];
            updatedTiles[index] = { status, opacity, onClick: () => updateTiles(index) };
            return updatedTiles;
          });
        }
      });

      return mirroredTiles;
    });
  }, [settings, setTiles, selectedTiles, setSelectedTiles, updateTiles]);

  const onRotateRight = useCallback(() => {
    setTiles((currentTiles) => {
      if (selectedTiles.length === 0) {
        return currentTiles;
      }

      const referenceIndex = selectedTiles[0];
      const referenceRow = Math.floor(referenceIndex / settings.gridSize);
      const referenceCol = referenceIndex % settings.gridSize;

      const rotatedTiles: RotatedTiles = Array.from(
        { length: settings.gridSize * settings.gridSize },
        (_, index) => ({ ...currentTiles[index] || { status: TileStatus.FREE, opacity: 1, onClick: () => updateTiles(index) } })
      );

      for (let row = 0; row < settings.gridSize; row++) {
        for (let col = 0; col < settings.gridSize; col++) {
          const currentIndex = row * settings.gridSize + col;
          const newRow = referenceRow + (col - referenceCol);
          const newCol = referenceCol - (row - referenceRow);
          const newIndex = newRow * settings.gridSize + newCol;

          if (currentTiles[currentIndex]) {
            rotatedTiles[newIndex] = { ...currentTiles[currentIndex] };
          }
        }
      }

      const mirroredTiles: RotatedTiles = Array.from(
        { length: settings.gridSize * settings.gridSize },
        (_, index) => rotatedTiles[(index % settings.gridSize) * settings.gridSize + (settings.gridSize - Math.floor(index / settings.gridSize) - 1)]
      );

      const updatedSelectedTiles = selectedTiles.map((index) => {
        const row = Math.floor(index / settings.gridSize);
        const col = index % settings.gridSize;
        const newRow = referenceRow + (col - referenceCol);
        const newCol = referenceCol - (row - referenceRow);
        return newRow * settings.gridSize + newCol;
      });

      setSelectedTiles(updatedSelectedTiles);

      mirroredTiles.forEach((tile, index) => {
        if (tile) {
          const { status, opacity } = tile;
          setTiles((currentTiles) => {
            const updatedTiles = [...currentTiles];
            updatedTiles[index] = { status, opacity, onClick: () => updateTiles(index) };
            return updatedTiles;
          });
        }
      });

      return mirroredTiles;
    });
  }, [settings, setTiles, selectedTiles, setSelectedTiles, updateTiles]);

  const onDeleteLast = useCallback(() => {
    setSelectedTiles((prevSelectedTiles) => {
      if (prevSelectedTiles.length > 0) {
        const lastSelectedIndex = prevSelectedTiles[prevSelectedTiles.length - 1];
        let updatedTiles = [...tiles];

        updatedTiles[lastSelectedIndex] = {
          ...updatedTiles[lastSelectedIndex],
          status: TileStatus.FREE,
          opacity: 1,
        };

        const remainingTiles = prevSelectedTiles.slice(0, -1);
        const updatedSelectedTiles = remainingTiles.map((index) => {
          const row = Math.floor(index / settings.gridSize);
          const col = index % settings.gridSize;
          return row * settings.gridSize + col;
        });

        updatedSelectedTiles.forEach((index) => {
          updatedTiles[index] = {
            ...updatedTiles[index],
            status: handleTileStatus(index),
            opacity: 1,
          };
        });

        setTiles(updatedTiles);
        setSelectedTiles(updatedSelectedTiles);
        return updatedSelectedTiles;
      } else {
        const initialSelectedTiles = Array.from(
          { length: settings.maxClicks },
          (_, index) => index
        );

        const initialTiles = Array.from(
          { length: settings.gridSize * settings.gridSize },
          (_, index) => ({
            status: TileStatus.FREE,
            onClick: () => updateTiles(index),
            opacity: 1,
          })
        );

        setTiles(initialTiles);
        setSelectedTiles(initialSelectedTiles);
        return initialSelectedTiles;
      }
    });
  }, [setSelectedTiles, setTiles, tiles, settings.gridSize, settings.maxClicks, updateTiles, handleTileStatus]);

  const isLineComplete = useMemo(() => {
    const { gridSize } = settings;
    return selectedTiles.length === gridSize;
  }, [selectedTiles, settings]);

  const hasSomethingToDelete = useMemo(() => {
    return selectedTiles.length > 0;
  }, [selectedTiles]);

  return (
    <div className="container mt-3">
      <Matriz tiles={tiles} />

      <Buttons
        onRotateLeft={onRotateLeft}
        onRotateRight={onRotateRight}
        onDeleteLast={onDeleteLast}
        isLineComplete={isLineComplete}
        hasSomethingToDelete={hasSomethingToDelete}
      />
    </div>
  );
};

export default Home;
