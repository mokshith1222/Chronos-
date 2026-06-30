import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { logger } from "@/lib/logger"

interface SchemaConfig<TBody, TQuery> {
  body?: z.ZodSchema<TBody>
  query?: z.ZodSchema<TQuery>
}

type ValidatedHandler<TBody, TQuery> = (
  req: NextRequest,
  context: { params: any; body: TBody; query: TQuery }
) => Promise<NextResponse>

export function withApiValidation<TBody = any, TQuery = any>(
  schema?: SchemaConfig<TBody, TQuery>,
  handler?: ValidatedHandler<TBody, TQuery>
) {
  return async (req: NextRequest, context: any) => {
    const startTime = Date.now()
    const path = req.nextUrl.pathname

    try {
      // 1. Parse Query Parameters
      let query: any = {}
      if (schema?.query) {
        const urlParams = Object.fromEntries(req.nextUrl.searchParams.entries())
        query = schema.query.parse(urlParams)
      }

      // 2. Parse Body
      let body: any = {}
      if (schema?.body) {
        const contentType = req.headers.get("content-type") || ""
        if (contentType.includes("application/json")) {
          const rawBody = await req.json()
          body = schema.body.parse(rawBody)
        } else {
          throw new Error("Content-Type must be application/json")
        }
      }

      // 3. Resolve Params (Next.js 15+ Promise compatibility)
      let resolvedParams = {}
      if (context?.params) {
        resolvedParams = await context.params
      }

      if (!handler) {
        throw new Error("Handler function is required")
      }

      // 4. Execute Handler
      const response = await handler(req, { params: resolvedParams, body, query })
      
      const duration = Date.now() - startTime
      logger.info(`[API_SUCCESS] ${req.method} ${path} - ${response.status} (${duration}ms)`)
      
      return response
    } catch (error: any) {
      const duration = Date.now() - startTime
      logger.error(`[API_ERROR] ${req.method} ${path} (${duration}ms)`, {
        error: error.message,
        stack: error.stack
      })

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: error.issues },
          { status: 422 }
        )
      }

      if (error.message === "Content-Type must be application/json") {
        return NextResponse.json({ error: error.message }, { status: 415 })
      }

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  }
}
