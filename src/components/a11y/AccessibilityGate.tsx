"use client";

/**
 * Picks EXACTLY ONE accessibility control, out of three.
 *
 *   unset (the default)               -> AccessiYes, the shipped choice
 *   `NEXT_PUBLIC_A11Y_WIDGET=sienna`  -> Sienna, skinned and repointed
 *   `NEXT_PUBLIC_A11Y_WIDGET=builtin` -> the local widget (AccessibilityWidget.tsx)
 *
 * ACCESSIYES IS THE DEFAULT because it is what the user chose and generated a site ID for. It
 * needs no configuration to work — the ID is committed — so the unset case is a working widget
 * rather than a preference waiting on someone to fill in a variable. /accessibility §04 declares
 * an accessibility button exists under תקנה 35, and the default must never resolve to nothing.
 *
 * ⚠️ NEITHER OF THE OTHER TWO IS DEAD CODE. Every branch here is reachable by configuration, and
 * that is the point of the file — this product category has churned three times in one day
 * (built-in -> Sienna -> AccessiYes) and each swap has to be one variable, not a refactor. Do not
 * "clean up" the unreferenced-looking imports.
 *
 * ⚠️ THE `.asw-*` BLOCK IN globals.css AND `SiennaCustomize.tsx` ARE SIENNA-ONLY. They match
 * nothing while AccessiYes is shipping, which is harmless — they are the skin for a branch that
 * is still reachable. Do not delete them as dead CSS.
 *
 * ⚠️ /accessibility §04 ENUMERATES THE SHIPPED WIDGET'S CONTROLS. It was rewritten for AccessiYes
 * when this became the default. Flipping this gate again means rewriting it again, in the same
 * change — it is a declaration under תקנה 35, not a feature list.
 */

import AccessiYesWidget from "./AccessiYesWidget";
import SiennaWidget from "./SiennaWidget";
import AccessibilityWidget from "./AccessibilityWidget";

/* `NEXT_PUBLIC_*` is inlined at build time, so this resolves once rather than per render. */
const CHOICE = process.env.NEXT_PUBLIC_A11Y_WIDGET;

export default function AccessibilityGate() {
  if (CHOICE === "builtin") return <AccessibilityWidget />;
  if (CHOICE === "sienna") return <SiennaWidget />;
  return <AccessiYesWidget />;
}
