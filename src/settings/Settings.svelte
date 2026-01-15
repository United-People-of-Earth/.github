<script>
    import DtDd from "./DtDd.svelte";
    import Theme from "./theme/Theme.svelte";

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
        <DtDd dtText="Discussions" open>
            <a href="https://github.com/orgs/United-People-of-Earth/discussions"
                >https://github.com/orgs/United-People-of-Earth/discussions</a
            >
        </DtDd>
        <DtDd dtText="Source Code" open>
            <a href="https://github.com/United-People-of-Earth/.github"
                >https://github.com/United-People-of-Earth/.github</a
            >
        </DtDd>
        <DtDd dtText="Privacy Policy" open>
            <a href="https://unitedpeople.wiki/privacy-policy.html"
                >https://unitedpeople.wiki/privacy-policy.html</a
            >
        </DtDd>
        <DtDd dtText="Theme">
            <Theme />
        </DtDd>
    </dl>
</details>
