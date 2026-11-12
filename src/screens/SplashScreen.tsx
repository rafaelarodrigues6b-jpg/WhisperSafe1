import { useEffect } from "react"
import BrandLogo from "../components/BrandLogo"

interface Props {
  onContinue: () => void
}

export default function SplashScreen({ onContinue }: Props) {
  useEffect(() => {
    const t = window.setTimeout(onContinue, 5000)
    return () => clearTimeout(t)
  }, [onContinue])

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #f4f8f3 0%, #e8f2e9 52%, #dceadf 100%)" }}
    >
      <div className="whispersafe-splash-logo relative">
        <BrandLogo
          size="xl"
          stacked
          imageClassName="drop-shadow-[0_14px_30px_rgba(35,63,40,0.12)]"
          nameClassName="text-sage-900"
        />
      </div>
    </div>
  )
}
