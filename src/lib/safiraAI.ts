// ─────────────────────────────────────────────────────────────────────────────
// Safira AI — intent-driven, context-aware conversational engine
// Every response starts from what the student actually said.
// Language: Brazilian Portuguese for teenagers
// ─────────────────────────────────────────────────────────────────────────────

export type IncidentType =
  | "physical"
  | "verbal"
  | "cyber"
  | "harassment"
  | "discrimination"
  | "exclusion"
  | "threat"
  | "other"

export type ProbableCategory =
  | "Abuso verbal"
  | "Assédio"
  | "Agressão não verbal"
  | "Bullying ou perseguição repetida"
  | "Exclusão social"
  | "Cyberbullying"
  | "Outra situação"
  | "Categoria indeterminada"

export type ClassificationConfidence = "baixa" | "média" | "alta"

export type ConversationStage =
  | "acolhimento"
  | "compreensão"
  | "segurança"
  | "classificação"
  | "orientação"
  | "encerramento"

export type CollectedInfo =
  | "what"
  | "when"
  | "where"
  | "who"
  | "frequency"
  | "impact"
  | "tried_help"
  | "witnesses"
  | "aftermath"

// What the AI last asked about — so short replies can be interpreted
type LastAsked =
  | CollectedInfo
  | "general"
  | "how_are_you"
  | "anything_else"
  | "safety"
  | "next_step"
  | null

// Student's apparent emotional state
type EmotionalState = "neutral" | "scared" | "sad" | "angry" | "confused" | "overwhelmed"

// What the student's message seems to be about
type MessageIntent =
  | "greeting"
  | "farewell"
  | "thanks"
  | "casual"
  | "how_it_works"
  | "trust_question"
  | "ready_to_talk"
  | "difficulty_expressing"
  | "short_emotion"
  | "happened_again"
  | "short_confirm_yes"
  | "short_confirm_no"
  | "short_confirm_maybe"
  | "short_ambiguous"
  | "report_detail"
  | "wants_report"
  | "only_talk"
  | "other"

export interface AIState {
  userMsgCount: number
  incidentType: IncidentType | null
  urgency: boolean
  collected: CollectedInfo[]
  lastAsked: LastAsked
  guidanceGiven: boolean
  reportSubmitted: boolean
  emotionalState: EmotionalState
  usedPhrases: string[]
  categories: ProbableCategory[]
  classificationConfidence: ClassificationConfidence
  stage: ConversationStage
  safetyChecked: boolean
  classificationShared: boolean
}

export const initialAIState: AIState = {
  userMsgCount: 0,
  incidentType: null,
  urgency: false,
  collected: [],
  lastAsked: null,
  guidanceGiven: false,
  reportSubmitted: false,
  emotionalState: "neutral",
  usedPhrases: [],
  categories: ["Categoria indeterminada"],
  classificationConfidence: "baixa",
  stage: "acolhimento",
  safetyChecked: false,
  classificationShared: false,
}

// ─── Utilities ────────────────────────────────────────────────────────────────

const lower = (s: string) => s.toLowerCase().trim()

function has(text: string, words: string[]): boolean {
  const t = lower(text)
  return words.some((w) => t.includes(w))
}

function matchesPattern(text: string, pattern: RegExp): boolean {
  return pattern.test(lower(text))
}

// Pick from a pool, avoiding recently used phrases
function pick(pool: string[], used: string[]): string {
  const fresh = pool.filter((p) => !used.includes(p))
  const source = fresh.length > 0 ? fresh : pool
  return source[Math.floor(Math.random() * source.length)]
}

// ─── Message intent classifier ────────────────────────────────────────────────

