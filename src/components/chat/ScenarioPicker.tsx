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
      className="flex border-t border-[var(--sf-border)]"
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
            className={`relative flex-1 touch-manipulation py-2.5 text-center text-[13px] font-medium transition active:opacity-70 disabled:opacity-40 ${
              active
                ? "text-[var(--sf-accent)]"
                : "text-[var(--sf-muted)] hover:text-[var(--sf-text)]"
            }`}
          >
            {scenario.label}
            <span
              className={`absolute inset-x-4 bottom-0 h-0.5 rounded-full transition-all duration-200 ${
                active
                  ? "bg-[var(--sf-accent)] opacity-100"
                  : "bg-transparent opacity-0"
              }`}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}
