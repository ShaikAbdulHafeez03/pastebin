
async function verify() {
    const content = "Verification Paste Content " + Date.now();
    console.log("Testing Pastebin API...");

    try {
        // 1. Create Paste
        const createRes = await fetch("http://localhost:3000/api/pastes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content,
                expiresIn: "10", // 10 minutes
            }),
        });

        if (!createRes.ok) {
            const text = await createRes.text();
            throw new Error(`Failed to create paste: ${createRes.status} ${text}`);
        }

        const data = await createRes.json();
        console.log("Create Paste Response:", data);

        if (!data.url) {
            throw new Error("Response did not contain 'url'");
        }

        // 2. View Paste
        const pasteUrl = `http://localhost:3000${data.url}`;
        console.log(`Fetching paste page: ${pasteUrl}`);

        const viewRes = await fetch(pasteUrl);

        if (!viewRes.ok) {
            throw new Error(`Failed to fetch paste page: ${viewRes.status}`);
        }

        const html = await viewRes.text();

        // 3. Verify Content
        if (html.includes(content)) {
            console.log("SUCCESS: Paste content found in the response HTML.");
        } else {
            console.error("FAILURE: Paste content NOT found in the response HTML.");
            console.log("Preview of HTML:", html.substring(0, 500));
        }

    } catch (error) {
        console.error("Verification Failed:", error);
        process.exit(1);
    }
}

verify();
