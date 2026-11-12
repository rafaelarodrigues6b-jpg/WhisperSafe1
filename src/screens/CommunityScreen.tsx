// Matches 26.png:
// White background, user avatar (green circle) + username above each card,
// large rounded sage-green content cards, "..." pagination, 3-icon bottom nav.

import { useState } from "react"

interface Props {
  onBack: () => void
  onReport: () => void
}

const CARD_BG = "#dce9d8"
const AVATAR_BG = "#8aad84"

interface Post {
  id: number
  user: string
  content: string
  time: string
  category: string
  liked: boolean
}

const initialPosts: Post[] = [
  {
    id: 1,
    user: "an527.",
    content:
      "Precisamos falar mais sobre respeito na escola. Todo mundo merece se sentir seguro e acolhido, independente de quem seja. 💚",
    time: "há 2h",
    category: "Apoio",
    liked: false,
  },
  {
    id: 2,
    user: "thur855_",
    content:
      "Hoje na aula de educação física vi um colega sendo excluído do jogo. Fui lá e chamei ele para jogar junto. Pequenas atitudes fazem diferença!",
    time: "há 4h",
    category: "Relato",
    liked: false,
  },
  {
    id: 3,
    user: "mari_coelho",
    content:
      "Lembrete: a escola tem serviço de orientação disponível toda semana. Se precisar conversar com alguém, não hesite. Você não está sozinho(a).",
    time: "há 6h",
    category: "Aviso",
    liked: true,
  },
  {
    id: 4,
    user: "pedro.r_",
    content:
      "Semana de combate ao bullying começa segunda-feira! Vai ter roda de conversa, exposição e muito mais. Apareçam! 🏫",
    time: "ontem",
    category: "Evento",
    liked: false,
  },
]

function Avatar({ name }: { name: string }) {
  const letter = name[0].toUpperCase()
  return (
    <div
      className="flex items-center justify-center flex-shrink-0 font-bold text-sm"
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: AVATAR_BG,
        color: "#ffffff",
        fontFamily: "'Nunito',sans-serif",
      }}
    >
      {letter}
    </div>
  )
}

export default function CommunityScreen({ onBack, onReport }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p))
    )
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "#ffffff", fontFamily: "'Nunito',sans-serif" }}
    >
      {/* Back button */}
      <div className="px-5 pt-12 pb-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold"
          style={{ color: "#5a8a5e" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
      </div>

      {/* Page header */}
      <div className="px-5 pt-3 pb-4">
        <h1 className="font-black text-2xl" style={{ color: "#1e1e1e" }}>
          Comunidade
        </h1>
        <p className="text-sm" style={{ color: "#9ab09a" }}>
          Escola Estadual Boa Esperança
        </p>
      </div>

      {/* Posts list — matches 26.png layout */}
      <div className="flex flex-col gap-5 px-5 pb-6">
        {posts.map((post) => (
          <div key={post.id}>
            {/* Username row with avatar — matches 26.png */}
            <div className="flex items-center gap-2 mb-2">
              <Avatar name={post.user} />
              <span
                className="text-sm font-bold"
                style={{ color: "#1e1e1e" }}
              >
                {post.user}
              </span>
              <span className="text-xs ml-auto" style={{ color: "#9ab09a" }}>
                {post.time}
              </span>
            </div>

            {/* Content card — large rounded sage-green rectangle matching 26.png */}
            <div
              className="rounded-3xl px-5 pt-4 pb-5"
              style={{ background: CARD_BG }}
            >
              <span
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: "#5a8a5e" }}
              >
                {post.category}
              </span>
              <p
                className="text-sm mt-2 leading-relaxed"
                style={{ color: "#2a2a2a" }}
              >
                {post.content}
              </p>

              {/* Like button */}
              <button
                onClick={() => toggleLike(post.id)}
                className="flex items-center gap-1.5 mt-3"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={post.liked ? "#5a8a5e" : "none"}
                  stroke={post.liked ? "#5a8a5e" : "#9ab09a"}
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span
                  className="text-xs font-semibold"
                  style={{ color: post.liked ? "#5a8a5e" : "#9ab09a" }}
                >
                  Apoiar
                </span>
              </button>
            </div>
          </div>
        ))}

        {/* "..." load more — matches 26.png */}
        <p
          className="text-center text-xl font-bold tracking-widest mt-2"
          style={{ color: "#c2d4bc" }}
        >
          ...
        </p>
      </div>

      {/* Report CTA */}
      <div className="px-5 pb-4">
        <button
          onClick={onReport}
          className="w-full py-4 rounded-3xl font-bold text-sm"
          style={{ background: "#c2d4bc", color: "#1e1e1e" }}
        >
          Fazer uma denúncia
        </button>
      </div>
    </div>
  )
}
