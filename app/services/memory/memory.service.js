import { searchFactualMemory, storeFactMemory } from "./embeddings.service.js"

const STM_LIMIT = 6; 

let shortTermMemory = [];
let counter = 0;

export function addToShortTermMemory(user, assistant) {
  counter++;
  shortTermMemory.push({ user, assistant, id: counter });
  if (shortTermMemory.length > STM_LIMIT) shortTermMemory.shift();
  return counter;
}

export function getShortTermArray(){
  return shortTermMemory
}

export function getCounter(){
  return counter + 1;
}

export function getShortTermMemory(){
  if(shortTermMemory.length){
    return [shortTermMemory[shortTermMemory.length-1]].map((m, i) => `User: ${m.user}\nAria: ${m.assistant}`)
    .join("\n\n");
  } else {
    return "";
  }
}

export function deleteFromIndex(index){
  while (
    shortTermMemory.length > 0 &&
    shortTermMemory[shortTermMemory.length - 1].id >= index
  ) {
    shortTermMemory.pop();
  }
}

export function deleteShortTerm(){
  shortTermMemory = [];
  counter = 0;
}

export async function getRelatedFacts(fact, subjects){
  const relatedFacts = await searchFactualMemory(fact, subjects);
  return relatedFacts.map(({ text }) => text).join(";\n");;
}

export async function storeNewFact(fact, subjects, importance){
  await storeFactMemory(fact, {subjects, importance})
}