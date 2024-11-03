import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { LoginSchema, registerSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";
const app = new Hono().get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user");
    return c.json(user);
})
    .post("/login", zValidator("json", LoginSchema), async (c) => {
        const { email, password } = c.req.valid("json");
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);
        setCookie(c, AUTH_COOKIE, session.secret, { path: "/", httpOnly: true, sameSite: "strict", secure: true, maxAge: 60 * 60 * 24 * 30 });
        return c.json({ success: true });
    }).post("/register", zValidator("json", registerSchema), async (c) => {
        const { name, email, password } = c.req.valid("json");
        const { account } = await createAdminClient();
        const user = await account.create(ID.unique(), email, password, name);
        console.log({ name, email, password })
        const session = await account.createEmailPasswordSession(email, password);
        setCookie(c, AUTH_COOKIE, session.secret, { path: "/", httpOnly: true, sameSite: "strict", secure: true, maxAge: 60 * 60 * 24 * 30 });
        return c.json({ success: true });
    })
    .post("/logout", sessionMiddleware, async (c) => {
        const account = c.get("account")
        deleteCookie(c, AUTH_COOKIE);
        await account.deleteSession("current");
        return c.json({ success: true });
    })

export default app