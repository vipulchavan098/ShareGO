import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Note: You need to install clsx and tailwind-merge usually, but for now I'll write a simple version if those aren't available
// or just use a simpler concatenation if dependencies are strict. 
// Given the prompt, I'll stick to simple template literals in components if these libs aren't added, 
// but it's better to add them. For now, I'll create a simple joiner.

export function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}