export function classifyIntent(text: string, state: AIState): MessageIntent {
  const t = lower(text)
  const len = t.replace(/\s/g, "").length

  if (has(t, ["quero denunciar", "quero fazer uma denúncia", "quero registrar", "registrar denúncia", "enviar denúncia"]))
    return "wants_report"
  if (has(t, ["só quero conversar", "so quero conversar", "só desabafar", "so desabafar", "não quero denunciar", "nao quero denunciar"]))
    return "only_talk"

  // Greetings — exact or near-exact
  if (
    matchesPattern(
      t,
      /^(oi+|olá|ola|hey|hi|hello|bom dia|boa tarde|boa noite|tá aí|ta ai|tem alguém|tem alguem|alô|alo|e aí|e ai|eai|salve|opa|oiê|oie|ei|oii|oiii)[\s!?.,]*$/
    )
  )
    return "greeting"

  // Farewells — goodbye + "that's all" type endings
  const isThanks =
    matchesPattern(t, /^(obrigad[ao]|vlw|valeu|obg|brigad[ao]|agradec)[\s!?.,]*$/) ||
    has(t, ["obrigada por ouvir", "obrigado por ouvir", "valeu por ouvir", "vlw por ouvir"])
  const isFarewell =
    matchesPattern(t, /^(tchau|até|ate|xau|bye|falou|flw|vou indo|tô indo|to indo|vou sair|até mais|até logo|de nada|tamo|foi)[\s!?.,]*$/) ||
    has(t, [
      "isso é tudo", "é só isso", "é isso só", "é só isso mesmo", "foi só isso",
      "terminei", "acabei", "pode encerrar", "pode fechar", "pode parar",
      "não tenho mais nada", "não tenho mais nada a dizer", "não tem mais nada",
      "não, é só isso", "não, obrigad", "não tem mais", "nada mais",
      "pode finalizar", "acho que é isso", "acho que é só isso",
      "pronto, é isso", "pronto é isso", "só isso mesmo",
      "vou indo agora", "tenho que ir", "tenho que sair", "preciso ir",
      "bye bye", "até amanhã", "até depois", "até mais tarde",
      "obrigado tchau", "obrigada tchau", "valeu tchau", "brigado tchau",
    ])
  if (isThanks || isFarewell) return isThanks && !isFarewell ? "thanks" : "farewell"

  // How it works / what can I do here
  if (
    has(t, [
      "como funciona", "o que é isso", "o que posso fazer", "pra que serve",
      "como usar", "o que tem aqui", "como faço", "como isso funciona",
      "o que é whisper", "como funciona o app", "pra que é isso",
    ])
  )
    return "how_it_works"

  // Trust / anonymity questions
  if (
    has(t, [
      "é seguro", "posso confiar", "vão saber", "vai aparecer", "alguém vai ver",
      "meu nome", "fica anônimo", "anonimo", "anônima", "quem vai ver",
      "vai aparecer meu nome", "é confidencial", "professor vai ver",
    ])
  )
    return "trust_question"

  // Casual social
  if (matchesPattern(t, /^(tudo bem|tudo bom|tudo certo|como vai|como você (está|ta|tá)|oi tudo|beleza|oi como|tô bem|to bem|estou bem)[\s!?.,]*$/))
    return "casual"

  // Wants to talk / open request
  if (
    has(t, [
      "preciso conversar", "preciso falar", "preciso desabafar", "quero desabafar",
      "aconteceu uma coisa", "aconteceu algo", "posso contar", "posso falar",
      "quero falar", "quero contar", "quero relatar", "tenho algo pra falar",
      "preciso de ajuda", "pode me ajudar", "não sei o que fazer",
    ])
  )
    return "ready_to_talk"

  // Difficulty expressing themselves
  if (
    has(t, [
      "não sei como explicar", "não sei o que dizer", "não sei por onde começar",
      "é difícil falar", "difícil de explicar", "não consigo explicar",
      "não sei como começar", "não sei como contar", "é complicado explicar",
      "não sei nem como", "tá difícil falar",
    ])
  )
    return "difficulty_expressing"

  // Happened again
  if (has(t, ["aconteceu de novo", "foi de novo", "aconteceu outra vez", "voltou a acontecer", "tá acontecendo de novo", "de novo isso"]))
    return "happened_again"

  // Short emotional expressions
  if (
    len < 30 &&
    has(t, [
      "com medo", "tenho medo", "estou com medo", "tô com medo",
      "assustado", "assustada", "apavorad",
      "triste", "chorando", "chorei", "tô triste",
      "com raiva", "raiva", "irritado", "irritada", "bravo", "brava",
      "nervoso", "nervosa", "ansioso", "ansiosa",
      "mal", "péssim", "horrív", "arrasad",
      "não aguento mais", "cansado", "cansada", "esgotad",
      "perdid", "sozinho", "sozinha",
    ])
  )
    return "short_emotion"

  // Short confirmations
  if (len < 20) {
    if (matchesPattern(t, /^(sim|s|ss|sss|yeah|yep|é|eh|isso|exato|exatamente|com certeza|claro|óbvio|claro que sim|aham|uhm|uhum|mhm|xim)[\s!?.,]*$/))
      return "short_confirm_yes"
    if (matchesPattern(t, /^(não|nao|n|nn|nope|nem|nem um pouco|de jeito nenhum|jamais|nunca)[\s!?.,]*$/))
      return "short_confirm_no"
    if (matchesPattern(t, /^(talvez|sei lá|sei la|idk|pode ser|acho|não sei|nao sei|nsé|mais ou menos|nem sei|depende)[\s!?.,]*$/))
      return "short_confirm_maybe"
    // Very short message that's ambiguous
    if (len < 10 && state.userMsgCount > 0) return "short_ambiguous"
  }

  // Longer message — likely a report or explanation
  if (len > 25) return "report_detail"

  return "other"
}

// ─── Emotional state detection ────────────────────────────────────────────────

function detectEmotion(text: string): EmotionalState {
  if (has(text, ["medo", "assustado", "assustada", "apavorad", "com medo"])) return "scared"
  if (has(text, ["triste", "chorando", "chorei", "arrasad", "não aguento", "esgotad"])) return "sad"
  if (has(text, ["raiva", "irritado", "irritada", "bravo", "brava", "ódio", "odeio"])) return "angry"
  if (has(text, ["não sei", "confuso", "confusa", "perdido", "perdida", "não entendo"])) return "confused"
  if (has(text, ["cansado", "cansada", "esgotad", "pesado", "pesada", "difícil demais"])) return "overwhelmed"
  return "neutral"
}

// ─── Urgency detection ────────────────────────────────────────────────────────

function detectUrgency(text: string): boolean {
  return has(text, [
    "suicídio", "suicidio", "me matar", "quero morrer", "não quero mais viver",
    "me machucar", "me ferir", "perigo agora", "vão me bater hoje",
    "estou em perigo", "me ameaçaram de morte", "faca", "arma",
    "não me sinto seguro agora", "não me sinto segura agora",
  ])
}

// ─── Incident type detection ──────────────────────────────────────────────────

function detectsSafetyConcern(text: string): boolean {
  return has(text, [
    "ameaça", "ameaçou", "ameaçando", "intimid", "persegu", "seguindo",
    "medo", "bater", "apanhar", "machucar", "agredir", "arma", "faca",
    "tocar", "tocou", "assédio", "sem permissão",
  ])
}

function indicatesSafetyAnswer(text: string): boolean {
  return has(text, [
    "estou seguro", "estou segura", "tô seguro", "tô segura", "to seguro", "to segura",
    "não estou seguro", "não estou segura", "nao estou seguro", "nao estou segura",
    "agora sim", "agora não", "agora nao", "nesse momento",
  ])
}

