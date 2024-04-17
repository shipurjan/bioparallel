type Position = { x: number; y: number };

export const getAngle = (pos1: Position, pos2: Position) => {
    return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) + Math.PI / 2;
};
