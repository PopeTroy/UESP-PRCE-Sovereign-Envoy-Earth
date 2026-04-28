window.EnvoyEngine = {
    async runDiagnostic(video, githubToken) {
        try {
            // STEP 1: NVIDIA
            const nvidiaAnalysis = await puter.ai.chat(
                "80-AI Stoichiometry: Identify bipedal biotic signatures (Humans).", 
                video, { model: 'nvidia/llama-3.1-405b-instruct' }
            );

            // STEP 2: GROQ
            const groqDecision = await puter.ai.chat(
                `Analyze: "${nvidiaAnalysis}". Return 'TRIGGER' if a human is detected.`,
                { model: 'groq/llama-3.1-70b-versatile' }
            );

            // STEP 3: PUTER
            const finalBrief = await puter.ai.chat(`Summarize: ${nvidiaAnalysis}`, { model: 'gemini-1.5-flash' });

            // ⚡ PROXY DISPATCH WITH AUDIT
            let dispatchStatus = "SKIPPED";
            if (githubToken && groqDecision.includes('TRIGGER')) {
                dispatchStatus = await this.triggerGithubProxy(githubToken);
            }

            return { 
                analysis: finalBrief, 
                status: groqDecision,
                dispatch: dispatchStatus 
            };
        } catch (err) {
            return `BRIDGE_CRASH: ${err.message}`;
        }
    },

    async triggerGithubProxy(token) {
        const url = 'https://api.github.com/repos/PopeTroy/UESP-PRCE-Sovereign-Envoy-Earth/dispatches';
        
        try {
            const response = await puter.net.fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28' // Explicit versioning
                },
                body: JSON.stringify({ 
                    event_type: 'vila_human_detection',
                    client_payload: { unit: "Envoy-01", location: "Kempton Park" } 
                })
            });

            const statusCode = response.status;
            if (statusCode === 204) return "SUCCESS (204 NO CONTENT)";
            
            const errorBody = await response.text();
            return `FAIL (${statusCode}): ${errorBody.substring(0, 50)}`;
        } catch (e) {
            return `FETCH_ERROR: ${e.message}`;
        }
    }
};