export function detectCategories(text: string): ProbableCategory[] {
  const categories: ProbableCategory[] = []

  if (has(text, [
    "xingar", "xingam", "xingou", "insulto", "ameaça verbal", "chamar de",
    "apelido", "humilhar", "ofender", "deboche", "zoação", "zoar",
    "tirar sarro", "falar mal", "comentário ofensivo",
  ])) categories.push("Abuso verbal")

  if (has(text, [
    "assédio", "assedi", "tocar", "tocou", "cantada", "sexual", "sem permissão",
    "sem minha permissão", "invadiu meu espaço", "constrang",
  ])) categories.push("Assédio")

  if (has(text, [
    "gesto", "encarando", "olhar ameaçador", "sinal", "careta", "intimid",
    "seguindo", "perseguindo", "expor", "exposição",
  ])) categories.push("Agressão não verbal")

  if (has(text, [
    "ignorar", "ignoram", "excluir", "excluíram", "ninguém fala", "grupo sem mim",
    "deixar de fora", "me afastaram", "isolando", "isolado", "isolada",
  ])) categories.push("Exclusão social")

  if (has(text, [
    "internet", "redes sociais", "whatsapp", "instagram", "tiktok", "print",
    "foto minha sem", "vídeo meu sem", "online", "grupo do zap", "stories",
    "direct", "dm", "perfil falso",
  ])) categories.push("Cyberbullying")

  const repeated = has(text, [
    "sempre", "todo dia", "toda semana", "várias vezes", "varias vezes",
    "de novo", "outra vez", "continua", "recorrente", "faz semanas",
    "faz meses", "toda vez", "com frequência", "constantemente",
  ])
  const aggressive = categories.length > 0 || has(text, [
    "bater", "empurrar", "socar", "agredir", "ameaçar", "humilhar", "perseguir", "bullying",
  ])
  if (repeated && aggressive)
    categories.push("Bullying ou perseguição repetida")

  return Array.from(new Set(categories))
}

function classificationFor(
  text: string,
  state: AIState,
  collected: CollectedInfo[],
): { categories: ProbableCategory[]; confidence: ClassificationConfidence } {
  const detected = detectCategories(text)
  const previous = state.categories.filter((category) => category !== "Categoria indeterminada")
  const recurrenceConfirmed = has(text, [
    "sempre", "todo dia", "toda semana", "várias vezes", "varias vezes",
    "de novo", "outra vez", "continua", "recorrente", "faz semanas",
    "faz meses", "toda vez", "com frequência", "constantemente",
  ])
  if (
    recurrenceConfirmed &&
    state.incidentType &&
    state.incidentType !== "other" &&
    !detected.includes("Bullying ou perseguição repetida")
  ) {
    detected.push("Bullying ou perseguição repetida")
  }
  const categories = Array.from(new Set([...previous, ...detected]))

  if (categories.length === 0) {
    return {
      categories: collected.includes("what") ? ["Outra situação"] : ["Categoria indeterminada"],
      confidence: "baixa",
    }
  }

  const contextPoints = [
    collected.includes("what"),
    collected.includes("frequency") || collected.includes("when"),
    collected.includes("where") || collected.includes("who"),
    collected.includes("impact"),
  ].filter(Boolean).length

  return {
    categories,
    confidence: contextPoints >= 3 ? "alta" : contextPoints >= 2 ? "média" : "baixa",
  }
}

export function categoryLabel(categories: ProbableCategory[]): string {
  return categories.join(", ")
}

export function detectIncidentType(text: string): IncidentType | null {
  if (has(text, ["suicídio", "suicidio", "me matar", "quero morrer"])) return "threat"
  if (has(text, ["bater", "bateram", "empurrar", "socar", "agredir", "agressão", "machucar", "violência física", "apanhar", "chute", "chutou", "pancada"])) return "physical"
  if (has(text, ["ameaça", "ameaçar", "ameaçou", "vou te bater", "medo que me machuque", "está me ameaçando"])) return "threat"
  if (has(text, ["internet", "redes sociais", "whatsapp", "instagram", "tiktok", "print", "foto minha sem", "vídeo meu sem", "online", "grupo do zap", "comentário", "stories", "direct", "dm"])) return "cyber"
  if (has(text, ["tocar", "tocou", "assédio", "constrangimento sexual", "cantada forçada", "sem minha permissão", "sem permissão"])) return "harassment"
  if (has(text, ["racismo", "racista", "homofobia", "lgbtq", "preconceito", "discriminação", "apelido por ser", "minha cor", "minha religião", "xenofobia"])) return "discrimination"
  if (has(text, ["ignorar", "ignoram", "excluir", "excluíram", "ninguém fala", "grupo sem mim", "deixar de fora", "sozinho porque", "sozinha porque", "me afastaram"])) return "exclusion"
  if (has(text, ["xingar", "xingam", "chamar de", "apelido", "humilhar", "ofender", "deboche", "zoação", "zoar", "tirar sarro", "falar mal", "gozação", "bullying"])) return "verbal"
  if (has(text, ["bullying", "bully"])) return "verbal"
  return null
}

// ─── Info extraction from message ────────────────────────────────────────────

function extractInfo(text: string): CollectedInfo[] {
  const found: CollectedInfo[] = []
  if (has(text, ["hoje", "ontem", "semana passada", "mês passado", "faz tempo", "começou", "desde", "há dias", "há semanas", "faz um tempo", "já faz", "meses", "anos"])) found.push("when")
  if (has(text, ["corredor", "sala", "quadra", "refeitório", "banheiro", "portão", "escola", "ônibus", "online", "no grupo", "instagram", "whatsapp", "durante", "no recreio", "na aula"])) found.push("where")
  if (has(text, ["ele", "ela", "eles", "elas", "um colega", "uma colega", "um grupo", "professor", "professora", "menino", "menina", "uma pessoa", "algumas pessoas", "turma toda"])) found.push("who")
  if (has(text, ["sempre", "toda semana", "todo dia", "todo dia", "frequente", "várias vezes", "de vez em quando", "aconteceu uma vez", "repetindo", "continua", "toda vez", "com frequência", "constantemente"])) found.push("frequency")
  if (has(text, ["sinto", "me sentindo", "afetando", "não consigo", "não quero mais", "com medo", "envergonhado", "envergonhada", "triste", "ansioso", "ansiosa", "deprimido", "tá me afetando", "tô mal"])) found.push("impact")
  if (has(text, ["já falei", "tentei contar", "contei pra", "já disse", "já avisei", "professor sabe", "direção sabe", "minha mãe sabe", "meu pai sabe", "já fui", "já tentei"])) found.push("tried_help")
  if (has(text, ["viram", "outros viram", "tinha gente", "tinha pessoas", "todo mundo viu", "meu amigo viu", "testemunha", "viu acontecer"])) found.push("witnesses")
  if (text.trim().length > 30) found.push("what")
  return found
}

