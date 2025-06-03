import { PlayerUpdate } from "../types";

export default class Player {
    id: string;
    name: string;
    color: string;
    x = -1000;
    y = -1000;
    radius = 4;
    floating = false;
    isAlive = true;
    points: { x: number; y: number }[] = [];

    constructor(id: string, name: string, color: string) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    update(state: PlayerUpdate) {
        // If not floating, add point to points.
        if (!this.floating) {
            const point = { x: this.x, y: this.y };
            this.points = [...this.points, point];
        }

        this.x = state.x;
        this.y = state.y;

        this.floating = state.floating;
        this.isAlive = state.isAlive;
    }

    reset() {
        this.points = [];
        this.x = -1000;
        this.y = -1000;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const { color, x, y, points, radius } = this;

        if (points && points.length > 1) {
            ctx.strokeStyle = color;
            ctx.lineWidth = radius * 2;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i++) {
                const prev = points[i - 1];
                const curr = points[i];

                const dx = Math.abs(curr.x - prev.x);
                const dy = Math.abs(curr.y - prev.y);
                const wrapThreshold = 6;

                if (dx > wrapThreshold || dy > wrapThreshold) {
                    // End the current segment and start a new one
                    ctx.stroke(); // Draw the previous path
                    ctx.beginPath(); // Start a new path
                    ctx.moveTo(curr.x, curr.y); // Move to the new isolated point
                } else {
                    ctx.lineTo(curr.x, curr.y); // Continue the path
                }
            }

            ctx.stroke(); // Draw the final segment
        }

        // Draw player head
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
