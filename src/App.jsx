import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, CalendarDays, Plus, Trash2, Medal, Zap, Footprints, TimerReset } from "lucide-react";

const RACE_DATE = new Date("2026-10-04T08:00:00");
const PLAN_START = new Date("2026-06-01T00:00:00");

const TRAINING_PLAN = [
  { week: 1, easy: "2.0–2.5 mi", long: "3.5 mi", optional: "20 min easy" },
  { week: 2, easy: "2.5 mi", long: "3.75 mi", optional: "6 short fast bursts" },
  { week: 3, easy: "2.5 mi", long: "4.0 mi", optional: "20–25 min easy" },
  { week: 4, easy: "2.0 mi", long: "3.25 mi", optional: "Rest / bike / play" },
  { week: 5, easy: "2.75 mi", long: "4.25 mi", optional: "6 quick bursts" },
  { week: 6, easy: "3.0 mi", long: "4.5 mi", optional: "20–25 min easy" },
  { week: 7, easy: "2.5 mi", long: "3.75 mi", optional: "Trail walk/jog" },
  { week: 8, easy: "3.0 mi", long: "4.75 mi", optional: "6 quick bursts" },
  { week: 9, easy: "3.25 mi", long: "5.0 mi", optional: "25 min easy" },
  { week: 10, easy: "2.5 mi", long: "4.0 mi", optional: "Fun activity" },
  { week: 11, easy: "3.25 mi", long: "5.25 mi", optional: "6 quick bursts" },
  { week: 12, easy: "3.5 mi", long: "5.5 mi", optional: "25 min easy" },
  { week: 13, easy: "3.0 mi", long: "4.5 mi", optional: "Fun run" },
  { week: 14, easy: "3.5 mi", long: "5.75 mi", optional: "Short fast bursts" },
  { week: 15, easy: "3.5 mi", long: "6.0 mi", optional: "20 min easy" },
  { week: 16, easy: "3.0 mi", long: "6.2 mi practice", optional: "Rest" },
  { week: 17, easy: "2.5 mi", long: "4.0 mi relaxed", optional: "15–20 min easy" },
  { week: 18, easy: "2.0 mi easy", long: "RACE DAY: 10K", optional: "Victory lap" },
];

const FEELINGS = [
  { label: "Easy", emoji: "😎" },
  { label: "Medium", emoji: "🔥" },
  { label: "Hard", emoji: "🥵" },
  { label: "6-7", emoji: "🫡" },
];

