import { searchFactualMemory, storeFactMemory } from "./embeddings.service.js"

export async function getRelatedFacts(fact, subjects){
  const relatedFacts = await searchFactualMemory(fact, subjects);
  return relatedFacts.map(({ text }) => text).join(";\n");;
}

export async function storeNewFact(fact, subjects, importance){
  await storeFactMemory(fact, {subjects, importance})
}