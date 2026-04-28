/**
 * UESP-PRCE Sovereign Envoy Engine
 * Force Global Scope for WordPress Bridge
 */
window.EnvoyEngine = {
    async runDiagnostic(video) {
        // Ensure Puter is initialized
        if (!window.puter || !puter.auth.isSignedIn()) {
            return "AUTH_REQUIRED: PLEASE SIGN IN";
        }

        try {
            const prompt = "MISSION STATUS: Identify humans vs animals. 10-word morphology description.";
            const analysis = await puter.ai.chat(prompt, video, { 
                model: 'gemini-2.5-flash-lite' 
            });

            const user = await puter.auth.getUser();
            const path = `UESP_PRCE/logs/${user.uuid.substring(0, 8)}/telemetry_${Date.now()}.txt`;
            await puter.fs.write(path, analysis, { createMissingParents: true });

            return { analysis, sessionId: user.uuid.substring(0, 8) };
        } catch (err) {
            return `SYNC_ERROR: ${err.message.toUpperCase()}`;
        }
    }
};
console.log("Sovereign Envoy Engine: GitHub Bridge Active");
