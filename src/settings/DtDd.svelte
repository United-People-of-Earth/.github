<script lang="ts">
    import type { Snippet } from "svelte";

    const {
        dtText,
        dtTextEnd,
        children,
        afterDd,
        open: defaultOpen = false,
    }: {
        dtText: string;
        dtTextEnd?: Snippet;
        children: Snippet;
        afterDd?: Snippet;
        open?: boolean;
    } = $props();

    let open = $derived.by(() => {
        const storedToggle = localStorage.getItem(`${dtText} Open`);
        if (storedToggle === null) return defaultOpen;
        return storedToggle === "true";
    });

    $effect(() => {
        localStorage.setItem(`${dtText} Open`, open.toString());
    });
</script>

<dt>
    <label>
        <input type="checkbox" bind:checked={open} /><span
        ></span>{dtText}{@render dtTextEnd?.()}{#if open}:{/if}
    </label>
</dt>
{#if open}
    <dd>
        {@render children()}
    </dd>
    {@render afterDd?.()}
{/if}

<style>
    label {
       cursor: text;
    }
    input[type="checkbox"] {
        display: none;
        & + span::after {
            content: "▸";
        }
        &:checked + span::after {
            content: "▾";
        }
    }
</style>
