import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DailyStat } from "@/types/statistics.types";

/** Com poucos dias mostra o dia da semana (mais legível); com muitos, dia/mês (evita repetição). */
function formatDayLabel(dateStr: string, useWeekday: boolean): string {
  const date = new Date(`${dateStr}T00:00:00`);
  if (useWeekday) {
    return date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
  }
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function XpTrendChart({ data }: { data: DailyStat[] }) {
  const useWeekday = data.length <= 7;
  const chartData = data.map((d) => ({ day: formatDayLabel(d.date, useWeekday), xp: d.xp }));

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12 }}
            interval={data.length > 10 ? Math.floor(data.length / 6) : 0}
          />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
          <Line type="monotone" dataKey="xp" stroke="#E8A33D" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
