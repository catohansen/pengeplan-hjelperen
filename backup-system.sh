#!/bin/bash

# Pengeplan Backup System
# Automatisk backup av hele prosjektet

echo "🔄 Starter Pengeplan backup..."

# Opprett backup-mappe med timestamp
BACKUP_DIR="Backup/v1.2.0-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📁 Oppretter backup i: $BACKUP_DIR"

# Kopier alle filer (unntatt Backup-mappen selv)
find . -maxdepth 1 -not -name '.' -not -name 'Backup' -exec cp -r {} "$BACKUP_DIR/" \;

# Opprett database backup
mkdir -p "$BACKUP_DIR/database"
if [ -f "supabase/schema.sql" ]; then
    cp supabase/schema.sql "$BACKUP_DIR/database/"
    echo "✅ Database schema backupet"
fi

# Opprett konfigurasjonsbackup
mkdir -p "$BACKUP_DIR/config"
if [ -f "vercel.json" ]; then
    cp vercel.json "$BACKUP_DIR/config/"
fi
if [ -f "README-file-guide.md" ]; then
    cp README-file-guide.md "$BACKUP_DIR/config/"
fi

# Opprett git status backup
git status > "$BACKUP_DIR/git-status.txt" 2>/dev/null
git log --oneline -10 > "$BACKUP_DIR/git-log.txt" 2>/dev/null

# Opprett filstruktur backup
find . -type f -not -path "./Backup/*" | sort > "$BACKUP_DIR/file-structure.txt"

# Opprett backup-info
cat > "$BACKUP_DIR/backup-info.txt" << EOF
Pengeplan Backup Info
=====================

Backup opprettet: $(date)
Versjon: 1.2.0
Status: Production Ready

Inneholder:
- Komplett kodebase
- Database schema
- Konfigurasjonsfiler
- Git historikk
- Filstruktur

For å gjenopprette:
1. Kopier alle filer fra denne mappen til prosjektmappen
2. Kjør: npm install (hvis nødvendig)
3. Sett opp environment variables
4. Deploy til Vercel

Kontakt: cato@catohansen.no
EOF

echo "✅ Backup fullført!"
echo "📊 Backup størrelse: $(du -sh "$BACKUP_DIR" | cut -f1)"
echo "📁 Backup plassering: $BACKUP_DIR"

# Rydd opp gamle backups (behold siste 5)
echo "🧹 Rydder opp gamle backups..."
cd Backup
ls -t | tail -n +6 | xargs -r rm -rf
cd ..

echo "🎉 Backup-prosess fullført!"
