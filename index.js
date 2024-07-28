import { openai, supabase, lmclient } from "./config.js";
import podcasts from "./content.js";

/*
async function main(input) {
  const data = await Promise.all(
    input.map( async (textChunk) => {
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: textChunk
        });
        return { 
          content: textChunk, 
          embedding: embeddingResponse.data[0].embedding 
        }
    })
  );
  
  // Insert content and embedding into Supabase
  await supabase.from('documents').insert(data); 
  console.log('Embedding and storing complete!');
}*/

const content = [
  "Beyond Mars: speculating life on distant planets.",
  "Jazz under stars: a night in New Orleans' music scene.",
  "Mysteries of the deep: exploring uncharted ocean caves.",
  "Rediscovering lost melodies: the rebirth of vinyl culture.",
  "Tales from the tech frontier: decoding AI ethics.",
];

/*
async function main(input){
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: input,
  })
  console.log(embedding.data)
  console.log(embedding.data[0])

  const data = embedding.data.map((line, index) =>{
    return {
      'content': input[index],
      'embedding': line.embedding
    }
  })
  await supabase.from('documents').insert(data); 
  console.log('Embedding and storing complete!');
} */

async function lmMain(input) {
  console.log("starting embedding endpoint call");
  const embedding = await lmclient.embeddings.create({
    //model: "CompendiumLabs/bge-large-en-v1.5-gguf/bge-large-en-v1.5-q8_0.gguf",
    input: input,
  });
  console.log(embedding.data);
  console.log(embedding.data[0]);

  const data = embedding.data.map((line, index) => {
    return {
      content: input[index],
      embedding: line.embedding,
    };
  });
  //await supabase.from('documents').insert(data); //this pushes to a supabase vector database set to 1536, would need to create a database for vector size 1024 for bge-large-en-v1.5 embeddings
  displayResultsToWeb(JSON.stringify(data)); //
  console.log("Embedding and storing complete!");
}

const conversation = [
  {
    role: "system",
    content:
      "Below is an instruction that describes a task. Write a response that appropriately completes the request. Keep responses as short but fully complete the request.",
  },
  {
    role: "user",
    content:
      "What is the capital of China and how long has it been the capital of China",
  },
];

async function lmInference(input) {
  console.log("starting chat completion test...");
  // Define the conversation

  // Make the API call
  const response = await lmclient.chat.completions.create({
    model:
      "TheBloke/Mistral-7B-Instruct-v0.2-GGUF/mistral-7b-instruct-v0.2.Q6_K.gguf",
    messages: input,
    temperature: 0.8,
  });
  console.log(response);
  // Print the response
  const responseText = response.choices[0].message.content;
  console.log(responseText);
  const data = {
    context: input,
    responseText,
  };
  displayResultsToWeb(JSON.stringify(data));
  console.log("Response provided");
}

function displayResultsToWeb(results) {
  const root = document.getElementById("root");
  const element = document.createElement("div");
  element.innerHTML = results;
  root.appendChild(element);
}

function tryCatchWrapper(fn) {
  return async function (...args) {
    try {
      return await fn(...args);
    } catch (error) {
      console.error("An error occurred:", error.message);
      // You can customize error handling here
      throw error; // Re-throw the error if needed
    }
  };
}

//const catchLMMain = tryCatchWrapper(lmMain)
const catchLMInference = tryCatchWrapper(lmInference);
catchLMInference(conversation);
//catchLMMain(podcasts)
//main(content)

//main(podcasts)
