window.EnvoyEngine = {
    async runDiagnostic(video, githubToken) {
        try {
            // STEP 1: NVIDIA (Visual Foundation)
            const nvidiaAnalysis = await puter.ai.chat(
                "80-AI Stoichiometry: Identify bipedal biotic signatures (Humans).", 
                video, { model: 'nvidia/llama-3.1-405b-instruct' }
            );

            // STEP 2: GROQ (Logic Overseer)
            const groqDecision = await puter.ai.chat(
                `Analyze: "${nvidiaAnalysis}". Return 'VALIDATED' if human shape is identified.`,
                { model: 'groq/llama-3.1-70b-versatile' }
            );

            // STEP 3: PUTER (Refinement)
            const finalBrief = await puter.ai.chat(`Summarize: ${nvidiaAnalysis}`, { model: 'gemini-1.5-flash' });

            // ⚡ PROXY DISPATCH (Bypassing CORS)
            if (githubToken && groqDecision.includes('VALIDATED')) {
                this.triggerGithubProxy(githubToken);
            }

            return { analysis: finalBrief, status: groqDecision };
        } catch (err) {
            return `BRIDGE_CRASH: ${err.message}`;
        }
    },

    async triggerGithubProxy(token) {
        const url = 'https://api.github.com/repos/PopeTroy/UESP-PRCE-Sovereign-Envoy-Earth/dispatches';
        
        // Using puter.net.fetch to bypass browser CORS
        const response = await puter.net.fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'User-Agent': 'Puter-Cloud-Envoy'
            },
            body: JSON.stringify({ event_type: 'vila_human_detection' })
        });

        const status = await response.status;
        console.log(`GitHub Cloud Sync Status: ${status}`);
    }
};