// ─── Response pools ──────────────────────────────────────────────────────────

const GREETING_RESPONSES = [
  "Oi! Tô aqui. 💚 Pode falar o que quiser — sem pressa.",
  "Olá! Que bom que você veio. Estou aqui para ouvir. O que tá passando?",
  "Oi! Estou aqui sim. Pode falar quando quiser.",
  "Oi, oi! Pode começar por onde preferir — tô toda ouvidos.",
  "Olá! Fico feliz que você apareceu. Estou aqui para o que você precisar.",
]

const FAREWELL_RESPONSES = [
  "Tá bom. Fico feliz que você veio conversar. Cuide-se, e pode voltar quando quiser. 💚",
  "Claro. Se surgir mais alguma coisa, estou aqui. Cuide-se!",
  "Que bom que a gente conversou. Até logo — e lembra que pode voltar sempre que precisar. 💚",
  "Pode ir. Lembra que você não está sozinho(a) nisso. Cuide-se! 💚",
  "Entendido. Foi bom te ouvir. Se precisar de mais alguma coisa, a gente se fala.",
  "Tá ótimo. Espero ter ajudado. Cuide-se e volte quando precisar. 💚",
  "Claro, pode ir. Você fez certo em conversar. Qualquer coisa, estou aqui.",
]

const THANKS_RESPONSES = [
  "De nada. Pode continuar me contando se quiser — estou aqui.",
  "Claro. Se tiver mais alguma coisa que queira falar, estou aqui.",
  "Que bom que pôde conversar comigo. Fico aqui se precisar de mais alguma coisa.",
  "Fico feliz em ter ajudado. Estou aqui sempre que precisar.",
]

const HOW_IT_WORKS_RESPONSES = [
  "Aqui você pode conversar comigo sobre qualquer coisa que esteja acontecendo na escola — uma situação difícil, algo que te incomoda, ou só uma dúvida. Se quiser, podemos fazer uma denúncia juntos. Mas não tem pressa. Por onde você quer começar?",
  "Esse espaço é seu. Você pode me contar o que está acontecendo, pedir uma orientação, ou registrar uma denúncia — tudo no seu tempo. A conversa aqui é segura e sigilosa. Tem alguma coisa específica que você quer falar?",
  "Você pode conversar comigo sobre o que estiver acontecendo, receber orientações, ou formalizar uma denúncia se quiser. Não precisa saber exatamente o que fazer — a gente vai junto. O que tá na sua cabeça?",
]

const TRUST_RESPONSES = [
  "O WhisperSafe limita o acesso às suas informações à equipe responsável. Outros estudantes não veem esta conversa. Ainda assim, não quero prometer anonimato absoluto: em uma situação grave, a equipe pode precisar agir para proteger você. O que você gostaria de saber sobre esse cuidado?",
  "Sua conversa não fica visível para outros estudantes e o acesso é controlado pela plataforma. Se você registrar uma denúncia, somente a equipe autorizada poderá analisá-la. Isso responde à sua dúvida?",
  "A plataforma foi feita para proteger sua identidade e restringir o acesso aos responsáveis pelo atendimento. Eu não posso prometer sigilo absoluto em situações de risco, mas seus dados não devem ser compartilhados sem necessidade. Quer conversar sobre algo específico?",
]

const CASUAL_RESPONSES = [
  "Estou bem, obrigada! 😊 E você — tem alguma coisa que queira falar ou perguntar?",
  "Tô por aqui, pronta pra ouvir. Como você tá?",
  "Tô bem! E você? Tem algo no que eu possa te ajudar?",
]

const READY_TO_TALK_RESPONSES = [
  "Pode falar. Estou ouvindo.",
  "Claro. Tô aqui. Pode começar por onde quiser.",
  "Estou aqui. Conta pra mim — o que aconteceu?",
  "Tô toda ouvidos. Pode ir falando.",
  "Pode contar. Sem julgamento aqui.",
]

const DIFFICULTY_EXPRESSING_RESPONSES = [
  "Não precisa explicar tudo de uma vez, nem de forma perfeita. Você pode começar pelo que vier — qualquer coisa serve como ponto de partida.",
  "Entendo. É difícil encontrar as palavras às vezes. Pode falar aos pedaços, do jeito que estiver conseguindo — a gente vai entendendo juntos.",
  "Não tem jeito certo de contar. Pode começar por qualquer parte, pelo que parecer mais fácil. Estou aqui pra ir junto.",
  "Tudo bem. Você não precisa ter tudo organizado na cabeça antes de falar. Pode soltar o que vier — eu ajudo a entender.",
]

const HAPPENED_AGAIN_RESPONSES = [
  "Entendido. Que chato que voltou a acontecer. Me conta — o que foi dessa vez?",
  "Que difícil. Quando se repete assim, pesa muito. O que aconteceu agora?",
  "Entendi. Obrigada por me avisar. O que aconteceu de novo — foi a mesma situação?",
]

const SHORT_EMOTION: Record<EmotionalState, string[]> = {
  scared: [
    "Sentir medo faz sentido com o que você está vivendo. Você está em segurança aqui. Me conta o que está acontecendo?",
    "Esse medo que você está sentindo é real. Pode me falar mais sobre o que está acontecendo?",
    "Entendo. Quando a gente sente medo assim, é porque tem algo sério por trás. O que tá acontecendo?",
  ],
  sad: [
    "Fico triste que você esteja passando por isso. Que bom que você veio conversar — pode me contar o que está acontecendo?",
    "Isso que você está sentindo faz sentido. Estou aqui para ouvir. O que tá acontecendo com você?",
    "Que pesado carregar isso. Me conta — o que aconteceu?",
  ],
  angry: [
    "Raiva também é uma resposta válida. Se você quiser me contar o que aconteceu, estou aqui para ouvir.",
    "Entendo essa raiva. Quando a gente passa por coisas injustas, é natural se sentir assim. Pode me contar o que está acontecendo?",
    "Faz sentido estar assim. O que aconteceu?",
  ],
  confused: [
    "Confusão também é uma resposta normal — nem sempre é fácil entender o que está acontecendo. Me conta e a gente tenta entender juntos.",
    "Tudo bem não saber exatamente o que está sentindo. Pode me contar o que aconteceu e a gente vai junto.",
    "Isso é comum. Às vezes a situação em si é confusa. Me conta o que está passando.",
  ],
  overwhelmed: [
    "Parece que tá sendo pesado demais. Você não precisa resolver tudo agora. Me conta um pouco do que está acontecendo?",
    "Quando as coisas pesam muito assim, é importante ter alguém para conversar. Estou aqui. O que tá acontecendo?",
    "Não precisa dar conta de tudo sozinho(a). Me conta o que está acontecendo.",
  ],
  neutral: [
    "Parece que tem algo acontecendo. Pode me contar o que é?",
    "Entendi. Me conta mais — o que está acontecendo?",
    "Pode me falar mais sobre o que você está sentindo?",
  ],
}

