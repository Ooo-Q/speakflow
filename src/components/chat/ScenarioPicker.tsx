import type { Scenario, ScenarioId } from "@/types/scenario";

interface ScenarioPickerProps {
  value: ScenarioId;
  scenarios: Scenario[];
  onChange: (id: ScenarioId) => void;
  disabled?: boolean;
}

export function ScenarioPicker({
  value,
  scenarios,
  onChange,
  disabled,
}: ScenarioPickerProps) {
  return (
    <div className="border-t border-[var(--sf-border)] px-4 py-3">
      <p className="mb-2 text-xs text-[var(--sf-muted)]">练习场景</p>
      <div
        className="sf-scroll flex gap-2 overflow-x-auto pb-0.5"
        role="tablist"
        aria-label="练习场景"
      >
        {scenarios.map((scenario) => {
          const active = scenario.id === value;
          return (
            <button
              key={scenario.id}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={disabled}
              onClick={() => onChange(scenario.id)}
              className={`min-h-10 shrink-0 touch-manipulation rounded-lg border px-4 py-2 text-sm transition active:scale-[0.98] disabled:opacity-50 ${
                active
                  ? "border-[var(--sf-accent)] bg-[var(--sf-accent-soft)] text-[var(--sf-text)]"
                  : "border-[var(--sf-border)] bg-[var(--sf-surface)] text-[var(--sf-muted)] hover:border-[var(--sf-scroll-hover)] hover:text-[var(--sf-text)]"
              }`}
            >
              {scenario.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
