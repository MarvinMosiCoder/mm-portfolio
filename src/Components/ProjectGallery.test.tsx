import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ProjectGallery from "./ProjectGallery";
import { DARK_OS_THEME } from "../theme/osTheme";

const images = [
  { src: "/one.png", alt: "Dashboard", caption: "Overview" },
  { src: "/two.png", alt: "Orders" },
];

test("browses and wraps images using buttons, keyboard, and thumbnails", () => {
  render(<ProjectGallery images={images} projectName="Demo" theme={DARK_OS_THEME} />);
  expect(screen.getByAltText("Dashboard")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Next image" }));
  expect(screen.getByAltText("Orders")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Next image" }));
  expect(screen.getByAltText("Dashboard")).toBeInTheDocument();
  fireEvent.keyDown(screen.getByLabelText(/Swipe or use/), { key: "ArrowLeft" });
  expect(screen.getByAltText("Orders")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Show image 1: Dashboard" }));
  expect(screen.getByAltText("Dashboard")).toBeInTheDocument();
});

test("hides the gallery entirely when no images are provided", () => {
  render(<ProjectGallery images={[]} projectName="Demo" theme={DARK_OS_THEME} />);
  expect(screen.queryByRole("region", { name: "Demo images" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Next image" })).not.toBeInTheDocument();
});

test("handles a broken image and keeps other slides usable", () => {
  render(<ProjectGallery images={images} projectName="Demo" theme={DARK_OS_THEME} />);
  fireEvent.error(screen.getByAltText("Dashboard"));
  expect(screen.getByText("Image unavailable")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Next image" }));
  expect(screen.getByAltText("Orders")).toBeInTheDocument();
});

test("swipes horizontally but ignores vertical gestures and cancelled pointers", () => {
  render(<ProjectGallery images={images} projectName="Demo" theme={DARK_OS_THEME} />);
  const viewport = screen.getByLabelText(/Swipe or use/);
  viewport.setPointerCapture = jest.fn();
  const pointer = (type: string, x: number, y: number) => {
    const event = new Event(type, { bubbles: true });
    Object.assign(event, { pointerId: 1, isPrimary: true, button: 0, clientX: x, clientY: y });
    fireEvent(viewport, event);
  };
  pointer("pointerdown", 200, 100);
  pointer("pointerup", 80, 105);
  expect(screen.getByAltText("Orders")).toBeInTheDocument();
  pointer("pointerdown", 80, 100);
  pointer("pointerup", 200, 300);
  expect(screen.getByAltText("Orders")).toBeInTheDocument();
  pointer("pointerdown", 80, 100);
  pointer("pointercancel", 80, 100);
  pointer("pointerup", 200, 100);
  expect(screen.getByAltText("Orders")).toBeInTheDocument();
});