// Guidance by incident type — specific, practical, non-generic
const GUIDANCE: Record<string, string> = {
  physical: "Enquanto a denúncia é analisada, uma coisa importante: tente não ficar sozinho(a) nos momentos em que você se sente mais vulnerável. Se possível, fique perto de colegas de confiança. E se sentir que está em perigo imediato em algum momento, busque um professor ou funcionário da escola na hora — não precisa esperar.",
  verbal: "Uma coisa que pode ajudar agora é identificar um professor ou funcionário com quem você se sinta confortável para conversar pessoalmente — só a presença de um adulto por perto já pode mudar a dinâmica. Se puder, anote quando as situações acontecem e o que foi dito — não para provar nada, mas porque isso ajuda muito na investigação.",
  cyber: "Se for seguro fazer isso, guarde prints das mensagens ou publicações relacionadas — são evidências importantes. Evite responder ou reagir a quem está te atacando online, porque isso geralmente piora. E conta para alguém de confiança o que está acontecendo — não precisa enfrentar isso sozinho(a).",
  harassment: "É importante que um adulto responsável fique sabendo disso. Um orientador, a coordenação ou um professor de confiança têm obrigação de agir. Se puder, anote as situações com data e o que aconteceu. E se alguém tentar te pressionar a não contar — isso também é errado.",
  discrimination: "Discriminação é uma violação de direitos, e a escola é obrigada a investigar e tomar medidas. Além de falar com a orientação, pode ser útil contar para um familiar ou responsável para que eles acompanhem o caso. O que você está sentindo é válido — e o que aconteceu com você é sério.",
  exclusion: "Exclusão pode ser difícil de provar, mas não significa que não é real ou séria. Identificar um professor ou colega que tenha percebido a situação pode ajudar. Conversar com o orientador também pode abrir caminhos. E, se possível, procurar manter contato com pessoas fora desse grupo também ajuda.",
  threat: "Ameaças nunca devem ser ignoradas. Por favor, fale com um adulto de confiança — familiar, professor ou orientador — sobre isso o quanto antes. Se sentir que está em perigo agora, busque ajuda presencialmente imediatamente.",
  other: "Enquanto a denúncia está sendo analisada, tente identificar um adulto de confiança — professor, orientador, ou alguém da família — com quem você possa conversar pessoalmente. Não precisa esperar a resolução do caso para buscar apoio.",
}

// Specific acknowledgments when student describes an incident
const INCIDENT_ACKNOWLEDGMENTS: Record<string, string[]> = {
  physical: [
    "Isso é sério, e eu ouvi você. Ninguém deveria passar por isso.",
    "Agressão física não é normal, e você fez certo em me contar.",
    "Que difícil. Isso não deveria estar acontecendo com você.",
  ],
  verbal: [
    "Palavras machucam de verdade — isso não é frescura nem exagero.",
    "Ser humilhado ou xingado repetidamente desgasta muito por dentro. Entendo.",
    "Isso que você está vivendo é pesado. E você fez certo em falar.",
  ],
  cyber: [
    "Cyberbullying é especialmente difícil porque parece que não tem como escapar — está em todo lugar.",
    "Quando acontece pela internet, a sensação de não ter saída é muito real. Você não está exagerando.",
    "Isso online machuca tanto quanto qualquer outra coisa. Às vezes mais, porque não tem como fugir.",
  ],
  harassment: [
    "Obrigada por confiar em mim com isso. O que você descreveu é sério.",
    "Isso é uma violação, e você tem todo o direito de se sentir como está se sentindo.",
    "Você não precisava passar por isso. E você fez certo em me contar.",
  ],
  discrimination: [
    "Ser tratado de forma diferente por quem você é... isso dói de um jeito muito específico.",
    "Discriminação não é só desrespeitosa — ela machuca profundamente. E você não merece isso.",
    "Você não deveria estar passando por isso. O que aconteceu com você é errado.",
  ],
  exclusion: [
    "Ser ignorado ou excluído pode parecer menos grave para quem está de fora, mas a dor é muito real.",
    "Isso de ser deixado de fora... é uma coisa muito pesada de carregar sozinho(a).",
    "Exclusão também é uma forma de violência — mesmo que silenciosa. Você não precisa normalizar isso.",
  ],
  threat: [
    "Obrigada por me contar isso. O que você está descrevendo me preocupa — e faz bem que você veio falar.",
    "Sentir-se ameaçado(a) é sério, e você não deveria ter que lidar com isso sozinho(a).",
    "Ameaças não devem ser ignoradas. Você fez certo em me contar.",
  ],
  other: [
    "Obrigada por compartilhar isso comigo. Estou levando a sério.",
    "Ouvi o que você disse. Pode continuar me contando.",
    "Que bom que você veio falar. Pode me contar mais?",
  ],
}