function formatDate(date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getWeekDates(week) {
  const start = addDays(PLAN_START, (week - 1) * 7);
  const end = addDays(start, 6);
  return `${formatDate(start)}–${formatDate(end)}`;
}

function getCurrentWeek() {
  const today = new Date();
  const days = Math.floor((today - PLAN_START) / (1000 * 60 * 60 * 24));
  return Math.min(18, Math.max(1, Math.floor(days / 7) + 1));
}

function daysUntilRace() {
  const today = new Date();
  const diff = Math.ceil((RACE_DATE - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function parseMiles(value) {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-100 p-3">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="text-2xl font-black text-slate-900">{value}</p>
          {sub ? <p className="text-xs text-slate-500">{sub}</p> : null}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ value, max = 100, label }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="font-black text-slate-900">{Math.round(pct)}%</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}

function Badge({ unlocked, title, detail, emoji }) {
  return (
    <div className={`rounded-3xl p-4 shadow-sm ring-1 ${unlocked ? "bg-white ring-emerald-200" : "bg-slate-100 text-slate-400 ring-slate-200"}`}>
      <div className="flex items-start gap-3">
        <div className={`text-3xl ${unlocked ? "" : "grayscale"}`}>{emoji}</div>
        <div>
          <p className="font-black">{title}</p>
          <p className="text-sm">{detail}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-wide">{unlocked ? "Unlocked" : "Locked"}</p>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ title, workout, desc }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-4 text-left shadow-sm ring-1 ring-slate-200">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-black uppercase tracking-wide text-slate-500">{title}</span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 ring-1 ring-slate-200">Plan</span>
      </div>
      <p className="text-2xl font-black">{workout}</p>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>
    </div>
  );
}

export default function Ashers10KQuestTracker() {
  const [runs, setRuns] = useState(() => loadJson("asher10k:runs", []));
  const [activeWeek, setActiveWeek] = useState(getCurrentWeek());
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    distance: "",
    time: "",
    feeling: "Easy",
    runType: "Easy Run",
    notes: "",
  });

  useEffect(() => localStorage.setItem("asher10k:runs", JSON.stringify(runs)), [runs]);

  const stats = useMemo(() => {
    const totalMiles = runs.reduce((sum, r) => sum + parseMiles(r.distance), 0);
    const longestRun = runs.reduce((max, r) => Math.max(max, parseMiles(r.distance)), 0);
    const completedRuns = runs.length;
    return { totalMiles, longestRun, completedRuns };
  }, [runs]);

  const currentPlan = TRAINING_PLAN.find((w) => w.week === activeWeek) || TRAINING_PLAN[0];
  const raceCountdown = daysUntilRace();
  const tenKProgress = Math.min(stats.longestRun, 6.2);
  const dadDanger = Math.min(100, Math.round((stats.longestRun / 6.2) * 80 + Math.min(stats.completedRuns, 18)));

  function addRun(e) {
    e.preventDefault();
    const miles = parseMiles(form.distance);
    if (!miles) return;
    setRuns((prev) => [
      {
        id: uid(),
        ...form,
        distance: miles.toFixed(miles % 1 === 0 ? 0 : 2),
      },
      ...prev,
    ]);
    setForm((prev) => ({ ...prev, distance: "", time: "", notes: "" }));
  }

  function removeRun(id) {
    setRuns((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-4 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-lg sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-bold">
                <Flame className="h-4 w-4" /> Rock ’n’ Roll San Jose 10K Quest
              </div>
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Asher’s 10K Tracker</h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-300">
                Mission: run 6.2 miles, feel strong, have fun, and make Dad question his life choices in the final sprint.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-300">Race countdown</p>
              <p className="text-5xl font-black">{raceCountdown}</p>
              <p className="text-slate-300">days until final boss day</p>
            </div>
          </div>
        </motion.header>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard icon={Footprints} label="Total Miles" value={stats.totalMiles.toFixed(1)} sub="Every mile counts" />
          <StatCard icon={Trophy} label="Longest Run" value={`${stats.longestRun.toFixed(1)} mi`} sub="Goal: 6.2 miles" />
          <StatCard icon={CalendarDays} label="Runs Logged" value={stats.completedRuns} sub="Consistency wins" />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black">This Week’s Quest</h2>
                <p className="text-slate-500">Week {activeWeek} • {getWeekDates(activeWeek)}</p>
              </div>
              <select
                value={activeWeek}
                onChange={(e) => setActiveWeek(Number(e.target.value))}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold shadow-sm"
              >
                {TRAINING_PLAN.map((w) => (
                  <option key={w.week} value={w.week}>Week {w.week} • {getWeekDates(w.week)}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <PlanCard title="Easy Run" workout={currentPlan.easy} desc="Chill pace. Talking speed." />
              <PlanCard title="Long Run" workout={currentPlan.long} desc="Main 10K builder." />
              <PlanCard title="Optional Fun Run" workout={currentPlan.optional} desc="Bonus XP only." />
            </div>

            <div className="mt-6 space-y-5 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <ProgressBar value={tenKProgress} max={6.2} label="Progress to 6.2 miles" />
              <ProgressBar value={dadDanger} max={100} label="Dad Danger Meter" />
              <p className="text-sm text-slate-500">
                Scientific rating? Absolutely not. Accurate vibes? Very possible.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-1 text-2xl font-black">Add a Run</h2>
            <p className="mb-4 text-sm text-slate-500">Log the run. Claim the XP. Make Dad nervous.</p>

            <form onSubmit={addRun} className="space-y-3">
              <label className="block">
                <span className="text-sm font-bold text-slate-600">Date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-bold text-slate-600">Miles</span>
                  <input
                    inputMode="decimal"
                    placeholder="3.5"
                    value={form.distance}
                    onChange={(e) => setForm({ ...form, distance: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-600">Time</span>
                  <input
                    placeholder="38:26"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-slate-600">Run Type</span>
                <select
                  value={form.runType}
                  onChange={(e) => setForm({ ...form, runType: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold"
                >
                  <option>Easy Run</option>
                  <option>Long Run</option>
                  <option>Optional Fun Run</option>
                  <option>Race / Practice 10K</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-600">Feeling</span>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {FEELINGS.map((f) => (
                    <button
                      type="button"
                      key={f.label}
                      onClick={() => setForm({ ...form, feeling: f.label })}
                      className={`rounded-2xl p-2 text-center text-sm font-black ring-1 ${form.feeling === f.label ? "bg-slate-950 text-white ring-slate-950" : "bg-slate-50 ring-slate-200"}`}
                    >
                      <div className="text-xl">{f.emoji}</div>
                      {f.label}
                    </button>
                  ))}
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-600">Notes</span>
                <textarea
                  placeholder="Felt good. Dad looked worried."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1 min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold"
                />
              </label>

              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-4 font-black text-white shadow-sm active:scale-[0.99]">
                <Plus className="h-5 w-5" /> Save Run
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Run Log</h2>
                <p className="text-sm text-slate-500">Most recent runs show first.</p>
              </div>
              <TimerReset className="h-6 w-6 text-slate-400" />
            </div>

            {runs.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-8 text-center ring-1 ring-slate-200">
                <p className="text-4xl">👟</p>
                <p className="mt-2 font-black">No runs logged yet.</p>
                <p className="text-sm text-slate-500">Add the first run and start the quest.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {runs.map((run) => (
                  <motion.div
                    key={run.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wide ring-1 ring-slate-200">{run.runType}</span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wide ring-1 ring-slate-200">{run.feeling}</span>
                      </div>
                      <p className="mt-2 text-2xl font-black">{run.distance} miles {run.time ? <span className="text-slate-400">• {run.time}</span> : null}</p>
                      <p className="text-sm text-slate-500">{new Date(`${run.date}T00:00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</p>
                      {run.notes ? <p className="mt-2 text-sm text-slate-700">{run.notes}</p> : null}
                    </div>
                    <button
                      onClick={() => removeRun(run.id)}
                      className="self-start rounded-2xl bg-white p-3 text-slate-400 ring-1 ring-slate-200 hover:text-rose-500"
                      aria-label="Delete run"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center gap-2">
              <Medal className="h-6 w-6" />
              <h2 className="text-2xl font-black">Badges</h2>
            </div>
            <div className="space-y-3">
              <Badge unlocked title="3.5 Mile Badge" detail="Already unlocked. Strong start." emoji="✅" />
              <Badge unlocked={stats.longestRun >= 4} title="4 Mile Badge" detail="Okay, this kid can run." emoji="🏃" />
              <Badge unlocked={stats.longestRun >= 5} title="5 Mile Badge" detail="Dad should be nervous." emoji="👀" />
              <Badge unlocked={stats.longestRun >= 6} title="6 Mile Badge" detail="Final boss energy." emoji="⚡" />
              <Badge unlocked={stats.longestRun >= 6.2} title="10K Ready" detail="6.2 miles unlocked." emoji="🏆" />
              <Badge unlocked={false} title="Beat Dad Badge" detail="Unlock on race day." emoji="🐐" />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-6 w-6" />
            <h2 className="text-2xl font-black">Full 18-Week Plan</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="text-sm uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2">Week</th>
                  <th className="px-3 py-2">Dates</th>
                  <th className="px-3 py-2">Easy</th>
                  <th className="px-3 py-2">Long</th>
                  <th className="px-3 py-2">Optional</th>
                </tr>
              </thead>
              <tbody>
                {TRAINING_PLAN.map((w) => (
                  <tr key={w.week} className="bg-slate-50 ring-1 ring-slate-200">
                    <td className="rounded-l-2xl px-3 py-3 font-black">{w.week}</td>
                    <td className="px-3 py-3 text-sm text-slate-500">{getWeekDates(w.week)}</td>
                    <td className="px-3 py-3 text-sm font-bold">{w.easy}</td>
                    <td className="px-3 py-3 text-sm font-bold">{w.long}</td>
                    <td className="rounded-r-2xl px-3 py-3 text-sm font-bold">{w.optional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
export default function Ashers10KQuestTracker() {
