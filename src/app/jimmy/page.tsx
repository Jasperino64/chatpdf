"use client";

import React, {useRef, useEffect} from 'react'
class Turtle {
    N: number;
    x: number;
    y: number;
    color: string;

    constructor(N: number) {
        this.N = N;
        this.x = 0;
        this.y = 0;
        this.color = `rgb(${127 + 127 * Math.sin(N)}, ${
            127 + 127 * Math.sin(N + 2)
        }, 100)`;
    }

    draw_segment(t: number, ctx_arms: CanvasRenderingContext2D, ctx: CanvasRenderingContext2D) {
        let c1 = {
            x: Math.sin(this.N + (this.N + 1) * t),
            y: Math.cos(this.N + (this.N + 1) * t),
        };
        let c2 = {
            x: Math.cos((5 * this.N + 6) * t),
            y: Math.sin((5 * this.N + 6) * t),
        };
        // draw circle arms
        ctx_arms.beginPath();
        ctx_arms.moveTo(400, 400);
        ctx_arms.lineTo(400 + 50 * this.N * c1.x, 400 + 50 * this.N * c1.y);
        ctx_arms.lineTo(
            400 + 50 * this.N * c1.x + 25 * c2.x,
            400 + 50 * this.N * c1.y + 25 * c2.y
        );
        ctx_arms.stroke();

        // draw colored path
        let new_x = 2 * this.N * c1.x + c2.x;
        let new_y = 2 * this.N * c1.y + c2.y;
        if (this.x || this.y) {
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(25 * this.x + 400, 25 * this.y + 400);
            ctx.lineTo(25 * new_x + 400, 25 * new_y + 400);
        }
    }
}
function Jimmy() {
    const canvas0Ref = useRef<HTMLCanvasElement>(null);
    const canvas1Ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvas0Ref.current || !canvas1Ref.current) {
            return;
        }

        let ctx_arms  = canvas1Ref.current.getContext("2d");
        let ctx = canvas0Ref.current.getContext("2d");
        let turtles : Turtle[] = [];
        for (var i = 1; i < 8; i++) turtles.push(new Turtle(i));

        let frame = 0;
        const render = () => {
            frame += 0.002;
            if (ctx_arms) ctx_arms.clearRect(0, 0, 800, 800);
            if (ctx && (frame * 500) % 80 < 0.1) {
                ctx.clearRect(0, 0, 800, 800);
            }
            if (ctx_arms != null && ctx != null) {
                turtles.forEach((t) => {
                    if (ctx_arms && ctx) {
                        t.draw_segment(frame, ctx_arms, ctx);
                    }
                });
            }
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }, []);

    return (
        <div>
            <style>
                {`
                    canvas {
                        position: absolute;
                        width: 800px;
                        height: 800px;
                    }
                `}
            </style>
            <canvas ref={canvas0Ref} width="800" height="800" />
            <canvas ref={canvas1Ref} width="800" height="800" />
        </div>
    );
}
export default Jimmy
