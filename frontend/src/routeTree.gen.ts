import { RootRoute } from '@tanstack/react-router'
import { Route as indexRoute } from './routes/index'
import { Route as cartRoute } from './routes/cart'
import { Route as adminRoute } from './routes/admin'
import { Route as rootRoute } from './routes/__root'

export const routeTree = rootRoute.addChildren([
  indexRoute,
  cartRoute,
  adminRoute,
])
