import { openai, supabase, lmclient } from './config.js';
import podcasts from './content.js';

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

async function lmMain(input){
  console.log('starting embedding endpoint call')
  const embedding = await lmclient.embeddings.create({
    //model: "CompendiumLabs/bge-large-en-v1.5-gguf/bge-large-en-v1.5-q8_0.gguf",
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
  //await supabase.from('documents').insert(data); //this pushes to a supabase vector database set to 1536, would need to create a database for vector size 1024 for bge-large-en-v1.5 embeddings

  const root = document.getElementById('root')
  const element = document.createElement('div')
  element.innerHTML = JSON.stringify(data)
  //element.textContent = 'hello'
  console.log(element)
  root.appendChild(element)
  console.log(data)
  console.log('Embedding and storing complete!');
}

function tryCatchWrapper(fn) {
  return async function(...args) {
    try {
      return await fn(...args);
    } catch (error) {
      console.error("An error occurred:", error.message);
      // You can customize error handling here
      throw error; // Re-throw the error if needed
    }
  }
}

const catchLMMain = tryCatchWrapper(lmMain)
//catchLMMain(podcasts)
//main(content)


//main(podcasts)
