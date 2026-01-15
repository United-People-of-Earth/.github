import { writable } from "svelte/store";

if (localStorage.theme) document.documentElement.setAttribute("data-theme", localStorage.theme);

type Themes = "light" | "dark" | "system"

export const themes: { value: Themes, label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
]

export const theme = writable<Themes>(
    themes.find((t) => localStorage.getItem("theme") === t.value)?.value
    || "system"
);