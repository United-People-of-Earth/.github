<script lang="ts">
    import { themes, theme } from ".";

    $effect(() => {
        if ($theme === "system") {
            delete document.documentElement.dataset.theme;
            localStorage.removeItem("theme");
        } else {
            document.documentElement.dataset.theme = $theme;
            localStorage.setItem("theme", $theme);
        }
    });
</script>

{#each themes as { value, label }}
    <label>
        <input type="radio" name="theme" {value} bind:group={$theme} />
        {label}
    </label>
{/each}
