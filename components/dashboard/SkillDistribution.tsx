interface SkillDistributionProps {
  distribution: { skill: string; hours: number; percentage: number }[]
}

const SKILL_GRADIENTS: Record<string, { gradient: string; glow: string }> = {
  Coding: { gradient: "linear-gradient(135deg, #9D93F9, #7C6FF7, #5B51E0)", glow: "0 0 8px rgba(125,111,247,0.4)" },
  Design: { gradient: "linear-gradient(135deg, #F5A0C0, #F07AAB, #E65A96)", glow: "0 0 8px rgba(240,122,171,0.4)" },
  Writing: { gradient: "linear-gradient(135deg, #7EDCB5, #5EC8A0, #3DB889)", glow: "0 0 8px rgba(94,200,160,0.4)" },
  Math: { gradient: "linear-gradient(135deg, #FFB88C, #F7A97C, #E8926A)", glow: "0 0 8px rgba(247,169,124,0.4)" },
  Research: { gradient: "linear-gradient(135deg, #88C8F7, #5EB0F0, #3A97E8)", glow: "0 0 8px rgba(94,176,240,0.4)" },
  Language: { gradient: "linear-gradient(135deg, #F5A0C0, #F07AAB, #E65A96)", glow: "0 0 8px rgba(240,122,171,0.4)" },
  Music: { gradient: "linear-gradient(135deg, #FFB88C, #F7A97C, #E8926A)", glow: "0 0 8px rgba(247,169,124,0.4)" },
  Reading: { gradient: "linear-gradient(135deg, #7EDCB5, #5EC8A0, #3DB889)", glow: "0 0 8px rgba(94,200,160,0.4)" },
  Business: { gradient: "linear-gradient(135deg, #88C8F7, #5EB0F0, #3A97E8)", glow: "0 0 8px rgba(94,176,240,0.4)" },
}

const DEFAULT_GRADIENT = { gradient: "linear-gradient(135deg, #9D93F9, #7C6FF7, #5B51E0)", glow: "0 0 8px rgba(125,111,247,0.4)" }

export function SkillDistribution({ distribution }: SkillDistributionProps) {
  if (distribution.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm font-semibold text-[#7B80A0]">Log sessions to see your skill mix</p>
      </div>
    )
  }

  return (
    <div className="space-y-3.5">
      {distribution.map((item) => {
        const style = SKILL_GRADIENTS[item.skill] || DEFAULT_GRADIENT
        return (
          <div key={item.skill} className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#7B80A0] w-16 shrink-0">
              {item.skill}
            </span>
            <div
              className="flex-1 h-2.5 rounded-full overflow-hidden bg-[#E8EAF0]"
              style={{ boxShadow: "inset 4px 4px 10px #C5C8D6, inset -4px -4px 10px #FFFFFF" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700 ease-smooth"
                style={{
                  width: `${item.percentage}%`,
                  background: style.gradient,
                  boxShadow: style.glow,
                }}
              />
            </div>
            <div className="flex items-center gap-1 w-16 justify-end shrink-0">
              <span className="text-xs text-[#3B3F5C] font-bold">{item.hours}h</span>
              <span className="text-[10px] text-[#A8ABBE] font-semibold">({item.percentage}%)</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
