"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface RadarAxis {
  label: string
  v: number
  description?: string
}

interface SkinRadarChartProps {
  axes: RadarAxis[]
  healthScore: number
}

const cx = 130, cy = 130, R = 95

const angle = (i: number, N: number) => (Math.PI * 2 * i) / N - Math.PI / 2

const pt = (i: number, r: number, N: number) => ({
  x: cx + r * Math.cos(angle(i, N)),
  y: cy + r * Math.sin(angle(i, N)),
})

const ringPath = (scale: number, axes: RadarAxis[]) =>
  axes.map((_, i) => {
    const { x, y } = pt(i, R * scale, axes.length)
    return `${i === 0 ? "M" : "L"} ${x} ${y}`
  }).join(" ") + " Z"

const dataPath = (axes: RadarAxis[]) =>
  axes.map((a, i) => {
    const { x, y } = pt(i, R * (a.v / 100), axes.length)
    return `${i === 0 ? "M" : "L"} ${x} ${y}`
  }).join(" ") + " Z"

const scoreConfig = (v: number) => {
  if (v >= 80) return { label: "Excellent", color: "#10b981", bg: "#d1fae5", border: "#6ee7b7" }
  if (v >= 60) return { label: "Good",      color: "#0ea5e9", bg: "#e0f2fe", border: "#7dd3fc" }
  if (v >= 40) return { label: "Fair",      color: "#f59e0b", bg: "#fef3c7", border: "#fcd34d" }
  return               { label: "Needs Work",color: "#f43f5e", bg: "#ffe4e6", border: "#fda4af" }
}

