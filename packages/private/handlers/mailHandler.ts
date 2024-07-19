import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

export async function sendVerificationEmail(to: string, token: string, language: string) {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: to,
        subject: 'Verify Your Email',
        html: 
        language === 'ptBR' ? `
            <h1>Bem-vindo(a) ao MemBot!</h1>
            <p>Por favor, clique no link abaixo para verificar seu endereço de e-mail:</p>
            <a href="${verificationLink}">Verifique seu e-mail</a>
        ` :
        `
            <h1>Welcome to MemBot!</h1>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationLink}">Verify Email</a>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}
