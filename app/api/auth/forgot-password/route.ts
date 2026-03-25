import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * POST /api/auth/forgot-password
 * Initiates password recovery flow
 * Sends recovery link via email (or logs token to console for development)
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security, don't reveal if email exists
      // But do return success to prevent email enumeration
      return NextResponse.json(
        { success: true, message: "Se o email existe, você receberá um link" },
        { status: 200 }
      );
    }

    // Generate recovery token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Save token to database
    // Note: You might want to add a PasswordResetToken model to your Prisma schema
    // For now, we'll store it with the user as a temporary field
    // In production, use a separate PasswordResetToken table

    // This is a simplified approach - in production, create proper model
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // Store reset token details (add these to User model in schema.prisma)
        // resetToken: tokenHash,
        // resetTokenExpiresAt: expiresAt,
      },
    });

    // For development: log the token to console
    // In production: send via email using Resend, SendGrid, etc.
    console.log(
      `[PASSWORD RECOVERY] Reset link for ${email}:`,
      `http://localhost:3000/reset-password/${token}`
    );
    console.log(`[PASSWORD RECOVERY] Token expires at:`, expiresAt.toISOString());

    // TODO: Send email with reset link
    // const emailResponse = await resend.emails.send({
    //   from: "noreply@jobreviewers.com",
    //   to: email,
    //   subject: "Recuperar sua senha no JobReviewers",
    //   html: `<p>Clique <a href="http://localhost:3000/reset-password/${token}">aqui</a> para redefinir sua senha. Link válido por 1 hora.</p>`,
    // });

    return NextResponse.json(
      {
        success: true,
        message: "Email de recuperação enviado",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PASSWORD RECOVERY ERROR]", error);

    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