export default function SkinRadarChart({ axes, healthScore }: SkinRadarChartProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)

  const active = selected ?? hovered
  const activeAxis = active !== null ? axes[active] : null
  const activeCfg  = activeAxis ? scoreConfig(activeAxis.v) : null

  const handleDotClick = useCallback((i: number) => {
    setSelected(prev => prev === i ? null : i)
  }, [])

  const rings = [0.25, 0.5, 0.75, 1]
  const N = axes.length

  return (
    <div className="flex-1 flex flex-col">
      {/* SVG */}
      <div className="relative flex items-center justify-center py-2">
        <svg
          viewBox="0 0 260 260"
          className="w-full max-w-[250px] cursor-pointer select-none"
        >
          <defs>
            <radialGradient id="rg-active" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.03" />
            </radialGradient>
            <radialGradient id="rg-default" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
            </radialGradient>
            <filter id="glow-dot">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-path">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Grid rings */}
          {rings.map((s, i) => (
            <path
              key={i}
              d={ringPath(s, axes)}
              fill={i === 0 ? "#f5f3ff" : "none"}
              stroke={i === 3 ? "#c4b5fd" : "#ede9fe"}
              strokeWidth={i === 3 ? 1.2 : 0.75}
            />
          ))}

          {/* Ring % labels */}
          {rings.map((s) => {
            const { x, y } = pt(0, R * s, N)
            return (
              <text key={s} x={x + 3} y={y - 3}
                fontSize="7" fill="#a78bfa" fontWeight="600" opacity="0.7">
                {s * 100}
              </text>
            )
          })}

          {/* Spoke lines — highlight active */}
          {axes.map((_, i) => {
            const outer = pt(i, R, N)
            const isActive = active === i
            return (
              <line
                key={i}
                x1={cx} y1={cy} x2={outer.x} y2={outer.y}
                stroke={isActive ? "#7c3aed" : "#ddd6fe"}
                strokeWidth={isActive ? 1.5 : 0.8}
                strokeDasharray={isActive ? "none" : "none"}
                style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
              />
            )
          })}

          {/* Data fill */}
          <path
            d={dataPath(axes)}
            fill={active !== null ? "url(#rg-active)" : "url(#rg-default)"}
            style={{ transition: "fill 0.3s" }}
          />

          {/* Data stroke */}
          <path
            d={dataPath(axes)}
            fill="none"
            stroke="#7c3aed"
            strokeWidth={active !== null ? 2 : 1.5}
            opacity={active !== null ? 0.9 : 0.7}
            filter="url(#glow-path)"
            style={{ transition: "stroke-width 0.2s, opacity 0.2s" }}
          />

          {/* Invisible spoke hit areas */}
          {axes.map((_, i) => {
            const outer = pt(i, R + 20, N)
            return (
              <line
                key={`hit-${i}`}
                x1={cx} y1={cy} x2={outer.x} y2={outer.y}
                stroke="transparent"
                strokeWidth="24"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleDotClick(i)}
              />
            )
          })}

          {/* Data dots */}
          {axes.map((a, i) => {
            const { x, y } = pt(i, R * (a.v / 100), N)
            const isActive = active === i
            const isSelected = selected === i
            return (
              <g
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleDotClick(i)}
                style={{ cursor: "pointer" }}
              >
                {/* Pulse ring on selected */}
                {isSelected && (
                  <circle cx={x} cy={y} r="12" fill="#7c3aed" opacity="0.1" />
                )}
                {/* Glow halo on hover */}
                {isActive && (
                  <circle cx={x} cy={y} r="8" fill="#7c3aed" opacity="0.15" filter="url(#glow-dot)" />
                )}
                <circle
                  cx={x} cy={y}
                  r={isActive ? 7 : 5}
                  fill="#ede9fe"
                  style={{ transition: "r 0.15s" }}
                />
                <circle
                  cx={x} cy={y}
                  r={isActive ? 4.5 : 3}
                  fill={isSelected ? "#4c1d95" : "#7c3aed"}
                  stroke="white"
                  strokeWidth="1.5"
                  style={{ transition: "r 0.15s, fill 0.15s" }}
                />
              </g>
            )
          })}

          {/* Axis labels */}
          {axes.map((a, i) => {
            const labelR = R + 20
            const { x, y } = pt(i, labelR, N)
            const anchor = x < cx - 5 ? "end" : x > cx + 5 ? "start" : "middle"
            const isActive = active === i
            return (
              <g
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleDotClick(i)}
                style={{ cursor: "pointer" }}
              >
                <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle"
                  fontSize="9" fontWeight={isActive ? "800" : "700"}
                  fill={isActive ? "#5b21b6" : "#7c3aed"}
                  letterSpacing="0.03em"
                  style={{ transition: "fill 0.15s, font-weight 0.15s" }}>
                  {a.label}
                </text>
                <text x={x} y={y + 11} textAnchor={anchor} dominantBaseline="middle"
                  fontSize="10" fontWeight="900"
                  fill={isActive ? "#3b0764" : "#6d28d9"}
                  style={{ transition: "fill 0.15s" }}>
                  {a.v}
                </text>
              </g>
            )
          })}

          {/* Centre */}
          <circle cx={cx} cy={cy} r="26" fill="#f5f3ff" stroke="#ede9fe" strokeWidth="1" />
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="17" fontWeight="900" fill="#3b0764">
            {healthScore}
          </text>
          <text x={cx} y={cy + 9} textAnchor="middle" fontSize="7" fontWeight="700"
            fill="#a78bfa" letterSpacing="0.1em">SCORE</text>
        </svg>
      </div>

      {/* Tooltip panel — appears when axis is active */}
      <div className={cn(
        "mx-1 rounded-xl border px-4 py-3 transition-all duration-200",
        activeAxis
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-1 pointer-events-none"
      )}
        style={{
          background: activeCfg?.bg ?? "#f5f3ff",
          borderColor: activeCfg?.border ?? "#ede9fe",
          minHeight: 64,
        }}
      >
        {activeAxis && activeCfg && (
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: activeCfg.color }}>
                {activeCfg.label}
              </p>
              <p className="text-sm font-black text-gray-900 mt-0.5">{activeAxis.label}</p>
              {activeAxis.description && (
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{activeAxis.description}</p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-black" style={{ color: activeCfg.color }}>
                {activeAxis.v}
              </div>
              <div className="text-[9px] text-gray-400 font-semibold">/ 100</div>
            </div>
          </div>
        )}
        {!activeAxis && (
          <p className="text-[11px] text-violet-400 text-center font-medium py-2">
            点击或悬停轴点查看详情
          </p>
        )}
      </div>

      {/* Hint */}
      <p className="text-center text-[10px] text-gray-400 mt-2">
        {selected !== null ? "点击同一轴点取消选中" : "悬停或点击轴点查看分项数据"}
      </p>
    </div>
  )
}
