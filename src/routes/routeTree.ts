// src/routes/routeTree.ts
import { rootRoute } from './root'
import { loginRoute } from './loginRoute'
import { AdminPainelRouter } from './AdminPainelRouter'


export const routeTree = rootRoute.addChildren([
  loginRoute,
  AdminPainelRouter,
  
])