import config from "config";
import type { Message } from "seyfert";
import type { EmbedConfig } from "../../types";

const responses: string[] = [
    "Hinagi is thinking... 🤔",
    "*Doing the thing* ⚙️",
    "*beep boop* 🤖",
    "Processing... please wait 🌀",
    "One moment, while I summon the data 🧙‍♂️✨",
    "Hold tight, it's happening 🔧",
    "Hinagi is brewing up the response ☕",
    "*Whirring gears*... almost there! ⚙️",
    "Calculating the meaning of life... and your request 🔢",
    "Hinagi is on the case! 🔍",
    "*dusting off the archives* 📚",
    "*Tapping into the matrix* 💻",
    "Searching for answers in the void...🛸",
    "Give me a sec, just grabbing your data 📡",
    "*Scribbling down notes* ✍️",
    "Running some high-tech magic 🧪",
    "Fetching the wisdom of the interwebs 🌐",
    "Hinagi is pondering the universe and your request 🌌",
    "*Downloading wisdom* 💾...",
    "*Initiating dance sequence* 💃... oh wait, wrong command!",
    "*Transporting through the data vortex* 🚀",
];

export function deferReplyResponse(): Parameters<Message["write"]>[0] {
    const response = responses[Math.floor(Math.random() * responses.length)];
    return {
        embeds: [
            {
                color: config.get<EmbedConfig>("embedConfig").colors.transparent,
                description: `${response}`,
            },
        ],
    };
}