// Contextual follow-up questions — short, one at a time
const FOLLOW_UP_QUESTIONS: Record<CollectedInfo, string[]> = {
  who: [
    "Você sabe quem está fazendo isso — é alguém da sua turma?",
    "É uma pessoa só ou um grupo?",
    "Você conhece quem está envolvido?",
  ],
  when: [
    "Isso está acontecendo há quanto tempo, mais ou menos?",
    "Quando foi que isso começou?",
    "Isso é recente ou já faz um tempo?",
  ],
  where: [
    "Onde isso costuma acontecer?",
    "Isso ocorre em algum lugar específico da escola, ou em vários?",
    "Em que parte da escola isso acontece normalmente?",
  ],
  frequency: [
    "Isso acontece com frequência, ou foi uma coisa isolada?",
    "Isso se repete com que frequência?",
    "É algo que acontece sempre, ou de vez em quando?",
  ],
  impact: [
    "Como isso está te afetando? No dia a dia, na escola?",
    "Você está conseguindo ir à escola normalmente com tudo isso?",
    "Como você está se sentindo com tudo isso?",
  ],
  tried_help: [
    "Você já tentou falar com alguém sobre isso — um professor, a orientação, ou alguém em casa?",
    "Tem algum adulto que já sabe o que está acontecendo?",
    "Você já contou isso para alguém antes?",
  ],
  witnesses: [
    "Quando isso acontece, tem outras pessoas por perto?",
    "Alguém mais presenciou alguma dessas situações?",
  ],
  what: [
    "Me conta mais. O que está acontecendo exatamente?",
    "Pode me contar mais sobre o que aconteceu?",
  ],
  aftermath: [
    "Depois que você tentou pedir ajuda, o que aconteceu?",
    "E depois disso — as coisas mudaram de algum jeito?",
  ],
}

// Short confirm interpretation templates
function interpretShortConfirm(
  confirmType: "yes" | "no" | "maybe",
  lastAsked: LastAsked,
  state: AIState
): string {
  if (lastAsked === "safety") {
    if (confirmType === "yes") return "Fico aliviada por você estar em segurança agora. Isso já aconteceu mais de uma vez?"
    if (confirmType === "no") return "Sua segurança vem primeiro. Vá para perto de um adulto de confiança ou de outras pessoas e peça ajuda presencial agora. Se houver perigo imediato, ligue para o **190**. Você consegue ir para um local mais seguro?"
    return "Tudo bem se não tiver certeza. Procure ficar perto de pessoas de confiança enquanto conversamos. Isso já aconteceu mais de uma vez?"
  }

  if (lastAsked === "next_step") {
    if (confirmType === "no") return "Tudo bem. Você não precisa decidir agora. Podemos continuar conversando ou parar por aqui, como preferir."
    return "Você pode me dizer qual opção prefere: registrar uma denúncia, buscar apoio emocional ou continuar conversando?"
  }

  if (lastAsked === "how_are_you") {
    if (confirmType === "yes") return "Fico feliz. E tem alguma coisa que você queira falar comigo?"
    if (confirmType === "no") return "Desculpe ouvir isso. Quer me contar o que está acontecendo?"
    return "Entendi. Se quiser me contar mais, estou aqui."
  }

  if (lastAsked === "anything_else") {
    if (confirmType === "yes") return "Pode falar. Estou ouvindo."
    if (confirmType === "no") return "Tudo bem. Estou aqui se precisar de mais alguma coisa."
    return "Sem problema. Pode voltar quando quiser."
  }

  if (lastAsked === "frequency") {
    if (confirmType === "yes") return "Que pesado — quando se repete assim, vai desgastando muito. Você pode me dizer onde isso costuma acontecer?"
    if (confirmType === "no") return "Entendido. Mesmo sendo uma coisa isolada, é sério. Você sabe quem estava envolvido?"
    return "Entendi. Mesmo que não seja todo dia, já é demais. Você pode me dizer onde isso costuma acontecer?"
  }

  if (lastAsked === "tried_help") {
    if (confirmType === "yes") return "E depois que você contou, o que aconteceu? Alguém tomou alguma atitude?"
    if (confirmType === "no") return "Tudo bem — não precisava ter feito isso antes. Estou aqui agora. Você tem alguém de confiança na escola — um professor ou orientador com quem se sinta bem?"
    return "Entendi. Se um dia você sentir que quer tentar, posso te ajudar a pensar em como fazer isso."
  }

  if (lastAsked === "witnesses") {
    if (confirmType === "yes") return "Bom saber. Testemunhas podem ajudar muito na investigação. Você sabe se alguma dessas pessoas estaria disposta a falar sobre o que viu?"
    if (confirmType === "no") return "Entendido. Isso não torna o que você viveu menos real ou menos sério."
    return "Tudo bem. Você lembra se tinha alguém por perto, mesmo que não esteja certo(a)?"
  }

  if (lastAsked === "who") {
    if (confirmType === "yes") return "Entendido. É da sua turma ou de outra?"
    if (confirmType === "no") return "Tudo bem. Você pode me contar mais sobre o que está acontecendo — mesmo sem saber quem é?"
    return "Tudo bem. Me conta mais sobre a situação da forma que puder."
  }

  if (lastAsked === "where") {
    if (confirmType === "yes") return "Me conta onde — pode ser uma descrição geral."
    if (confirmType === "no") return "Entendi. Você pode me contar quando isso costuma acontecer?"
    return "Tudo bem. Me conta o que você lembrar."
  }

  if (lastAsked === "when") {
    if (confirmType === "yes") return "Entendido. Você consegue me dizer quando foi, mais ou menos?"
    if (confirmType === "no") return "Tudo bem. Me conta o que você sabe sobre quando isso aconteceu."
    return "Pode me dizer mais sobre quando isso começou?"
  }

  if (lastAsked === "impact") {
    if (confirmType === "yes") return "Isso faz sentido. Quando uma situação assim afeta o dia a dia, é sinal de que é sério. Você já tentou falar com alguém sobre isso?"
    if (confirmType === "no") return "Fico aliviada em saber disso. Mas mesmo assim, é importante que isso seja resolvido. Você já tentou falar com alguém sobre o que está acontecendo?"
    return "Entendi. Às vezes é difícil de medir. Você já tentou falar com alguém sobre isso?"
  }

  // Generic fallback
  const generic: Record<string, string[]> = {
    yes: [
      "Entendido. Me conta mais.",
      "Certo. Pode continuar.",
      "Entendi. O que mais você quer me dizer?",
    ],
    no: [
      "Tudo bem. Me conta mais sobre como está sendo essa situação.",
      "Entendido. Pode me falar mais sobre o que aconteceu?",
      "Ok. O que mais você quer que eu saiba?",
    ],
    maybe: [
      "Sem problema. Me conta o que você sabe.",
      "Entendi. Pode me falar mais sobre a situação?",
      "Tudo bem. Continue contando como foi.",
    ],
  }
  return pick(generic[confirmType], state.usedPhrases)
}

