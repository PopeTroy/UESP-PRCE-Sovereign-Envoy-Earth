window.EnvoyEngine = {
    async runDiagnostic(video, githubToken) {
        try {
            // STEP 1: NVIDIA (Visual Foundation)
            const nvidiaAnalysis = await puter.ai.chat(
                "Perform 80-AI visual stoichiometry. Identify biotic morphology (Human/Animal).", 
                video, 
                { model: 'nvidia/llama-3.1-405b-instruct' }
            );

            // STEP 2: GROQ (Rapid Overseer)
            const groqDecision = await puter.ai.chat(
                `Oversee this data: "${nvidiaAnalysis}". Determine if deterrent is needed. Return 'STATUS: VALIDATED' or 'STATUS: THREAT'.`,
                { model: 'groq/llama-3.1-70b-versatile' }
            );

            // STEP 3: PUTER AI (Refining & Sync)
            const finalBrief = await puter.ai.chat(
                `Refine this report for terminal output: Nvidia: ${nvidiaAnalysis} | Groq: ${groqDecision}`,
                { model: 'gemini-1.5-flash' }
            );

            // Daikokuten Cloud Sync
            const user = await puter.auth.getUser();
            await puter.fs.write(`UESP/logs/diag_${Date.now()}.txt`, finalBrief);

            // GitHub Dispatch (Triggered by Groq's validation)
            if (githubToken && groqDecision.includes('VALIDATED')) {
                this.triggerGithub(githubToken);
            }

            return { analysis: finalBrief, id: user.uuid.substring(0,8) };
        } catch (err) {
            return `CORE_FAILURE: ${err.message}`;
        }
    },

    async triggerGithub(token) {
        fetch('https://api.github.com/repos/PopeTroy/UESP-PRCE-Sovereign-Envoy-Earth/dispatches', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json' },
            body: JSON.stringify({ event_type: 'vila_human_detection' })
        });
    }
};
