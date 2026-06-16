---
title: { de: "Weg von Synology", en: "Away from Synology" }
order: 2
goal:
  de: "Den eigenen Homelab-Stack vollständig ohne Synology betreiben."
  en: "Run the whole homelab stack without any Synology dependency."
nodes:
  - id: storage
    title: { de: "NetApp-Storage", en: "NetApp storage" }
    requires: []
    post: clusterrettung-nach-powerout
  - id: energy
    title: { de: "Energieübersicht", en: "Energy overview" }
    requires: []
    post: powermap
  - id: sso
    title: { de: "SSO mit Authentik", en: "SSO with Authentik" }
    requires: [storage]
    post: authentik-sso
  - id: backup
    title: { de: "Backup-Strategie", en: "Backup strategy" }
    requires: [storage]
  - id: decommission
    title: { de: "Synology abgeschaltet", en: "Synology retired" }
    desc: { de: "Ziel", en: "Goal" }
    requires: [sso, energy, backup]
---

Schritt für Schritt raus aus der Synology-Abhängigkeit.
