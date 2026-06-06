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
    <div
      className="flex rounded-lg border border-[var(--sf-border)] bg-[var(--sf-surface-2)] p-1"
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
            className={`min-h-9 flex-1 touch-manipulation rounded-md px-2 py-1.5 text-center text-sm transition active:scale-[0.98] disabled:opacity-50 ${
              active
                ? "bg-[var(--sf-surface)] text-[var(--sf-text)] shadow-sm"
                : "text-[var(--sf-muted)] hover:text-[var(--sf-text)]"
            }`}
          >
            {scenario.label}
          </button>
        );
      })}
    </div>
  );
}