// ─── Post-submit message ──────────────────────────────────────────────────────

export function generatePostSubmitMessage(incidentType: IncidentType | null): string {
  const specific: Partial<Record<IncidentType, string>> = {
    physical: "O sistema confirmou o registro da sua denúncia. A equipe responsável poderá analisar o que aconteceu. Se você se sentir em perigo, procure um adulto de confiança imediatamente — não precisa esperar a resposta.",
    verbal: "Registrado. A escola vai analisar essa situação. Se isso continuar acontecendo antes de uma resposta, tente anotar as situações — e, se puder, fale com um professor de confiança pessoalmente.",
    cyber: "O sistema confirmou o registro. Se for seguro, preserve prints sem compartilhar senhas ou conteúdo íntimo. Você não precisa responder a quem está atacando você online.",
    discrimination: "O sistema confirmou o registro. A equipe responsável poderá analisar o relato. Se quiser conversar enquanto aguarda, estou aqui.",
    exclusion: "O sistema confirmou o registro. Enquanto a escola analisa, você pode buscar alguém de confiança e identificar um professor com quem se sinta à vontade para conversar.",
    threat: "O sistema confirmou o registro. Se você estiver em perigo agora, procure ajuda presencial imediatamente; não espere a análise da denúncia.",
    harassment: "O sistema confirmou o registro para análise pela equipe responsável. Você não precisa compartilhar detalhes íntimos adicionais.",
  }
  return (
    (incidentType ? specific[incidentType] : undefined) ??
    "O sistema confirmou o registro da sua denúncia. A equipe responsável poderá analisar o que você compartilhou. Você pode continuar conversando comigo enquanto aguarda."
  )
}

// ─── Opening message ──────────────────────────────────────────────────────────

export const OPENING =
  "Olá, eu sou a Safira. Estou aqui para ouvir você com respeito e sem pressa. O que aconteceu?"

// ─── Main response generator ──────────────────────────────────────────────────

