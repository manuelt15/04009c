"use client";

import { useEffect, useRef } from "react";

// Cada modal conserva su disparador y el scroll previo, también al desmontarse.
export function useFocusTrap<T extends HTMLElement>(open: boolean, initialSelector?: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!open || !ref.current) return;
    const dialog = ref.current;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
    )).filter((el) => el.tabIndex >= 0 && el.getClientRects().length > 0);
    const focusFirst = () => (focusable()[0] ?? dialog).focus();
    const initial = initialSelector ? dialog.querySelector<HTMLElement>(initialSelector) : null;
    (initial ?? focusable()[0] ?? dialog).focus();
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first) { event.preventDefault(); dialog.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    }
    function onFocus(event: FocusEvent) {
      if (!dialog.contains(event.target as Node)) focusFirst();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocus);
      document.body.style.overflow = overflow;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [open, initialSelector]);
  return ref;
}
