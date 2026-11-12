import logo from "../assets/whispersafe-logo.png"

interface Props {
  imageClassName?: string
  nameClassName?: string
  showName?: boolean
  size?: "sm" | "md" | "lg" | "xl"
  stacked?: boolean
}

const imageSizes = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-20 w-20",
  xl: "h-28 w-28",
}

const nameSizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
  xl: "text-4xl",
}

export default function BrandLogo({
  imageClassName = "",
  nameClassName = "",
  showName = true,
  size = "md",
  stacked = false,
}: Props) {
  return (
    <div className={`flex items-center ${stacked ? "flex-col gap-3" : "gap-2.5"}`}>
      <img
        src={logo}
        alt="Logo WhisperSafe"
        className={`${imageSizes[size]} shrink-0 object-contain ${imageClassName}`}
      />
      {showName && (
        <span className={`${nameSizes[size]} font-black tracking-tight text-sage-900 ${nameClassName}`}>
          WhisperSafe
        </span>
      )}
    </div>
  )
}
