import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct",
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
        }),
    };

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options); // ✅ OpenRouter endpoint
        const data = await response.json();

        if (!response.ok) {
            console.error("OpenRouter API error:", data);
            return "Sorry, I couldn't generate a reply.";
        }

        const reply = data?.choices?.[0]?.message?.content;

        if (!reply) {
            console.error("Response missing:", data);
            return "Sorry, something went wrong with the response.";
        }

        return reply;
    } catch (err) {
        console.log("Fetch error:", err);
        return "There was a server error. Try again later.";
    }
};

export default getOpenAIAPIResponse;
