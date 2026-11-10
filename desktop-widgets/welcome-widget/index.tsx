function Welcome() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Terminofeu</h1>
      <h2>Begriffsmanagment für die BSV 2026</h2>

      <p>
        CMS-Einstellungsdateien:{' '}
        <a href="https://github.com/mornir/terminofeu-studio" target="_blank">
          https://github.com/mornir/terminofeu-studio
        </a>
      </p>

      <p>
        Quellcode von terminofeu.ch:{' '}
        <a href="https://github.com/mornir/terminofeu-studio" target="_blank">
          https://github.com/mornir/terminofeu-web
        </a>
      </p>

      <p>
        Sicherheitskopien (Backup):{' '}
        <a href="https://github.com/mornir/terminofeu-studio" target="_blank">
          https://github.com/mornir/terminofeu-studio/actions/workflows/main.yml
        </a>
      </p>
      <p style={{ fontStyle: 'italic' }}>
        CMS-Inhalte werden zweimal pro Monat gesichert. Sicherheitskopien werden
        90 Tage lang aufbewahrt.
      </p>
    </div>
  )
}

export const welcomeWidget = {
  name: 'welcome-widget',
  component: Welcome,
  layout: { width: 'full' as const },
}
