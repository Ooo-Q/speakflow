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
    <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
      {scenarios.map((scenario) => {
        const active = scenario.id === value;
        return (
          <button
            key={scenario.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(scenario.id)}
            className={`min-h-11 shrink-0 touch-manipulation rounded-full border px-4 py-2 text-left transition active:scale-95 disabled:opacity-50 ${
              active
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-200"
                : "border-slate-600 bg-slate-800/60 text-slate-300 hover:border-slate-500"
            }`}
          >
            <span className="block text-sm font-medium">{scenario.label}</span>
            <span className="block text-xs opacity-80">{scenario.description}</span>
          </button>
        );
      })}
    </div>
  );
}
