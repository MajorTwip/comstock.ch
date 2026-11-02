---
title: { de: "Weg von Synology", en: "Away from Synology" }
order: 2
goal:
  de: "Den eigenen Homelab-Stack vollständig ohne Synology betreiben."
  en: "Run the whole homelab stack without any Synology dependency."
nodes:
  - id: mail
    title: { de: "Mail migrieren", en: "Migrate mail" }
    desc: { de: "Gmail / Workspace", en: "Gmail / Workspace" }
    requires: []
    status: done
  - id: data
    title: { de: "Daten migrieren", en: "Migrate data" }
    desc: { de: "Diskbay + TrueNAS", en: "Disk bay + TrueNAS" }
    requires: []
  - id: databases
    title: { de: "Datenbanken migrieren", en: "Migrate databases" }
    desc: { de: "Loki, InfluxDB, MariaDB", en: "Loki, InfluxDB, MariaDB" }
    requires: []
    post: project-unsyno
    anchor: { de: datenbanken-migrieren, en: migrating-the-databases }
  - id: old-backup
    title: { de: "Alte Backup-Syno abschalten", en: "Disable old backup Syno" }
    requires: []
  - id: sso
    title: { de: "SSO mit Authentik", en: "SSO with Authentik" }
    requires: []
    post: authentik-sso
  - id: sso-dlit
    title: { de: "SSO für DLIT", en: "SSO for DLIT" }
    requires: [sso]
    status: done
  - id: docs
    title: { de: "Doku in Outline", en: "Docs in Outline" }
    requires: [sso-dlit]
    post: outline-dokumentation
  - id: dns
    title: { de: "DNS migrieren", en: "Migrate DNS" }
    desc: { de: "Technitium", en: "Technitium" }
    requires: [docs]
  - id: reset-syno
    title: { de: "Neuere Syno zurücksetzen", en: "Reset newer Syno" }
    requires: [dns, mail, data, databases]
  - id: backup-syno
    title: { de: "Backups auf neue Syno", en: "Backups to new Syno" }
    desc: { de: "DSM am IdP", en: "DSM joined to IdP" }
    requires: [reset-syno, old-backup]
  - id: backup
    title: { de: "Backup-Lösung bei VB", en: "Backup solution at VB" }
    desc: { de: "TrueNAS + Tunnel", en: "TrueNAS + tunnel" }
    requires: [backup-syno]
  - id: decommission
    title: { de: "Synology abgeschaltet", en: "Synology retired" }
    desc: { de: "Ziel", en: "Goal" }
    requires: [backup]
---

Schritt für Schritt raus aus der Synology-Abhängigkeit.
