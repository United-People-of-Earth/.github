<script>
    import DtDd from "./DtDd.svelte";

    const defaultOpen = true;

    let open = $derived.by(() => {
        const storedOpen = localStorage.getItem("Settings Open");
        if (storedOpen === null) return defaultOpen;
        return storedOpen === "true";
    });

    $effect(() => {
        localStorage.setItem("Settings Open", open.toString());
    });
</script>

<details bind:open>
    <summary>Settings</summary>
    <dl>
        <DtDd dtText="Domain Name" open>
            <a href="https://unitedpeople.wiki">https://unitedpeople.wiki</a>
        </DtDd>
    </dl>
</details>
