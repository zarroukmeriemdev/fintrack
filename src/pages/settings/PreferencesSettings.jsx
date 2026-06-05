import { Button } from '../../components/common/Button.jsx';
import { useTheme } from '../../hooks/useTheme.js';
import { capitalize } from '../../utils/formatters.js';

export default function PreferencesSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div style={{ maxWidth: 480 }}>
      <h2>Preferences</h2>

      <div className="pref-row">
        <div>
          <strong>Theme</strong>
          <p className="field__hint">
            Currently using the {capitalize(theme)} theme.
          </p>
        </div>
        <div className="header-actions">
          <Button
            variant={theme === 'light' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTheme('light')}
            aria-pressed={theme === 'light'}
          >
            Light
          </Button>
          <Button
            variant={theme === 'dark' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTheme('dark')}
            aria-pressed={theme === 'dark'}
          >
            Dark
          </Button>
        </div>
      </div>

      <div className="pref-row">
        <div>
          <strong>Data storage</strong>
          <p className="field__hint">
            Your data is stored locally in your browser. Clearing your browser
            data will remove it.
          </p>
        </div>
      </div>
    </div>
  );
}
