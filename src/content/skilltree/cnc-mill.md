---
title: { de: "CNC-Fräse", en: "CNC Mill" }
order: 1
goal:
  de: "Eine selbstgebaute, produktionsreife CNC-Fräse."
  en: "A self-built, production-ready CNC mill."
nodes:
  - id: start
    title: { de: "Erste CNC", en: "First CNC" }
    post: meine-erste-cnc
  - id: material
    title: { de: "Rohmaterial", en: "Raw material" }
    requires: [start]
    post: rohmaterial
  - id: prototype
    title: { de: "Prototyp steht", en: "Prototype up" }
    requires: [material]
    post: prototyping-erfolgreich-nun-wird-stabilisiert
  - id: bearings
    title: { de: "Loslager", en: "Floating bearings" }
    requires: [prototype]
    post: provisorische-loslager
  - id: worktable-test
    title: { de: "Nutenplatte testen", en: "Test groove plate" }
    requires: [prototype]
    post: probe-der-nutenplatte
  - id: worktable
    title: { de: "Nutenplatte montiert", en: "Groove plate mounted" }
    requires: [worktable-test]
    post: nutenplatte-angeschraubt
  - id: softlimits
    title: { de: "Softlimits (Mach4)", en: "Soft limits (Mach4)" }
    requires: [prototype]
    post: autosetsoftlimit
  - id: mk2
    title: { de: "CNC Mk2", en: "CNC Mk2" }
    requires: [bearings, worktable, softlimits]
    post: meine-zweite-cnc-mk2
  - id: improvements
    title: { de: "Verbesserungen Mk3", en: "Mk3 improvements" }
    requires: [mk2]
    post: diverse-verbesserungen-mk3
  - id: production
    title: { de: "Produktionsreif", en: "Production-ready" }
    desc: { de: "Ziel", en: "Goal" }
    requires: [improvements]
---

Der Weg zur eigenen CNC-Fräse, Etappe für Etappe.
