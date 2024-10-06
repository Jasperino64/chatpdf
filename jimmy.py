import pygame
from pygame.locals import *

# Define the Turtle class here...
import math


class Turtle:
    def __init__(self, N):
        self.N = N
        self.x = 0
        self.y = 0
        self.color = (
            f"rgb({127 + 127 * math.sin(N)}, {127 + 127 * math.sin(N + 2)}, 100)"
        )

    def draw_segment(self, t, ctx_arms, ctx):
        c1 = {
            "x": math.sin(self.N + (self.N + 1) * t),
            "y": math.cos(self.N + (self.N + 1) * t),
        }
        c2 = {
            "x": math.cos((5 * self.N + 6) * t),
            "y": math.sin((5 * self.N + 6) * t),
        }

        # draw circle arms
        ctx_arms.move_to(400, 400)
        ctx_arms.line_to(400 + 50 * self.N * c1["x"], 400 + 50 * self.N * c1["y"])
        ctx_arms.line_to(
            400 + 50 * self.N * c1["x"] + 25 * c2["x"],
            400 + 50 * self.N * c1["y"] + 25 * c2["y"],
        )
        ctx_arms.stroke()

        # draw colored path
        new_x = 2 * self.N * c1["x"] + c2["x"]
        new_y = 2 * self.N * c1["y"] + c2["y"]
        if self.x or self.y:
            ctx.set_source_rgb(self.color)
            ctx.move_to(25 * self.x + 400, 25 * self.y + 400)
            ctx.line_to(25 * new_x + 400, 25 * new_y + 400)
            ctx.stroke()

        self.x = new_x
        self.y = new_y


def main():
    pygame.init()
    screen = pygame.display.set_mode((800, 800))
    clock = pygame.time.Clock()

    turtles = [Turtle(i) for i in range(1, 8)]

    frame = 0
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == QUIT:
                running = False

        frame += 0.002
        screen.fill((0, 0, 0))  # Clear the screen

        if frame * 500 % 80 < 0.1:
            pygame.draw.rect(screen, (255, 255, 255), pygame.Rect(0, 0, 800, 800))

        for t in turtles:
            t.draw_segment(frame, screen)

        pygame.display.flip()
        clock.tick(60)

    pygame.quit()


if __name__ == "__main__":
    main()
