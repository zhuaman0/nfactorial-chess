<template>
  <div class="relative overflow-hidden bg-white backdrop-blur-lg border border-white/10 rounded-3xl p-12 shadow-2xl">
    <div class="flex justify-between w-full">
      <div>
        <h1 class="text-5xl font-extrabold text-orange-500/80 mb-6 tracking-tight">
          Master the <span class="text-slate-900/100">Game</span>
        </h1>
        <p class="text-slate-400 text-lg mb-10 max-w-2xl">
          Experience chess like never before. Play against friends, track your progress,
          and climb the global ranks in our modern arena.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <UiButton variant="primary-dark" class="!w-auto px-10 text-lg" @click="navigateTo('/play')">
            Play Now
          </UiButton>
          <UiButton variant="outline-dark" class="!w-auto px-10 text-lg" @click="navigateTo('/leaderboard')">
            Leaderboard
          </UiButton>
        </div>
      </div>
      <div><img src="~/assets/img/ChessPng__1_-removebg-preview.png" class="h-[300px]" alt=""></div>
    </div>
  </div>
</template>
