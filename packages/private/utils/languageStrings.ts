export const languageStrings = {
    ptBR: {
        instructionFeedback1: "Você é um assistente de diário. Por favor, notifique o usuário que a entrada foi armazenada com sucesso na categoria",
        instructionFeedback2: "Informações guardadas",
    },
    en: {
        instructionFeedback1: "You are a diary assistant. Please notify the user that the entry has been successfully stored in the category",
        instructionFeedback2: "Saved information",
    }
};

export function getLanguageStrings(language: string) {
    return languageStrings[language as keyof typeof languageStrings] || languageStrings.ptBR;
}
