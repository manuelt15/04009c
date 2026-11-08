import type { KeyboardEvent } from "react";

// El grupo comparte una sola parada de Tab y omite opciones deshabilitadas.
export function handleRadioKeys(event: KeyboardEvent<HTMLElement>) {
  if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
  const radios = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button[role="radio"]:not(:disabled)'));
  if (!radios.length) return;
  event.preventDefault();
  const current = radios.indexOf(event.target as HTMLButtonElement);
  const next = event.key === "Home" ? 0 : event.key === "End" ? radios.length - 1
    : (current + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) + radios.length) % radios.length;
  radios[next].focus();
  radios[next].click();
}
