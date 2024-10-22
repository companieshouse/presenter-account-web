import { Environment } from "nunjucks";
import { getLocalesValue } from "./localise";

export function addFormatters(env: Environment) {
    for (const [name, formatter] of Object.entries(Formatters)) {
        env.addFilter(`Formatters.${name}`, formatter);
    }
}

const Formatters = {
    date: formatDateString,
} as const;


function formatDateString(dateString: string, language?: string): string {

    const months: string[] = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(dateString);

    const day = date.getDate();
    const month = getLocalesValue(months[date.getMonth()].toLowerCase(), language);
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}