export function generateResponse(
  userMsg: string,
  state: AIState
): { text: string; newState: AIState } {
  const intent = classifyIntent(userMsg, state)
  const msgCount = state.userMsgCount + 1
  const detectedEmotion = detectEmotion(userMsg)
  const newInfo = extractInfo(userMsg)
  const detectedType = detectIncidentType(userMsg)

  // Always check urgency first
  if (detectUrgency(userMsg) && !state.urgency) {
    return {
      text: "Obrigada por me contar. Sua segurança vem primeiro. Procure agora um adulto de confiança que esteja perto de você, como um familiar ou alguém da equipe escolar. Se houver perigo imediato ou uma arma envolvida, vá para um local seguro e ligue para o **190**. Você consegue buscar essa ajuda agora?",
      newState: {
        ...state,
        userMsgCount: msgCount,
        urgency: true,
        stage: "segurança",
        safetyChecked: true,
        lastAsked: "safety",
      },
    }
  }

  // Update collected info and incident type
  const collected = Array.from(new Set([...state.collected, ...newInfo]))
  const incidentType = state.incidentType ?? detectedType
  const emotionalState = detectedEmotion !== "neutral" ? detectedEmotion : state.emotionalState
  const classification = classificationFor(userMsg, state, collected)
  const categories = classification.categories

  // Build the response
  let text = ""
  let lastAsked: LastAsked = state.lastAsked

  // ── Classify and respond ────────────────────────────────────────────────────

  if (state.lastAsked === "safety" && indicatesSafetyAnswer(userMsg)) {
    if (has(userMsg, ["não estou seguro", "não estou segura", "nao estou seguro", "nao estou segura", "perigo"])) {
      text = "Não continue sozinho(a) nessa situação. Vá para perto de um adulto de confiança ou de outras pessoas e peça ajuda presencial agora. Se o perigo for imediato, ligue para o **190**. Você consegue ir para um local mais seguro?"
      lastAsked = "safety"
    } else {
      text = "Fico aliviada por você estar em segurança neste momento. Sem precisar dar detalhes que não queira, isso já aconteceu mais de uma vez?"
      lastAsked = "frequency"
    }
  } else if (detectsSafetyConcern(userMsg) && !state.safetyChecked) {
    text = "Obrigada por contar isso. Antes de continuar, preciso cuidar da sua segurança: você se sente seguro(a) neste momento?"
    lastAsked = "safety"
  } else if (intent === "wants_report") {
    if (state.reportSubmitted) {
      text = "O sistema já confirmou o registro desta denúncia. Você pode acompanhar o andamento na área de status. Há algo novo que queira acrescentar?"
      lastAsked = "anything_else"
    } else {
      text = "Posso ajudar a organizar o que você contou. Para registrar, revise a conversa e toque em **Enviar denúncia**; o envio só acontece depois dessa sua ação. Antes disso, há algo importante que queira acrescentar?"
      lastAsked = "anything_else"
    }
  } else if (intent === "only_talk") {
    text = "Tudo bem. Você não precisa registrar uma denúncia nem contar mais do que quiser. Podemos apenas conversar. Como você está se sentindo agora?"
    lastAsked = "how_are_you"
  } else if (intent === "greeting") {
    text = pick(GREETING_RESPONSES, state.usedPhrases)
    lastAsked = "general"
  } else if (intent === "farewell") {
    text = pick(FAREWELL_RESPONSES, state.usedPhrases)
    lastAsked = null
  } else if (intent === "thanks") {
    text = pick(THANKS_RESPONSES, state.usedPhrases)
    lastAsked = "anything_else"
  } else if (intent === "how_it_works") {
    text = pick(HOW_IT_WORKS_RESPONSES, state.usedPhrases)
    lastAsked = "general"
  } else if (intent === "trust_question") {
    text = pick(TRUST_RESPONSES, state.usedPhrases)
    lastAsked = "general"
  } else if (intent === "casual") {
    text = pick(CASUAL_RESPONSES, state.usedPhrases)
    lastAsked = "how_are_you"
  } else if (intent === "ready_to_talk") {
    text = pick(READY_TO_TALK_RESPONSES, state.usedPhrases)
    lastAsked = "general"
  } else if (intent === "difficulty_expressing") {
    text = pick(DIFFICULTY_EXPRESSING_RESPONSES, state.usedPhrases)
    lastAsked = "general"
  } else if (intent === "happened_again") {
    text = pick(HAPPENED_AGAIN_RESPONSES, state.usedPhrases)
    collected.push("what")
    lastAsked = "general"
  } else if (intent === "short_emotion") {
    const pool = SHORT_EMOTION[emotionalState] ?? SHORT_EMOTION.neutral
    text = pick(pool, state.usedPhrases)
    lastAsked = "general"
  } else if (intent === "short_confirm_yes") {
    text = interpretShortConfirm("yes", state.lastAsked, state)
    // Mark what was last asked as collected
    if (state.lastAsked && state.lastAsked !== "general" && state.lastAsked !== "how_are_you" && state.lastAsked !== "anything_else") {
      if (!collected.includes(state.lastAsked as CollectedInfo)) collected.push(state.lastAsked as CollectedInfo)
    }
    lastAsked = state.lastAsked === "safety" ? "frequency" : state.lastAsked === "next_step" ? "next_step" : "general"
  } else if (intent === "short_confirm_no") {
    text = interpretShortConfirm("no", state.lastAsked, state)
    lastAsked = state.lastAsked === "safety" ? "safety" : state.lastAsked === "next_step" ? null : "general"
  } else if (intent === "short_confirm_maybe") {
    text = interpretShortConfirm("maybe", state.lastAsked, state)
    lastAsked = state.lastAsked === "safety" ? "frequency" : state.lastAsked === "next_step" ? "next_step" : "general"
  } else if (intent === "short_ambiguous") {
    // Ambiguous short message — ask for clarification gently
    text = "Desculpe, não entendi muito bem. Pode me contar mais sobre o que está querendo dizer?"
    lastAsked = "general"
  } else if (intent === "report_detail") {
    // Student described something — acknowledge it specifically, then ask one question
    const typeKey = incidentType ?? "other"
    const ackPool = INCIDENT_ACKNOWLEDGMENTS[typeKey] ?? INCIDENT_ACKNOWLEDGMENTS.other
    const ack = pick(ackPool, state.usedPhrases)

    // Decide on one follow-up question — pick what's most relevant and not yet known
    const priority: CollectedInfo[] =
      incidentType === "cyber"
        ? ["frequency", "where", "impact", "tried_help"]
        : incidentType === "harassment"
          ? ["frequency", "impact", "tried_help"]
          : ["frequency", "where", "impact", "tried_help"]
    const missing = priority.filter((k) => !collected.includes(k))

    // Give guidance after 3+ exchanges if enough context exists
    const hasEnoughContext =
      !state.classificationShared &&
      msgCount >= 3 &&
      collected.includes("what") &&
      (collected.includes("frequency") || collected.includes("when") || collected.includes("where"))

    if (hasEnoughContext) {
      const guidanceKey = incidentType ?? "other"
      const categoryText = categoryLabel(categories)
      text = `${ack} Pelo que você contou, isso pode envolver **${categoryText}**. É uma sugestão com confiança ${classification.confidence}, não uma conclusão sobre ninguém. ${GUIDANCE[guidanceKey] ?? GUIDANCE.other} Você prefere registrar uma denúncia, buscar apoio emocional ou continuar conversando?`
      lastAsked = "next_step"
      return {
        text,
        newState: {
          ...state,
          userMsgCount: msgCount,
          incidentType,
          collected,
          emotionalState,
          guidanceGiven: true,
          categories,
          classificationConfidence: classification.confidence,
          classificationShared: true,
          stage: "orientação",
          safetyChecked: state.safetyChecked || detectsSafetyConcern(userMsg),
          lastAsked,
          usedPhrases: [...state.usedPhrases, ack, text].slice(-20),
        },
      }
    }

    if (missing.length > 0) {
      const nextTopic = missing[0]
      const question = pick(FOLLOW_UP_QUESTIONS[nextTopic], state.usedPhrases)
      text = `${ack} ${question}`
      lastAsked = nextTopic
    } else {
      // All info gathered
      text = `${ack} Parece que você me contou bastante. Tem mais alguma coisa que acha importante que a escola saiba?`
      lastAsked = "anything_else"
    }
  } else {
    // "other" — respond based on conversation context
    if (msgCount === 1) {
      // First message from student and we couldn't classify it — gentle open
      text = "Entendi. Me conta mais — estou aqui para ouvir."
      lastAsked = "general"
    } else if (state.lastAsked === "anything_else") {
      text = "Claro. Pode falar. Estou ouvindo."
      lastAsked = "general"
    } else {
      // Continue naturally
      const continuers = [
        "Pode continuar me contando.",
        "Entendi. Me conta mais sobre isso.",
        "Estou acompanhando. O que mais aconteceu?",
        "Ouvi. Pode continuar.",
      ]
      text = pick(continuers, state.usedPhrases)
      lastAsked = "general"
    }
  }

  return {
    text,
    newState: {
      ...state,
      userMsgCount: msgCount,
      incidentType,
      collected,
      emotionalState,
      lastAsked,
      categories,
      classificationConfidence: classification.confidence,
      stage:
        intent === "farewell"
          ? "encerramento"
          : lastAsked === "safety"
            ? "segurança"
            : state.classificationShared
              ? "orientação"
              : "compreensão",
      safetyChecked: state.safetyChecked || lastAsked === "safety",
      usedPhrases: [...state.usedPhrases, text].slice(-20),
    },
  }
}
