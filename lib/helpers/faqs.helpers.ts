import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import z from "zod";

// getFaqs() GET /faqs
// createFaq(question, answer) POST /faqs
// getFaq(faqId) GET /faqs/faqId
// updateFaq(faqId) PATCH /faqs/faqId
// deleteFaq(faqId) DELETE /faqs/faqId

export async function getFaqs() {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    try {
        const res = await fetch(`${process.env.BACKEND_API}/faqs`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage }
        }

        const data = await res.json();
        return { success: false, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}

export async function createFaq(formData: FormData) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    const createFaqSchema = z.object({
        question: z.string().min(1, "Question required"),
        answer: z.string().min(1, "Answer required")
    });

    const parsedData = createFaqSchema.safeParse({
        question: formData.get('question'),
        answer: formData.get('answer'),
    });

    if(!parsedData.success){
        return {success: false, error: parsedData.error.message}
    }

    try {
        const res = await fetch(`${process.env.BACKEND_API}/faqs`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData,
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage }
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}

export async function getFaq(faqId: string) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    try {
        const res = await fetch(`${process.env.BACKEND_API}/faqs/${faqId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage }
        }

        const data = await res.json();
        return { success: false, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}

export async function updateFaq(faqId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    const createFaqSchema = z.object({
        question: z.string().min(1, "Question required").optional(),
        answer: z.string().min(1, "Answer required").optional(),
    });

    const parsedData = createFaqSchema.safeParse({
        question: formData.get('question'),
        answer: formData.get('answer'),
    });

    if(!parsedData.success){
        return {success: false, error: parsedData.error.message}
    }

    try {
        const res = await fetch(`${process.env.BACKEND_API}/faqs/${faqId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData,
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage }
        }

        const data = await res.json();
        return { success: false, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}

export async function deleteFaq(faqId: string) {
    const session = await getServerSession(authOptions);
    const { accessToken } = session!;

    try {
        const res = await fetch(`${process.env.BACKEND_API}/faqs/${faqId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!res.ok) {
            const errorMessage = await res.json();
            return { success: false, error: errorMessage }
        }

        const data = await res.json();
        return { success: false, data };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
}