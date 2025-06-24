'use client'

const UseSpeechSynthesis = (isListening : boolean, value: string | undefined) : void => {

        const utterance = new SpeechSynthesisUtterance(value);
        // Get voices and choose the most natural-sounding one
        const voices = speechSynthesis.getVoices();
        console.log(voices)
        const naturalVoice = voices.find(v =>
            v.name.includes("Microsoft Zira") && v.lang === "en-US"
        ) || voices[0];
        utterance.voice = naturalVoice;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.onstart = () => console.log("Speaking started...");
        utterance.onend = () => console.log("Speaking finished.");

        if (isListening){
            speechSynthesis.cancel();
        }
        speechSynthesis.speak(utterance)
    window.speechSynthesis.onvoiceschanged = () => {};
}
export default UseSpeechSynthesis
