import { executeCode } from "@/lib/code-executor";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { language, code, stdin } = body;

        if (!language || !code) {
            return Response.json(
                { error: "Missing 'language' or 'code' in request body" },
                { status: 400 }
            );
        }

        // Basic size limit
        if (code.length > 50000) {
            return Response.json(
                { error: "Code too long (max 50,000 characters)" },
                { status: 400 }
            );
        }

        const result = await executeCode({ language, code, stdin });

        return Response.json(result);
    } catch (error) {
        console.error("Code execution error:", error);
        return Response.json(
            { error: "Failed to execute code" },
            { status: 500 }
        );
    }
}
