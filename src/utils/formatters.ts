import { Environment } from "nunjucks";

export function addFormatters(env: Environment) {
    for (const [name, formatter] of Object.entries(Formatters)) {
        env.addFilter(`Formatters.${name}`, formatter);
    }
}

const Formatters = {
    date: formatDateString,
} as const;


function formatDateString(dateString: string): string {
    const months: string[] = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date(dateString);

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}
