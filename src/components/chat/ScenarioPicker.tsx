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
    <div className="border-t border-[#2a3441] px-4 py-3">
      <p className="mb-2 text-xs text-[#8b98a8]">练习场景</p>
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
                  ? "border-[#5b9fd4] bg-[rgba(91,159,212,0.14)] text-[#e8edf2]"
                  : "border-[#2a3441] bg-[#141a22] text-[#8b98a8] hover:border-[#3a4654] hover:text-[#c5cdd6]"
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
