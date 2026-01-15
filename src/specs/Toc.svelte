<script lang="ts">
    import { onMount } from "svelte";

    function toggleCssClassLarge() {
        var style = getComputedStyle(document.documentElement);

        const tocMaxWidth = parseInt(style.getPropertyValue("--toc-maxWidth"));
        if (!tocMaxWidth) {
            console.log("--toc-maxWidth not set");
            return;
        }
        const contentMaxWidth = parseInt(
            style.getPropertyValue("--content-maxWidth"),
        );
        if (!contentMaxWidth) {
            console.log("--content-maxWidth not set");
            return;
        }
        const bodyPadding = parseInt(style.getPropertyValue("--body-margin"));
        if (!bodyPadding) {
            console.log("--body-margin not set");
            return;
        }

        const isLarge =
            window.innerWidth > tocMaxWidth + contentMaxWidth + bodyPadding * 2;

        document.documentElement.classList.toggle("large", isLarge);
    }

    let headings: {
        id: string;
        text: string;
        level: number;
        indexes: number[];
    }[] = $state([]);

    onMount(() => {
        const elements = document.querySelectorAll(
            "#toc ~ :is(h1, h2, h3, h4, h5, h6)",
        );

        let buildIndexes: number[] = [];
        const usedIds: Record<string, number> = {};
        const slugify = (s: string | null) =>
            (s || "")
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9\-]/g, "")
                .replace(/\-+/g, "-")
                .replace(/^\-+|\-+$/g, "");

        headings = Array.from(elements || []).map((el, index) => {
            const origTextContent = el.textContent;

            const level = +el.tagName[1];

            if (!buildIndexes[level]) buildIndexes[level] = 0;
            buildIndexes[level]++;
            buildIndexes = buildIndexes.slice(0, level + 1);

            let id = el.id;
            if (!id) {
                const base = slugify(el.textContent) || `h-${index}`;
                let unique = base;
                if (typeof usedIds[base] !== "number") {
                    usedIds[base] = 0;
                } else {
                    usedIds[base]++;
                    unique = `${base}-${usedIds[base]}`;
                }
                id = unique;
                el.id = id;
            }

            const indexes = [...buildIndexes.slice(1)];

            el.childNodes.forEach((node) => {
                if (
                    node.nodeType === Node.TEXT_NODE &&
                    node.textContent?.trim() !== ""
                ) {
                    const linkSection = document.createElement("a");
                    linkSection.className = "link";
                    linkSection.href = `/#${id}`;

                    const indexSpan = document.createElement("span");
                    indexSpan.className = "index";
                    indexSpan.textContent = indexes.join(".");

                    const contentSpan = document.createElement("span");
                    contentSpan.className = "content";
                    contentSpan.textContent = node.textContent;

                    el.replaceChild(contentSpan, node);
                    el.insertBefore(indexSpan, contentSpan);
                    el.insertBefore(linkSection, indexSpan);
                }
            });

            return {
                id,
                text: origTextContent,
                level,
                indexes,
            };
        });

        toggleCssClassLarge();
        const onResize = () => {
            toggleCssClassLarge();
        };

        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    });
</script>

<nav id="toc">
    <h2>Table of Contents</h2>
    <ul>
        {#if headings.length > 0}
            {#each headings as heading (heading.id)}
                <li
                    class="level-{heading.level}"
                    style="--indent: {heading.level - 1}"
                >
                    <a href="/#{heading.id}">
                        <span class="index">
                            {heading.indexes.join(".")}
                        </span>

                        <span class="label">
                            {heading.text}
                        </span>
                    </a>
                </li>
            {/each}
        {:else}
            <li>
                <span class="error">No headings found</span>
            </li>
        {/if}
    </ul>
</nav>

<svelte:head>
    <style>
        #toc {
            margin-bottom: 2rem;

            & ~ :is(h1, h2, h3, h4, h5, h6) {
                position: relative;
                padding-right: 0.6ch;
                box-sizing: border-box;

                .link {
                    text-decoration: none;
                    font-size: 1.4rem;
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translate(0, -50%);
                    opacity: 0.5;
                    transition: opacity 400ms;

                    &:hover {
                        opacity: 1;
                    }

                    &::before {
                        content: "§";
                    }
                }

                &:hover .link {
                    text-decoration: underline;
                }

                .index {
                    margin-right: 0.5rem;

                    &::after {
                        content: ".";
                    }
                }
            }
        }

        .large {
            #toc {
                position: fixed;
                top: 0;
                left: 0;
                padding-left: var(--body-margin);
                padding-right: var(--body-margin);
                box-sizing: border-box;
                width: var(--toc-maxWidth);
                background-color: rgba(128, 128, 128, 0.075);
                height: 100vh;
                overflow-y: auto;

                h2 {
                    margin-left: auto;
                }
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6,
            p,
            hr,
            details {
                margin-left: calc(
                    (
                            100% - var(--content-maxWidth) + var(--toc-maxWidth) +
                                var(--body-margin) * 2
                        ) / 2
                );
            }
        }
    </style>
</svelte:head>

<style>
    ul {
        list-style: none;
        padding-left: 0;
        margin-left: 0;
    }
    .level-1 {
        margin-top: 1em;
        font-weight: bold;
    }
    a {
        display: flex;
        text-decoration: none;
        color: inherit;
    }
    .index {
        min-width: 11ch;
    }
    .label {
        margin-left: calc(var(--indent) * 1.5rem);
        flex: 1;
        border-bottom: 1px solid transparent;
    }
    a:hover .label {
        border-bottom-color: gray;
        background-color: rgba(0, 170, 255, 0.05);
    }
</style>
