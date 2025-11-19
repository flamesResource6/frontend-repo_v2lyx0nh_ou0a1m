import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative h-[50vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">Tic-Tac-Toe, Reimagined</h1>
          <p className="mt-4 text-white/90 max-w-2xl mx-auto">Play in real-time with friends, spectate live matches, or challenge an unbeatable AI. Sign in to track your history and stats.</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-slate-900/80" />
    </section>
  )
}
