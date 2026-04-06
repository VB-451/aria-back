import fs from "fs";
import { callEmbeddings } from "../llm/llm.service.js"


const FACTUAL_VECTOR_MEMORY_FILE = "./factual_vector_memory.json";
const SUBJECTS_VECTOR_MEMORY_FILE = "./subjects_vector_memory.json";


let factualMemoryCache = null;
let subjectsMemoryCache = null;

function loadVectorMemory(path) {
  try {
    return JSON.parse(fs.readFileSync(path, "utf-8"));
  } catch {
    return [];
  }
}

function loadMemoryCache(type){
  if(type === "facts"){
    if (!factualMemoryCache) {
      factualMemoryCache = loadVectorMemory(FACTUAL_VECTOR_MEMORY_FILE);
    }
    return factualMemoryCache;
  } else {
    if (!subjectsMemoryCache){
      subjectsMemoryCache = loadVectorMemory(SUBJECTS_VECTOR_MEMORY_FILE);
    }
    return subjectsMemoryCache;
  }
}

function saveVectorMemory(memory, type = "factual") {
  fs.writeFileSync(type === "factual" ? FACTUAL_VECTOR_MEMORY_FILE : SUBJECTS_VECTOR_MEMORY_FILE, JSON.stringify(memory, null, 2));
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
}

function mergeByTextMultiplySimilarity(arr1, arr2) {
  const map = new Map();
  for (const { text, similarity } of arr1) {
    map.set(text, { text, similarity, count: 1 });
  }
  for (const { text, similarity } of arr2) {
    if (map.has(text)) {
      const entry = map.get(text);
      entry.similarity *= similarity;
      entry.count += 1;
    } else {
      map.set(text, { text, similarity, count: 1 });
    }
  }
  return Array.from(map.values()).map(e => ({
    text: e.text,
    similarity: Math.pow(e.similarity, 1 / e.count),
  }));
}

async function compareSimilarity(a, b){
  const aEmbedded = await callEmbeddings(a);
  const bEmbedded = await callEmbeddings(b);
  return cosineSimilarity(aEmbedded, bEmbedded)
}

async function searchSubjectMemory(supposedSubject, topN = 5){
  const subjectEmbedding = await callEmbeddings(supposedSubject);
  const subjectMemory = loadMemoryCache("subjects")
  const unfilteredScored = subjectMemory.map(m => {
    const { embedding, ...memoryWithoutEmbedding } = m;
    return {
      ...memoryWithoutEmbedding, 
      similarity: cosineSimilarity(subjectEmbedding, m.embedding),
    };
  });
  const scored = unfilteredScored.filter(subject =>{
    return subject.similarity > 0.65;
  })
  return scored.sort((a, b) => b.similarity - a.similarity).slice(0, topN);
}

export async function searchFactualMemory(supposedFact, supposedSubjects, topN = 10, alreadyEmbeddedFact = ""){
  const factEmbedding = alreadyEmbeddedFact || await callEmbeddings(supposedFact);
  
  const subjectLists = await Promise.all(
    supposedSubjects.map(s => searchSubjectMemory(s))
  );
  let relatedSubjects = [];
  for (const list of subjectLists) {
    relatedSubjects = mergeByTextMultiplySimilarity(relatedSubjects, list);
  }
  const relatedSubjectsDestructure = relatedSubjects.map(({ text }) => text);
  const unfilteredFactualMemory = loadMemoryCache("facts")
  const filteredFactualMemory = unfilteredFactualMemory.filter(fact => {
    const subjects = fact.metadata?.subjects;
    if (!Array.isArray(subjects)) return false;
    return relatedSubjectsDestructure.some(subject =>
      subjects.includes(subject)
    );
  });

  const unfilteredScored = filteredFactualMemory.map(m => {
    const { embedding, ...memoryWithoutEmbedding } = m;
    const subject = relatedSubjects.find((element) => m.metadata.subjects.includes(element.text));
    return {
      ...memoryWithoutEmbedding, 
      similarity: cosineSimilarity(factEmbedding, m.embedding) * 0.7 + subject.similarity * 0.3,
    };
  });
  const scored = unfilteredScored.filter(fact =>{
    return fact.similarity > 0.67;
  })
  return scored.sort((a, b) => b.similarity - a.similarity).slice(0, topN);
}

async function storeSubjectMemory(supposedSubject){
  const subjectsMemory = loadMemoryCache("subjects");
  const alreadyStored = subjectsMemory.filter(subject => {
    return subject.text === supposedSubject.toLowerCase().trim();
  })
  if(!alreadyStored.length){
    const subjectEmbedding = await callEmbeddings(supposedSubject);
    subjectsMemory.push({
      id: Date.now(),
      text: supposedSubject,
      embedding: subjectEmbedding
    })
    saveVectorMemory(subjectsMemory, "subjects")
    subjectsMemoryCache = null;
  }
}

export async function storeFactMemory(fact, metadata = {}) {
  const factEmbedding = await callEmbeddings(fact);
  const factualMemory = loadMemoryCache("facts")
  const mostSimilarFactVector = await searchFactualMemory(fact, metadata.subjects, 1, factEmbedding)
  if (mostSimilarFactVector.length === 0 || mostSimilarFactVector[0].similarity < 0.85) {
    factualMemory.push({
      id: Date.now(),
      text:fact,
      embedding: factEmbedding,
      metadata,
    });
    const { subjects } = metadata;
    for (const subject of subjects){
      await storeSubjectMemory(subject)
    }
    saveVectorMemory(factualMemory);
    factualMemoryCache = null;
  }
}