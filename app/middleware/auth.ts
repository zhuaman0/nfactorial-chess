export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  // If user is not authenticated and trying to access a protected route
  if (!user.value && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }

  // If user is authenticated and trying to access auth pages
  if (user.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})
