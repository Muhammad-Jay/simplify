#  # Base image for production build
#   FROM node:18-alpine AS base
#
#   WORKDIR /app
#
#   COPY package.json yarn.lock* package-lock.json* pnpm-lock.json* ./
#
#   RUN if [ -f yarn.lock ]; then yarn install --production --frozen-lockfile;
#       elif [ -f package-lock.json ]; then npm install --production ci;
#       else npm install --production; fi
#
#   FROM node:18-alpine AS builder
#
#   WORKDIR /app
#
#   COPY ..
#
#   COPY --from=base /app/node_modules ./node_modules
#
#   RUN npm run build
#
#   FROM node:18-alpine AS runner
#
#   WORKDIR /app
#
#   COPY --from=builder /app/public ./public
#   COPY --from=builder /app/.next ./.next
#   COPY --from=builder /app/node_modules ./node_modules
#   COPY --from=builder /app/package.json ./package.json
#
#   EXPOSE 3001
#
#   RUN addgroup -S appgroup && adduser -S appuser -G appgroup
#   USER appuser
#
#   CMD ["npm", "start"]